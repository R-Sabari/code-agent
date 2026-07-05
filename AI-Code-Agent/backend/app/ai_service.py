import os
from typing import Optional

from app.config import settings

try:
    from openai import OpenAI

    if settings.groq_api_key:
        client = OpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1"
        )
    else:
        client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None
    
    _use_new_client = True
except Exception:
    import openai
    
    # Legacy openai is highly discouraged with custom base_url but we try:
    if settings.groq_api_key:
        openai.api_key = settings.groq_api_key
        openai.api_base = "https://api.groq.com/openai/v1"
        client = openai
    else:
        openai.api_key = settings.openai_api_key
        client = openai if settings.openai_api_key else None
    
    _use_new_client = False


def build_system_prompt(mode: str) -> str:
    if mode == "debug":
        return "You are a senior software engineer. Find bugs, explain them clearly, provide a corrected version, and summarize changes."
    if mode == "explain":
        return "You are a senior software educator. Explain the code clearly, including variables, loops, functions, and complexity."
    if mode == "generate-code":
        return "You are a senior full-stack engineer. Generate clean, production-ready code with comments and a brief explanation."
    if mode == "optimize":
        return "You are a performance-focused engineer. Improve the code for readability, reliability, and efficiency."
    if mode == "convert":
        return "You are a polyglot engineer. Convert code carefully while preserving behavior."
    return "You are an expert programming assistant for a coding agent platform. Help with coding tasks clearly and concisely."


def fallback_response(mode: str, prompt: str) -> str:
    if mode == "debug":
        return (
            "A debug-focused response could not be generated because no OpenAI key is configured. "
            "Please paste the code and error message so I can walk through the issue."
        )
    if mode == "explain":
        return f"Here is a concise explanation of your request: {prompt}. I can break down variables, loops, functions, classes, and complexity in more detail when connected to an OpenAI key."
    if mode == "generate-code":
        return f"I can generate production-ready code for: {prompt}. Configure OPENAI_API_KEY to enable full AI-powered code generation."
    return f"This is a fallback answer for: {prompt}. Configure OPENAI_API_KEY to enable the full assistant experience."


def generate_ai_response(prompt: str, mode: str = "chat") -> str:
    if not client:
        return fallback_response(mode, prompt)
        
    model_to_use = settings.groq_model if settings.groq_api_key else settings.openai_model
    
    try:
        if _use_new_client:
            response = client.chat.completions.create(
                model=model_to_use,
                messages=[
                    {"role": "system", "content": build_system_prompt(mode)},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=800,
            )
            return response.choices[0].message.content or fallback_response(mode, prompt)
        else:
            # legacy openai package
            response = client.ChatCompletion.create(
                model=model_to_use,
                messages=[
                    {"role": "system", "content": build_system_prompt(mode)},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=800,
            )
            return response.choices[0].message['content'] or fallback_response(mode, prompt)
    except Exception as exc:
        error_text = str(exc).lower()
        if "insufficient_quota" in error_text or "429" in error_text:
            return "The assistant could not respond because the OpenAI API quota is exhausted or billing is not available for this key. Please add billing credits or use a different API key."
        if "invalid_api_key" in error_text or "authentication" in error_text or "api key" in error_text:
            return "The assistant could not respond because the OpenAI API key is invalid or unauthorized. Please verify the key and try again."
        return fallback_response(mode, prompt)
