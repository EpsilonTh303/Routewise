import type { SourceAuditBatch } from "../server/apply-source-audit";

/** New immutable, claim-specific follow-up. Never alter after application. */
export const SOURCE_FOLLOWUP: SourceAuditBatch = {
  id: "official-source-followup-2026-10-25-v1",
  items: [
    {
      id: "vu-cbi",
      expectedHash: "d00df51758304e39403445869f8c0f20a326858f23c99c1d031001efbdaf9746",
      patch: {
        audit: {
          batchId: "official-source-followup-2026-10-25-v1",
          status: "partial",
          reviewedAt: "2026-10-25T17:44:21.000Z",
          routeStatus: "unclear",
          claims: [
            {
              topic: "Program status and rules",
              summary: "Citizenship Office framework lists DSP among investor citizenship routes and links official Order 33/2019 regulations. Its designated-agent page says DSP agents are to engage a new contract with the Citizenship Office in 2026; current contribution schedule not found in accessible official pages.",
              sourceUrl: "https://vancitizenship.gov.vu/index.php/about-us/legislative-framework",
              checkedAt: "2026-10-25T13:47:12.000Z",
              retrieval: "page"
            },
            {
              topic: "Oath/presence",
              summary: "Official Citizenship Office notice refers to oath of allegiance in physical presence and notes a COVID-era video-conference exception; it does not establish an evergreen no-travel rule.",
              sourceUrl: "https://vancitizenship.gov.vu/index.php/news-and-updates/95-information",
              checkedAt: "2026-10-25T13:47:12.000Z",
              retrieval: "page"
            },
            {
              topic: "Citizenship Office fees published online",
              summary: "The current Citizenship Office Fees and Charges page displays government-mandated USD amounts of 130,000 single applicant; 150,000 married couple; 165,000 couple plus one child; 180,000 couple plus two children; and USD 10,000 per additional applicant. It separately lists a USD 5,000 FIU diligence fee and VUV 5,000 application fee per application (excluding Form D), paid at lodgment; the listed citizenship fee is paid after Commission approval. The page also presents a separate Form D schedule (USD 250 application and USD 260,000 citizenship fee covering applicant/spouse/one child, with separate dependent supplements). The page does not state a schedule effective date, does not clearly map the generic table to the DSP subcategory, and advises applicants to contact the Citizenship Office for correct fees. These are published figures, not a verified DSP quote or complete case cost.",
              sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges",
              checkedAt: "2026-10-25T17:44:21.000Z",
              retrieval: "page"
            }
          ],
          financialRequirements: [
            { amount: 130000, currency: "USD", period: "one-time", description: "Citizenship Office fee page's published single-applicant government-mandated citizenship fee. Its schedule has no effective date and the page does not conclusively assign this generic table to DSP; confirm current route-specific fees with the office.", sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges" },
            { amount: 150000, currency: "USD", period: "one-time", description: "Published married-couple citizenship fee on the Citizenship Office fee page; route/form mapping and current quote not confirmed.", sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges" },
            { amount: 165000, currency: "USD", period: "one-time", description: "Published married couple plus one child citizenship fee; route/form mapping and current quote not confirmed.", sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges" },
            { amount: 180000, currency: "USD", period: "one-time", description: "Published married couple plus two children citizenship fee; route/form mapping and current quote not confirmed.", sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges" },
            { amount: 10000, currency: "USD", period: "one-time", description: "Published additional-applicant citizenship fee; applicant category and route/form mapping need office confirmation.", sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges" },
            { amount: 5000, currency: "USD", period: "one-time", description: "Separate FIU diligence fee listed by the Citizenship Office; do not combine with the citizenship fee or treat as the entire diligence cost for a particular file without confirmation.", sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges" },
            { amount: 5000, currency: "VUV", period: "one-time", description: "Application fee per application, excluding Form D, paid when lodging according to the Citizenship Office page.", sourceUrl: "https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges" }
          ],
          limitations: [
            "The Citizenship Office fee page now directly supports a current online public schedule, but is undated and advises applicants to contact the office. The generic table's precise DSP form/category mapping and a current case quote are unresolved; the separate Form D schedule must not be conflated with DSP.",
            "The 2026 agent-contract notice means the DSP application channel or terms may be transitioning. Keep availability unclear pending office confirmation; no processing clock or no-travel guarantee established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Unclear availability means this follow-up does not establish intake for a particular applicant or application channel.",
            "The listed fee amounts are not a complete relocation budget: they do not establish legal/agent charges, all diligence expenses, document costs, or every dependent scenario. Unsupported cost and timing fields remain null.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          unknownFields: ["minBudget", "minMonthlyIncome", "totalYearOneCost", "costPerDependent", "processingWeeks", "yearsToPR", "jobOfferRequired", "remoteFriendly"]
        },
        requirements: [
          "Citizenship Office framework lists DSP among investor citizenship routes and links official Order 33/2019 regulations. Its designated-agent page says DSP agents are to engage a new contract with the Citizenship Office in 2026; the active application channel and full current DSP rules remain unconfirmed.",
          "Official Citizenship Office notice refers to oath of allegiance in physical presence and notes a COVID-era video-conference exception; it does not establish an evergreen no-travel rule.",
          "The Citizenship Office Fees and Charges page directly displays fee categories and amounts, including USD 130,000 for a single applicant, separate FIU diligence and application charges, and a note to contact the office for correct fees. The undated generic amounts are not confirmed as a DSP-specific current quote."
        ],
        cons: [
          "The Citizenship Office fee page now directly supports a current online public schedule, but is undated and advises applicants to contact the office. The generic table's precise DSP form/category mapping and a current case quote are unresolved; the separate Form D schedule must not be conflated with DSP.",
          "The 2026 agent-contract notice means the DSP application channel or terms may be transitioning. Keep availability unclear pending office confirmation; no processing clock or no-travel guarantee established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Unclear availability means this follow-up does not establish intake for a particular applicant or application channel.",
          "The listed fee amounts are not a complete relocation budget: they do not establish legal/agent charges, all diligence expenses, document costs, or every dependent scenario. Unsupported cost and timing fields remain null.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        tagline: "Official fee schedule retrieved; DSP-specific current quote and application availability remain unresolved."
      }
    },
    {
      id: "pt-d7",
      expectedHash: "959bdfcb9c399c503eb6d6378d5c0ddab565b1cc8f78dcb275e819f67ab77a91",
      patch: {
        audit: {
          batchId: "official-source-followup-2026-10-25-v1",
          status: "partial",
          reviewedAt: "2026-10-25T17:44:21.000Z",
          routeStatus: "open",
          claims: [
            {
              topic: "D7 means of subsistence",
              summary: "MNE portal direct access returned 403. Official-source consular checklist links means-of-subsistence page and asks for resources for at least 12 months; it does not expose the exact threshold. Statutory percentage/euro figure was not independently verified from issuing authority.",
              sourceUrl: "https://vistos.mne.gov.pt/en/national-visas/necessary-documentation/means-of-subsistence",
              checkedAt: "2026-10-25T13:39:21.000Z",
              retrieval: "official-index"
            },
            {
              topic: "Own-income residence-visa service",
              summary: "The official gov.pt residence-visa service explicitly covers third-country nationals intending to reside in Portugal as pensioners or live from their own income. It directs applicants to the competent consular post for appointment details and lists a 60-day service deadline; this is not represented as a guaranteed observed end-to-end decision time. The page links the governing residence-entry regulation and means-of-subsistence instruments but its retrieved body does not expose a document checklist.",
              sourceUrl: "https://www.gov.pt/pt/servicos/pedir-um-visto-de-residencia-para-fixacao-de-residencia-de-reformados-religiosos-e-pessoas-que-vivem-de-rendimentos-proprios",
              checkedAt: "2026-10-25T17:44:21.000Z",
              retrieval: "page"
            },
            {
              topic: "Means-of-subsistence formula for own-income applicants",
              summary: "The Diário da República text of Portaria 1563/2007 sets the household reference scale by reference to the minimum guaranteed monthly wage (RMMG), net of social-security contributions: 100% for the first adult, 50% for each additional adult, and 30% per child under 18 or dependent adult child. Article 5(6) says a residence-visa applicant including a retiree or a person living from movable/immovable property, intellectual-property or financial-investment income must show means for at least 12 months; passive-income evidence must show existence and amount of income and its availability in Portugal. This is the general statutory means framework, not a D7-specific flat income promise.",
              sourceUrl: "https://dre.pt/application/conteudo/628798",
              checkedAt: "2026-10-25T17:44:21.000Z",
              retrieval: "page"
            },
            {
              topic: "2026 minimum-wage index",
              summary: "DGERT reports Decree-Law 139/2025 set Portugal's 2026 guaranteed minimum monthly wage (RMMG) at €920, effective 1 January 2026. The subsistence regulation references the wage net of social-security contributions; therefore €920 gross is the current index, not a verified exact net amount or a D7-only monthly threshold.",
              sourceUrl: "https://www.dgert.gov.pt/retribuicao-minima-mensal-garantida-para-2026",
              checkedAt: "2026-10-25T17:44:21.000Z",
              retrieval: "page"
            }
          ],
          financialRequirements: [
            { amount: 920, currency: "EUR", period: "monthly", description: "2026 gross RMMG index effective 1 Jan 2026. The means-of-subsistence statute uses the RMMG net of social-security contributions and a household scale; this gross index is not a D7-specific flat floor or an exact net requirement.", sourceUrl: "https://www.dgert.gov.pt/retribuicao-minima-mensal-garantida-para-2026" }
          ],
          limitations: [
            "Gov.pt confirms an active residence-visa service for own-income applicants, but directs applicants to the competent consular post for appointment details and individualized handling. Service deadline is not represented as a guaranteed observed decision time.",
            "The generic means-of-subsistence regulation uses the minimum wage net of social-security contributions and an applicant-household scale; DGERT's €920 figure is the 2026 gross wage index. Do not display it as a D7-specific exact net monthly floor or compute a household total without the correct net basis and applicant circumstances.",
            "The official AIMA means page retrieved in the prior check still named the 2025 €870 benchmark. The 2026 DGERT statutory wage update is directly retrieved here, but AIMA's page-level summary has not yet been updated to show the 2026 amount.",
            "Current consular checklist handling, fee, appointment timing, and the exact accepted evidence for a specific post remain post-specific. No all-in cost or processing-time estimate is established.",
            "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Broad service availability does not decide any particular applicant's eligibility.",
            "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
          ],
          unknownFields: ["minBudget", "minMonthlyIncome", "totalYearOneCost", "costPerDependent", "processingWeeks", "yearsToPR", "yearsToCitizenship", "jobOfferRequired", "remoteFriendly"]
        },
        requirements: [
          "Official gov.pt lists a residence-visa service for non-EU/EEA/Swiss applicants who wish to reside as a pensioner or live from their own income, directs applicants to the competent consular post for appointment details, and lists a 60-day service deadline. The retrieved page body does not expose a document checklist.",
          "Portaria 1563/2007 establishes a household means scale based on RMMG net of social-security contributions: 100% for the first adult, 50% for additional adults and 30% for dependent children. Article 5(6) requires at least 12 months' means evidence for retirees and people living from asset or financial-investment income, including evidence of income availability in Portugal.",
          "DGERT reports the 2026 RMMG as €920 gross per month effective 1 January 2026. The statutory means formula references RMMG net of social-security contributions, so this index alone does not establish an exact net D7 amount."
        ],
        cons: [
          "The generic means-of-subsistence regulation uses the minimum wage net of social-security contributions and an applicant-household scale; DGERT's €920 figure is the 2026 gross wage index. Do not display it as a D7-specific exact net monthly floor or compute a household total without the correct net basis and applicant circumstances.",
          "The official AIMA means page retrieved in the prior check still named the 2025 €870 benchmark. The 2026 DGERT statutory wage update is directly retrieved here, but AIMA's page-level summary has not yet been updated to show the 2026 amount.",
          "Current consular checklist handling, fee, appointment timing, and the exact accepted evidence for a specific post remain post-specific. No all-in cost or processing-time estimate is established.",
          "This is a claim-specific audit, not full legal eligibility, route verification or document adjudication. Broad service availability does not decide any particular applicant's eligibility.",
          "Country quality, family score and Azerbaijani passport-access scores remain contextual heuristics, not verified rights or current passport statistics."
        ],
        tagline: "Own-income residence-visa service and current 2026 wage index sourced; applicant-specific sufficiency remains unresolved."
      }
    }
  ]
};
