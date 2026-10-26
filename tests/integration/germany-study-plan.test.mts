import {before,after,test} from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdirSync,mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {join,resolve,sep} from 'node:path';
import {PrismaClient} from '@prisma/client';
import {Client} from '@modelcontextprotocol/client';
import {StdioClientTransport} from '@modelcontextprotocol/client/stdio';
import {projectRoot} from '../../scripts/runtime-config.mjs';
import {CatalogRepository} from '../../src/lib/server/catalog';
import {RouteWiseService} from '../../src/lib/server/service';
import {handleApi} from '../../src/lib/server/http';

const exec=promisify(execFile);
const parent=resolve(projectRoot,'tmp');
mkdirSync(parent,{recursive:true});
const directory=mkdtempSync(join(parent,'germany-plan-integration-'));
const url=`file:${join(directory,'test.sqlite').replaceAll('\\','/')}`;
const env={...process.env,ROUTEWISE_DATABASE_URL:url};
const database=new PrismaClient({datasourceUrl:url,log:[]});
const repository=new CatalogRepository(database);
const service=new RouteWiseService(repository);
const profile=JSON.parse(readFileSync(resolve(projectRoot,'examples/ai/match.json'),'utf8')).profile;
const input={profile:{...profile,goal:'study'},asOf:'2026-10-26'};
const run=(args:string[])=>exec(process.execPath,args,{cwd:projectRoot,env,timeout:45000,maxBuffer:8*1024*1024});
const post=(value:unknown)=>handleApi(new Request('http://localhost/api/v1/tools/get_germany_study_plan',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value),
}),['tools','get_germany_study_plan'],service);

before(async()=>{
  await run(['--import','tsx','scripts/database.mts','setup']);
  await repository.initializeConnection();
});
after(async()=>{
  await database.$disconnect();
  assert.ok(resolve(directory).startsWith(parent+sep));
  rmSync(directory,{recursive:true,force:true});
});

test('Germany plan agrees across live service, public HTTP, CLI and real MCP without persistence',async()=>{
  const expected=await service.germanyStudyPlan(input);
  const discovery=await handleApi(new Request('http://localhost/api/v1/tools'),['tools'],service);
  const manifest=(await discovery.json()).data.tools.find((tool:{name:string})=>tool.name==='get_germany_study_plan');
  assert.equal(manifest.annotations.readOnlyHint,true);
  assert.equal(manifest.annotations.destructiveHint,false);
  const response=await post(input);
  assert.equal(response.status,200);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.deepEqual((await response.json()).data,expected);
  const cli=await run(['scripts/cli.mjs','get_germany_study_plan','--json',JSON.stringify(input)]);
  assert.deepEqual(JSON.parse(cli.stdout).data,expected);
  const client=new Client({name:'germany-plan-integration',version:'1.0.0'});
  const transport=new StdioClientTransport({command:process.execPath,args:[resolve(projectRoot,'scripts/mcp.mjs')],cwd:directory,env:env as Record<string,string>,stderr:'pipe'});
  try {
    await client.connect(transport);
    assert.ok((await client.listTools()).tools.some(tool=>tool.name==='get_germany_study_plan'));
    const result=await client.callTool({name:'get_germany_study_plan',arguments:input});
    assert.notEqual(result.isError,true);
    assert.deepEqual(result.structuredContent,expected);
  } finally {await client.close();}
  assert.equal(await database.savedProfile.count(),0);
  assert.equal(await database.strategyRun.count(),0);
});

test('Germany plan rejects unknown input, invalid dates and malformed quotes at HTTP boundary',async()=>{
  for(const value of [{...input,save:true},{...input,asOf:'not-a-date'},{...input,budget:{tuition:{amount:-1,sourceUrl:'https://example.org',reviewedOn:'2026-10-26'}}}]) {
    const response=await post(value);
    assert.equal(response.status,400);
    assert.equal((await response.json()).error.code,'INVALID_INPUT');
  }
  assert.equal(await database.savedProfile.count(),0);
});

test('HTTP preserves reported gaps and a sourced expense scenario separately from funds proof',async()=>{
  const quote=(amount:number,monthly=false)=>({amount,description:'Synthetic applicant quote for integration testing',sourceUrl:'https://example.org/fees',reviewedOn:'2026-10-26',...(monthly?{coversMonths:12}:{})});
  const request={...input,profile:{...input.profile,familyStatus:'single',dependents:0},
    stageEvidence:{settlement:{pension24Months:false,germanB1:true}},
    budget:{monthlyProjectionMonths:12,quotes:{tuition:quote(0),housing:quote(800,true),living:quote(500,true),insurance:quote(150,true),semesterFees:quote(600),relocation:quote(1000),permitFees:quote(200)}}};
  const response=await post(request);
  assert.equal(response.status,200);
  const result=(await response.json()).data;
  assert.equal(result.budget.total,19200);
  assert.equal(result.budget.proofItems[0].amount,11904);
  const settlement=result.journey.stages.find((stage:{id:string})=>stage.id==='permanent-residence');
  assert.equal(settlement.status,'unmet');
  assert.ok(settlement.checks.some((check:{kind:string;status:string})=>check.kind==='manual'&&check.status==='unknown'));
  assert.equal(await database.savedProfile.count(),0);
  assert.equal(await database.strategyRun.count(),0);
});

