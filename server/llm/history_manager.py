from google.genai import types


class ChatHistoryManager:
    def __init__(self, chat_history: list = []):
        self.history = chat_history

    def add_user_prompt(self, prompt: str):
        part = types.UserContent(
            parts=[types.Part.from_text(text=prompt)]
        )
        self.history.append(part.model_dump())

    def add_model_function_calls(self, function_calls):
        part = types.ModelContent(
            parts=[
                types.Part.from_function_call(
                    name=function_call.name,
                    args=function_call.args,
                ) for function_call in function_calls
            ]
        )
        self.history.append(part.model_dump())

    def add_model_function_responses(self, responses):
        part = types.Content(
            role='tool',
            parts=[
                types.Part.from_function_response(
                    name=response.name,
                    response=response.data)
                for response in responses
            ]
        )
        self.history.append(part.model_dump())

    def add_model_response(self, response):
        part = types.ModelContent(
            parts=[types.Part.from_text(text=response)]
        )
        self.history.append(part.model_dump())

    def get_chat_history(self):
        return self.history

    def get_chat_history_as_json(self):
        return self.history
