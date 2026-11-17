# Customer Experience Agent Studio Managed MCP Extension

The Customer Experience Agent Studio managed MCP extension enables AI-assisted
development workflows, drastically reducing the friction of building and
maintaining agent applications.

## Why use the Customer Experience Agent Studio managed MCP server?

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
    [Customer Experience Agent Studio API](https://console.cloud.google.com/marketplace/product/google/ces.googleapis.com)
    on the Google Cloud project.

## Configure authentication

This extension uses Google Application Default Credentials (ADC) to perform
authentication. To login with ADC, run the following command in your terminal:

```bash
gcloud auth application-default login
```

For additional details, see the
[ADC documentation](https://docs.cloud.google.com/docs/authentication/application-default-credentials#personal).

## Available tools

To see a complete list of available tools and their schemas, see the
[Customer Experience Agent Studio MCP reference](https://docs.cloud.google.com/customer-engagement-ai/conversational-agents/ps/reference/mcp).

## Limitations

The following limitations apply:

-   Token Context Limits: Large agent configurations (with many tools and
    extensive instructions) may exceed the context window of some coding models
    when retrieving full agent definitions. We recommend fetching specific
    sub-components (for example, just one tool) rather than the entire app
    definition at once. Additionally, users should monitor their context window
    usage and restart their agent session periodically (every few requests) to
    clear the buffer.
-   Latency: "Direct Mutation" (API calls) are generally faster for small
    changes. However, for massive architectural refactors (renaming variables
    across 50 files), we recommend the "Export -> Local Edit -> Import" workflow
    to ensure data integrity, which the MCP server also supports using
    export_app and import_app tools.

## Example use cases

The following are sample use cases for the Customer Experience Agent Studio MCP
server:

-   Vibe Coding (Rapid Prototyping): Instead of manually clicking through the UI
    to create an agent, you can simply tell your AI-assisted IDE "Create a
    retail support agent that uses the Shopify API and speaks in a friendly
    tone." The coding agent uses the MCP server to construct the agent
    architecture for you.
-   Mass Refactoring & Clean-up: The MCP server excels at bulk operations that
    are tedious in a UI. For example, you can command "Rename the 'customer_id'
    parameter across all 15 sub-agents" or "Find and delete all unused intents".
-   Interactive Eval-Driven Development: You can run a failing evaluation and
    instruct the agent: "Modify the instructions until this specific evaluation
    passes".
-   Self-Healing & Optimization: An automated "Helper Agent" can monitor an
    agent's performance (for example, failing a specific evaluation) and use the
    MCP server to autonomously tweak instructions or fix tool definitions to
    improve the score ("Hill Climbing").
-   Contextual Awareness: The server allows coding assistants to "read" the
    current state of a deployed agent, making it easier for you to understand
    complex legacy configurations without digging through JSON files manually.

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Customer Experience Agent Studio MCP server doesn't have its own quotas.
There is no limit on the number of call that can be made to the MCP server. You
are still subject to the quotas enforced by the APIs called by the MCP server
tools.

## Reference and resources

*   Explore the
    [Customer Experience Agent Studio remote MCP server reference documentation](https://docs.cloud.google.com/customer-engagement-ai/conversational-agents/ps/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [Customer Experience Agent Studio overview](https://docs.cloud.google.com/customer-engagement-ai).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
