# BigQuery Migration Service Managed MCP Extension

The BigQuery Migration Service managed MCP extension allows users to perform
tasks such as translating SQL queries into GoogleSQL syntax, generating DDL
statements from SQL input queries, and getting explanations of SQL translations.

## Why use the BigQuery Migration Service managed MCP server?

Google and Google Cloud
[managed MCP servers](https://docs.cloud.google.com/mcp/overview) can be used in
your AI applications with enterprise-ready governance, security, and access
control.

## Before you begin

1.  In the Google Cloud console, on the
    [project selector page](https://console.cloud.google.com/projectselector2/home/dashboard),
    select or create a Google Cloud project. > **Note**: If you don't plan to
    keep the resources that you create in this > procedure, create a project
    instead of selecting an existing project. > After you finish these steps,
    you can delete the project, removing all > resources associated with the
    project.
2.  Get your administrator to grant you the
    [MCP Tool User role](https://docs.cloud.google.com/iam/docs/roles-permissions/mcp#mcp.toolUser)
    (`roles/mcp.toolUser`) on the Google Cloud project. If you created a new
    project, then you already have the required permissions.
3.  Ensure your administrator has enabled the
    [BigQuery Migration API](https://console.cloud.google.com/marketplace/product/google/bigquerymigration.googleapis.com)
    on the Google Cloud project.

## Configure authentication

This extension uses Google Application Default Credentials (ADC) to perform
authentication. To login with ADC, run the following command in your terminal:

```bash
gcloud auth application-default login
```

For additional details, see the
[ADC documentation](https://docs.cloud.google.com/docs/authentication/application-default-credentials#personal).

## Install the extension

To install the extension, run the following command in your terminal:

```bash
gemini extensions install https://github.com/gemini-cli-extensions/bigquery-migration-service
```

## Available tools

To see a complete list of available tools and their schemas, see the
[BigQuery Migration Service MCP reference](https://docs.cloud.google.com/bigquery/docs/reference/migration/mcp).

## Sample use cases

The following are sample use cases for the BigQuery Migration Service MCP
server:

-   Using an MCP client with an IDE, translate a query file into GoogleSQL
    syntax.
-   Using an MCP client without an IDE, translate a specified query into
    GoogleSQL syntax.
-   Assess translation quality.
-   Get explanations of SQL translations.
-   Generate a DDL statement for a specified query.

### Sample prompts

You can use the following sample prompts to create and manage BigQuery Migration
Service resources:

-   Translate the `DIALECT` query in this `FILENAME`. Use `PROJECT_ID` and
    `LOCATION`. Persist the output and translation logs into separate
    directories.

    When you use this prompt, the MCP client calls the translate_query tool to
    translate the query in the specified file. The MCP client periodically calls
    the get_translation tool to get the results. After the translation
    completes, the client writes the output to the output directory and the logs
    to the logs directory.

-   Translate this query from `DIALECT`: `QUERY`. Use `PROJECT_ID` and
    `LOCATION`.

    When you use this prompt, the MCP client calls the translate_query tool to
    translate the specified query and displays the translation results.

-   Assess the translation quality.

    When you use this prompt, the MCP client reads and examines the translation
    logs and displays a summary of the translation issues with suggested next
    steps.

-   Explain the translation.

    When you use this prompt, the MCP client calls the explain_translation tool
    to get an explanation of the translation. If the translation logs contain
    RelationNotFound or AttributeNotFound errors, the MCP client should suggest
    that you create a metadata package. If you can't generate the metadata, you
    can send a prompt that requests the DDL statement.

    A sample response looks like the following:

    > The translated code converts Teradata-specific features into their
    > BigQuery equivalents. Here's a breakdown of the key changes: * `MACRO` to
    > `PROCEDURE`: The `YourMacroName` macro was converted into a BigQuery
    > stored procedure because BigQuery doesn't support macros. * `SELECT INTO`
    > to `SET`: * For setting multiple `OUT` parameters in
    > `YourStoredProcedureName`, the `SELECT ... INTO` is changed to `SET
    > (...) = (SELECT STRUCT(...))`. * For single variable assignment in
    > `YourOtherProcedureName`, `SELECT ... INTO` is replaced by `SET variable =
    > (SELECT ...)` which is the standard in BigQuery. * Atomic Operations to
    > `MERGE: The BEGIN REQUEST ... END REQUEST` blocks in the `ProcedureA`,
    > `ProcedureB`, and `ProcedureC` procedures, which perform atomic "update or
    > insert" operations, are translated into standard SQL `MERGE` statements.
    > This is the correct and modern way to handle this logic in BigQuery.

-   Generate DDL for this input query.

    The MCP client calls the generate_ddl_suggestion tool to start a suggestion
    job. The client gets the suggestion results by calling the
    fetch_ddl_suggestion tool. When the suggestion is available, the MCP client
    displays it.

    If the DDL statements are correct, you can send a prompt to prepend the
    generated DDL statements to the query to improve the translation quality.

-   Prepend the generated DDL statements to the input query and retranslate.

    When you use this prompt, the MCP client prepends the DDL statements to the
    original input query and calls the translate_query tool. The client calls
    the get_translation tool to get the translation. The new query translation
    and the logs persist when they're available.

    If the generated DDL statements are correct, any RelationNotFound or
    AttributeNotFound errors should be resolved which results in improved
    translation quality.

In the prompts, replace the following:

-   `DIALECT`: The dialect of the SQL query you're translating.
-   `QUERY`: The query you're translating.
-   `FILENAME`: The file that contains the query you're translating.
-   `PROJECT_NUMBER`: Your Google Cloud project number.
-   `LOCATION`: The location of the SQL translator.

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project. For more information about
MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The BigQuery Migration Service MCP server doesn't have its own quotas. There is
no limit on the number of calls that can be made to the MCP server. You are
still subject to the quotas enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [BigQuery Migration Service remote MCP server reference documentation](https://docs.cloud.google.com/bigquery/docs/reference/migration/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [BigQuery Migration Service overview](https://docs.cloud.google.com/bigquery/docs/migration-intro).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
