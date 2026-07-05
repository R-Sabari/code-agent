import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import {
  Bot,
  Copy,
  Download,
  MessageSquarePlus,
  Plus,
  SendHorizonal,
  Trash2,
  User,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../services/api';
import type { ChatHistoryItem, MessageItem } from '../types';

type Mode = 'chat' | 'debug' | 'explain' | 'generate-code' | 'optimize';

const MODES: { value: Mode; label: string; color: string }[] = [
  { value: 'chat', label: '💬 Chat', color: 'bg-slate-700 hover:bg-slate-600' },
  { value: 'generate-code', label: '⚙️ Generate', color: 'bg-violet-700/60 hover:bg-violet-600/60' },
  { value: 'debug', label: '🐞 Debug', color: 'bg-rose-700/60 hover:bg-rose-600/60' },
  { value: 'explain', label: '📚 Explain', color: 'bg-amber-700/60 hover:bg-amber-600/60' },
  { value: 'optimize', label: '⚡ Optimize', color: 'bg-emerald-700/60 hover:bg-emerald-600/60' },
];

const ACTIVE_MODE_COLORS: Record<Mode, string> = {
  chat: 'bg-cyan-500 text-slate-950',
  'generate-code': 'bg-violet-500 text-white',
  debug: 'bg-rose-500 text-white',
  explain: 'bg-amber-500 text-slate-950',
  optimize: 'bg-emerald-500 text-slate-950',
};

const WELCOME_MSG: MessageItem = {
  role: 'assistant',
  content:
    'Hello! I\'m your AI coding assistant. Ask me to **generate code**, **debug errors**, **explain concepts**, or **optimize your code**. Select a mode below to get started!',
};

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative my-2 rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-1.5">
        <span className="text-xs font-mono text-slate-400">{language}</span>
        <button
          onClick={copy}
          className="text-xs text-slate-400 hover:text-cyan-400 transition flex items-center gap-1"
        >
          <Copy size={12} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark as any}
        language={language}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: 0, background: '#0d1117' }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export default function ChatPage() {
  const [histories, setHistories] = useState<ChatHistoryItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('chat');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadHistories();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadHistories = async () => {
    try {
      const res = await api.get('/history');
      setHistories(res.data);
    } catch {
      // silent
    }
  };

  const newChat = () => {
    setActiveId(null);
    setMessages([WELCOME_MSG]);
    setInput('');
  };

  const loadHistory = (h: ChatHistoryItem) => {
    setActiveId(h.id);
    setMessages([WELCOME_MSG, ...h.messages]);
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim() || loading) return;
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);

    try {
      const res = await api.post(`/chat${activeId === null ? '?new_session=true' : ''}`, {
        message: prompt,
        mode,
        language: 'English',
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.reply },
      ]);
      // Track the conversation ID for subsequent messages in this session
      if (activeId === null && res.data.chat_id) {
        setActiveId(res.data.chat_id);
      }
      // Refresh history list
      loadHistories();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ The assistant could not respond. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyMessage = (text: string) => navigator.clipboard.writeText(text);

  const downloadMessage = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-response.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full bg-slate-950">
      {/* Chat History Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/10 bg-slate-900/60 lg:flex">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="text-sm font-semibold text-slate-100">Conversations</h2>
          <button
            onClick={newChat}
            className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300 transition hover:bg-cyan-500/30"
          >
            <Plus size={12} /> New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Current session */}
          <button
            onClick={newChat}
            className={`w-full rounded-lg px-3 py-2 text-left text-xs transition ${
              activeId === null
                ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquarePlus size={12} />
              <span className="truncate font-medium">New Conversation</span>
            </div>
          </button>

          {histories.length > 0 && (
            <div className="mt-2 px-2 pb-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">History</p>
            </div>
          )}

          {histories.map((h) => (
            <button
              key={h.id}
              onClick={() => loadHistory(h)}
              className={`group w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                activeId === h.id
                  ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="truncate font-medium">{h.title}</div>
              <div className="mt-0.5 text-[10px] text-slate-500">
                {new Date(h.created_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/40 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">AI Assistant</p>
            <h1 className="text-lg font-semibold text-slate-100">Code Chat Workspace</h1>
          </div>
          {/* Mode Selector */}
          <div className="hidden items-center gap-1.5 sm:flex">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  mode === m.value ? ACTIVE_MODE_COLORS[m.value] : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-purple-600'
                      : 'bg-slate-800 ring-1 ring-white/10'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User size={14} className="text-white" />
                  ) : (
                    <Bot size={14} className="text-cyan-400" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`group max-w-[85%] ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  } flex flex-col gap-1`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-tr-sm bg-cyan-500/15 text-slate-100 ring-1 ring-cyan-400/20'
                        : 'rounded-tl-sm bg-slate-900/80 text-slate-200 ring-1 ring-white/10'
                    }`}
                  >
                    <div className="prose prose-invert max-w-none prose-p:my-1 prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            const code = String(children).replace(/\n$/, '');
                            return match ? (
                              <CodeBlock language={match[1]}>{code}</CodeBlock>
                            ) : (
                              <code
                                className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-cyan-300"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Action buttons for assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                        title="Copy"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => downloadMessage(msg.content)}
                        className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                        title="Download"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 ring-1 ring-white/10">
                  <Bot size={14} className="text-cyan-400" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-slate-900/80 px-4 py-3 ring-1 ring-white/10">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Mobile mode selector */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-white/10 bg-slate-900/40 px-4 py-2 sm:hidden">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                mode === m.value ? ACTIVE_MODE_COLORS[m.value] : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 bg-slate-900/40 p-4 backdrop-blur sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950/80 ring-1 ring-white/5 transition focus-within:border-cyan-500/50 focus-within:ring-cyan-500/10">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask the AI (${mode} mode)... Press Enter to send, Shift+Enter for newline.`}
                rows={3}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
              <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
                <span className="text-xs text-slate-500">
                  Mode: <span className="text-cyan-400 font-medium">{mode}</span>
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <SendHorizonal size={15} />
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
