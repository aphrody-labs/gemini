# Managed Service for Apache Kafka MCP Extension

The Managed Service for Apache Kafka MCP extension lets you manage Managed
Service for Apache Kafka clusters, as well as Kafka Connect clusters.

-   You can create and manage Kafka clusters, including resources related to the
    the cluster, such as topics, consumer groups, and ACLs.
-   You can create and manage Connect clusters and connectors.

## Why use the Managed Service for Apache Kafka MCP server?

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
    [Managed Service for Apache Kafka API](https://console.cloud.google.com/marketplace/product/google/managedkafka.googleapis.com)
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
gemini extensions install https://github.com/gemini-cli-extensions/managed-kafka
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Managed Service for Apache Kafka MCP reference](https://docs.cloud.google.com/managed-service-for-apache-kafka/docs/reference/mcp).

## Sample use cases

The following are sample use cases for the Managed Service for Apache Kafka MCP
server:

-   Provision and scale streaming infrastructure. Create a Managed Service for
    Apache Kafka cluster and dynamically adjust its compute resources (vCPU and
    memory) to meet changing workload demands.
-   Automate topic management. Provision Kafka topics with specific
    configurations, partition counts and replication factors, to ensure high
    availability and data durability.
-   Build data pipelines with Kafka Connect: Deploy and manage Kafka Connect
    clusters and connectors to integrate Kafka data with Google Cloud services
    such as BigQuery or Pub/Sub.

### Sample prompts

-   Create a Kafka cluster named orders-cluster in us-central1 with 6 vCPUs and
    12 GiB of memory, and add a topic called new-orders with 10 partitions and a
    replication factor of 3.
-   I need to scale up my telemetry-cluster to 15 vCPUs to handle an upcoming
    traffic spike. Can you update the cluster configuration for me?
-   Set up a BigQuery Sink connector in my Connect cluster analytics-connect
    that streams data from the sensor-data topic into the streaming_analysis
    dataset.

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Managed Service for Apache Kafka MCP server doesn't have its own quotas.
There is no limit on the number of call that can be made to the MCP server. You
are still subject to the quotas enforced by the APIs called by the MCP server
tools.

## Reference and resources

*   Explore the
    [Managed Service for Apache Kafka remote MCP server reference documentation](https://docs.cloud.google.com/managed-service-for-apache-kafka/docs/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [Managed Service for Apache Kafka overview](https://docs.cloud.google.com/managed-service-for-apache-kafka/docs).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
