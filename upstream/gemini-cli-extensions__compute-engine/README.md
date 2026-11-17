# Compute Engine Managed MCP Extension

The Compute Engine managed MCP extension provides a comprehensive set of
capabilities that let LLM agents perform a range of infrastructure management
tasks including the following:

-   Manage virtual machine (VM) instances.
-   Retrieve information about instance group managers, instance templates,
    disks, snapshots, reservations and commitments.

## Why use the Compute Engine managed MCP server?

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
    [Compute Engine API](https://console.cloud.google.com/marketplace/product/google/compute.googleapis.com)
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
gemini extensions install https://github.com/gemini-cli-extensions/compute-engine
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Compute Engine MCP reference](https://docs.cloud.google.com/compute/docs/reference/mcp).

## Sample use cases

The following sample use cases describe how you can use the Compute Engine MCP
server to manage Compute Engine resources:

-   Inspect and manage resources. For example, to understand resource allocation
    and configuration in your project, you can list all compute instances. You
    can also find all running compute instances in a zone that have a specific
    accelerator attached, and show their location and name for resource
    management.
-   Clean up unused resources to reduce operational costs. For example, identify
    disk snapshots in a zone that are no longer associated with a source disk,
    or identify and delete stopped VM instances that have costly GPU resources
    attached.
-   Optimize instance performance. For example, resize an under-provisioned VM
    instance to a larger machine type in the same family, and confirm the
    successful update.
-   Provision specialized VMs for AI workloads with zone flexibility. For
    example, create a VM instance with a specific GPU accelerator attached, in
    any zone in a specified region where it is available.
-   Troubleshoot and validate instance configurations. For example, retrieve
    configuration details for a specific VM instance where the job is frozen,
    reboot it, and confirm the underlying accelerator and disk are attached.

### Sample prompts

The following are sample prompts that you can use to perform tasks by using the
Compute Engine MCP server:

-   List all VMs in `PROJECT_ID`, including the VM name and zone.
-   Show the instance details for `VM_NAME`.
-   In `REGION`, find all disk snapshots for which the source disk no longer
    exists.
-   Change the machine type of `VM_NAME` to the next largest machine type in the
    same machine family, send notification when it's back online, and confirm
    the new machine type.
-   Find all running VMs in `REGION` with NVIDIA accelerators, and show the zone
    and name for these VMs.
-   Create a VM in `ZONE` with an NVIDIA T4 accelerator attached. Name the VM
    my-nvidiat4-vm.
-   Find all stopped VMs in `REGION` with NVIDIA Tesla T4 accelerators, and
    delete them.

Replace the following:

-   `PROJECT_ID`: the Google Cloud project ID.
-   `REGION`: the name of the region where your resources exist.
-   `ZONE`: the name of the zone where your VMs exist.
-   `VM_NAME`: the name of your VM instance.

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

The Compute Engine MCP server doesn't have its own quotas. There is no limit on
the number of call that can be made to the MCP server. You are still subject to
the quotas enforced by the APIs called by the MCP server tools.

## Reference and resources

*   Explore the
    [Compute Engine remote MCP server reference documentation](https://docs.cloud.google.com/compute/docs/reference/mcp),
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   See the
    [Compute Engine overview](https://docs.cloud.google.com/compute/docs).
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
