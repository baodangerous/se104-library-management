import * as React from 'react';
import { bookService } from '../../services/bookService';
import { serviceRequestService } from '../../services/serviceRequestService';
import { settingsService } from '../../services/settingsService';
import { buildLocalBotReply } from './libBotEngine';
import type { ChatMessage } from './types';

function nowTimeLabel(): string {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome-msg',
    role: 'assistant',
    text: 'Xin chào! Mình là **UIT LibBot** — trợ lý tra cứu thông minh của Thư viện UIT. Bạn cần tìm sách theo ngành, kiểm tra quy định mượn trả hay đặt phòng học nhóm?',
    timestamp: nowTimeLabel(),
    source: 'local',
  };
}

export function useLibBot() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => [
    createWelcomeMessage(),
  ]);
  const [thinking, setThinking] = React.useState(false);

  const sendMessage = React.useCallback(async (rawText: string) => {
    const query = rawText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: nowTimeLabel(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    try {
      // 1. Always retrieve real-time data from bookService, settingsService (THAMSO), and rooms
      const [books, params, rooms] = await Promise.all([
        bookService.listPublic(),
        settingsService.getParams(),
        serviceRequestService.listRooms(),
      ]);

      // 2. Compute guaranteed instant Mini-RAG answer & verified Interactive Book Cards locally
      const localReply = buildLocalBotReply(query, { books, params, rooms });
      let finalText = localReply.text;
      let source: 'ai' | 'local' = 'local';

      // 3. Optionally refine open-ended phrasing via server-side @google/genai with strict timeout
      if (localReply.intent === 'GREETING' || localReply.intent === 'BOOK_SEARCH') {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 2400);
        try {
          const res = await fetch('/api/chatbot/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              query,
              context: {
                totalBooks: books.length,
                availableBooks: books.filter((b) => b.TinhTrang === 'Có sẵn').length,
                readyRooms: rooms.filter((r) => r.TrangThai === 'Sẵn sàng').length,
                params,
                matchedBooks: localReply.books.map((b) => ({
                  MaSach: b.MaSach,
                  TenSach: b.TenSach,
                  TenNganh: b.TenNganh,
                  TinhTrang: b.TinhTrang,
                  MaKeSach: b.MaKeSach,
                  TacGiaList: b.TacGiaList,
                })),
              },
            }),
          });
          if (res.ok) {
            const data = (await res.json()) as { configured?: boolean; text?: string | null };
            if (data.configured && data.text) {
              finalText = data.text;
              source = 'ai';
            }
          }
        } catch {
          // Seamless fallback to Local Smart Engine
        } finally {
          window.clearTimeout(timer);
        }
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: 'assistant',
        text: finalText,
        books: localReply.books,
        actions: localReply.actions,
        timestamp: nowTimeLabel(),
        source,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setThinking(false);
    }
  }, []);

  const resetChat = React.useCallback(() => {
    setMessages([createWelcomeMessage()]);
  }, []);

  return { messages, thinking, sendMessage, resetChat };
}
