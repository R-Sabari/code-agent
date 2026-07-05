from groq import Groq

from app.config import settings

# Initialise Groq client (works as long as GROQ_API_KEY is set)
_client: Groq | None = None
if settings.groq_api_key:
    _client = Groq(api_key=settings.groq_api_key)


def build_system_prompt(mode: str) -> str:
    if mode == "debug":
        return (
            "You are a senior software engineer. Carefully analyse the code or error "
            "the user provides. Identify all bugs, explain them clearly, provide a "
            "corrected version, and summarise the changes made."
        )
    if mode == "explain":
        return (
            "You are a senior software educator. Explain the code clearly, covering "
            "variables, loops, functions, classes, algorithms, and time/space complexity."
        )
    if mode == "generate-code":
        return (
            "You are a senior full-stack engineer. Generate clean, well-commented, "
            "production-ready code. Always include a brief explanation of what the "
            "code does and how to use it."
        )
    if mode == "optimize":
        return (
            "You are a performance-focused engineer. Improve the given code for "
            "readability, reliability, and efficiency. Explain every optimisation you make."
        )
    if mode == "convert":
        return (
            "You are a polyglot engineer. Convert the provided code to the requested "
            "language while preserving its behaviour exactly."
        )
    # default — general chat
    return (
        "You are an expert AI programming assistant embedded in a coding-agent platform. "
        "Help developers with coding questions, code reviews, architecture decisions, "
        "and best practices. Be concise, accurate, and use markdown with code blocks."
    )


def generate_ai_response(prompt: str, mode: str = "chat") -> str:
    if not _client:
        return (
            "⚠️ The AI assistant is not configured. "
            "Please set the **GROQ_API_KEY** environment variable in your Render service settings and redeploy."
        )

    try:
        response = _client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": build_system_prompt(mode)},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=1500,
        )
        content = response.choices[0].message.content
        return content if content else "The AI returned an empty response. Please try again."
    except Exception as exc:
        error_text = str(exc).lower()
        if "rate_limit" in error_text or "429" in error_text:
            return "⚠️ The AI assistant is temporarily rate-limited. Please wait a moment and try again."
        if "authentication" in error_text or "api key" in error_text or "401" in error_text:
            return "⚠️ The GROQ_API_KEY is invalid or unauthorised. Please verify the key in your Render environment variables."
        if "model" in error_text or "404" in error_text:
            return "⚠️ The requested AI model is unavailable. Please check the GROQ_MODEL setting."
        # Generic fallback with error hint
        return f"⚠️ The AI assistant encountered an error: {exc}. Please try again."
