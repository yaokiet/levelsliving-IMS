from vertexai.generative_models import (
    Content,
    FunctionDeclaration,
    GenerationConfig,
    GenerativeModel,
    Part,
    Tool,
    ToolConfig,

)
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from config import settings 
from logger import logger
import json
import asyncio

def convert_function_declaration(tool):
    return FunctionDeclaration(
        name=tool.name,
        description=tool.description,
        parameters=tool.parameters
    )


def convert_chat_history(role, content):
    return Content(
        role=role,
        parts=[Part.from_text(
            content
        )]
    )


def get_functions_from_response(response):
    function_calls = [{"name": call.name, "args": call.args}
                      for call in response.candidates[0].function_calls]
    return function_calls


async def generate_function_calling_response(system_instruction: str, tools, query, chat_history):
    chat_content = [convert_chat_history(
        history['role'], history['content']) for history in chat_history]
    user_query = Content(role="user", parts=[Part.from_text(query)])
    chat_content.append(user_query)

    function_declarations = [
        convert_function_declaration(tool) for tool in tools]
    tool = Tool(function_declarations=function_declarations)
    tool_config = ToolConfig(
        function_calling_config=ToolConfig.FunctionCallingConfig(
            mode=ToolConfig.FunctionCallingConfig.Mode.ANY,
        )
    )

    generation_config = GenerationConfig(
        temperature=0,
    )
    model = GenerativeModel(
        "gemini-2.5-flash", system_instruction=system_instruction, tools=[tool], tool_config=tool_config, generation_config=generation_config)
    response = await model.generate_content_async(chat_content)
    return get_functions_from_response(response)


async def generate_structured_response(system_instruction: str = "", response_schema: dict = {}):
    model = GenerativeModel("gemini-2.5-flash")
    response = await model.generate_content_async(
        system_instruction,
        generation_config=GenerationConfig(
            response_mime_type="application/json",
            response_schema=response_schema,
        )
    )
    return json.loads(response.text)


async def generate_response(system_instruction: str = "", query="", chat_history=[]):
    chat_content = [convert_chat_history(
        history['role'], history['content']) for history in chat_history]

    user_query = Content(role="user", parts=[Part.from_text(query)])

    chat_content.append(user_query)

    model = GenerativeModel("gemini-2.5-flash",
                            system_instruction=system_instruction)
    response = model.generate_content(chat_content)
    return response.text


async def generate_streaming_response(system_instruction: str = "", query="", chat_history=[]):
    chat_content = [convert_chat_history(
        history['role'], history['content']) for history in chat_history]

    user_query = Content(role="user", parts=[Part.from_text(query)])

    chat_content.append(user_query)

    generation_config = GenerationConfig(
        temperature=0,
    )
    model = GenerativeModel("gemini-2.5-flash",
                            system_instruction=system_instruction,
                            generation_config=generation_config,
                            )
    stream = await model.generate_content_async(chat_content, stream=True)
    response = ""
    # The final chunk is needed to get token count
    final_chunk = None

    async for chunk in stream:
        final_chunk = chunk
        if chunk.text is not None:
            # Artificial character by character streaming
            for char in chunk.text:
                response += char
                await asyncio.sleep(0.01)
                yield response


async def generate_streaming_text(text: str):
    response = ""
    for char in text:
        response += char
        await asyncio.sleep(0.01)
        yield response


async def embed_document_query(query, dimensionality=768, task="RETRIEVAL_QUERY"):
    model = TextEmbeddingModel.from_pretrained("text-embedding-004")
    inputs = [TextEmbeddingInput(query, task)]
    embeddings = await model.get_embeddings_async(
        inputs, output_dimensionality=dimensionality)

    embedding_values = [embedding.values for embedding in embeddings]
    return embedding_values[0]


