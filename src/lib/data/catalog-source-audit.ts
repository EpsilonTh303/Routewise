import type {SourceAuditBatch} from '../server/apply-source-audit';

/** Reviewed immutable catalog audit; never regenerate after application. */
export const CATALOG_SOURCE_AUDIT:SourceAuditBatch={
  "id": "official-catalog-audit-2026-10-25-v2",
  "items": [
    {
      "id": "ae-golden-professional",
      "expectedHash": "f0547e6901ff6b5568f0773c4167fb9e306d97d4df7b7553b68a3394a6ed1aed",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.737Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Professional eligibility",
              "summary": "ICP guide requires approved employment contract, valid UAE work permit, bachelor's degree and AED 30,000/month salary for professional category; describes 10-year renewable residency. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass.",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-golden-residency/",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 30000,
              "currency": "AED",
              "period": "monthly",
              "description": "Salary threshold",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-golden-residency/"
            }
          ],
          "limitations": [
            "Occupation category/employer conditions matter; remote foreign work alone not shown to qualify. PR/citizenship and processing not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "ICP guide requires approved employment contract, valid UAE work permit, bachelor's degree and AED 30,000/month salary for professional category; describes 10-year renewable residency. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass."
        ],
        "pros": [],
        "cons": [
          "Occupation category/employer conditions matter; remote foreign work alone not shown to qualify. PR/citizenship and processing not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ae-golden-property",
      "expectedHash": "1e24447117da8640f7fd35a2b69018cd77358069831347ed30922f18b9ed0eb7",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.741Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Property qualification",
              "summary": "ICP guide states UAE property ownership totaling AED 2m qualifies, with current guide describing 10-year residency; government portal lists five years for property investors. Official duration conflict retained unresolved. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass.",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-golden-residency/",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            },
            {
              "topic": "Conflicting duration",
              "summary": "UAE government portal describes a five-year property-investor visa, inconsistent with ICP's 10-year guide.",
              "sourceUrl": "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 2000000,
              "currency": "AED",
              "period": "assets",
              "description": "Aggregate UAE real estate value",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-golden-residency/"
            }
          ],
          "limitations": [
            "ICP/u.ae duration discrepancy unresolved; no PR/citizenship or processing time evidence.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "ICP guide states UAE property ownership totaling AED 2m qualifies, with current guide describing 10-year residency; government portal lists five years for property investors. Official duration conflict retained unresolved. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass.",
          "UAE government portal describes a five-year property-investor visa, inconsistent with ICP's 10-year guide."
        ],
        "pros": [],
        "cons": [
          "ICP/u.ae duration discrepancy unresolved; no PR/citizenship or processing time evidence.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ae-green-freelance",
      "expectedHash": "16bb8bd77474c16754367b6bff8536250a478078df97acf2bc40b0b2c5eadee3",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.741Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Freelancer eligibility",
              "summary": "ICP requires MOHRE freelance/self-employment permit, bachelor's degree or specialized diploma, solvency and AED 360,000 annual freelance income over prior two years; Green Residence renewable for five years. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass.",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-green-residency/",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 360000,
              "currency": "AED",
              "period": "annual",
              "description": "Freelance income evidence across prior two years",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-green-residency/"
            }
          ],
          "limitations": [
            "Permit type and prior-year evidence interpretation need application confirmation; no PR/citizenship established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "ICP requires MOHRE freelance/self-employment permit, bachelor's degree or specialized diploma, solvency and AED 360,000 annual freelance income over prior two years; Green Residence renewable for five years. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass."
        ],
        "pros": [],
        "cons": [
          "Permit type and prior-year evidence interpretation need application confirmation; no PR/citizenship established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ae-green-skilled",
      "expectedHash": "a4a4d940f3272a10598bb295dceb8b0d755b8b919477c9a2bbc0aac987d2f225",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.741Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Skilled employee eligibility",
              "summary": "ICP requires valid UAE employment contract, occupational level 1-3, bachelor's degree or higher, and AED 15,000 minimum monthly salary; Green Residence is renewable for five years. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass.",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-green-residency/",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 15000,
              "currency": "AED",
              "period": "monthly",
              "description": "Employee salary floor",
              "sourceUrl": "https://icp.gov.ae/en/services/uae-green-residency/"
            }
          ],
          "limitations": [
            "Not a general foreign remote-work route; no PR/citizenship or processing time established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "ICP requires valid UAE employment contract, occupational level 1-3, bachelor's degree or higher, and AED 15,000 minimum monthly salary; Green Residence is renewable for five years. Evidence inherited from existing official-source research; not independently page-retrieved in this audit pass."
        ],
        "pros": [],
        "cons": [
          "Not a general foreign remote-work route; no PR/citizenship or processing time established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ag-cbi",
      "expectedHash": "5b3cc827a73e70a893a86f1cedfdee626546c15983ce60009ee1a82b264711ce",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": 0,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "NDF contribution",
              "summary": "Official NDF page states USD 230,000 one-time contribution per application; family members can be included without additional NDF contribution, with per-person government and due diligence fees.",
              "sourceUrl": "https://cip.gov.ag/investment-options/ndf/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 230000,
              "currency": "USD",
              "period": "one-time",
              "description": "NDF contribution per application; other fees apply",
              "sourceUrl": "https://cip.gov.ag/investment-options/ndf/"
            }
          ],
          "limitations": [
            "Application fees, dependants' fees, current processing time, visit obligations, and passport-access claims were not established by this page.",
            "Archive year-one total, dependent cost and processing clock are unsupported by reviewed evidence.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official NDF page states USD 230,000 one-time contribution per application; family members can be included without additional NDF contribution, with per-person government and due diligence fees."
        ],
        "pros": [],
        "cons": [
          "Application fees, dependants' fees, current processing time, visit obligations, and passport-access claims were not established by this page.",
          "Archive year-one total, dependent cost and processing clock are unsupported by reviewed evidence.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ar-residency",
      "expectedHash": "b64d6e91cd0f4228e85e58cc27dafaa88578aabe07f52d1f14586124f5a132dc",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Rentista threshold and permit",
              "summary": "DNM requires income from assets in applicant patrimony (not personal-work wages), at least five current SMVM, and proof funds enter through authorized financial institutions. Service page lists one-year renewable temporary residence; statute permits up to three years by category.",
              "sourceUrl": "https://www.argentina.gob.ar/servicio/obtener-una-residencia-temporaria-como-rentista",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "SMVM changes; no static USD floor. Rentista excludes personal-work remuneration; local work rights not established by checklist.",
            "Permit validity is not processing time or citizenship clock.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "DNM requires income from assets in applicant patrimony (not personal-work wages), at least five current SMVM, and proof funds enter through authorized financial institutions. Service page lists one-year renewable temporary residence; statute permits up to three years by category."
        ],
        "pros": [],
        "cons": [
          "SMVM changes; no static USD floor. Rentista excludes personal-work remuneration; local work rights not established by checklist.",
          "Permit validity is not processing time or citizenship clock.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "at-rwr",
      "expectedHash": "7bdbfa235ebd55a2aa888c518913b09439e67ff992414af758d110c18855ad2f",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "2026 threshold €3,465 gross monthly; offer, labor-market test and 55 points. Other route categories have distinct rules.",
              "retrieval": "page",
              "sourceUrl": "https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/other-key-workers/",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 3465,
              "sourceUrl": "https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/other-key-workers/",
              "period": "monthly",
              "currency": "EUR",
              "description": "2026 Other Key Worker gross minimum; other categories differ"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "2026 threshold €3,465 gross monthly; offer, labor-market test and 55 points. Other route categories have distinct rules."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "au-subclass-189",
      "expectedHash": "237ab09c78584dce04a8e9015776cfd721ab9e6c3dc6e7c157521530d0427478",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": 0,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Eligibility and status",
              "summary": "Subclass 189 points-tested stream is permanent; invitation requires eligible occupation, skills assessment, age under 45, English and at least 65 points, but minimum points do not guarantee invitation.",
              "sourceUrl": "https://immi.homeaffairs.gov.au/Visa-subsite/Pages/work/189-skilled-independent-points-tested.aspx",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Official page only indexed in this pass; application fee, current processing, citizenship/residence details not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToCitizenship",
            "remoteFriendly"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "Subclass 189 points-tested stream is permanent; invitation requires eligible occupation, skills assessment, age under 45, English and at least 65 points, but minimum points do not guarantee invitation."
        ],
        "pros": [],
        "cons": [
          "Official page only indexed in this pass; application fee, current processing, citizenship/residence details not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "au-subclass-190",
      "expectedHash": "7ac700d38e048e57a5e679a01b960cd458d21697daf27312a2b895c856aab928",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": 0,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Eligibility and status",
              "summary": "Subclass 190 is permanent and needs state/territory nomination, eligible occupation, skills assessment, invitation and at least 65 points; invitation threshold may be higher.",
              "sourceUrl": "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Nomination criteria vary; processing and citizenship timelines not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToCitizenship",
            "remoteFriendly"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "Subclass 190 is permanent and needs state/territory nomination, eligible occupation, skills assessment, invitation and at least 65 points; invitation threshold may be higher."
        ],
        "pros": [],
        "cons": [
          "Nomination criteria vary; processing and citizenship timelines not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "br-business-investor",
      "expectedHash": "e0897134859deb0af250c5463beda62363f4a6575e6bcba51f1d13ed054434c2",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Individual business investment",
              "summary": "RN 13/2017 as amended by RN 49/2024 requires external own funds invested in a Brazilian legal entity and project potential for jobs/income. General threshold is BRL 500,000; BRL 150,000–500,000 option is restricted to qualifying innovation/research/science/technology activity and criteria; investment plan required.",
              "sourceUrl": "https://portaldeimigracao.mj.gov.br/images/resolucoes_normativas/RESOLU%C3%87%C3%83O_NORMATIVA_N%C2%BA_13_DE_12_DE_DEZEMBRO_DE_2017.pdf",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 500000,
              "currency": "BRL",
              "period": "one-time",
              "description": "General investment floor into Brazilian legal entity; external own funds, plan and job/income potential.",
              "sourceUrl": "https://portaldeimigracao.mj.gov.br/images/resolucoes_normativas/RESOLU%C3%87%C3%83O_NORMATIVA_N%C2%BA_13_DE_12_DE_DEZEMBRO_DE_2017.pdf"
            },
            {
              "amount": 150000,
              "currency": "BRL",
              "period": "one-time",
              "description": "Alternative lower floor only for qualifying innovation/research/science/technology investment and criteria.",
              "sourceUrl": "https://portaldeimigracao.mj.gov.br/images/resolucoes_normativas/RESOLU%C3%87%C3%83O_NORMATIVA_N%C2%BA_13_DE_12_DE_DEZEMBRO_DE_2017.pdf"
            }
          ],
          "limitations": [
            "Permit duration, renewal, family inclusion, local work rights and current checklist not fully resolved.",
            "Reduced threshold is not general; investment is not total relocation cost.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "RN 13/2017 as amended by RN 49/2024 requires external own funds invested in a Brazilian legal entity and project potential for jobs/income. General threshold is BRL 500,000; BRL 150,000–500,000 option is restricted to qualifying innovation/research/science/technology activity and criteria; investment plan required."
        ],
        "pros": [],
        "cons": [
          "Permit duration, renewal, family inclusion, local work rights and current checklist not fully resolved.",
          "Reduced threshold is not general; investment is not total relocation cost.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "br-vitem-xiv-nomad",
      "expectedHash": "d3c90dbb4e41259f0b353aa926814fe431dae34087a95039f4d6155329f6aaf2",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": true,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Digital nomad criteria and permit",
              "summary": "Brazil's official immigration authority says foreign-employer remote workers need USD 1,500 monthly foreign-source income or USD 18,000 available bank funds; residence is up to one year and renewable for an equal period. This is not Brazilian local employment authorization.",
              "sourceUrl": "https://portaldeimigracao.mj.gov.br/images/publicacoes/5_Passos_para_obter_autoriza%C3%A7%C3%A3o_de_resid%C3%AAncia_como_N%C3%B4made_Digital_Ingl%C3%AAs_2.pdf",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 1500,
              "currency": "USD",
              "period": "monthly",
              "description": "Alternative minimum regular foreign-source income",
              "sourceUrl": "https://portaldeimigracao.mj.gov.br/images/publicacoes/5_Passos_para_obter_autoriza%C3%A7%C3%A3o_de_resid%C3%AAncia_como_N%C3%B4made_Digital_Ingl%C3%AAs_2.pdf"
            },
            {
              "amount": 18000,
              "currency": "USD",
              "period": "balance",
              "description": "Alternative available bank funds",
              "sourceUrl": "https://portaldeimigracao.mj.gov.br/images/publicacoes/5_Passos_para_obter_autoriza%C3%A7%C3%A3o_de_resid%C3%AAncia_como_N%C3%B4made_Digital_Ingl%C3%AAs_2.pdf"
            }
          ],
          "limitations": [
            "No minimum budget, total relocation cost, dependent cost, processing guarantee, PR or citizenship clock established.",
            "Archive 'total year one' and processing claims must not be treated as official requirements.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "Brazil's official immigration authority says foreign-employer remote workers need USD 1,500 monthly foreign-source income or USD 18,000 available bank funds; residence is up to one year and renewable for an equal period. This is not Brazilian local employment authorization."
        ],
        "pros": [],
        "cons": [
          "No minimum budget, total relocation cost, dependent cost, processing guarantee, PR or citizenship clock established.",
          "Archive 'total year one' and processing claims must not be treated as official requirements.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ca-ee",
      "expectedHash": "d178b791608c587a7340dc2b84ecef3126668527b09a2dbf9dc41438077d916d",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Proof of settlement funds",
              "summary": "Federal Skilled Worker and Federal Skilled Trades candidates generally need family-size settlement funds; Canadian Experience Class and qualifying authorized workers with valid job offers are exempt. Funds must be available and legally accessible. Table shown by IRCC was updated July 7, 2025.",
              "sourceUrl": "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Current published funds table date",
              "summary": "Live IRCC page retrieved Oct 25 2026 still shows the same family-size thresholds and explicitly labels them updated July 7, 2025; no newer 2026 table was found on the official page. Use the amounts as the currently published IRCC values but disclose their table date.",
              "sourceUrl": "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 15263,
              "currency": "CAD",
              "period": "balance",
              "description": "IRCC published minimum for family size 1; larger family amounts vary, table updated July 7 2025",
              "sourceUrl": "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/proof-funds.html"
            }
          ],
          "limitations": [
            "Express Entry is a pool and multiple programs with distinct rules; no unconditional income, job-offer, or fixed processing-week claim applies.",
            "IRCC live page retrieved Oct 25 2026 still labels the table Updated July 7, 2025; no newer official amount found. Confirm before filing because IRCC updates yearly.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Federal Skilled Worker and Federal Skilled Trades candidates generally need family-size settlement funds; Canadian Experience Class and qualifying authorized workers with valid job offers are exempt. Funds must be available and legally accessible. Table shown by IRCC was updated July 7, 2025.",
          "Live IRCC page retrieved Oct 25 2026 still shows the same family-size thresholds and explicitly labels them updated July 7, 2025; no newer 2026 table was found on the official page. Use the amounts as the currently published IRCC values but disclose their table date."
        ],
        "pros": [],
        "cons": [
          "Express Entry is a pool and multiple programs with distinct rules; no unconditional income, job-offer, or fixed processing-week claim applies.",
          "IRCC live page retrieved Oct 25 2026 still labels the table Updated July 7, 2025; no newer official amount found. Confirm before filing because IRCC updates yearly.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ca-suv",
      "expectedHash": "4c95d8a502481bf393dd32b4b857367f7ce110ebdbf40d8009fa4ded2d43a5aa",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "closed",
          "claims": [
            {
              "topic": "Intake status",
              "summary": "IRCC states it is not accepting new Start-Up Visa applications; program paused June 30, 2026. Existing accepted applications continue processing. Applicants who qualify may still apply for an open work permit while their application is processed.",
              "sourceUrl": "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Program is paused to new applicants; historical route requirements do not make intake open.",
            "No basis for archive costs, processing clock, dependent costs or general work-right claim.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "IRCC states it is not accepting new Start-Up Visa applications; program paused June 30, 2026. Existing accepted applications continue processing. Applicants who qualify may still apply for an open work permit while their application is processed."
        ],
        "pros": [],
        "cons": [
          "Program is paused to new applicants; historical route requirements do not make intake open.",
          "No basis for archive costs, processing clock, dependent costs or general work-right claim.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Official source records intake as paused or closed to new applications."
      }
    },
    {
      "id": "ch-lumpsum",
      "expectedHash": "ef20b7bafad70c22559ff1299227e3ae390a868f43e08d133dbeed3b61f79e32",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Cantonal permit and tax distinction",
              "retrieval": "page",
              "summary": "Geneva canton requires non-EU applicant to apply before entry, transfer center of interests and spend majority of year in Switzerland, perform no gainful activity except managing own assets, and obtain cantonal tax administration certificate of significant fiscal interest. No universal CHF threshold is listed; permit is cantonal and individualized.",
              "sourceUrl": "https://www.ge.ch/en/applying-residence-permit-without-gainful-activity/lump-sum-taxation-permit-third-country-national",
              "checkedAt": "2026-10-25T13:39:21.000Z"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Geneva example is canton-specific and cannot establish a Switzerland-wide route.",
            "Archive CHF 150k–500k annual estimate is unsupported by current source.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Geneva canton requires non-EU applicant to apply before entry, transfer center of interests and spend majority of year in Switzerland, perform no gainful activity except managing own assets, and obtain cantonal tax administration certificate of significant fiscal interest. No universal CHF threshold is listed; permit is cantonal and individualized."
        ],
        "pros": [],
        "cons": [
          "Geneva example is canton-specific and cannot establish a Switzerland-wide route.",
          "Archive CHF 150k–500k annual estimate is unsupported by current source.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "co-nomad",
      "expectedHash": "0b162d205b2d7e20781520d708e41a46f97eeac5f13f0ca698dd8e73a2f07fc4",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": true,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Visa V digital nomad",
              "summary": "Colombian Foreign Ministry requires bank statements showing income of at least three current monthly minimum legal wages over the prior three months; visa may be granted up to two years, allows beneficiaries, and prohibits paid work for Colombian persons/entities.",
              "sourceUrl": "https://cancilleria.gov.co/node/26950",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Archive migration from nomad visa to R residency and citizenship timeline not established by this visa page.",
            "Do not convert dynamic SMLMV to a static USD figure without dated exchange/wage inputs.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "The official Visa V nomad page also requires a passport from the short-stay visa-exempt list. Citizenship-specific applicability is not established here; do not infer eligibility from remote income alone."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired"
          ]
        },
        "requirements": [
          "Colombian Foreign Ministry requires bank statements showing income of at least three current monthly minimum legal wages over the prior three months; visa may be granted up to two years, allows beneficiaries, and prohibits paid work for Colombian persons/entities."
        ],
        "pros": [],
        "cons": [
          "Archive migration from nomad visa to R residency and citizenship timeline not established by this visa page.",
          "Do not convert dynamic SMLMV to a static USD figure without dated exchange/wage inputs.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "cr-investment-residency",
      "expectedHash": "e96a98a0ad192a52bebd264b909d347190376f7e398ec8dbf0f9b5bc60b3591c",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Investor residence amount and validity",
              "summary": "Costa Rica's current consolidated regulation sets minimum qualifying investment at USD 150,000 across eligible registered movable/immovable property, shares/securities, productive projects, venture capital, or sustainable tourism infrastructure. Investor residence is granted for two years and renewable for equal periods if investment is maintained continuously.",
              "sourceUrl": "https://www.pgrweb.go.cr/DOCS/NORMAS/1/VIGENTE/D/2020-2029/2020-2024/2023/1825D/158B0A.HTML",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 150000,
              "currency": "USD",
              "period": "assets",
              "description": "Qualifying investment; categories and official exchange-rate wording in regulation",
              "sourceUrl": "https://www.pgrweb.go.cr/DOCS/NORMAS/1/VIGENTE/D/2020-2029/2020-2024/2023/1825D/158B0A.HTML"
            }
          ],
          "limitations": [
            "Not a general property-purchase amount: investment forms are regulated and evidence/registration apply.",
            "Temporary residence validity is not processing time, PR eligibility or citizenship eligibility.",
            "Checklist, dependent costs, work rights and actual processing clock not established here.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Costa Rica's current consolidated regulation sets minimum qualifying investment at USD 150,000 across eligible registered movable/immovable property, shares/securities, productive projects, venture capital, or sustainable tourism infrastructure. Investor residence is granted for two years and renewable for equal periods if investment is maintained continuously."
        ],
        "pros": [],
        "cons": [
          "Not a general property-purchase amount: investment forms are regulated and evidence/registration apply.",
          "Temporary residence validity is not processing time, PR eligibility or citizenship eligibility.",
          "Checklist, dependent costs, work rights and actual processing clock not established here.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "cr-rentista-residency",
      "expectedHash": "cd49dc9db679f953359c8d9025ddf87b3d403e1c9a9ce1bd3ec79fa7a94cfa5d",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Rentista threshold",
              "summary": "Costa Rica General Migration Law art. 82 requires stable monthly rent/income from abroad or the national banking system of at least USD 2,500 or equivalent; dependants may be included for migration purposes.",
              "sourceUrl": "https://www.migracion.go.cr/Documentos%20compartidos/Leyes/Ley%20General%20de%20Migraci%C3%B3n%20y%20Extranjer%C3%ADa%208764.pdf",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            },
            {
              "topic": "Insurance contribution distinction",
              "summary": "CCSS contribution reference for rentista may not be below equivalent of USD 2,500; this is social insurance calculation, not separate visa income threshold.",
              "sourceUrl": "https://www.pgrweb.go.cr/DOCS/NORMAS/1/VIGENTE/A/2010-2019/2010-2014/2012/1208B/EA688.HTML",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 2500,
              "currency": "USD",
              "period": "monthly",
              "description": "Stable rent/income from abroad or Costa Rican national banking system under Migration Law art. 82; dependants may be included.",
              "sourceUrl": "https://www.migracion.go.cr/Documentos%20compartidos/Leyes/Ley%20General%20de%20Migraci%C3%B3n%20y%20Extranjer%C3%ADa%208764.pdf"
            }
          ],
          "limitations": [
            "Law establishes criterion, not a complete current DGME checklist; confirm prescribed certificate/guarantee evidence.",
            "No income rule proves work rights, processing time, PR or citizenship eligibility.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent crosscheck could not retrieve supporting page content for a cited PDF/page (403/404, oversized PDF or unavailable endpoint). Search-index evidence is partial; direct confirmation remains required."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Costa Rica General Migration Law art. 82 requires stable monthly rent/income from abroad or the national banking system of at least USD 2,500 or equivalent; dependants may be included for migration purposes.",
          "CCSS contribution reference for rentista may not be below equivalent of USD 2,500; this is social insurance calculation, not separate visa income threshold."
        ],
        "pros": [],
        "cons": [
          "Law establishes criterion, not a complete current DGME checklist; confirm prescribed certificate/guarantee evidence.",
          "No income rule proves work rights, processing time, PR or citizenship eligibility.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "cy-property",
      "expectedHash": "72e154a8110b0924dae7246d6e1641ab557a3a65ff55cf00c284fa9a00b881b9",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "€300,000 qualifying investment across property/company/fund options, plus personal secure income €50,000 annual, +€15,000 spouse and +€10,000 per minor child. Permit unlimited validity subject to conditions; card 10 years.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.gov.cy/mip-md/en/documents/companies-investors-permanent-residence-3/immigration-permits-for-investors/",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 300000,
              "sourceUrl": "https://www.gov.cy/mip-md/en/documents/companies-investors-permanent-residence-3/immigration-permits-for-investors/",
              "period": "one-time",
              "currency": "EUR",
              "description": "Qualifying investment; alternatives apply"
            },
            {
              "amount": 50000,
              "sourceUrl": "https://www.gov.cy/mip-md/en/documents/companies-investors-permanent-residence-3/immigration-permits-for-investors/",
              "period": "annual",
              "currency": "EUR",
              "description": "Secure income; family additions apply"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "€300,000 qualifying investment across property/company/fund options, plus personal secure income €50,000 annual, +€15,000 spouse and +€10,000 per minor child. Permit unlimited validity subject to conditions; card 10 years."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "de-bluecard",
      "expectedHash": "ce3e95eb2f023fa0c2cdb97b47ebe0a2f7fcc48037ace2f5ca4a2daf2a810666",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "2026 salary €50,700 regular; €45,934.20 shortage/new entrant; qualifying employment and qualification; exceptions for experienced IT.",
              "retrieval": "page",
              "sourceUrl": "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 50700,
              "sourceUrl": "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
              "period": "annual",
              "currency": "EUR",
              "description": "Regular 2026 salary"
            },
            {
              "amount": 45934.2,
              "sourceUrl": "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
              "period": "annual",
              "currency": "EUR",
              "description": "Shortage/new entrant 2026"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "2026 salary €50,700 regular; €45,934.20 shortage/new entrant; qualifying employment and qualification; exceptions for experienced IT."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "de-chancenkarte",
      "expectedHash": "4203a7f1f226755d50b612f5f32ff110bd847b52637f0e4f92565dab7535d4ba",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "sourceUrl": "https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/questions-answers",
              "topic": "Opportunity Card",
              "retrieval": "official-index",
              "summary": "2026 funds proof €1,091 net per month; part-time income and shortfall blocked funds alternatives. Search residence title up to one year. Points system applies only to one eligibility track."
            }
          ],
          "financialRequirements": [
            {
              "period": "monthly",
              "sourceUrl": "https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/questions-answers",
              "amount": 1091,
              "description": "2026 net means-of-subsistence figure",
              "currency": "EUR"
            }
          ],
          "limitations": [
            "Job offer not required to seek work; after qualified offer, apply for appropriate residence permit.",
            "2025 print page is stale; 2026 FAQ gives current amount.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "2026 funds proof €1,091 net per month; part-time income and shortfall blocked funds alternatives. Search residence title up to one year. Points system applies only to one eligibility track."
        ],
        "pros": [],
        "cons": [
          "Job offer not required to seek work; after qualified offer, apply for appropriate residence permit.",
          "2025 print page is stale; 2026 FAQ gives current amount.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "de-freelance",
      "expectedHash": "2271c649df4b3e6408a8430bf06bc4f4fedc2759e28e785918620d2d4fc16dcc",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "No fixed income floor stated; prove project financing and living means, professional permission where required; initial permit max 3 years; settlement possible after 5 years.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.make-it-in-germany.com/en/working-in-germany/setting-up-business/visa/freelance",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "No fixed income floor stated; prove project financing and living means, professional permission where required; initial permit max 3 years; settlement possible after 5 years."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "dm-cbi",
      "expectedHash": "d1cbfa8246664d01807c9849389607bde7f2482c103f730ccb16bba12ce94941",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": 0,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "EDF contribution schedule",
              "summary": "Official CBIU lists USD 200,000 for principal, USD 250,000 for principal plus up to three dependants, then USD 25,000 per additional minor and USD 40,000 per additional adult. Qualifying amount is not total fees.",
              "sourceUrl": "https://www.cbiu.gov.dm/investment-options/economic-diversification-fund/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Application channel and process",
              "summary": "Official 2025 process guide uses authorized agents and background checks; investment paid after approval in principle, with no guaranteed completion clock established.",
              "sourceUrl": "https://www.cbiu.gov.dm/wp-content/uploads/2025/03/CBIU_Dominica_2025_Application-Process-Guide_F.pdf",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 200000,
              "currency": "USD",
              "period": "one-time",
              "description": "EDF contribution for a main applicant; family schedule and fees differ.",
              "sourceUrl": "https://www.cbiu.gov.dm/investment-options/economic-diversification-fund/"
            }
          ],
          "limitations": [
            "Archive USD 200k is correct for one applicant but not a family total or all-in cost.",
            "No processingWeeks or citizenship completion guarantee verified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official CBIU lists USD 200,000 for principal, USD 250,000 for principal plus up to three dependants, then USD 25,000 per additional minor and USD 40,000 per additional adult. Qualifying amount is not total fees.",
          "Official 2025 process guide uses authorized agents and background checks; investment paid after approval in principle, with no guaranteed completion clock established."
        ],
        "pros": [],
        "cons": [
          "Archive USD 200k is correct for one applicant but not a family total or all-in cost.",
          "No processingWeeks or citizenship completion guarantee verified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ee-startup",
      "expectedHash": "67c6110d261d05ab607012c6a0a2b2d004e8439df6cd19b7999931d603a40a39",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Startup founders are exempt from ordinary €65,000 investment requirement; permit up to five years. Startup Committee approval criteria should be checked.",
              "retrieval": "official-index",
              "sourceUrl": "https://startupestonia.ee/frequently-asked-questions/",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Startup founders are exempt from ordinary €65,000 investment requirement; permit up to five years. Startup Committee approval criteria should be checked."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "eg-cbi",
      "expectedHash": "00b1b86ba5a945766a9cb4e4459858e68b0c9c2a22961e68f1f2630f946e61b2",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": 0,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Investment citizenship options",
              "summary": "Government portal’s headline program list gives real estate USD 300,000, investment project USD 450,000, deposit USD 500,000 for three years, and direct revenue USD 250,000. The official application form clarifies the investment-project total: at least USD 350,000 project investment plus separate USD 100,000 non-refundable Treasury contribution. Application fee USD 10,000.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Project investment cost and non-refundable contribution",
              "summary": "Official application form breaks the investment-project option into at least USD 350,000 invested in/participating in the project under Investment Law 72/2017 plus USD 100,000 in non-refundable direct revenue to the Treasury; if project is liquidated, stopped, or disposed of before five years of operation, USD 250,000 non-refundable deposit is required to retain citizenship. This is not simply USD 450,000 of assets.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/ECI/Upload/Application/%D8%B7%D8%A8%D8%A7%D8%B9%D8%A9%20%D9%86%D9%85%D9%88%D8%B0%D8%AC%20%D8%A7%D9%84%D8%B7%D9%84%D8%A8.pdf",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 250000,
              "currency": "USD",
              "period": "one-time",
              "description": "Direct revenue contribution option.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/"
            },
            {
              "amount": 300000,
              "currency": "USD",
              "period": "assets",
              "description": "Minimum real estate purchase option.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/"
            },
            {
              "amount": 500000,
              "currency": "USD",
              "period": "assets",
              "description": "Cash deposit held three years; refundable in EGP at CBE exchange rate on repayment, without interest; not a donation.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/"
            },
            {
              "amount": 350000,
              "currency": "USD",
              "period": "assets",
              "description": "Minimum investment/participation in the investment project; project option also requires a separate non-refundable USD 100,000 Treasury contribution.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/ECI/Upload/Application/%D8%B7%D8%A8%D8%A7%D8%B9%D8%A9%20%D9%86%D9%85%D9%88%D8%B0%D8%AC%20%D8%A7%D9%84%D8%B7%D9%84%D8%A8.pdf"
            },
            {
              "amount": 100000,
              "currency": "USD",
              "period": "one-time",
              "description": "Separate non-refundable direct-revenue contribution to the Treasury in the project option.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/ECI/Upload/Application/%D8%B7%D8%A8%D8%A7%D8%B9%D8%A9%20%D9%86%D9%85%D9%88%D8%B0%D8%AC%20%D8%A7%D9%84%D8%B7%D9%84%D8%A8.pdf"
            },
            {
              "amount": 250000,
              "currency": "USD",
              "period": "one-time",
              "description": "Contingent non-refundable deposit required to retain citizenship if project stopped/liquidated/disposed before five years of operation.",
              "sourceUrl": "https://egyptcitizenship.gov.eg/ECI/Upload/Application/%D8%B7%D8%A8%D8%A7%D8%B9%D8%A9%20%D9%86%D9%85%D9%88%D8%B0%D8%AC%20%D8%A7%D9%84%D8%B7%D9%84%D8%A8.pdf"
            }
          ],
          "limitations": [
            "Portal states 6–12 month estimate; not a guaranteed visa-processing service level.",
            "Fee/current implementation detail and dependent fees not fully established; page uses Arabic.",
            "The portal headline labels project option “USD 450,000”; official form shows composition is USD 350,000 project investment plus USD 100,000 non-refundable contribution. Early project closure/disposal before five operating years can trigger USD 250,000 replacement deposit to retain citizenship.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent crosscheck could not retrieve supporting page content for a cited PDF/page (403/404, oversized PDF or unavailable endpoint). Search-index evidence is partial; direct confirmation remains required."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Government portal’s headline program list gives real estate USD 300,000, investment project USD 450,000, deposit USD 500,000 for three years, and direct revenue USD 250,000. The official application form clarifies the investment-project total: at least USD 350,000 project investment plus separate USD 100,000 non-refundable Treasury contribution. Application fee USD 10,000.",
          "Official application form breaks the investment-project option into at least USD 350,000 invested in/participating in the project under Investment Law 72/2017 plus USD 100,000 in non-refundable direct revenue to the Treasury; if project is liquidated, stopped, or disposed of before five years of operation, USD 250,000 non-refundable deposit is required to retain citizenship. This is not simply USD 450,000 of assets."
        ],
        "pros": [],
        "cons": [
          "Portal states 6–12 month estimate; not a guaranteed visa-processing service level.",
          "Fee/current implementation detail and dependent fees not fully established; page uses Arabic.",
          "The portal headline labels project option “USD 450,000”; official form shows composition is USD 350,000 project investment plus USD 100,000 non-refundable contribution. Early project closure/disposal before five operating years can trigger USD 250,000 replacement deposit to retain citizenship.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "es-dn",
      "expectedHash": "d3d54c41f954a1bbad000011af58dc7e83692c26d840f355b8113700787d4615",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": true,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "2026 SMI €1,221 monthly; applicant 200%=€2,442, first dependent +€916, each additional +€306; remote work conditions and 20% Spanish-company limit for professional activity.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.exteriores.gob.es/Consulados/washington/en/ServiciosConsulares/Paginas/Consular/Telework-Visa.aspx",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 2442,
              "sourceUrl": "https://www.exteriores.gob.es/Consulados/washington/en/ServiciosConsulares/Paginas/Consular/Telework-Visa.aspx",
              "period": "monthly",
              "currency": "EUR",
              "description": "Consular formula is 200% of stated €1,221 monthly SMI. SMI is legally 14 payments/year; the consular page does not state annualization method."
            }
          ],
          "limitations": [
            "Consular page gives 2026 €2,442/month based on monthly SMI €1,221. Spain SMI is paid in 14 annual installments; official consular page does not spell out annual evidence treatment. Preserve the monthly formula and clarify annualization with consulate.",
            "Partial review only.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired"
          ]
        },
        "requirements": [
          "2026 SMI €1,221 monthly; applicant 200%=€2,442, first dependent +€916, each additional +€306; remote work conditions and 20% Spanish-company limit for professional activity."
        ],
        "pros": [],
        "cons": [
          "Consular page gives 2026 €2,442/month based on monthly SMI €1,221. Spain SMI is paid in 14 annual installments; official consular page does not spell out annual evidence treatment. Preserve the monthly formula and clarify annualization with consulate.",
          "Partial review only.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "es-nlv",
      "expectedHash": "f8405ad542142e5f6cfdede2541e5c8fe2f9d7cffb911d48c80ee3ac22b00f2c",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Official guidance updated May 2025: 400% IPREM applicant monthly, 100% IPREM each dependent; no work, insurance. 2026 IPREM amount not verified.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.inclusion.gob.es/en/web/migraciones/w/autorizacion-inicial-de-residencia-temporal-no-lucrativa",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official guidance updated May 2025: 400% IPREM applicant monthly, 100% IPREM each dependent; no work, insurance. 2026 IPREM amount not verified."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "fi-eu-ict-permit",
      "expectedHash": "d44ad3824f30ac247f93c91bc92b493592624edb5c7d7ef3bba8d213e3a3fec4",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": false,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.742Z",
          "routeStatus": "open",
          "claims": [
            {
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "sourceUrl": "https://migri.fi/internal-transfer-within-a-company",
              "topic": "ICT eligibility",
              "retrieval": "official-index",
              "summary": "Transfer within group as manager, specialist or trainee; posting entity outside EU; qualification and competence required. Pay meets applicable collective agreement. Manager/specialist up to 3 years; trainee up to 1 year."
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "No single fixed salary floor; applicable collective agreement controls.",
            "Partial review; PR and citizenship unresolved.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "Transfer within group as manager, specialist or trainee; posting entity outside EU; qualification and competence required. Pay meets applicable collective agreement. Manager/specialist up to 3 years; trainee up to 1 year."
        ],
        "pros": [],
        "cons": [
          "No single fixed salary floor; applicable collective agreement controls.",
          "Partial review; PR and citizenship unresolved.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "fi-specialist-permit",
      "expectedHash": "115e72f42c516e31e9abc6ce471cdbd1ce6c325d6f309a2310fcb8cf61b1eaa7",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": false,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "2026 salary €3,937 gross monthly; job and special expertise required; degree usually, or equivalent acquired expertise.",
              "retrieval": "official-index",
              "sourceUrl": "https://migri.fi/en/specialist",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 3937,
              "sourceUrl": "https://migri.fi/en/specialist",
              "period": "monthly",
              "currency": "EUR",
              "description": "Gross salary 2026"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "2026 salary €3,937 gross monthly; job and special expertise required; degree usually, or equivalent acquired expertise."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "fr-talent-investor",
      "expectedHash": "54d1f1d92c1e717e1e5ba58329ba5a15e997b5cfe155341225f0d12a1110fa93",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "EUR 300,000 direct investment with personal direction or 30% ownership and employment commitments.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.service-public.fr/particuliers/vosdroits/F16922",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "period": "one-time",
              "sourceUrl": "https://www.service-public.fr/particuliers/vosdroits/F16922",
              "description": "Direct qualifying investment; ownership, active direction and employment commitments apply",
              "amount": 300000,
              "currency": "EUR"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "EUR 300,000 direct investment with personal direction or 30% ownership and employment commitments."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "fr-talent-salaried",
      "expectedHash": "3908299be0568cb319ab7c11d6af4712fc56317ae8c72a31feb2bb7fc381c76f",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "EUR 39,582 gross annual for specified salaried tracks; qualifications and contract conditions vary.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.service-public.fr/particuliers/vosdroits/F16922",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "period": "annual",
              "sourceUrl": "https://www.service-public.fr/particuliers/vosdroits/F16922",
              "description": "Gross salary floor for specified salaried route; tracks differ",
              "amount": 39582,
              "currency": "EUR"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "EUR 39,582 gross annual for specified salaried tracks; qualifications and contract conditions vary."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "gd-cbi",
      "expectedHash": "2f0ebd3439816cddb3f4a8746a79b0b0e797a01b3553979976d8c469d0df5545",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": 0,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Current program options and prices",
              "summary": "IMA Grenada lists NTF contribution USD 235,000 for a single applicant or family of four; approved project real estate USD 270,000 plus USD 50,000 government contribution. Dependant profiles and fees affect total.",
              "sourceUrl": "https://imagrenada.gd/enquiries/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Agent and eligibility rules",
              "summary": "IMA says application must go through authorized local agent; applicant must satisfy personal requirements including age 18, criminal record and health.",
              "sourceUrl": "https://imagrenada.gd/becoming-a-citizen/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 235000,
              "currency": "USD",
              "period": "one-time",
              "description": "NTF contribution for applicant or family up to four; fees/dependant rules apply.",
              "sourceUrl": "https://imagrenada.gd/enquiries/"
            },
            {
              "amount": 270000,
              "currency": "USD",
              "period": "assets",
              "description": "Approved project real estate, plus USD 50,000 government contribution for applicant/family up to four.",
              "sourceUrl": "https://imagrenada.gd/enquiries/"
            }
          ],
          "limitations": [
            "Legacy cbi.gov.gd USD 150,000 page is stale; current authority IMA uses USD 235,000.",
            "Archive calls route NDF; current authority calls it NTF. Processing and citizenship timings not independently verified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "IMA Grenada lists NTF contribution USD 235,000 for a single applicant or family of four; approved project real estate USD 270,000 plus USD 50,000 government contribution. Dependant profiles and fees affect total.",
          "IMA says application must go through authorized local agent; applicant must satisfy personal requirements including age 18, criminal record and health."
        ],
        "pros": [],
        "cons": [
          "Legacy cbi.gov.gd USD 150,000 page is stale; current authority IMA uses USD 235,000.",
          "Archive calls route NDF; current authority calls it NTF. Processing and citizenship timings not independently verified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ge-business-residence",
      "expectedHash": "44d360f1008f4bf8c38e53db3a4823cd0e0efa1ae0ecab3a9d742f8ac3bb0ebc",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "retrieval": "page",
              "topic": "Entrepreneurial/work residence",
              "checkedAt": "2026-10-25T13:50:00.000Z",
              "summary": "The Georgian Agency states a work residence permit may issue to an alien carrying out entrepreneurial activities in Georgia or a registered labour immigrant. Evidence must show legal monthly income/remuneration of at least five times the average-consumer subsistence level; an alien-founded enterprise must show annual turnover of at least GEL 50,000 per applicant (GEL 35,000 for education/medical enterprises), plus the stated registration and staffing evidence.",
              "sourceUrl": "https://sda.gov.ge/en/products/migration-residence-permits/"
            }
          ],
          "financialRequirements": [
            {
              "sourceUrl": "https://sda.gov.ge/en/products/migration-residence-permits/",
              "currency": "GEL",
              "period": "annual",
              "amount": 50000,
              "description": "Annual employer/alien-founded enterprise turnover per work-residence applicant; not personal income. Educational or medical enterprises: GEL 35,000 per applicant."
            }
          ],
          "limitations": [
            "Applicant must meet separate legal monthly-income formula (fivefold average-consumer subsistence minimum; no amount encoded because it varies), labour-immigrant registration where applicable, and other requirements. This is entrepreneurial/work residence, not investment residence.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "The Georgian Agency states a work residence permit may issue to an alien carrying out entrepreneurial activities in Georgia or a registered labour immigrant. Evidence must show legal monthly income/remuneration of at least five times the average-consumer subsistence level; an alien-founded enterprise must show annual turnover of at least GEL 50,000 per applicant (GEL 35,000 for education/medical enterprises), plus the stated registration and staffing evidence."
        ],
        "pros": [],
        "cons": [
          "Applicant must meet separate legal monthly-income formula (fivefold average-consumer subsistence minimum; no amount encoded because it varies), labour-immigrant registration where applicable, and other requirements. This is entrepreneurial/work residence, not investment residence.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "gr-golden-visa",
      "expectedHash": "b6517e35505900736af565ad73750f460068f37d2400da9c7f97493aa956a945",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Official ministry page lists property-based investor residence and application requirements. Current regional thresholds not established by retrieved page; €250k legacy figure must not be generalized.",
              "retrieval": "official-index",
              "sourceUrl": "https://migration.gov.gr/en/golden-visa/",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "Current regional thresholds not established by retrieved ministry page; legacy €250,000 cannot represent all locations.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official ministry page lists property-based investor residence and application requirements. Current regional thresholds not established by retrieved page; €250k legacy figure must not be generalized."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "Current regional thresholds not established by retrieved ministry page; legacy €250,000 cannot represent all locations.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "hk-ttps",
      "expectedHash": "9c3e911821f9e87ca5abece47bb6f2f263b101a1ed8b125c89e4328c7d166001",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Eligibility",
              "summary": "Hong Kong TTPS allows eligible Category A high-income applicants (HKD 2.5m prior-year annual income), Category B graduates of eligible universities with 3 years' experience, or Category C recent eligible graduates subject to quota; job offer is not required at application. Initial stay is 36 months for A and 24 months for B/C.",
              "sourceUrl": "https://www.immd.gov.hk/eng/services/visas/TTPS.html",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 2500000,
              "currency": "HKD",
              "period": "annual",
              "description": "Prior-year income qualification for Category A only",
              "sourceUrl": "https://www.immd.gov.hk/eng/services/visas/TTPS.html"
            }
          ],
          "limitations": [
            "Category B/C depend on current eligible university list; further stay requires employment/business evidence. PR/citizenship not verified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Hong Kong TTPS allows eligible Category A high-income applicants (HKD 2.5m prior-year annual income), Category B graduates of eligible universities with 3 years' experience, or Category C recent eligible graduates subject to quota; job offer is not required at application. Initial stay is 36 months for A and 24 months for B/C."
        ],
        "pros": [],
        "cons": [
          "Category B/C depend on current eligible university list; further stay requires employment/business evidence. PR/citizenship not verified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "hu-golden-visa",
      "expectedHash": "5c03b6a1935e619233f5762216b3b580b759fb443964e6ff09eac58a27865c17",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Official immigration portal shows €250,000 registered real-estate fund certificate or €1m educational donation.",
              "retrieval": "official-index",
              "sourceUrl": "https://enterhungary.gov.hu/eh/tajekoztato/en/okmanyvendegbef",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 250000,
              "sourceUrl": "https://enterhungary.gov.hu/eh/tajekoztato/en/okmanyvendegbef",
              "period": "one-time",
              "currency": "EUR",
              "description": "Fund route; education donation €1m"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official immigration portal shows €250,000 registered real-estate fund certificate or €1m educational donation."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "id-e33g-remote-worker",
      "expectedHash": "bd7c36f67634248dbd793b3e2512edc60297e4cbf32a742a6a11b0a78661936e",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": true,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "retrieval": "page",
              "topic": "E33G employment and income",
              "checkedAt": "2026-10-25T13:50:00.000Z",
              "summary": "The retrievable official Bontang immigration office listing states the special E33G criteria: bank evidence of salary/income of at least USD 60,000 per year and an employment agreement with a company established outside Indonesia. The national E33G page itself returned 403 in this audit.",
              "sourceUrl": "https://bontang.imigrasi.go.id/layanan-publik/kategori/wna/sub/informasi-visa-republik-indonesia"
            },
            {
              "retrieval": "page",
              "topic": "E33G living-funds evidence",
              "checkedAt": "2026-10-25T13:50:00.000Z",
              "summary": "The same official local immigration listing separately requires a recent three-month bank statement showing at least USD 2,000 for living costs; this is not the USD 60,000 annual-income criterion.",
              "sourceUrl": "https://bontang.imigrasi.go.id/layanan-publik/kategori/wna/sub/informasi-visa-republik-indonesia"
            }
          ],
          "financialRequirements": [
            {
              "sourceUrl": "https://bontang.imigrasi.go.id/layanan-publik/kategori/wna/sub/informasi-visa-republik-indonesia",
              "currency": "USD",
              "period": "annual",
              "amount": 60000,
              "description": "Salary/income qualification, separate from living-cost funds"
            },
            {
              "sourceUrl": "https://bontang.imigrasi.go.id/layanan-publik/kategori/wna/sub/informasi-visa-republik-indonesia",
              "currency": "USD",
              "period": "balance",
              "amount": 2000,
              "description": "Living-cost proof on a three-month bank statement; distinct from annual income"
            }
          ],
          "limitations": [
            "National Directorate E33G page returned 403; the current retrievable detail is from the official Bontang immigration office listing. No contractor/self-employed eligibility or PR/citizenship entitlement established. Published fee/current checkout amount not verified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship"
          ]
        },
        "requirements": [
          "The retrievable official Bontang immigration office listing states the special E33G criteria: bank evidence of salary/income of at least USD 60,000 per year and an employment agreement with a company established outside Indonesia. The national E33G page itself returned 403 in this audit.",
          "The same official local immigration listing separately requires a recent three-month bank statement showing at least USD 2,000 for living costs; this is not the USD 60,000 annual-income criterion."
        ],
        "pros": [],
        "cons": [
          "National Directorate E33G page returned 403; the current retrievable detail is from the official Bontang immigration office listing. No contractor/self-employed eligibility or PR/citizenship entitlement established. Published fee/current checkout amount not verified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "id-second-home",
      "expectedHash": "bab6128499ad0a6bf8ed1beeab1d897724c6cc7b282734cb0e995a29f1e2b9c8",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "retrieval": "page",
              "topic": "Second Home proof of funds",
              "checkedAt": "2026-10-25T13:50:00.000Z",
              "summary": "Official Jakarta Barat Immigration page says Second Home ITAS proof-of-funds may be either at least USD 130,000 equivalent in savings held at a state-owned bank or Indonesian apartment/property title with minimum value USD 1,000,000 equivalent. Evidence is due within 90 days under the page checklist.",
              "sourceUrl": "https://jakartabarat.imigrasi.go.id/pelaporan-proof-of-fund-2/"
            }
          ],
          "financialRequirements": [
            {
              "sourceUrl": "https://jakartabarat.imigrasi.go.id/pelaporan-proof-of-fund-2/",
              "currency": "USD",
              "period": "balance",
              "amount": 130000,
              "description": "State-owned bank savings alternative for Second Home proof of funds"
            },
            {
              "sourceUrl": "https://jakartabarat.imigrasi.go.id/pelaporan-proof-of-fund-2/",
              "currency": "USD",
              "period": "assets",
              "amount": 1000000,
              "description": "Indonesian apartment/property title alternative for Second Home proof of funds"
            }
          ],
          "limitations": [
            "Evidence retrieved from an official local immigration office checklist; verify national eVisa category and current filing interpretation before applying. Remote-work permission, PR, citizenship and processing time not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official Jakarta Barat Immigration page says Second Home ITAS proof-of-funds may be either at least USD 130,000 equivalent in savings held at a state-owned bank or Indonesian apartment/property title with minimum value USD 1,000,000 equivalent. Evidence is due within 90 days under the page checklist."
        ],
        "pros": [],
        "cons": [
          "Evidence retrieved from an official local immigration office checklist; verify national eVisa category and current filing interpretation before applying. Remote-work permission, PR, citizenship and processing time not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "ie-csep",
      "expectedHash": "a5a1bb2b2a83bc2696a376a73577909487d54d12141356f6991e7473b37d97c8",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "2026 CSEP annual remuneration schedule: €40,909 relevant degree; €68,911 no relevant degree; recent graduate €36,849. Occupation and job offer conditions apply.",
              "retrieval": "page",
              "sourceUrl": "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/economic-migration-policy/minimum-annual-remuneration/",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "period": "annual",
              "sourceUrl": "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/economic-migration-policy/minimum-annual-remuneration/",
              "description": "2026 qualifying occupation with relevant degree",
              "amount": 40909,
              "currency": "EUR"
            },
            {
              "period": "annual",
              "sourceUrl": "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/economic-migration-policy/minimum-annual-remuneration/",
              "description": "2026 route without relevant degree",
              "amount": 68911,
              "currency": "EUR"
            },
            {
              "period": "annual",
              "sourceUrl": "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/economic-migration-policy/minimum-annual-remuneration/",
              "description": "2026 recent graduate CSEP threshold",
              "amount": 36849,
              "currency": "EUR"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "2026 CSEP annual remuneration schedule: €40,909 relevant degree; €68,911 no relevant degree; recent graduate €36,849. Occupation and job offer conditions apply."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "it-investor",
      "expectedHash": "a5b0d3eeb59d52dc199ac3b06b5dc246c9951549c7f22abddd92696b515a6b9e",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Investor visa valid two years; €2m government bonds, €500k Italian company, €250k innovative startup, or €1m philanthropy.",
              "retrieval": "official-index",
              "sourceUrl": "https://investorvisa.mise.gov.it/index.php/en/home-en/",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 250000,
              "sourceUrl": "https://investorvisa.mise.gov.it/index.php/en/home-en/",
              "period": "one-time",
              "currency": "EUR",
              "description": "Innovative startup alternative; other alternatives apply"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Investor visa valid two years; €2m government bonds, €500k Italian company, €250k innovative startup, or €1m philanthropy."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "jp-bizmanager",
      "expectedHash": "bff9d57c290b8f15ba41fd83ef830fd9aa8ecd2f5320d47d36101340b972d6fa",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "2025 rule change",
              "summary": "Japan's Business Manager criteria were amended effective 16 October 2025. Official guidance describes JPY 30 million in business assets; for individual businesses this means deployed resources such as office, staff salary for a year and equipment, not simply required share capital. Residence periods include 3 months to 5 years.",
              "sourceUrl": "https://www.moj.go.jp/isa/applications/resources/10_00237.html",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 30000000,
              "currency": "JPY",
              "period": "assets",
              "description": "Business assets invested in the business; corporate capital for corporations, qualifying deployed costs for sole proprietors",
              "sourceUrl": "https://www.moj.go.jp/isa/applications/resources/10_00237.html"
            }
          ],
          "limitations": [
            "New criteria include other business/qualification/staff requirements not fully audited here; existing holders have transition provisions. Processing and citizenship not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent crosscheck could not retrieve supporting page content for a cited PDF/page (403/404, oversized PDF or unavailable endpoint). Search-index evidence is partial; direct confirmation remains required."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Japan's Business Manager criteria were amended effective 16 October 2025. Official guidance describes JPY 30 million in business assets; for individual businesses this means deployed resources such as office, staff salary for a year and equipment, not simply required share capital. Residence periods include 3 months to 5 years."
        ],
        "pros": [],
        "cons": [
          "New criteria include other business/qualification/staff requirements not fully audited here; existing holders have transition provisions. Processing and citizenship not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "jp-hsp",
      "expectedHash": "46eeb2b2e608ede61bee6ed89a1a042badd7305467a457d461921f2f0c349ca5",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Points and PR",
              "summary": "Highly-skilled professional status requires 70 points in a qualifying work activity; PR may be sought after three years maintaining qualifying 70 points or one year at 80 points, subject to general PR conditions.",
              "sourceUrl": "https://www.moj.go.jp/isa/applications/resources/nyukan_nyukan50.html",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "This is employment activity-linked status rather than a standalone income-independent visa; category-specific salary, employer and points evidence not modeled. PR is discretionary.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent crosscheck could not retrieve supporting page content for a cited PDF/page (403/404, oversized PDF or unavailable endpoint). Search-index evidence is partial; direct confirmation remains required."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Highly-skilled professional status requires 70 points in a qualifying work activity; PR may be sought after three years maintaining qualifying 70 points or one year at 80 points, subject to general PR conditions."
        ],
        "pros": [],
        "cons": [
          "This is employment activity-linked status rather than a standalone income-independent visa; category-specific salary, employer and points evidence not modeled. PR is discretionary.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "kn-cbi",
      "expectedHash": "0a41e6c7df12b12a4f11767871a6d2a11fc6a373f47e7d5250a10f25ae657813",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": 0,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "SISC contribution",
              "summary": "Current official CIU lists US$250,000 for main applicant or family up to four, plus US$25,000 per additional dependent under 18 and US$50,000 per additional adult; due diligence US$10,000 main and US$7,500 per dependent aged 16+. Interview required for principal. CIU says 120–180 days to communicate approval in principle, denial, or delay, not citizenship completion guarantee.",
              "sourceUrl": "https://ciu.gov.kn/sustainable-island-state-contribution/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 250000,
              "currency": "USD",
              "period": "one-time",
              "description": "SISC contribution for main applicant or family up to four; additional dependent contribution and fees apply",
              "sourceUrl": "https://ciu.gov.kn/sustainable-island-state-contribution/"
            }
          ],
          "limitations": [
            "120–180 days is a decision-status communication window after acknowledgment, not guaranteed citizenship processing time.",
            "Archive's $250k pricing assumptions and dependent fees should be revisited; route has age-based dependent amounts, due diligence, mandatory interview and authorized-agent requirement.",
            "No PR interval: route is citizenship by investment, but grant completion timing not given here.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Current official CIU lists US$250,000 for main applicant or family up to four, plus US$25,000 per additional dependent under 18 and US$50,000 per additional adult; due diligence US$10,000 main and US$7,500 per dependent aged 16+. Interview required for principal. CIU says 120–180 days to communicate approval in principle, denial, or delay, not citizenship completion guarantee."
        ],
        "pros": [],
        "cons": [
          "120–180 days is a decision-status communication window after acknowledgment, not guaranteed citizenship processing time.",
          "Archive's $250k pricing assumptions and dependent fees should be revisited; route has age-based dependent amounts, due diligence, mandatory interview and authorized-agent requirement.",
          "No PR interval: route is citizenship by investment, but grant completion timing not given here.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "kr-f27",
      "expectedHash": "6d1ed2e8f66b5dad6a58959e547c4ce38c32f94bf55c1a00de56ebe561e06aae",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "unresolved",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "unclear",
          "claims": [],
          "financialRequirements": [],
          "limitations": [
            "Official Korea Immigration Service homepage and Visa Portal were retrieved, but route-specific F-2-7 eligibility detail was not; no eligibility, score, income or duration claim asserted.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official evidence retrieval is unresolved; inspect the audit limitations before relying on this route."
        ],
        "pros": [],
        "cons": [
          "Official Korea Immigration Service homepage and Visa Portal were retrieved, but route-specific F-2-7 eligibility detail was not; no eligibility, score, income or duration claim asserted.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Source retrieval unresolved; route conditions and costs require review."
      }
    },
    {
      "id": "me-property",
      "expectedHash": "89131a6ff5db684c91b2f52fd7fe1af0b3e45ac2fbdb59656a98108f322eaaa9",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "unclear",
          "claims": [
            {
              "topic": "Property residence",
              "summary": "Montenegro government states temporary residence may be granted for having disposal of immovable property; permits generally do not exceed one year and require means of subsistence, accommodation and health insurance. A 2025 government announcement described a proposed EUR 200,000 property threshold in draft amendments; enactment/current applicability was not confirmed.",
              "sourceUrl": "https://www.gov.me/en/article/temporary-residence",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Current threshold must be confirmed in enacted law and local MUP practice; draft announcement is not treated as in-force rule. Permit generally tied to grounds; PR/citizenship not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Montenegro government states temporary residence may be granted for having disposal of immovable property; permits generally do not exceed one year and require means of subsistence, accommodation and health insurance. A 2025 government announcement described a proposed EUR 200,000 property threshold in draft amendments; enactment/current applicability was not confirmed."
        ],
        "pros": [],
        "cons": [
          "Current threshold must be confirmed in enacted law and local MUP practice; draft announcement is not treated as in-force rule. Permit generally tied to grounds; PR/citizenship not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "mt-mprp",
      "expectedHash": "45c1aae5a0ed02c90385bb8b7c18354bd020fe5b3977e2241b69a17cb9a9fce2",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Current agency page: €60,000 admin fee, €37,000 government contribution, €2,000 NGO donation; rent ≥€14,000 annual or purchase ≥€375,000; assets €500k incl €150k financial or €650k incl €75k.",
              "retrieval": "page",
              "sourceUrl": "https://residencymalta.gov.mt/legal-framework-mprp-2/",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "period": "one-time",
              "sourceUrl": "https://residencymalta.gov.mt/legal-framework-mprp-2/",
              "description": "Non-refundable administrative fee",
              "amount": 60000,
              "currency": "EUR"
            },
            {
              "period": "one-time",
              "sourceUrl": "https://residencymalta.gov.mt/legal-framework-mprp-2/",
              "description": "Government contribution",
              "amount": 37000,
              "currency": "EUR"
            },
            {
              "period": "one-time",
              "sourceUrl": "https://residencymalta.gov.mt/legal-framework-mprp-2/",
              "description": "NGO donation",
              "amount": 2000,
              "currency": "EUR"
            },
            {
              "period": "annual",
              "sourceUrl": "https://residencymalta.gov.mt/legal-framework-mprp-2/",
              "description": "Minimum qualifying rent alternative to purchase",
              "amount": 14000,
              "currency": "EUR"
            },
            {
              "period": "one-time",
              "sourceUrl": "https://residencymalta.gov.mt/legal-framework-mprp-2/",
              "description": "Minimum qualifying property purchase alternative",
              "amount": 375000,
              "currency": "EUR"
            },
            {
              "period": "assets",
              "sourceUrl": "https://residencymalta.gov.mt/legal-framework-mprp-2/",
              "description": "Capital assets incl. at least €150,000 financial assets; alternative €650,000 incl. €75,000 financial",
              "amount": 500000,
              "currency": "EUR"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Current agency page: €60,000 admin fee, €37,000 government contribution, €2,000 NGO donation; rent ≥€14,000 annual or purchase ≥€375,000; assets €500k incl €150k financial or €650k incl €75k."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "mu-property",
      "expectedHash": "4560f07a0715528f4b76ed1c2ab4de7078c2c6dabc5a44acae3d7f64ab812b8a",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Property-linked residence permit",
              "summary": "EDB says non-citizens acquiring residential property under approved IRS, RES or PDS schemes for USD 375,000 qualify for residence permit while holding the property; spouse and children under 24 may qualify. PDS permit holders are exempt from work permit to invest and work.",
              "sourceUrl": "https://edbmauritius.org/real-estate-hospitality",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Purchase currency rules",
              "summary": "EDB states amendments effective 13 Dec 2024 require 85% purchase price in Mauritian rupees and remaining 15% in foreign currency or rupees; for property over USD 750,000, first USD 750,000 from own funds and local rupee loan can cover remainder.",
              "sourceUrl": "https://edbmauritius.org/newsroom/amendments-to-irs-res-ihs-pds-and-scs-regulations",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 375000,
              "currency": "USD",
              "period": "assets",
              "description": "Qualifying property under approved IRS/RES/PDS schemes; residence permit while property ownership continues.",
              "sourceUrl": "https://edbmauritius.org/real-estate-hospitality"
            }
          ],
          "limitations": [
            "Not any property qualifies; scheme/project conditions and acquisition costs apply.",
            "Permit validity is ownership-linked, not processing time or citizenship clock.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "EDB says non-citizens acquiring residential property under approved IRS, RES or PDS schemes for USD 375,000 qualify for residence permit while holding the property; spouse and children under 24 may qualify. PDS permit holders are exempt from work permit to invest and work.",
          "EDB states amendments effective 13 Dec 2024 require 85% purchase price in Mauritian rupees and remaining 15% in foreign currency or rupees; for property over USD 750,000, first USD 750,000 from own funds and local rupee loan can cover remainder."
        ],
        "pros": [],
        "cons": [
          "Not any property qualifies; scheme/project conditions and acquisition costs apply.",
          "Permit validity is ownership-linked, not processing time or citizenship clock.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "mx-residency",
      "expectedHash": "ee789704145a77d0658fdcf9b5ccdcd2b4a78aec4ae80fcd98008eb84ed2d225",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Temporary residence validity and solvency",
              "summary": "Denver SRE consulate lists temporary residence for stays over 180 days and less than four years, without paid activities under its description; its checklist accepts either USD 70,000 minimum monthly balance for 12 months, USD 4,200 monthly employment/pension income for six months, or qualifying Mexican property over USD 558,000. Consular solvency amounts vary by post/year.",
              "sourceUrl": "https://consulmex.sre.gob.mx/denver/index.php/visasparapersonasextranjeras",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            },
            {
              "topic": "Work rights",
              "summary": "Oklahoma SRE consulate says temporary resident may work when salary is paid from abroad; local Mexico paid job requires employer to obtain authorization from INM.",
              "sourceUrl": "https://consulmex.sre.gob.mx/oklahoma/index.php/visas",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 70000,
              "currency": "USD",
              "period": "balance",
              "description": "Denver post example only: minimum monthly savings/investment balance over preceding 12 months.",
              "sourceUrl": "https://consulmex.sre.gob.mx/denver/index.php/visasparapersonasextranjeras"
            },
            {
              "amount": 4200,
              "currency": "USD",
              "period": "monthly",
              "description": "Denver post example alternative: income for six months, free of liens.",
              "sourceUrl": "https://consulmex.sre.gob.mx/denver/index.php/visasparapersonasextranjeras"
            }
          ],
          "limitations": [
            "Solvency thresholds are post-specific and change; Denver figures are not national universal thresholds. Confirm consular jurisdiction.",
            "Temporary duration is not processing time; permanent-residence path and citizenship clock vary by eligibility basis.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Denver SRE consulate lists temporary residence for stays over 180 days and less than four years, without paid activities under its description; its checklist accepts either USD 70,000 minimum monthly balance for 12 months, USD 4,200 monthly employment/pension income for six months, or qualifying Mexican property over USD 558,000. Consular solvency amounts vary by post/year.",
          "Oklahoma SRE consulate says temporary resident may work when salary is paid from abroad; local Mexico paid job requires employer to obtain authorization from INM."
        ],
        "pros": [],
        "cons": [
          "Solvency thresholds are post-specific and change; Denver figures are not national universal thresholds. Confirm consular jurisdiction.",
          "Temporary duration is not processing time; permanent-residence path and citizenship clock vary by eligibility basis.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "my-mm2h",
      "expectedHash": "41a551e6169f82af118b20798e0389458d857a2564bfbf683a01c417fc25c675",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Silver category",
              "summary": "Official MM2H Silver terms require USD 150,000 fixed deposit, compulsory Malaysian residence purchase of at least RM600,000, age 25+, 5-year renewable term, 90 days annual stay for under-50 participants, and RM1,000 one-off participation fee.",
              "sourceUrl": "https://www.mm2h.gov.my/category/silver",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 150000,
              "currency": "USD",
              "period": "balance",
              "description": "Required fixed deposit; up to 50% withdrawal for specified purposes after approval",
              "sourceUrl": "https://www.mm2h.gov.my/category/silver"
            },
            {
              "amount": 600000,
              "currency": "MYR",
              "period": "assets",
              "description": "Minimum required residence purchase",
              "sourceUrl": "https://www.mm2h.gov.my/category/silver"
            },
            {
              "amount": 1000,
              "currency": "MYR",
              "period": "one-time",
              "description": "Silver one-off participation fee",
              "sourceUrl": "https://www.mm2h.gov.my/category/silver"
            }
          ],
          "limitations": [
            "Application via licensed MM2H tour operator/One Stop Centre; it is not permanent residence; processing/citizenship not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official MM2H Silver terms require USD 150,000 fixed deposit, compulsory Malaysian residence purchase of at least RM600,000, age 25+, 5-year renewable term, 90 days annual stay for under-50 participants, and RM1,000 one-off participation fee."
        ],
        "pros": [],
        "cons": [
          "Application via licensed MM2H tour operator/One Stop Centre; it is not permanent residence; processing/citizenship not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "nl-hsm",
      "expectedHash": "0aa102136af8aea69acf847bda799acd11877e58a5887a5f324c84ef52f0a8df",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "2026 gross monthly thresholds: €5,942 age 30+, €4,357 under 30, €3,122 reduced. Recognized IND sponsor and market-rate job required.",
              "retrieval": "official-index",
              "sourceUrl": "https://ind.nl/en/required-amounts-income-requirements",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 5942,
              "sourceUrl": "https://ind.nl/en/required-amounts-income-requirements",
              "period": "monthly",
              "currency": "EUR",
              "description": "30+ 2026"
            },
            {
              "amount": 4357,
              "sourceUrl": "https://ind.nl/en/required-amounts-income-requirements",
              "period": "monthly",
              "currency": "EUR",
              "description": "Under 30 2026"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "2026 gross monthly thresholds: €5,942 age 30+, €4,357 under 30, €3,122 reduced. Recognized IND sponsor and market-rate job required."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "no-skilled",
      "expectedHash": "fbb708d691a42eff4c3809e433b857010dc12847f319bc0af7e43b54155c4f03",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Concrete employer job offer, relevant skilled qualification; normal pay/conditions. University role permit usually up to 3 years; PR application after 3 years.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/?c=per",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "The retrieved UDI page is personalized for Peru. General skilled-work statements do not establish nationality-specific documents or application channels for Azerbaijan or another citizenship."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Concrete employer job offer, relevant skilled qualification; normal pay/conditions. University role permit usually up to 3 years; PR application after 3 years."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "nz-smc",
      "expectedHash": "803459396be2338ab0db40a15ddb2ce16b8a7df6abb4ab34e77764b4f48c71d6",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Six-point residence pathway",
              "summary": "SMC points pathway needs six skilled resident points from qualification, occupational registration or income, with up to three additional points from skilled NZ work; all applicants generally need a NZ job/offer, wage threshold, health, character and English. Official page also lists separate skilled work experience and trades/technician routes.",
              "sourceUrl": "https://www.immigration.govt.nz/visas/skilled-migrant-category-resident-visa/",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "The archived six-point framing omits job/offer and NZ work requirements. Rules scheduled to change; verify applicable date at filing.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "SMC points pathway needs six skilled resident points from qualification, occupational registration or income, with up to three additional points from skilled NZ work; all applicants generally need a NZ job/offer, wage threshold, health, character and English. Official page also lists separate skilled work experience and trades/technician routes."
        ],
        "pros": [],
        "cons": [
          "The archived six-point framing omits job/offer and NZ work requirements. Rules scheduled to change; verify applicable date at filing.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "pa-friendly",
      "expectedHash": "488c68371178a5e3f0a3b0f1ff40405eec5815a4507845e0d20ef7c5dddfc178",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "unclear",
          "claims": [
            {
              "topic": "Friendly Nations eligibility",
              "summary": "Decree 416 and 2021 Decree 197 restrict permanent-residence subcategory to designated nationalities and qualifying economic/professional purposes. SNM 2026 decree index shows Decree 16 adds Ecuador, confirming list is mutable; current consolidated text is needed for final nationality list.",
              "sourceUrl": "https://www.migracion.gob.pa/wp-content/uploads/DECRETO_EJECUTIVO_197.pdf",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            },
            {
              "topic": "Separate financial-solvency route",
              "summary": "SNM fixed-term deposit PDF describes a separate permanent residence route with B/.300,000 deposit for two years before applying for permanent residence; not a Friendly Nations requirement.",
              "sourceUrl": "https://www.migracion.gob.pa/wp-content/uploads/03.SOLVENCIA_ECONOMICA_DEPOSITO_PLAZO_FIJO.pdf",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Do not conflate Friendly Nations with separate solvency deposit pathway. Exact current modalities/list need consolidated 2026 checklist.",
            "Archive’s Azerbaijan eligibility not demonstrated; original list excluded Azerbaijan and later amendments need checking.",
            "No all-in cost, processing time or citizenship clock established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent crosscheck could not retrieve supporting page content for a cited PDF/page (403/404, oversized PDF or unavailable endpoint). Search-index evidence is partial; direct confirmation remains required."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Decree 416 and 2021 Decree 197 restrict permanent-residence subcategory to designated nationalities and qualifying economic/professional purposes. SNM 2026 decree index shows Decree 16 adds Ecuador, confirming list is mutable; current consolidated text is needed for final nationality list.",
          "SNM fixed-term deposit PDF describes a separate permanent residence route with B/.300,000 deposit for two years before applying for permanent residence; not a Friendly Nations requirement."
        ],
        "pros": [],
        "cons": [
          "Do not conflate Friendly Nations with separate solvency deposit pathway. Exact current modalities/list need consolidated 2026 checklist.",
          "Archive’s Azerbaijan eligibility not demonstrated; original list excluded Azerbaijan and later amendments need checking.",
          "No all-in cost, processing time or citizenship clock established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "pt-d7",
      "expectedHash": "6d557905e4018d294ef86ea9a3ff4f892ef6e16e7ec31ef3f4c8f9ebb3be0081",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "unclear",
          "claims": [
            {
              "topic": "D7 means of subsistence",
              "retrieval": "official-index",
              "summary": "MNE portal direct access returned 403. Official-source consular checklist links means-of-subsistence page and asks for resources for at least 12 months; it does not expose the exact threshold. Statutory percentage/euro figure was not independently verified from issuing authority.",
              "sourceUrl": "https://vistos.mne.gov.pt/en/national-visas/necessary-documentation/means-of-subsistence",
              "checkedAt": "2026-10-25T13:39:21.000Z"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "MNE official page returned 403; current threshold and 12-month interpretation remain partially supported by consular application checklist.",
            "Archived bank balance and accommodation claims need competent post specific confirmation.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "MNE portal direct access returned 403. Official-source consular checklist links means-of-subsistence page and asks for resources for at least 12 months; it does not expose the exact threshold. Statutory percentage/euro figure was not independently verified from issuing authority."
        ],
        "pros": [],
        "cons": [
          "MNE official page returned 403; current threshold and 12-month interpretation remain partially supported by consular application checklist.",
          "Archived bank balance and accommodation claims need competent post specific confirmation.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "pt-golden-visa",
      "expectedHash": "2a52487786568ee879c32f097fd2ab6816f052b82ac79b4af6c0e962a547bfe5",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "ARI options include 10 jobs; €500k non-real-estate investment funds or research; €250k cultural; qualifying company capital/jobs. Real estate investment excluded.",
              "retrieval": "official-index",
              "sourceUrl": "https://aima.gov.pt/en/viver/autorizacao-de-residencia-para-investimento-art-90-o-a",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 500000,
              "sourceUrl": "https://aima.gov.pt/en/viver/autorizacao-de-residencia-para-investimento-art-90-o-a",
              "period": "one-time",
              "currency": "EUR",
              "description": "Research/fund options; cultural route €250k"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "ARI options include 10 jobs; €500k non-real-estate investment funds or research; €250k cultural; qualifying company capital/jobs. Real estate investment excluded."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "py-residency",
      "expectedHash": "4753de557cc29f8e0818b4fd4de0c6b664dc6f744dbdcb8cad934c15ece2e37d",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Temporary to permanent path",
              "summary": "DNM says temporary residence is granted up to two years, renewable for an equal period, and is prerequisite for permanent residence; resident-in-process status permits work/study and exit/reentry.",
              "sourceUrl": "https://migraciones.gov.py/residencia-temporal/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Current permanent solvency rules",
              "summary": "DNM Resolution 407/2026 effective for applications from 6 Jul 2026 unifies permanent-residence proof and requires verifiable income and evidence of actual declared activity. Twelve categories include remote workers, property owners, shareholders, pensioners and others.",
              "sourceUrl": "https://migraciones.gov.py/migraciones-actualiza-el-regimen-de-acreditacion-de-solvencia-economica-para-extranjeros/",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Generic low-bar/instant permanent-residence claim is inaccurate: ordinary route requires prior temporary residence and category-based solvency documents.",
            "Investor SUACE is separate. No one universal amount in overview; current detailed checklist required.",
            "Processing time, total costs, dependants and citizenship clock remain unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "DNM says temporary residence is granted up to two years, renewable for an equal period, and is prerequisite for permanent residence; resident-in-process status permits work/study and exit/reentry.",
          "DNM Resolution 407/2026 effective for applications from 6 Jul 2026 unifies permanent-residence proof and requires verifiable income and evidence of actual declared activity. Twelve categories include remote workers, property owners, shareholders, pensioners and others."
        ],
        "pros": [],
        "cons": [
          "Generic low-bar/instant permanent-residence claim is inaccurate: ordinary route requires prior temporary residence and category-based solvency documents.",
          "Investor SUACE is separate. No one universal amount in overview; current detailed checklist required.",
          "Processing time, total costs, dependants and citizenship clock remain unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "rs-company-residence",
      "expectedHash": "d8b4fb6ec53c69a3237520fc2725c5c68cd650ccf82f93bd93b98b5812e0f3cd",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Business-owner residence",
              "summary": "Freshly retrieved official Serbia portal: running a business is a recognized residence purpose through self-employment; longer stays require D visa or temporary residence/work single permit. Company incorporation is a valid purpose but does not guarantee visa/permit.",
              "sourceUrl": "https://welcometoserbia.gov.rs/visa-for-foreign-business-owners",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "No minimum capital/income stated in the reviewed article; visa/permit still subject to applicable conditions. PR/citizenship not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Freshly retrieved official Serbia portal: running a business is a recognized residence purpose through self-employment; longer stays require D visa or temporary residence/work single permit. Company incorporation is a valid purpose but does not guarantee visa/permit."
        ],
        "pros": [],
        "cons": [
          "No minimum capital/income stated in the reviewed article; visa/permit still subject to applicable conditions. PR/citizenship not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "rs-property-residence",
      "expectedHash": "758997a2668865d45ca91f39d0da64dd45b11811ce9531417d2f2f25e8488fac",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Property residence",
              "summary": "Freshly retrieved official Serbia portal lists real estate owner as a statutory basis for temporary residence. Temporary residence can be issued up to three years depending on the basis; page does not state minimum property value.",
              "sourceUrl": "https://welcometoserbia.gov.rs/temporary-residence-international-agreements",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Exact documents and any property proof conditions should be checked in linked eApplication guidance; no numeric property threshold or citizenship claim established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Freshly retrieved official Serbia portal lists real estate owner as a statutory basis for temporary residence. Temporary residence can be issued up to three years depending on the basis; page does not state minimum property value."
        ],
        "pros": [],
        "cons": [
          "Exact documents and any property proof conditions should be checked in linked eApplication guidance; no numeric property threshold or citizenship claim established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "sa-premium-annual",
      "expectedHash": "ae03275eda3eebfe1fc364b8f2e4b7dc14f7c6f4ec53961d7176e2a081dd100f",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Product fee",
              "summary": "Official Premium Residency Center official-domain index states limited-duration residency is one to five years renewable and costs SAR 100,000 per year. Direct pages opened today redirected to JavaScript/logout; search index is current observation.",
              "sourceUrl": "https://pr.gov.sa/product-details-limited-unlimited",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 100000,
              "currency": "SAR",
              "period": "annual",
              "description": "Limited-duration product fee, not income floor",
              "sourceUrl": "https://pr.gov.sa/product-details-limited-unlimited"
            }
          ],
          "limitations": [
            "Direct platform source blocked; product eligibility and renewal specifics need platform confirmation; no citizenship entitlement stated.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official Premium Residency Center official-domain index states limited-duration residency is one to five years renewable and costs SAR 100,000 per year. Direct pages opened today redirected to JavaScript/logout; search index is current observation."
        ],
        "pros": [],
        "cons": [
          "Direct platform source blocked; product eligibility and renewal specifics need platform confirmation; no citizenship entitlement stated.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "sa-premium-one-time",
      "expectedHash": "f25985dbacd51e7c1822657487c2e6161451e9f1593851c7c44538f082c0b8b5",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Product fee",
              "summary": "Official Premium Residency Center official-domain index states unlimited/permanent residency costs SAR 800,000. Direct pages opened today redirected to JavaScript/logout; search index is current observation.",
              "sourceUrl": "https://pr.gov.sa/product-details-limited-unlimited",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 800000,
              "currency": "SAR",
              "period": "one-time",
              "description": "Permanent/unlimited product fee, not investment amount",
              "sourceUrl": "https://pr.gov.sa/product-details-limited-unlimited"
            }
          ],
          "limitations": [
            "Direct platform source blocked; fee alone does not establish eligibility; no citizenship entitlement stated.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official Premium Residency Center official-domain index states unlimited/permanent residency costs SAR 800,000. Direct pages opened today redirected to JavaScript/logout; search index is current observation."
        ],
        "pros": [],
        "cons": [
          "Direct platform source blocked; fee alone does not establish eligibility; no citizenship entitlement stated.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
          "Primary-agent direct retrieval was blocked, empty, too large or redirected away from evidence for one or more sources; those claims are conservatively labeled official-index pending a direct check."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "se-work",
      "expectedHash": "bf6918288be2e5237594eee85711398be10508aa349e43151fde05064de90c78",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "From June 2026 salary at least 90% median = SEK 34,470/month, with collective/common conditions; exceptions apply.",
              "retrieval": "page",
              "sourceUrl": "https://www.migrationsverket.se/en/word-explanations/salary-requirements-for-a-work-permit.html",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [
            {
              "amount": 34470,
              "sourceUrl": "https://www.migrationsverket.se/en/word-explanations/salary-requirements-for-a-work-permit.html",
              "period": "monthly",
              "currency": "SEK",
              "description": "90% median; current June 2026"
            }
          ],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "From June 2026 salary at least 90% median = SEK 34,470/month, with collective/common conditions; exceptions apply."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "sg-ep",
      "expectedHash": "fa40b48ef1157e391c36c1c4a600d7d027b7cecec2b72e3cd06ffb219c2606e6",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Employment Pass",
              "summary": "Singapore EP needs a qualifying salary starting SGD 5,600/month outside financial services (age adjusted; SGD 6,200 in financial services) and generally 40 COMPASS points; employer/agent applies. First pass up to two years, renewals up to three years.",
              "sourceUrl": "https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 5600,
              "currency": "SGD",
              "period": "monthly",
              "description": "Base qualifying monthly salary outside financial services; rises with age",
              "sourceUrl": "https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility"
            }
          ],
          "limitations": [
            "Salary and COMPASS rules are age, sector and employer dependent; a pass requires job offer and employer application. 2027 salary updates published.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Singapore EP needs a qualifying salary starting SGD 5,600/month outside financial services (age adjusted; SGD 6,200 in financial services) and generally 40 COMPASS points; employer/agent applies. First pass up to two years, renewals up to three years."
        ],
        "pros": [],
        "cons": [
          "Salary and COMPASS rules are age, sector and employer dependent; a pass requires job offer and employer application. 2027 salary updates published.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "th-dtv",
      "expectedHash": "8fabe43443143fe14bff24cb04a4229b25e5714b00d2fe17e91a0d12acc9f83e",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": true,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "DTV workcation",
              "summary": "Thai official information lists DTV for remote workers/freelancers, Thai soft-power activities and dependants, valid five years with up to 180 days per entry. Current embassy checklist requires at least THB 500,000 funds and proof matching category; Thai-source employment/freelance work is not authorized.",
              "sourceUrl": "https://washingtondc.thaiembassy.org/en/page/dtv-visa",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [
            {
              "amount": 500000,
              "currency": "THB",
              "period": "balance",
              "description": "Financial evidence; some posts require statements for multiple months",
              "sourceUrl": "https://washingtondc.thaiembassy.org/en/page/dtv-visa"
            }
          ],
          "limitations": [
            "Consular document details and fees vary by application post; DTV is a multiple-entry tourist visa, not permanent residence. PR/citizenship not established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired"
          ]
        },
        "requirements": [
          "Thai official information lists DTV for remote workers/freelancers, Thai soft-power activities and dependants, valid five years with up to 180 days per entry. Current embassy checklist requires at least THB 500,000 funds and proof matching category; Thai-source employment/freelance work is not authorized."
        ],
        "pros": [],
        "cons": [
          "Consular document details and fees vary by application post; DTV is a multiple-entry tourist visa, not permanent residence. PR/citizenship not established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "th-ltr-remote-degree",
      "expectedHash": "cc567aa8a454dc8fb1be3fe53991cfda23c9c61af96d4e51fe5a392612ff25b8",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": true,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Remote professional alternative",
              "summary": "BOI 2025 criteria allow USD 40,000 annual income over the past two years plus qualifying master's degree, IP ownership or Series A funding; qualifying overseas employer conditions also apply. Not a degree-only independent route. This claim was freshly retrieved in the official BOI search index; direct PDF page content was not opened in the browser.",
              "sourceUrl": "https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf",
              "checkedAt": "2026-10-25T13:50:00.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 40000,
              "currency": "USD",
              "period": "annual",
              "description": "Annual income alternative averaged over prior two years",
              "sourceUrl": "https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf"
            }
          ],
          "limitations": [
            "Employer conditions and no Thai work permit for this class; BOI endorsement time is 20 working days after complete submission, not total visa processing. No PR/citizenship established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "BOI 2025 criteria allow USD 40,000 annual income over the past two years plus qualifying master's degree, IP ownership or Series A funding; qualifying overseas employer conditions also apply. Not a degree-only independent route. This claim was freshly retrieved in the official BOI search index; direct PDF page content was not opened in the browser."
        ],
        "pros": [],
        "cons": [
          "Employer conditions and no Thai work permit for this class; BOI endorsement time is 20 working days after complete submission, not total visa processing. No PR/citizenship established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "th-ltr-remote-standard",
      "expectedHash": "8057387c831df096d822bb92eb75fc09b5d41da9efea1d230acac579b6b7ed7a",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": true,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Remote professional requirements",
              "summary": "BOI 2025 criteria require USD 80,000 annual personal income over the past two years, or USD 40,000 plus specified master's/IP/Series A alternative; employer must meet listed-public-company or qualifying private-company criteria. This claim was freshly retrieved in the official BOI search index; direct PDF page content was not opened in the browser.",
              "sourceUrl": "https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf",
              "checkedAt": "2026-10-25T13:50:00.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 80000,
              "currency": "USD",
              "period": "annual",
              "description": "Annual personal income over the past two years, standard track",
              "sourceUrl": "https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf"
            }
          ],
          "limitations": [
            "Overseas employer and no Thai work permit for this category; 20 working days is endorsement review only. No PR/citizenship established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "BOI 2025 criteria require USD 80,000 annual personal income over the past two years, or USD 40,000 plus specified master's/IP/Series A alternative; employer must meet listed-public-company or qualifying private-company criteria. This claim was freshly retrieved in the official BOI search index; direct PDF page content was not opened in the browser."
        ],
        "pros": [],
        "cons": [
          "Overseas employer and no Thai work permit for this category; 20 working days is endorsement review only. No PR/citizenship established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "th-ltr-wealthy",
      "expectedHash": "5f40d25d30e5992cdff77992f06d1a3b773239a2b4d7e9cf011da2687ef56e56",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": false,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Wealth requirements",
              "summary": "BOI 2025 material states no personal income floor for Wealthy Global Citizens; USD 1m personal assets including Thailand investments plus USD 500,000 qualifying Thai investment required. Health coverage has alternatives. This claim was freshly retrieved in the official BOI search index; direct PDF page content was not opened in the browser.",
              "sourceUrl": "https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 1000000,
              "currency": "USD",
              "period": "assets",
              "description": "Personal assets, including Thai investments",
              "sourceUrl": "https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf"
            },
            {
              "amount": 500000,
              "currency": "USD",
              "period": "assets",
              "description": "Qualifying investment in Thailand",
              "sourceUrl": "https://ltr.boi.go.th/documents/BOI-brochure%202025-LTR.pdf"
            }
          ],
          "limitations": [
            "Annual income is not required for this category. Visa renewable up to 10 years; no PR/citizenship established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "BOI 2025 material states no personal income floor for Wealthy Global Citizens; USD 1m personal assets including Thailand investments plus USD 500,000 qualifying Thai investment required. Health coverage has alternatives. This claim was freshly retrieved in the official BOI search index; direct PDF page content was not opened in the browser."
        ],
        "pros": [],
        "cons": [
          "Annual income is not required for this category. Visa renewable up to 10 years; no PR/citizenship established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "tr-cbi",
      "expectedHash": "ac25ed8d27a5a701557ad9223056557f983d0e3c5d925f05fcfd40e51c05d12c",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": 0,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Citizenship by investment options",
              "summary": "Official Turkish citizenship FAQ lists fixed capital investment USD 500,000, real estate USD 400,000 with three-year no-sale annotation, or bank deposit USD 500,000 held three years, among qualifying options; employment creation alternative is 50 jobs.",
              "sourceUrl": "https://www.nvi.gov.tr/sss-vatandaslik-hizmetleri",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "official-index"
            }
          ],
          "financialRequirements": [
            {
              "amount": 400000,
              "currency": "USD",
              "period": "assets",
              "description": "Minimum real estate value with three-year no-sale annotation",
              "sourceUrl": "https://www.nvi.gov.tr/sss-vatandaslik-hizmetleri"
            },
            {
              "amount": 500000,
              "currency": "USD",
              "period": "assets",
              "description": "Alternative fixed capital investment or bank deposit held three years",
              "sourceUrl": "https://www.nvi.gov.tr/sss-vatandaslik-hizmetleri"
            }
          ],
          "limitations": [
            "Multiple alternative routes; not all have same capital requirement. Citizenship discretionary and processing duration not stated in reviewed source.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics.",
            "Primary-agent crosscheck could not retrieve supporting page content for a cited PDF/page (403/404, oversized PDF or unavailable endpoint). Search-index evidence is partial; direct confirmation remains required."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official Turkish citizenship FAQ lists fixed capital investment USD 500,000, real estate USD 400,000 with three-year no-sale annotation, or bank deposit USD 500,000 held three years, among qualifying options; employment creation alternative is 50 jobs."
        ],
        "pros": [],
        "cons": [
          "Multiple alternative routes; not all have same capital requirement. Citizenship discretionary and processing duration not stated in reviewed source.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "tw-goldcard",
      "expectedHash": "35d12e07e8e201b082164a35ef44941db6548f3b35709e0f6a3613889bc32a2f",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Card rights and duration",
              "summary": "Official Taiwan Gold Card portal says card combines resident visa, work permit, ARC and re-entry permit, valid 1-3 years; no sponsor/job offer is required, and it permits open employment. Official overview states eligibility depends on professional assessment and application fees USD 100-310; perfect application described as 30 days, more documents 50-60 days. Portal lists PR eligibility after three years, subject to rules.",
              "sourceUrl": "https://goldcard.nat.gov.tw/en/about/",
              "checkedAt": "2026-10-25T13:40:26.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Eligibility is profession/sector specific; fee depends on nationality and validity. Portal summary last changed 2020, so PR detail requires current law confirmation.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official Taiwan Gold Card portal says card combines resident visa, work permit, ARC and re-entry permit, valid 1-3 years; no sponsor/job offer is required, and it permits open employment. Official overview states eligibility depends on professional assessment and application fees USD 100-310; perfect application described as 30 days, more documents 50-60 days. Portal lists PR eligibility after three years, subject to rules."
        ],
        "pros": [],
        "cons": [
          "Eligibility is profession/sector specific; fee depends on nationality and validity. Portal summary last changed 2020, so PR detail requires current law confirmation.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "uk-global-talent",
      "expectedHash": "36c516a4ecaced31b43f32f071414aeb3573763ad99b4423279e9d2a5440a7db",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Endorsement or eligible prestigious prize; stay up to 5 years at a time; settlement after 3 or 5 years by field/case; overseas decisions usually 3 weeks.",
              "retrieval": "official-index",
              "sourceUrl": "https://www.gov.uk/global-talent/overview",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Endorsement or eligible prestigious prize; stay up to 5 years at a time; settlement after 3 or 5 years by field/case; overseas decisions usually 3 weeks."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "uk-skilled",
      "expectedHash": "2d7b0da831b3d4f5f7543eaaa26aac5b4a27870e38d53a6b7b79fb3469a401d6",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "summary": "Approved sponsor, eligible occupation, salary generally at least £41,700 or going rate whichever higher; exceptions vary.",
              "retrieval": "page",
              "sourceUrl": "https://www.gov.uk/skilled-worker-visa/your-job",
              "checkedAt": "2026-10-25T13:39:21.000Z",
              "topic": "Current route requirements"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Partial selected-claim review only; pathway remains unverified.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Approved sponsor, eligible occupation, salary generally at least £41,700 or going rate whichever higher; exceptions vary."
        ],
        "pros": [],
        "cons": [
          "Partial selected-claim review only; pathway remains unverified.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "us-dv",
      "expectedHash": "bbf77de4678f58c3eaa035116cb64dd6b0234d6ad72acde2b58383ff6ae6e70e",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "unclear",
          "claims": [
            {
              "topic": "Registration and issuance status",
              "summary": "Official State Department instructions describe DV-2026, whose registration ended Nov 7, 2024; DV-2027 dates were not supplied in the instructions retrieved. The Aug 31, 2026 issuance guidance page contains conflicting text: a top update says the December 2025 pause ended after an Aug 28 court order, while the body says all issuances are paused. Current issuance status is therefore unclear from that official page and requires recheck.",
              "sourceUrl": "https://travel.state.gov/content/travel/en/us-visas/immigrate/diversity-visa-program-entry/diversity-visa-instructions.html",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Conflicting issuance notice",
              "summary": "The official notice's top update and body conflict on whether visa issuance is paused; do not treat either statement as unqualified current status.",
              "sourceUrl": "https://travel.state.gov/en/newsroom/visas/2025/diversity-visa-issuance-updated-guidance.html",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Entry is free but ancillary application/medical/travel costs are not zero; archive total cost unsupported.",
            "Azerbaijan birth/nativity eligibility must be checked against each year's instructions; annual country eligibility can change.",
            "Do not claim annual Oct–Nov window or fixed odds; DV-2027 registration dates were not found, and the current official issuance page is internally contradictory.",
            "Residence years to citizenship is not visa-processing time.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official State Department instructions describe DV-2026, whose registration ended Nov 7, 2024; DV-2027 dates were not supplied in the instructions retrieved. The Aug 31, 2026 issuance guidance page contains conflicting text: a top update says the December 2025 pause ended after an Aug 28 court order, while the body says all issuances are paused. Current issuance status is therefore unclear from that official page and requires recheck.",
          "The official notice's top update and body conflict on whether visa issuance is paused; do not treat either statement as unqualified current status."
        ],
        "pros": [],
        "cons": [
          "Entry is free but ancillary application/medical/travel costs are not zero; archive total cost unsupported.",
          "Azerbaijan birth/nativity eligibility must be checked against each year's instructions; annual country eligibility can change.",
          "Do not claim annual Oct–Nov window or fixed odds; DV-2027 registration dates were not found, and the current official issuance page is internally contradictory.",
          "Residence years to citizenship is not visa-processing time.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "us-e2",
      "expectedHash": "4364d6694bd4c8f66949063379b9566e87acc65a6061ec63832797b6cd846e63",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Treaty nationality",
              "summary": "State Department treaty-country list includes Azerbaijan for E-2 treaty investor classification (effective August 2, 2001); Azerbaijani nationality can satisfy the nationality threshold. This alone does not establish business or investment eligibility.",
              "sourceUrl": "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/treaty.html",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "No generic minimum investment amount: investment must be substantial in relation to enterprise cost, at risk, and in a bona fide non-marginal enterprise; thresholds and evidentiary rules not reviewed here.",
            "E-2 is nonimmigrant and does not itself grant permanent residence; family/work authorization rules not fully reviewed.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "State Department treaty-country list includes Azerbaijan for E-2 treaty investor classification (effective August 2, 2001); Azerbaijani nationality can satisfy the nationality threshold. This alone does not establish business or investment eligibility."
        ],
        "pros": [],
        "cons": [
          "No generic minimum investment amount: investment must be substantial in relation to enterprise cost, at risk, and in a bona fide non-marginal enterprise; thresholds and evidentiary rules not reviewed here.",
          "E-2 is nonimmigrant and does not itself grant permanent residence; family/work authorization rules not fully reviewed.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "us-eb2",
      "expectedHash": "1d734936aee2bf5aefebfabcfb62f8aac751168c00b020acf3fe1b0b110d11a3",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": false,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Classification and offer exception",
              "summary": "Regulation covers advanced-degree professionals or exceptional ability; ordinary petition requires job offer and labor certification unless waived in national interest. One boolean cannot accurately represent both branches.",
              "sourceUrl": "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-204/subpart-A/section-204.5",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Visa availability/priority date, NIW eligibility and current processing are not determined by basic classification regulation.",
            "Offer rule must remain branch-dependent; no universal processing or PR years claim.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired"
          ],
          "supportsRequirementVersion": "requirements-2026-10-25-v1"
        },
        "requirements": [
          "Regulation covers advanced-degree professionals or exceptional ability; ordinary petition requires job offer and labor certification unless waived in national interest. One boolean cannot accurately represent both branches."
        ],
        "pros": [],
        "cons": [
          "Visa availability/priority date, NIW eligibility and current processing are not determined by basic classification regulation.",
          "Offer rule must remain branch-dependent; no universal processing or PR years claim.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "us-eb3",
      "expectedHash": "0d5b37673884435477213f819ad9c271c880ec110fe450ee0426eb9e1ecd8d8e",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": true,
        "remoteFriendly": false,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "EB-3 worker categories",
              "summary": "Regulation distinguishes skilled workers (at least two years training/experience), professionals (baccalaureate degree), and other workers; employer petition and labor-certification/Schedule A evidence apply.",
              "sourceUrl": "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-204/subpart-A/section-204.5",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "The archive collapses distinct worker classes; actual offer/qualification criteria are job-specific. Visa availability and wait are country/priority-date dependent.",
            "PR grant is permanent status; it does not imply citizenship timeline or processing duration.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship"
          ]
        },
        "requirements": [
          "Regulation distinguishes skilled workers (at least two years training/experience), professionals (baccalaureate degree), and other workers; employer petition and labor-certification/Schedule A evidence apply."
        ],
        "pros": [],
        "cons": [
          "The archive collapses distinct worker classes; actual offer/qualification criteria are job-specific. Visa availability and wait are country/priority-date dependent.",
          "PR grant is permanent status; it does not imply citizenship timeline or processing duration.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "uy-residency",
      "expectedHash": "7e563eb8e77d203d209bf7e919b0fc7548344a02baaf8141787c398bd41632fe",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": null,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "open",
          "claims": [
            {
              "topic": "Residence types and means of life",
              "summary": "Official Interior Ministry page updated 29 Jul 2026 lists permanent and temporary categories; no fixed universal USD income floor. Temporary categories depend on grounds, generally 6 months–2 years; Mercosur temporary residence up to two years renewable.",
              "sourceUrl": "https://www.gub.uy/tramites/residencia-legal",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Citizenship habitual residence",
              "summary": "Official citizenship procedure requires habitual residence and means of life for 3 years with family constituted in Uruguay or 5 years otherwise; absences exceeding six consecutive months reset qualifying time. This is eligibility duration, not processing.",
              "sourceUrl": "https://www.gub.uy/tramites/carta-ciudadania",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "No universal USD 1,800/month floor identified; evidence is category/activity-specific and sufficient for maintenance.",
            "Citizenship is not automatic at year three; habitual residence, means and other conditions apply. Archive tax holiday not reviewed.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "yearsToCitizenship",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Official Interior Ministry page updated 29 Jul 2026 lists permanent and temporary categories; no fixed universal USD income floor. Temporary categories depend on grounds, generally 6 months–2 years; Mercosur temporary residence up to two years renewable.",
          "Official citizenship procedure requires habitual residence and means of life for 3 years with family constituted in Uruguay or 5 years otherwise; absences exceeding six consecutive months reset qualifying time. This is eligibility duration, not processing."
        ],
        "pros": [],
        "cons": [
          "No universal USD 1,800/month floor identified; evidence is category/activity-specific and sufficient for maintenance.",
          "Citizenship is not automatic at year three; habitual residence, means and other conditions apply. Archive tax holiday not reviewed.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    },
    {
      "id": "vu-cbi",
      "expectedHash": "fb4d4b6c592838968f98ae52647c7bdd94d1fd90fd34f604ee52ebd2ed8b2645",
      "patch": {
        "minBudget": null,
        "minMonthlyIncome": null,
        "totalYearOneCost": null,
        "costPerDependent": null,
        "processingWeeks": null,
        "yearsToPR": null,
        "yearsToCitizenship": 0,
        "jobOfferRequired": null,
        "remoteFriendly": null,
        "audit": {
          "batchId": "official-catalog-audit-2026-10-25-v2",
          "status": "partial",
          "reviewedAt": "2026-10-25T14:00:32.743Z",
          "routeStatus": "unclear",
          "claims": [
            {
              "topic": "Program status and rules",
              "summary": "Citizenship Office framework lists DSP among investor citizenship routes and links official Order 33/2019 regulations. Its designated-agent page says DSP agents are to engage a new contract with the Citizenship Office in 2026; current contribution schedule not found in accessible official pages.",
              "sourceUrl": "https://vancitizenship.gov.vu/index.php/about-us/legislative-framework",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            },
            {
              "topic": "Oath/presence",
              "summary": "Official Citizenship Office notice refers to oath of allegiance in physical presence and notes a COVID-era video-conference exception; it does not establish an evergreen no-travel rule.",
              "sourceUrl": "https://vancitizenship.gov.vu/index.php/news-and-updates/95-information",
              "checkedAt": "2026-10-25T13:47:12.000Z",
              "retrieval": "page"
            }
          ],
          "financialRequirements": [],
          "limitations": [
            "Current 2026 DSP contribution and fees not verified; historical 2019/2020 schedule cannot establish archive USD 130,000 is current.",
            "2026 agent-contract notice means program terms/application channel may be transitioning. No processing clock or no-travel guarantee established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
            "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          "unknownFields": [
            "minBudget",
            "minMonthlyIncome",
            "totalYearOneCost",
            "costPerDependent",
            "processingWeeks",
            "yearsToPR",
            "jobOfferRequired",
            "remoteFriendly"
          ]
        },
        "requirements": [
          "Citizenship Office framework lists DSP among investor citizenship routes and links official Order 33/2019 regulations. Its designated-agent page says DSP agents are to engage a new contract with the Citizenship Office in 2026; current contribution schedule not found in accessible official pages.",
          "Official Citizenship Office notice refers to oath of allegiance in physical presence and notes a COVID-era video-conference exception; it does not establish an evergreen no-travel rule."
        ],
        "pros": [],
        "cons": [
          "Current 2026 DSP contribution and fees not verified; historical 2019/2020 schedule cannot establish archive USD 130,000 is current.",
          "2026 agent-contract notice means program terms/application channel may be transitioning. No processing clock or no-travel guarantee established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Open means a route is described by the cited source, not that every applicant or application channel qualifies.",
          "Archive USD conversions, all-in/year-one and dependent spending, and universal processing/residence clocks are not established by these sources; unsupported scalar figures are null. Native thresholds are not summed into a relocation budget.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        "taxNote": "Tax treatment was not established by this claim audit.",
        "tagline": "Selected official-source claims audited; complete eligibility and relocation costs remain unresolved."
      }
    }
  ]
};
