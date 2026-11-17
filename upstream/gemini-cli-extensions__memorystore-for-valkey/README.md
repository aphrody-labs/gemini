# Memorystore for Valkey Managed MCP Extension

The Memorystore for Valkey managed MCP extension lets you manage Memorystore for
Valkey instances and backups from your AI-enabled development environments and
AI agent platforms.

## Why use the Memorystore for Valkey managed MCP server?

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
    [Memorystore for Valkey API](https://console.cloud.google.com/marketplace/product/google/memorystore.googleapis.com)
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
gemini extensions install https://github.com/gemini-cli-extensions/memorystore
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Memorystore for Valkey MCP reference](https://docs.cloud.google.com/memorystore/docs/valkey/reference/mcp).

## Sample use cases

The following are sample use cases for the Memorystore for Valkey MCP server:

-   "Why do you create a Memorystore for Valkey regional instance with IAM
    authentication enabled?"

    Creating this type of instance eliminates static passwords in favor of
    centralized, short-lived credentials for highly secure, regional workloads.
    The AI agent of the Memorystore for Valkey MCP server uses the
    create_instance MCP tool to create the instance.

-   "Why do you view all active Memorystore for Valkey instances in a specific
    region?"

    By listing these instances, you can ensure that resources match your current
    architecture. The AI agent of the Memorystore for Valkey MCP server uses the
    list_instances MCP tool to retrieve a formatted list of instances in the
    specified region.

-   "Why do you retrieve connection endpoints and operational metadata from a
    Memorystore for Valkey instance in a specific region?"

    You need this information for application integration and system
    maintenance. The AI agent of the Memorystore for Valkey MCP server uses the
    get_instance MCP tool to retrieve information about the instance, such as
    its discovery endpoint, shard count, and replica count.

-   "How can you optimize Memorystore for Valkey for your data-intensive
    applications?"

    To increase both the CPU capacity and the memory throughput for these
    applications significantly, you can scale a Memorystore for Valkey instance
    by increasing the instance's shard count. The AI agent of the Memorystore
    for Valkey MCP server uses the update_instance MCP tool to update the shard
    count for the instance.

-   "How can you protect your data from failures that might occur from either a
    Memorystore for Valkey instance or the region where it's located?"

    Create a backup of the Memorystore for Valkey instance. If a regional or
    instance failure occurs, then you can restore your data to a new instance to
    resume operations. The AI agent of the Memorystore for Valkey MCP server
    uses the backup_instance MCP tool to create a backup of the instance.

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Memorystore for Valkey MCP server doesn't have its own quotas. There is no
limit on the number of call that can be made to the MCP server. You are still
subject to the quotas enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [Memorystore for Valkey remote MCP server reference documentation](https://docs.cloud.google.com/memorystore/docs/valkey/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [Memorystore for Valkey overview](https://docs.cloud.google.com/memorystore/docs/valkey).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
