# GKE Managed MCP Extension

The GKE managed MCP extension provides read access to your GKE and Kubernetes
resources. It allows an AI agent to inspect and observe your environment.

## Why use the GKE managed MCP server?

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
    [GKE API](https://console.cloud.google.com/marketplace/product/google/container.googleapis.com)
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
gemini extensions install https://github.com/gemini-cli-extensions/gke-mcp-remote
```

## Available tools

To see a complete list of available tools and their schemas, see the
[GKE MCP reference](https://docs.cloud.google.com/kubernetes-engine/docs/reference/mcp).

## Sample use cases

The following are sample use cases for the GKE remote MCP server:

-   Inspect the configuration and status of your GKE clusters and node pools.
    For example, use the prompt: "Show me the details of my 'production-cluster'
    and list all of its node pools."
-   View Kubernetes resource configurations and container logs from within a
    cluster without using kubectl. For example, use the prompt: "Get the YAML
    for the 'frontend-deployment' in the 'default' namespace."
-   Monitor the status of long-running GKE operations, such as cluster upgrades.
    For example, use the prompt: "List all the GKE operations in my project from
    the last hour."

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The GKE MCP server doesn't have its own quotas. There is no limit on the number
of call that can be made to the MCP server. You are still subject to the quotas
enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [GKE remote MCP server reference documentation](https://docs.cloud.google.com/kubernetes-engine/docs/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [GKE overview](https://docs.cloud.google.com/kubernetes-engine/docs).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
