# Cloud Resource Manager MCP Extension

The Cloud Resource Manager MCP extension allows users to interact with the Cloud
Resource Manager API via natural language commands.

## Why use the Cloud Resource Manager MCP server?

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
    [Cloud Resource Manager API](https://console.cloud.google.com/marketplace/product/google/cloudresourcemanager.googleapis.com)
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
gemini extensions install https://github.com/gemini-cli-extensions/cloud-resource-manager
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Cloud Resource Manager MCP reference](https://docs.cloud.google.com/resource-manager/reference/mcp).

## Sample use cases

The search_projects tool in the Resource Manager remote MCP server lets AI
agents dynamically discover and identify all Google Cloud projects that you have
the necessary permissions to access so they can execute commands in other tools.

The tool returns a structured list containing the project ID, project number,
and the lifecycle state of the project. The following are sample use cases for
the Resource Manager MCP server:

-   Resource inventory and accessibility audits: List and summarize the active
    cloud projects accessible to you.

    User prompt: List all my active Google Cloud projects.

    Agent action: The agent sends a search query to the MCP server to retrieve
    and display a summarized list of all active projects under your credentials.

-   Targeted parent-based searches: Retrieve projects located within a specific
    folder or organization to narrow the scope of a request.

    User prompt: Find all projects under Folder 223.

    Agent action: The agent executes a tool call with the query
    parent:folders/223 to return a list of projects within that administrative
    boundary.

-   Implicit context resolution: When you ask for information about a resource
    without providing a specific project ID, the agent can resolve the context
    automatically.

    User prompt: Check the status of my 'payment-processor' service.

    Agent action: The agent recognizes that a project_id is missing for the
    Cloud Run tool. It uses the search_projects tool to find projects with
    payment in the name, identifies likely projects (such as payment-prod-123),
    and asks you for confirmation before proceeding.

-   Environment-specific discovery: You can find projects filtered by specific
    environments or organizational structures without leaving the chat
    interface.

    User prompt: Which projects do I have access to in the staging environment?

    Agent action: The agent performs a search operation for all projects labeled
    or named staging that you have permission to view and returns the specific
    project IDs.

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Cloud Resource Manager MCP server doesn't have its own quotas. There is no
limit on the number of call that can be made to the MCP server. You are still
subject to the quotas enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [Cloud Resource Manager remote MCP server reference documentation](https://docs.cloud.google.com/resource-manager/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [Cloud Resource Manager overview](https://docs.cloud.google.com/resource-manager/docs).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