test('named academic admission is identical over HTTP, CLI and real MCP and stays separate from visa checks',async()=>{
  const academic={programmeId:'bonn-computer-science-msc',intake:'summer-2027',asOf:'2026-10-26',
    evidence:{mathEctsReported:18,theoryEctsReported:14,programmingEctsReported:18,thesisEctsReported:12,
      relevantBachelor:'yes',degreeEquivalence:'yes',thesisScientificQuality:'yes',englishC1:'yes',acceptedEnglishProof:'yes'}};
  const visaBefore=await service.germanyStudyPlan(input);
  const expected=await service.academicAdmission(academic);
  assert.equal(expected.visaEligibilityAssessed,false);
  assert.equal(expected.admissionDecision,'not-assessed');
  assert.ok(expected.checks.length>0);
  assert.ok(expected.checks.every(check=>check.status==='unknown'));
  const path=['tools','evaluate_academic_admission'];
  const request=(value:unknown)=>new Request('http://localhost/api/v1/tools/evaluate_academic_admission',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value),
  });
  const response=await handleApi(request(academic),path,service);
  assert.equal(response.status,200);
  assert.deepEqual((await response.json()).data,expected);
  const discovery=await handleApi(new Request('http://localhost/api/v1/tools'),['tools'],service);
  const tool=(await discovery.json()).data.tools.find((item:{name:string})=>item.name==='evaluate_academic_admission');
  assert.equal(tool.annotations.readOnlyHint,true);
  assert.equal(tool.annotations.destructiveHint,false);
  const cli=await run(['scripts/cli.mjs','evaluate_academic_admission','--json',JSON.stringify(academic)]);
  assert.deepEqual(JSON.parse(cli.stdout).data,expected);
  const client=new Client({name:'academic-integration',version:'1.0.0'});
  try {
    await client.connect(new StdioClientTransport({command:process.execPath,args:[resolve(projectRoot,'scripts/mcp.mjs')],cwd:directory,env:env as Record<string,string>,stderr:'pipe'}));
    const result=await client.callTool({name:'evaluate_academic_admission',arguments:academic});
    assert.notEqual(result.isError,true);
    assert.deepEqual(result.structuredContent,expected);
  } finally {await client.close();}
  for(const invalid of [{...academic,profile},{...academic,evidence:{...academic.evidence,verified:true}},
    {...academic,evidence:{mathEctsReported:-1}},{...academic,asOf:'2026-02-30'}]) {
    const rejected=await handleApi(request(invalid),path,service);
    assert.equal(rejected.status,400);
  }
  assert.deepEqual(await service.germanyStudyPlan(input),visaBefore);
  assert.equal(await database.savedProfile.count(),0);
  assert.equal(await database.strategyRun.count(),0);
});

test('Bonn filing and document screening agrees across HTTP, CLI and MCP without changing academic or visa results',async()=>{
  const academic={programmeId:'bonn-computer-science-msc',intake:'summer-2027',asOf:'2026-10-26'};
  const application={...academic,applicationDate:'2026-12-20',
    groupFactors:{eeaCitizen:'no',eeaUniversityDegreeBy2027March31:'yes'},
    degreeDocumentBranch:'final-pending',degreeDocumentFacts:{provisionalIssuedByExamOffice:'no'},
    documents:{'provisional-degree-certificate':'present',cv:'absent'}};
  const before={academic:await service.academicAdmission(academic),visa:await service.germanyStudyPlan(input)};
  const expected=await service.bonnApplication(application);
  assert.equal(expected.availability,'available');
  assert.equal(expected.group.candidateEeaGroup,'eea-reported');
  assert.equal(expected.group.officialGroup,'unknown');
  assert.equal(expected.applicationCompleteness,'not-assessed');
  assert.equal(expected.applicationDecision,'not-assessed');
  assert.equal(expected.visaEligibilityAssessed,false);
  const path=['tools','evaluate_bonn_application'];
  const request=(value:unknown)=>new Request('http://localhost/api/v1/tools/evaluate_bonn_application',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value),
  });
  const response=await handleApi(request(application),path,service);
  assert.equal(response.status,200);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.deepEqual((await response.json()).data,expected);
  const discovery=await handleApi(new Request('http://localhost/api/v1/tools'),['tools'],service);
  const tool=(await discovery.json()).data.tools.find((item:{name:string})=>item.name==='evaluate_bonn_application');
  assert.equal(tool.annotations.readOnlyHint,true);
  assert.equal(tool.annotations.destructiveHint,false);
  assert.deepEqual(JSON.parse((await run(['scripts/cli.mjs','evaluate_bonn_application','--json',JSON.stringify(application)])).stdout).data,expected);
  const client=new Client({name:'bonn-application-integration',version:'1.0.0'});
  try {
    await client.connect(new StdioClientTransport({command:process.execPath,args:[resolve(projectRoot,'scripts/mcp.mjs')],cwd:directory,env:env as Record<string,string>,stderr:'pipe'}));
    const result=await client.callTool({name:'evaluate_bonn_application',arguments:application});
    assert.notEqual(result.isError,true);
    assert.deepEqual(result.structuredContent,expected);
  } finally {await client.close();}
  for(const invalid of [{...application,profile},{...application,documents:{verified:true}},
    {...application,applicationDate:'2027-02-30'},{...application,groupFactors:{eeaCitizen:true}}]) {
    assert.equal((await handleApi(request(invalid),path,service)).status,400);
  }
  assert.deepEqual(await service.academicAdmission(academic),before.academic);
  assert.deepEqual(await service.germanyStudyPlan(input),before.visa);
  assert.equal(await database.savedProfile.count(),0);
  assert.equal(await database.strategyRun.count(),0);
});
