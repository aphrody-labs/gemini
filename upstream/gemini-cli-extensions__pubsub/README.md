# Pub/Sub Managed MCP Extension

The Pub/Sub managed MCP extension lets you manage Pub/Sub resources and publish
messages. You can create, list, get, update, and delete Pub/Sub topics,
subscriptions, and snapshots, as well as publish messages to topics.

## Why use the Pub/Sub managed MCP server?

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
    [Pub/Sub API](https://console.cloud.google.com/marketplace/product/google/pubsub.googleapis.com)
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
gemini extensions install https://github.com/gemini-cli-extensions/pubsub
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Pub/Sub MCP reference](https://docs.cloud.google.com/pubsub/docs/reference/mcp).

## Sample use cases

The following are sample use cases for the Pub/Sub MCP server:

-   Create a Pub/Sub pipeline that includes a topic with subscriptions.
-   Create a subscription that uses Pub/Sub features such as message filtering.
-   Add Single Message Transforms (SMTs) to your existing Pub/Sub pipeline.

### Sample prompts

-   "Build a pipeline that consumes messages from Pub/Sub topic my-topic,
    filters out messages that have attribute priority=low, and writes the
    messages to Cloud Storage bucket my-bucket."
-   "Create a subscription from topic my-topic to BigQuery table my-table, with
    failed deliveries sent to my-dead-letter-topic."

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Pub/Sub MCP server doesn't have its own quotas. There is no limit on the
number of call that can be made to the MCP server. You are still subject to the
quotas enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [Pub/Sub remote MCP server reference documentation](https://docs.cloud.google.com/pubsub/docs/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the [Pub/Sub overview](https://docs.cloud.google.com/pubsub/docs).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
