import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Bug,
  Code2,
  Copy,
  Download,
  Lightbulb,
  Loader2,
  SendHorizonal,
  Sparkles,
  Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../services/api';

type Mode = 'generate-code' | 'debug' | 'explain' | 'optimize';

interface Tab {
  id: Mode;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  activeClass: string;
  description: string;
}

const TABS: Tab[] = [
  {
    id: 'generate-code',
    label: 'Generate',
    icon: Code2,
    placeholder:
      'Describe what code to generate. e.g., "Create a FastAPI CRUD API for a users table with SQLAlchemy."',
    activeClass: 'bg-violet-500 text-white',
    description: 'Generate clean, production-ready code from a description.',
  },
  {
    id: 'debug',
    label: 'Debug',
    icon: Bug,
    placeholder: 'Paste your buggy code or error message here. e.g., "TypeError: Cannot read property ..."',
    activeClass: 'bg-rose-500 text-white',
    description: 'Find and fix bugs in your code with clear explanations.',
  },
  {
    id: 'explain',
    label: 'Explain',
    icon: Lightbulb,
    placeholder: 'Paste code you want explained. e.g., a React hook, SQL query, or algorithm.',
    activeClass: 'bg-amber-500 text-slate-950',
    description: 'Understand any piece of code with detailed explanations.',
  },
  {
    id: 'optimize',
    label: 'Optimize',
    icon: Zap,
    placeholder: 'Paste code to optimize for performance, readability, or best practices.',
    activeClass: 'bg-emerald-500 text-slate-950',
    description: 'Improve code quality, performance, and maintainability.',
  },
];

const INACTIVE_CLASS =
  'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100';

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Mode>('generate-code');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tab = TABS.find((t) => t.id === activeTab)!;

  const run = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResult('');
    try {
      const endpoint =
        activeTab === 'generate-code'
          ? '/generate-code'
          : activeTab === 'debug'
            ? '/debug'
            : activeTab === 'explain'
              ? '/explain'
              : '/optimize';

      const res = await api.post(endpoint, { message: prompt });
      setResult(res.data.reply);
    } catch {
      setResult('⚠️ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 text-slate-100 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-cyan-400">Playground</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-100">Code Playground</h1>
          <p className="mt-2 text-slate-400">
            Generate, debug, explain, or optimize code with AI.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="mb-6 flex items-center gap-1 rounded-2xl border border-white/10 bg-slate-900/60 p-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setResult(''); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:flex-none sm:px-4 ${
                  activeTab === t.id ? t.activeClass : INACTIVE_CLASS
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 ring-1 ring-white/10">
                <tab.icon size={16} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{tab.label} Mode</p>
                <p className="text-xs text-slate-400">{tab.description}</p>
              </div>
            </div>

            <form onSubmit={run} className="flex flex-1 flex-col gap-3">
              <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 focus-within:border-cyan-500/50 transition">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={tab.placeholder}
                  className="h-64 w-full resize-none bg-transparent px-4 py-4 text-sm text-slate-100 placeholder-slate-500 outline-none lg:h-80"
                />
              </div>
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <SendHorizonal size={16} /> Run {tab.label}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">Output</p>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={copy}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300"
                  >
                    <Copy size={12} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadResult}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300"
                  >
                    <Download size={12} /> Download
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 p-4 overflow-auto" style={{ minHeight: 340 }}>
              {loading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 size={32} className="animate-spin text-cyan-400" />
                  <p className="text-sm">The AI is thinking…</p>
                </div>
              ) : result ? (
                <div className="prose prose-invert max-w-none text-sm prose-p:my-1 prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const code = String(children).replace(/\n$/, '');
                        return match ? (
                          <div className="my-2 rounded-xl overflow-hidden border border-white/10">
                            <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5">
                              <span className="text-xs font-mono text-slate-400">{match[1]}</span>
                            </div>
                            <SyntaxHighlighter
                              style={oneDark as any}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, borderRadius: 0, background: '#0d1117', fontSize: 12 }}
                              codeTagProps={{ style: { background: 'transparent', fontFamily: 'inherit' } }}
                            >
                              {code}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-cyan-300" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-600">
                  <Sparkles size={36} />
                  <p className="text-sm">
                    Your AI-generated output will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
