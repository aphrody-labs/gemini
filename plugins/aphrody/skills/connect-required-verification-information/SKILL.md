---
name: connect-required-verification-information
description: >-
  Use this skill when the user asks what information a Stripe Connect connected
  account must provide for verification, onboarding, KYC, or account
  requirements; when they need to compare requirements between connected-account
  setups; or when they ask which verification fields, documents, or business
  details are required for a particular platform country, account country,
  business type, dashboard, service agreement, or capability.
---

## Instructions

The human-accessible version of this documentation allows the user to select connected account fields and regions using a form, and then makes API requests to fetch and display the requirements a connected account with the selected configuration and region must provide. Follow these instructions to fetch the same information.

### Interaction contract

Terminology used in this document:

- `field`: a setup input such as `platformCountry`, `accountCountry`, or `capabilities`
- `option`: a presented selectable option for a field
- `value`: the option the user selects, or the free-response value the user provides for a field

Every time you ask the user to provide a value for a field:

- use a multiple-choice question; never stop at a plain free-form prompt or wait for raw chat input
- if you need free user input, instruct the user to use the question’s free-response field
- for long option lists, explicitly say that any value from the full validated list is still accepted through the free-response field
- if the user already provided a valid answer in an earlier message, use that instead of asking again

### Hard rules

You must follow these rules:

- Ask for a field _only_ after all of its prerequisite fields are satisfied.
- Collect setup fields progressively as the flow advances.
- Ask for one field at a time, or one group of fields only when they’re dependency-free at that point in the flow.
  - For example, ask for `platformCountry` and `accountCountry` separately: the platform country determines which account countries are valid, so asking both together can produce invalid combinations. But you may ask for `dashboardType`, `tosType`, and `legalEntityType` together in one group because their valid options are already known from the same response.
