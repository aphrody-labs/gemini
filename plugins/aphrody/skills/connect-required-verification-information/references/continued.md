1. Split each raw field key into a section using its prefix:
   - `company.*` -> `company`
   - `documents.*` -> `documents`
   - `individual.*` -> `individual`
   - `representative.*` -> `representative`
   - `directors.*` -> `directors`
   - `owners.*` -> `owners`
   - `executives.*` -> `executives`
   - anything else -> `account`
2. Render one table per non-empty section. Don’t merge multiple sections into one table.
3. For each table:
   - use the capitalized section name as the table heading, for example `Account`, `Company`, `Representative`, `Directors`, or `Owners`
   - Include the following columns:
     - Heading: blank
       - Content: Row display name, for example “Name”, “Date of birth”, or “Address”
     - Heading: `Requirement`
       - Content: a bulleted list of displayed fields
       - Render one bullet per displayed field
       - Render each field in code format
       - If a field has alternatives, keep them in the same bullet and render them as a set of options, for example ``field_a` or `field_b``
     - Heading: `Verification`
       - Content: a bulleted list built from `extras[].value`
       - Render each `extras[].value` entry as one list item
       - If `extras` is empty, leave the entry blank
     - Heading: `Enforcement action`
       - Content: human-readable enforcement text built from both sets of limit fields
       - First use the unverified limit fields to generate the `if not provided` message(s):
         - `capability_limit_amount`
         - `capability_limit_time`
         - `payment_limit_amount`
         - `payment_limit_time`
         - `payout_limit_amount`
         - `payout_limit_time`
       - Then use the verified limit fields to generate the `if not verified` message(s):
         - `verified_capability_limit_amount`
         - `verified_capability_limit_time`
         - `verified_payment_limit_amount`
         - `verified_payment_limit_time`
         - `verified_payout_limit_amount`
         - `verified_payout_limit_time`
       - If any limit amount or limit time is `<= 0`, treat that impact as immediate
       - If both a time limit and an amount limit exist for the same impact, join them with `or`
       - Group impacts with identical thresholds into a single sentence, for example `Capability, payments, and payouts will be paused immediately if not provided.`
       - If both `if not provided` and `if not verified` text exist, render the `if not provided` sentence(s) first and then the `if not verified` sentence(s); prefix the first `if not verified` sentence with `Also,`
       - If neither set of limits is present, render `—`
4. If two sections share the same row-definition family, they still remain separate tables. For example, `representative` and `owners` both use the `person` row-definition family, but they render as separate `Representative` and `Owners` tables because they’re different sections.
5. Assign each section to one of the row-definition families listed below in the `Row definitions` step. The row-definition family only controls how rows are matched and labeled inside that section’s table:
   - `account` -> `account`
   - `company` -> `entity`
   - `documents` -> `entity`
   - `individual` -> `person`
   - `representative` -> `person`
   - `owners` -> `person`
   - `executives` -> `person`
   - `directors` -> `person`
6. For every non-`account` section, strip the section prefix before matching row rules. For example, match `representative.first_name` as `first_name` and `company.address.city` as `address.city`.
7. Use the row definitions below for that section’s row-definition family. Create a row only when at least one field in that section matches the row.
8. Row definitions:

account: Merchant category code: `/business_profile.mcc/` URL: `/business_profile.(url|requirement)/` Product description: `/business_profile.product_description/` Support phone: `/business_profile.support_phone/` Statement descriptors: `/settings.payments.statement_descriptor/`

- /settings.card_payments.statement_descriptor/ Konbini support email address: `/settings.konbini_payments.support_email/` Konbini support phone number: `/settings.konbini_payments.support_phone/` Konbini support hours: `/settings.konbini_payments.support_hours/` Terms of service: `/^tos_acceptance\./` Issuing terms of service: `/settings\.card_issuing\.tos_acceptance\./` Estimated worker count: `/business_profile\.estimated_worker_count/` Annual revenue: `/business_profile\.annual_revenue/` External account: `/external_account/` Legal guardian: `/legal_guardian\./`

entity: Company name: `/name$/` Company name (kana): `/name_kana/` Company name (kanji): `/name_kanji/` Company address: `/address\..*/` Company address (kana): `/address_kana/` Company address (kanji): `/address_kanji/` Company phone: `/phone/` Company tax ID: `/tax_id/` Company registration number: `/registration_number/` Company ID number: `/id_number/` Trade license: `/company_license/` Memorandum of Association: `/company_memorandum_of_association/` Proof of bank account: `/bank_account_ownership_verification/` Directors provided: `/directors_provided/` Owners provided: `/owners_provided/` Executives provided: `/executives_provided/`

