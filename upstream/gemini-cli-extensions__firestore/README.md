# Firestore Managed MCP Extension

The Firestore managed MCP extension allows users to interact with the Firestore
API via natural language commands.

## Why use the Firestore managed MCP server?

Google and Google Cloud
[managed MCP servers](https://docs.cloud.google.com/mcp/overview) can be used in
your AI applications with enterprise-ready governance, security, and access
control.

## Before you begin

1.  In the Google Cloud console, on the
    [project selector page](https://console.cloud.google.com/projectselector2/home/dashboard),
    select or create a Google Cloud project.

    > **Note**: If you don't plan to keep the resources that you create in this
    > procedure, create a project instead of selecting an existing project.
    > After you finish these steps, you can delete the project, removing all
    > resources associated with the project.

2.  Get your administrator to grant you the
    [MCP Tool User role](https://docs.cloud.google.com/iam/docs/roles-permissions/mcp#mcp.toolUser)
    (`roles/mcp.toolUser`) on the Google Cloud project. If you created a new
    project, then you already have the required permissions.

3.  Ensure your administrator has enabled the
    [Firestore API](https://console.cloud.google.com/marketplace/product/google/firestore.googleapis.com)
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
gemini extensions install https://github.com/gemini-cli-extensions/firestore
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Firestore MCP reference](https://docs.cloud.google.com/firestore/docs/reference/mcp).

## Sample use cases

The following are sample use cases and prompts for the Firestore MCP server:

-   "What tools are available for the Firestore MCP server?"
-   "Add a document with collection "book" under my Firestore database
    "my-database" with the Google Cloud project "my-project" with generated book
    info."
-   "Get the information for the book with ID 3VyGFIAPRHUNeuH5h2eb from the book
    collection."
-   "Update the year field of document 3VyGFIAPRHUNeuH5h2eb to 1995."
-   "List all books under the book collection."
-   "List all collections IDs under the root of the "my-database" Firestore
    database."
-   "Delete the document 3VyGFIAPRHUNeuH5h2eb under the book collection."
-   "Create a new Firestore database named 'my-database' in location
    'us-central1' with project 'my-project'."
-   "List all databases in project 'my-project'."
-   "Get details for database 'my-database' in project 'my-project'."
-   "Delete database 'my-database' in project 'my-project'."
-   "Create a composite index on collection 'books' for fields 'author' and
    'year' in project 'my-project' and database 'my-database'."
-   "List all indexes in database 'my-database' for project 'my-project'."
-   "Delete the index for collection 'books' with fields 'author' and 'year'."

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Firestore MCP server doesn't have its own quotas. There is no limit on the
number of call that can be made to the MCP server. You are still subject to the
quotas enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [Firestore remote MCP server reference documentation](https://docs.cloud.google.com/firestore/docs/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [Firestore overview](https://docs.cloud.google.com/firestore/native/docs).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
