from langchain_core.messages import ToolMessage
def extract_tool_trace(response):

    messages = response.get("messages", [])

    tools_used = []
    tool_outputs = []

    for message in messages:

        if isinstance(message, ToolMessage):

            tool_name = getattr(message, "name", None)

            tools_used.append(tool_name)

            tool_outputs.append({
                "tool": tool_name,
                "output": message.content
            })

    return tools_used, tool_outputs