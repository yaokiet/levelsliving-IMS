import asyncio
import json_repair
import os

from typing import List, AsyncGenerator, Dict, Any

from pydantic import BaseModel
from google import genai
from google.genai import types
from logger import logger
from config import settings

def get_gemini_client():
    return genai.Client(
        project=settings.GOOGLE_GENAI_PROJECT_ID,
        location=settings.GOOGLE_GENAI_LOCATION,
        vertexai=settings.GOOGLE_GENAI_USE_VERTEXAI
    )


class GenerativeModelClient():
    def __init__(self, model_name: str = "gemini-2.5-flash", system_instruction: str = None):
        self.model_name = model_name
        self.system_instruction = system_instruction
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set!")
        self.client = genai.Client(api_key=api_key)



    def _has_function_call_in_response(self, response):
        # Check if the response contains a function call
        has_call = response.function_calls is not None and len(
            response.function_calls) > 0
        return has_call

    async def generate_function_calls(
        self,
        chat_history: List[Dict] = [],
        tools: List[types.Tool] = None,
    ) -> Dict[str, Any]:
        if chat_history is None:
            chat_history = self.chat_history


        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=chat_history,

            config=types.GenerateContentConfig(
                tools=tools,
                temperature=0,
                system_instruction=self.system_instruction,
                thinking_config=types.ThinkingConfig(
                    include_thoughts=True
                )
            )
        )
        logger.info(f"Generated response: {response}")

        if self._has_function_call_in_response(response):
            return response.function_calls

        return None

    async def generate_content_as_schema(
        self,
        response_schema: BaseModel,
        chat_history: List[Dict] = [],
    ) -> AsyncGenerator[Dict[str, Any], None]:
        if chat_history is None:
            chat_history = self.chat_history
        queue = asyncio.Queue()

        async def _process_chunks(producer, queue):
            accumulated_response = ""

            async for chunk in producer:
                if not chunk.text:
                    continue
                accumulated_response += chunk.text
                partial_response = json_repair.loads(accumulated_response)

                try:
                    partial_response = response_schema(**partial_response)
                except Exception as e:
                    continue



                await queue.put(partial_response)
            await queue.put(None)

        response = await self.client.aio.models.generate_content_stream(
            model=self.model_name,
            contents=chat_history,

            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0,
                system_instruction=self.system_instruction,
            )
        )

        asyncio.create_task(_process_chunks(response, queue))
        while True:
            chunk = await queue.get()
            if chunk is None:
                break
            yield chunk
