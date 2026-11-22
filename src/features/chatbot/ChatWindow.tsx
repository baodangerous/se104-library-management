import * as React from 'react';
import { Bot, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import type { Sach } from '../../types/library';
import { ChatMessageItem } from './ChatMessageItem';
import { QUICK_PROMPTS, type ChatAction, type ChatMessage } from './types';

interface ChatWindowProps {
  messages: ChatMessage[];
  thinking: boolean;
  onSend: (query: string) => void;
  onReset: () => void;
  onClose: () => void;
  onInspectBook: (book: Sach) => void;
  onOpenKnowledgeMap: (book: Sach) => void;
  onExecuteAction: (action: ChatAction) => void;
}

export function ChatWindow({
  messages,
  thinking,
  onSend,
  onReset,
  onClose,
  onInspectBook,
  onOpenKnowledgeMap,
  onExecuteAction,
}: ChatWindowProps) {
  const [input, setInput] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    const text = input;
    setInput('');
    onSend(text);
  };

  return (
    <section
      role="dialog"
      aria-label="Trợ lý AI Thư viện UIT (UIT LibBot)"
      className="w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[calc(100vh-7rem)] rounded-2xl overflow-hidden flex flex-col border border-white/60 bg-white/92 backdrop-blur-xl shadow-2xl ring-1 ring-slate-900/10"
    >
      {/* Glassmorphic UIT Blue Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-[#003B73] to-[#0054A6] text-white flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight truncate">UIT LibBot</h2>
              <Sparkles className="w-3.5 h-3.5 text-sky-200 shrink-0" />
            </div>
            <p className="text-[11px] text-sky-100/90 truncate">
              Trợ lý Tra cứu Thư viện UIT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onReset}
            title="Bắt đầu cuộc trò chuyện mới"
            aria-label="Làm mới hội thoại"
            className="p-1.5 rounded-lg text-sky-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng khung chat"
            className="p-1.5 rounded-lg text-sky-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3.5 bg-gradient-to-b from-slate-50/85 to-white/75"
      >
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onInspectBook={onInspectBook}
            onOpenKnowledgeMap={onOpenKnowledgeMap}
            onExecuteAction={onExecuteAction}
          />
        ))}

        {thinking ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 pl-9">
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0054A6] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0054A6] animate-bounce [animation-delay:120ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0054A6] animate-bounce [animation-delay:240ms]" />
            </span>
            <span>UIT LibBot đang tra cứu dữ liệu thư viện...</span>
          </div>
        ) : null}
      </div>

      {/* 4 Quick Prompts */}
      <div className="px-3.5 py-2.5 border-t border-slate-200/80 bg-white/85 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.id}
              type="button"
              disabled={thinking}
              onClick={() => onSend(qp.query)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:border-[#0054A6] hover:bg-[#0054A6]/5 hover:text-[#0054A6] text-[11px] font-medium text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi tìm sách, quy định mượn, giờ mở cửa..."
          className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0054A6]/25 focus:border-[#0054A6]"
        />
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          aria-label="Gửi câu hỏi"
          className="w-9 h-9 rounded-xl bg-[#0054A6] hover:bg-[#003B73] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  );
}
