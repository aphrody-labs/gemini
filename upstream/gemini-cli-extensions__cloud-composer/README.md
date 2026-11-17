# Cloud Composer Managed MCP Extension

> **Preview:** This product is subject to the "Pre-GA Offerings Terms" in the
> General Service Terms section of the
> [Service Specific Terms](https://docs.cloud.google.com/terms/service-terms#1).
> Pre-GA products and features are available "as is" and might have limited
> support. For more information, see the
> [launch stage descriptions](https://cloud.google.com/products#product-launch-stages).

The Cloud Composer managed MCP extension allows users to manage their Managed
Airflow environments and get details about executed DAG runs and Airflow tasks.

## Why use the Cloud Composer managed MCP server?

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
    [Cloud Composer API](https://console.cloud.google.com/marketplace/product/google/composer.googleapis.com)
    on the Google Cloud project.

## Configure authentication

This extension uses Google Application Default Credentials (ADC) to perform
authentication. To login with ADC, run the following command in your terminal:
`bash gcloud auth application-default login`

For additional details, see the
[ADC documentation](https://docs.cloud.google.com/docs/authentication/application-default-credentials#personal).

## Install the extension

To install the extension, run the following command in your terminal:

```bash
gemini extensions install https://github.com/gemini-cli-extensions/cloud-composer
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Cloud Composer MCP reference](https://docs.cloud.google.com/composer/docs/reference/mcp).

## Sample use cases

The following are example use cases for the Cloud Composer MCP server:

### Describe environment status

In this sample use case, you ask questions about environments in your project.

`Find all Managed Airflow environments in us-central1 that aren't in the running
state at the moment. If any of them are in the error state, tell me the time
when this environment was last updated and the environment's workloads
configuration.`

**Workflow**: Describing Managed Airflow environments might look like the
following.

-   **View the environments list**: The agent uses `list_environments` to obtain
    the list of environments in the specified region, along with information
    about the last update time.

### Create a new Managed Airflow environment with custom PyPI packages

In this sample use case, you create a new Managed Airflow environment and then
install custom PyPI packages into it.

`Create a new Managed Airflow (Gen 3) environment with Airflow 2 in my project.
Then install the nltk[machine_learning] package to it. Use the
example-account@example-project.iam.gserviceaccount.com service account for the
environment.`

**Workflow**: Creating a new Managed Airflow environment and then installing
custom PyPI packages into it might look like the following.

-   **Create an environment**: The agent uses `create_environment` to create a
    new environment with the provided configuration parameters. The agent asks
    about additional configuration parameters such as the list of IP addresses
    that are allowed to access the Airflow UI.

-   **Install packages**: The agent calls `manage_pypi_packages` to install the
    specified PyPI package.

### Troubleshooting failed DAG runs and tasks

`Check the example-environment-name Managed Airflow environment in us-central1.
The example_dag is failing, and I want to know why and at which task
specifically. Also tell me about any other DAGs that failed in this environment
in the past 24 hours.`

**Workflow**: Troubleshooting failed DAG runs might look like the following.

-   **Get failed DAG runs**: The agent uses `find_last_failed_dag_runs` to
    obtain the list of failed DAG runs for the example_dag DAG in the specified
    environment. The agent uses the same tool to obtain the list of all failed
    DAG runs.

-   **Inspect the failed DAG run**: The agent calls `list_failed_task_instances`
    to get the list of task instances of the DAG run that are in the failed
    state.

-   **Analyze failed task logs**: The agent uses `get_task_instance` to obtain
    the details of the failed task instance, including data required to retrieve
    logs.

-   **Inspect the DAG source code**: The agent uses `get_dag_source_code` to
    analyze the failed task source code for errors.

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project. For more information about
MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Cloud Composer MCP server doesn't have its own quotas. There is no limit on
the number of calls that can be made to the MCP server. You are still subject to
the quotas enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [Cloud Composer remote MCP server reference documentation](https://docs.cloud.google.com/composer/docs/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [Cloud Composer overview](https://docs.cloud.google.com/composer/docs/concepts/overview).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
