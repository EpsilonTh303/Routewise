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