person: Name: `/(first|last)_name/` Name (kana): `/(first|last)_name_kana/` Name (kanji): `/(first|last)_name_kanji/` Aliases: `/full_name_aliases/` Date of birth: `/dob\./` Address: `/^address\./` Address (kana): `/address_kana/` Address (kanji): `/address_kanji/` Registered address: `/registered_address/` Email: `/email/` Phone: `/phone/` Gender: `/gender/` Political Exposure: `/political_exposure/` Tax information: `/ssn_last_4$/` or `/id_number$/` Secondary ID number: `/(id_number_secondary)/` Job title: `/(relationship\.title)/` Relationship with legal entity: `/relationship\.(?!title)/` Nationality: `/nationality/` Passport: `/passport/` Proof of liveness: `/proof_of_liveness/`

1. For `apiVersion=v2`, replace each displayed field with `v2_field_name` and use `v2_alternatives`.
2. If `apiVersion=v2` and a requirement doesn’t expose `v2_field_name`, omit that field from the rendered table. If that removes every field from a row group, omit the row. If a section becomes empty, omit that section table.

##### How to construct the JSON-style summary:

- if the user asks for a JSON summary of required items, return a JSON object in this exact shape. Each array holds zero or more field names:
  ```json
  {
    "requirements": {
      "currently_due": ["configuration.merchant.mcc", "company.name", "representative.first_name"],
      "eventually_due": ["business_profile.url"]
    }
  }
  ```

Do not use ellipses (`...`) or placeholder strings in the output — list every field name explicitly.

- this shape is a derived summary for comparison and display. It isn’t a raw Accounts API response.
- If `apiVersion=v2`, inform the user that this JSON is for information only, and doesn’t match the shape of a real API response.
- derive each field’s due bucket from the requirement’s limit fields in the `get-requirements-for-setups` response:
  - treat a field as `currently_due` when any unverified limit amount or time is `<= 0`, or any verified limit amount or time is `<= 0`
  - otherwise treat it as `eventually_due`
- populate `requirements.currently_due` and `requirements.eventually_due` from those derived buckets
- don’t add a separate `future_requirements` bucket. Regulatory or ORR-driven future changes are modeled through `orrProgram` setup selection and A/B setup comparison, not through a third due array
- for `apiVersion=v1`, use the raw requirement field names in both arrays
- for `apiVersion=v2`, use `v2_field_name` values in both arrays
- If `apiVersion=v2`, omit fields that have no `v2_field_name`
- the JSON diff view compares requirement names only; it doesn’t diff verification text, thresholds, or supplemental metadata

### How to respond to users

When you return results to the user:

- restate the exact validated setup you queried, including `apiVersion`, `platformCountry`, `accountCountry`, `dashboardType`, `tosType`, `legalEntityType`, optional `businessStructure`, selected `capabilities`, and optional `orrProgram`
- always provide the user with a link containing the exact URL query parameters you used so they can view the requirements themselves and verify your conclusions
  - for example: `https://docs.stripe.com/_endpoint/get-requirements-for-setups?account-setup-A[platformCountry]=CA&account-setup-A[accountCountry]=FR&account-setup-A[dashboardType]=full&account-setup-A[tosType]=full&account-setup-A[legalEntityType]=individual&account-setup-A[capabilities][0]=card_payments&account-setup-A[orrProgram]=eu-2025` -> `https://docs.stripe.com/connect/required-verification-information?accountSetupKeys=account-setup-A&account-setup-A%5BapiVersion%5D=v2&account-setup-A%5BplatformCountry%5D=CA&account-setup-A%5BaccountCountry%5D=FR&account-setup-A%5BdashboardType%5D=full&account-setup-A%5BtosType%5D=full&account-setup-A%5BlegalEntityType%5D=individual&account-setup-A%5BbusinessStructure%5D=undefined&account-setup-A%5Bcapabilities%5D=card_payments&account-setup-A%5BorrProgram%5D=eu-2025`
  - when comparing two setups, include `account-setup-B` in the page URL only if you validated and queried setup B
- if any requested choice had to be changed because of selector dependencies, say so explicitly before presenting the requirements
- present currently due requirements separately from eventually due requirements, and label them clearly
- explain verification bullets using `extras[].value` as the source of truth
- mention when a requirement was omitted because it matched none of the table row definitions in this document
- mention when website or MCC endpoints returned no supplemental data, so the user doesn’t mistake that for a fetch failure
- if you receive `validation_errors`, ask the user to correct the setup inputs using the [Interaction contract](#interaction-contract) instead of guessing
- if you receive `build_errors`, retry the request; if the error persists, tell the user the helper endpoint failed unexpectedly

