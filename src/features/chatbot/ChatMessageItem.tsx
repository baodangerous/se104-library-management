import * as React from 'react';
import { ArrowUpRight, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Sach } from '../../types/library';
import { ChatBookCard } from './ChatBookCard';
import type { ChatAction, ChatMessage } from './types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onInspectBook: (book: Sach) => void;
  onOpenKnowledgeMap: (book: Sach) => void;
  onExecuteAction: (action: ChatAction) => void;
}

function renderFormattedLine(line: string, lineIndex: number): React.ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <p key={lineIndex} className={lineIndex > 0 ? 'mt-1' : undefined}>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={idx} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </p>
  );
}

export function ChatMessageItem({
  message,
  onInspectBook,
  onOpenKnowledgeMap,
  onExecuteAction,
}: ChatMessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser ? (
        <div className="w-7 h-7 rounded-full bg-[#0054A6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Bot className="w-4 h-4" />
        </div>
      ) : null}

      <div className={cn('max-w-[85%] space-y-2', isUser && 'items-end flex flex-col')}>
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs',
            isUser
              ? 'bg-[#0054A6] text-white rounded-br-sm'
              : 'bg-white/95 text-slate-800 border border-slate-200/90 rounded-bl-sm'
          )}
        >
          {message.text.split('\n').map((line, i) => renderFormattedLine(line, i))}
        </div>

        {/* Interactive Book Cards */}
        {!isUser && message.books && message.books.length > 0 ? (
          <div className="space-y-2 w-full">
            {message.books.map((book) => (
              <ChatBookCard
                key={book.MaSach}
                book={book}
                onInspectBook={onInspectBook}
                onOpenKnowledgeMap={onOpenKnowledgeMap}
              />
            ))}
          </div>
        ) : null}

        {/* Quick Navigation Action Buttons */}
        {!isUser && message.actions && message.actions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {message.actions.map((act) => (
              <button
                key={act.label}
                type="button"
                onClick={() => onExecuteAction(act)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0054A6]/10 hover:bg-[#0054A6] text-[#0054A6] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <span>{act.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        ) : null}

        <span className="text-[10px] text-slate-400 px-1">{message.timestamp}</span>
      </div>
    </div>
  );
}