- If there is ever a conflict between the user’s request and the validated setup, inform the user of the conflict and ask them to revise their setup choices using the [Interaction contract](#interaction-contract). Keep the validated setup aligned with what the user requested without silently dropping the conflict.
- Follow the [Interaction contract](#interaction-contract) for every user question.
- When the number of available options exceeds four, _always_ print the full validated reference list before asking the multiple-choice question so the user can see the full option space.
  - When printing countries, always print the full country name followed by its code in parentheses, for example, `Germany (DE)`.
  - In the multiple-choice question, include a small set of suggested options so the user can move forward with immediate clarity. The reference list above remains the authoritative full set.
  - Leave the descriptions for the country suggested options blank.
- For any field with four or fewer valid options, show every valid option directly in the multiple-choice question. Don’t print a separate reference list first.
- Every list of selectable options shown to the user must be pre-validated against all currently known constraints before you display it.
- Never display an option as selectable if you already know it will be removed, rejected, or auto-adjusted later in the flow.
  - Present options that stay valid through the current flow.
- Ask about `capabilities` after `platformCountry`, `accountCountry`, and the downstream validity constraints for that setup are resolved.
- _Only_ ask about `orrProgram` when it is present in the public `programs` returned for the validated setup.
- If the `businessStructure` map for the chosen `legalEntityType` is empty or contains exactly one key `nil`, skip `businessStructure`. Otherwise, ask for `businessStructure` and always allow a `none` option or leave unselected as a suggested option in the multiple-choice question.
- If the user decides to change an earlier choice like `platformCountry`, you must invalidate and re-check all downstream fields before continuing.
- Keep the dependency chain implicit. Share the information the user needs to make progress and keep the experience simple.
- Use external-facing language when talking to the user. See below to translate the internal API terminology.

#### Internal fields -> External language

| Internal field      | External language    |
| ------------------- | -------------------- |
| `apiVersion`        | Accounts API version |
| `platformCountry`   | Platform country     |
| `accountCountry`    | Account country      |
| `dashboardType`     | Dashboard type       |
| `tosType`           | Service agreement    |
| `legalEntityType`   | Business type        |
| `businessStructure` | Business structure   |
| `capabilities`      | Capabilities         |
| `orrProgram`        | Requirements update  |
| `eu2025`            | Europe               |

### Dependency chain

You must follow this dependency chain exactly:

```mermaid
flowchart TD
  apiVersion["apiVersion"] --> capabilities
  platformCountry --> accountCountry["accountCountry"]
  accountCountry --> dashboardType["dashboardType"]
  accountCountry --> tosType["tosType"]
  accountCountry --> legalEntityType["legalEntityType"]
  legalEntityType --> businessStructure["businessStructure (optional)"]
  accountCountry --> capabilities["capabilities"]
  accountCountry --> orrProgram["orrProgram (only if returned)"]
  tosType --> capabilities
  apiVersion --> capabilities
  dashboardType --> finalRequest["final requirements request"]
  apiVersion --> finalRequest
  platformCountry --> finalRequest
  accountCountry --> finalRequest
  tosType --> finalRequest
  legalEntityType --> finalRequest
  businessStructure --> finalRequest
  capabilities --> finalRequest
  orrProgram --> finalRequest
```

Interpret the diagram literally:

- Ask for a node _only_ after all of its incoming dependencies are resolved.
- Always ask the user for `apiVersion` first. Recommend `v2` by default.

### Inputs you eventually need

By the time you make the final requirements request, you must have validated values for all of the following fields:

- `apiVersion`: `v1` or `v2`
- `platformCountry`
- `accountCountry`
- `dashboardType`
- `tosType`
- `legalEntityType`
- `capabilities`: at least one capability must be selected

You also must have asked for the following optional fields, if they’re applicable:

- `businessStructure`: ask only when `legalEntityType` isn’t `individual`
- `orrProgram`: ask only when present in the public `programs` list for that validated setup

### Resolve capabilities

Use this algorithm whenever you build or validate the capability list:

1. Start from `country_map[accountCountry].capabilities`.
2. Apply `tosType` rules:
   - if `tosType=recipient`, force `transfers` and remove all other capabilities except `crypto_transfers`, which may be available in rare cases
   - if `apiVersion=v1` and `crypto_transfers` is selected, also include `transfers`
3. If `apiVersion=v2`, drop any capability not present in `get-v2-supported-v1-capabilities`.
4. Show the user the filtered capability list. When the user explicitly asks about a filtered-out capability, clearly explain that the asked-for capability is unavailable for the current setup.
5. If the filtered list is empty, tell the user that no capabilities are supported for the current setup and ask them to revise earlier setup choices using the [Interaction contract](#interaction-contract) before making the final requirements request.
6. When asking about `capabilities`, print the full filtered list first, then ask a multiple-choice question that includes the most likely choice or choices based on prior user context.
7. If the user asks for a capability outside the filtered list, explain why it is unavailable for the current setup.

- Keep the user’s requested capability visible in the conversation and explain the incompatibility directly. For example, if the user asks for `paypal_payments`, but also selected `v2` accounts, explain that `paypal_payments` is unavailable for `v2` accounts, and offer them the choice of switching to `apiVersion` `v1` and choosing `paypal_payments`, or remaining with `apiVersion` `v2` and choosing a different capability.

### Agent flow

When the user asks what verification information they need, use this flow:

1. Ask for `apiVersion`. Recommend `v2`.
2. Fetch `https://docs.stripe.com/_endpoint/get-platform-countries` and use the public supported list to ask for `platformCountry`.
3. Fetch `https://docs.stripe.com/_endpoint/get-v2-supported-v1-capabilities` if `apiVersion=v2`.
4. Fetch `https://docs.stripe.com/_endpoint/get-requirement-selections-for-platform-country?platformCountry=...` with the chosen `platformCountry`.
5. Ask for `accountCountry` from the returned `country_map` keys.
6. After `accountCountry` is validated, ask for:
   - `dashboardType`
   - `tosType`
   - `legalEntityType`
7. After `legalEntityType` is chosen, ask for `businessStructure` if the validated structure map exposes it.
8. Resolve and ask for `capabilities` using [Resolve capabilities](#resolve-capabilities).
9. Ask for `orrProgram` only if the validated setup exposes one or more public programs.
10. If the user’s requested setup doesn’t match the valid options, tell them exactly which parts are invalid or auto-adjusted, then ask the correcting follow-up using the [Interaction contract](#interaction-contract). Keep the mismatch visible, keep the setup grounded in the user’s request, and continue with a structured follow-up question.
11. Only after the setup is valid, call `https://docs.stripe.com/_endpoint/get-requirements-for-setups` with one top-level setup key `account-setup-A[...]`, including `account-setup-A[apiVersion]`, `account-setup-A[platformCountry]`, `account-setup-A[accountCountry]`, `account-setup-A[dashboardType]`, `account-setup-A[tosType]`, `account-setup-A[legalEntityType]`, optional `account-setup-A[businessStructure]`, one or more `account-setup-A[capabilities][i]`, and optional `account-setup-A[orrProgram]`.
12. At the end, you must call `https://docs.stripe.com/_endpoint/get-website-requirements-for-capabilities?capabilities[i]=...` and `https://docs.stripe.com/_endpoint/get-mcc-restrictions-for-capabilities?capabilities[i]=...` with the final validated capabilities to check for additional information.

If you’re asked to compare two setups or are asked what is needed to update from X to Y, you must follow the validation flow for setup A with a top-level `account-setup-A[...]` key and then follow the flow again for setup B with a second top-level key `account-setup-B[...]` before calling the diffable requirements request.

Treat transport or build failures as retryable helper failures, and reserve unsupported-setup conclusions for successful prerequisite fetches and business validation results.

### curl examples

In these examples, set the docs host to the public site:

```bash
DOCS_HOST="https://docs.stripe.com"
```

#### Naive user: “What do I need to verify for a Stripe connected account?”

Ask for `apiVersion`. Recommend `v2`.

Fetch the public platform-country list:

```bash
curl --get "$DOCS_HOST/_endpoint/get-platform-countries"
```

Ask the user which `platformCountry` value they want to use. Then, fetch the allowed options for that platform country. This request tells you what is valid next, and you must use it before choosing downstream fields. For example, if the user chose `US`:

```bash
curl --get "$DOCS_HOST/_endpoint/get-requirement-selections-for-platform-country" \
  --data-urlencode "platformCountry=US"
```

After that response returns, collect setup choices as described in the [Agent flow](#agent-flow) section.

#### Smart user: “I have a CA platform, and I want to onboard a FR company connected account to use card payments”

Ask for `apiVersion`. Recommend `v2`.

```bash
# Step 1: verify the platform country is valid
curl --get "$DOCS_HOST/_endpoint/get-platform-countries"

# Step 2: fetch all public options for that platform country
curl --get "$DOCS_HOST/_endpoint/get-requirement-selections-for-platform-country" \
  --data-urlencode "platformCountry=CA"
```

From that second response, first verify that FR is a valid account country, then read:

- `country_map.FR.dashboard_types`
- `country_map.FR.tos_types`
- `country_map.FR.entity_type_structures`
- `country_map.FR.capabilities`
- `country_map.FR.programs`

Then, confirm the user’s requested setup actually matches those available options.

If the user wants `apiVersion=v2`, first fetch and apply the v2 capability filter to compare against the user’s requested capabilities:

```bash
curl --get "$DOCS_HOST/_endpoint/get-v2-supported-v1-capabilities"
```

Only when the user’s requested setup actually matches those available options, then call the requirements endpoint.

The requirements endpoint expects nested query-string fields, not a JSON body:

```bash
curl --get "$DOCS_HOST/_endpoint/get-requirements-for-setups" \
  --data-urlencode "account-setup-A[apiVersion]=v2" \
  --data-urlencode "account-setup-A[platformCountry]=CA" \
  --data-urlencode "account-setup-A[accountCountry]=FR" \
  --data-urlencode "account-setup-A[dashboardType]=none" \
  --data-urlencode "account-setup-A[tosType]=full" \
  --data-urlencode "account-setup-A[legalEntityType]=company" \
  --data-urlencode "account-setup-A[businessStructure]=corporation" \
  --data-urlencode "account-setup-A[capabilities][0]=card_payments"
```

Optionally, since `.programs` is present for this configuration, you can ask the user if they would like to choose a requirements update and add `--data-urlencode "account-setup-A[orrProgram]=eu-2025"` to the request.

Use this response to present the requirements to the user as explained in the [Construct the result](#construct-the-result) section.

Fetch the optional supplemental tables for the selected capabilities:

```bash
curl --get "$DOCS_HOST/_endpoint/get-website-requirements-for-capabilities" \
  --data-urlencode "capabilities[0]=card_payments"
```

```bash
curl --get "$DOCS_HOST/_endpoint/get-mcc-restrictions-for-capabilities" \
  --data-urlencode "capabilities[0]=card_payments"
```

### Read the API responses

Use `get-platform-countries` to choose your initial `platformCountry`:

- `platform_countries` is the public list of available `platformCountry` options
- `default_country` is the page’s default starting country

Use `get-requirement-selections-for-platform-country` to validate the setup before you call the main requirements endpoint:

- `country_map` is the source of truth for which field values are valid for that `platformCountry` value
- the keys of `country_map` are the allowed `accountCountry` options
- `country_map[ACCOUNT_COUNTRY].dashboard_types` constrains `dashboardType`
- `country_map[ACCOUNT_COUNTRY].tos_types` constrains `tosType`
- `country_map[ACCOUNT_COUNTRY].entity_type_structures` constrains `legalEntityType` and optional `businessStructure`
- `country_map[ACCOUNT_COUNTRY].capabilities` constrains capability choices
- `country_map[ACCOUNT_COUNTRY].programs` lists the only public ORR programs you may pass as `orrProgram`
- `external_country_map` should be ignored

Apply these dependency rules before making the final request:

- if you change `accountCountry`, re-check all downstream selections
- if you change `legalEntityType`, re-check `businessStructure` and all downstream selections
- if you change `accountCountry`, `tosType`, or `apiVersion`, re-run [Resolve capabilities](#resolve-capabilities)

Use `get-requirements-for-setups` as your main source of requirement data:

- `requirements` contains the successful result for each requested setup key
- `validation_errors` means the setup was invalid and must be corrected before you interpret the response
- `build_errors` means the endpoint failed unexpectedly while building the summary; you must treat this as retryable rather than as a business conclusion

Within each successful setup result:

- `requirements[field_name]` is the requirement data for a single raw field, including enforcement limits, alternatives, display metadata, and related annotations used by the docs renderer
- `extras` contains human-readable labels and validation guidance for that requirement
- `requirement_tags` contains top-level requirement tags returned alongside the requirements data
- `requirement_groups` contains grouped requirement data returned alongside the requirements data

Check the supplemental endpoints to see if there are any additional capability-specific restrictions to present to the user.

- `requirements_by_capability` from the website endpoint is a separate website requirements table that explains requirements the connected account’s website must meet to support the selected capability. These should be presented to the user as a separate table.
- `restrictions_by_capability` from the MCC endpoint is a separate MCC restrictions table that explains requirements the connected account’s MCC must meet to support the selected capability. If this endpoint returns any restrictions, ask the user what kind of business they’re running to determine whether their business type is prohibited or restricted from using the specific capability.
- Empty maps are valid results for many standard capabilities and are not necessarily errors.

### Construct the result

Transform the API response into one or more human-readable tables in your own reply to the user, followed by any additional explanatory notes. These are output tables that you construct from the response data, not references to pre-existing tables on the human docs page.

##### How to construct the tables:

Suite du guide : [references/continued.md](references/continued.md)
