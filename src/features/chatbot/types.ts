import type { Sach } from '../../types/library';
import type { PortalTabId } from '../../types/portal';

export type ChatRole = 'user' | 'assistant';

export interface ChatAction {
  label: string;
  targetTab: PortalTabId;
  majorFilter?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  books?: Sach[];
  actions?: ChatAction[];
  timestamp: string;
  source?: 'ai' | 'local';
}

export interface QuickPromptItem {
  id: string;
  label: string;
  query: string;
}

export const QUICK_PROMPTS: QuickPromptItem[] = [
  {
    id: 'qp-attt',
    label: 'Tìm sách An toàn thông tin',
    query: 'Tìm sách An toàn thông tin',
  },
  {
    id: 'qp-rules',
    label: 'Quy định mượn & phạt trễ',
    query: 'Quy định mượn sách và phạt trễ hạn hiện nay thế nào?',
  },
  {
    id: 'qp-avail',
    label: 'Sách nào đang có sẵn?',
    query: 'Sách nào đang có sẵn tại thư viện?',
  },
  {
    id: 'qp-hours',
    label: 'Giờ mở cửa thư viện',
    query: 'Giờ mở cửa thư viện và cách đặt phòng họp nhóm?',
  },
];

export interface LibBotReply {
  text: string;
  books: Sach[];
  actions: ChatAction[];
  intent: 'REGULATIONS' | 'AVAILABLE_BOOKS' | 'BOOK_SEARCH' | 'SERVICES' | 'HOURS' | 'GREETING';
}
