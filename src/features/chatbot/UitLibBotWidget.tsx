import * as React from 'react';
import { Bot, X } from 'lucide-react';
import type { Sach } from '../../types/library';
import { ChatWindow } from './ChatWindow';
import type { ChatAction } from './types';
import { useLibBot } from './useLibBot';

interface UitLibBotWidgetProps {
  onInspectBook: (book: Sach) => void;
  onOpenKnowledgeMap: (book: Sach) => void;
  onExecuteAction: (action: ChatAction) => void;
}

export function UitLibBotWidget({
  onInspectBook,
  onOpenKnowledgeMap,
  onExecuteAction,
}: UitLibBotWidgetProps) {
  const [open, setOpen] = React.useState(false);
  const { messages, thinking, sendMessage, resetChat } = useLibBot();

  const handleInspect = (book: Sach) => {
    setOpen(false);
    onInspectBook(book);
  };

  const handleOpenMap = (book: Sach) => {
    setOpen(false);
    onOpenKnowledgeMap(book);
  };

  const handleAction = (action: ChatAction) => {
    setOpen(false);
    onExecuteAction(action);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 no-print">
      {open ? (
        <ChatWindow
          messages={messages}
          thinking={thinking}
          onSend={sendMessage}
          onReset={resetChat}
          onClose={() => setOpen(false)}
          onInspectBook={handleInspect}
          onOpenKnowledgeMap={handleOpenMap}
          onExecuteAction={handleAction}
        />
      ) : null}

      {/* Floating Action Button (FAB) with gentle pulse */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Thu gọn trợ lý UIT LibBot' : 'Mở trợ lý AI UIT LibBot'}
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#0054A6] to-[#003B73] text-white shadow-lg shadow-[#0054A6]/30 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
      >
        {!open ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#0054A6]/35 animate-ping [animation-duration:2.6s]"
          />
        ) : null}
        <span className="relative z-10 flex items-center justify-center">
          {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </span>

        {!open ? (
          <span className="pointer-events-none hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-medium shadow-md whitespace-nowrap absolute right-16 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            Hỏi UIT LibBot
          </span>
        ) : null}
      </button>
    </div>
  );
}
