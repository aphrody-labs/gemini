# Maps Grounding Lite MCP Extension

The Google Maps Grounding Lite managed MCP extension makes it easy to ground
your AI applications with trusted geospatial data from Google Maps. The MCP
server provides tools that allow LLMs to access capabilities for places,
weather, and routes.

## Why use the Maps Grounding Lite managed MCP server?

Google and
[Maps Grounding Lite MCP servers](https://developers.google.com/maps/ai/grounding-lite)
can be used in your AI applications with any LLMs to access real-world
geospatial information easily.

## Before you begin

1.  In the Google Cloud console, on the
    [project selector page](https://console.cloud.google.com/projectselector2/home/dashboard),
    select or create a Google Cloud project.

2.  Ensure your administrator has enabled the
    [Maps Grounding Lite](https://console.cloud.google.com/marketplace/product/google/mapstools.googleapis.com)
    on the Google Cloud project.

## Configure authentication

See
[options to configure authentication](https://developers.google.com/maps/ai/grounding-lite#configure_llms_to_use_the_mcp_server).

## Install the extension

To install the extension, run the following command in your terminal:

```bash
gemini extensions install https://github.com/gemini-cli-extensions/maps-grounding-lite
```

## Available tools

To see a complete list of available tools and their schemas, see the
[Maps Grounding Lite MCP reference](https://developers.google.com/maps/ai/grounding-lite/reference/mcp).

## Optional security and safety configurations

MCP introduces new security risks and considerations due to the wide variety of
actions that you can take with MCP tools. To minimize and manage these risks,
Google Cloud offers defaults and customizable policies to control the use of MCP
tools in your Google Cloud organization or project.

For more information about MCP security and governance, see
[AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).

## Quotas and limits

To see the quota limits for each tool, check the
[Quotas](https://developers.google.com/maps/ai/grounding-lite#quotas) section.

## Sourcing and attribution

See
[attribution requirements and guidelines](https://developers.google.com/maps/ai/grounding-lite/attribution)
for displaying Maps Grounding Lite content in your applications.

## Reference and resources

*   Explore the
    [Maps Grounding Lite remote MCP server overview](https://developers.google.com/maps/ai/grounding-lite)
    for introduction and how to start building today.
*   Explore the
    [Maps Grounding Lite remote MCP server reference](https://developers.google.com/maps/ai/grounding-lite/reference/mcp)
    which includes a list of all available tools, and the full input and output
    schema for each tool.
*   Learn about
    [MCP security and governance](https://docs.cloud.google.com/mcp/ai-security-safety).
