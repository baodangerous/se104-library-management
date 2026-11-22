import * as React from 'react';
import {
  BarChart3,
  BookCopy,
  BookDown,
  BookUp,
  CreditCard,
  DatabaseBackup,
  History,
  LayoutDashboard,
  Network,
  SlidersHorizontal,
  UserCircle2,
  Users,
} from 'lucide-react';
import type { UserRole } from '../../../types/library';

export type NavPageId =
  | 'dashboard'
  | 'readers'
  | 'books'
  | 'knowledge-map'
  | 'loans'
  | 'returns'
  | 'fines'
  | 'reports'
  | 'regulations'
  | 'accounts'
  | 'audit'
  | 'backup'
  | 'reader-portal';

export interface NavItem {
  id: NavPageId;
  label: string;
  readerLabel?: string;
  section: string;
  roles: UserRole[];
  icon: React.ComponentType<{ className?: string }>;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Quản trị viên',
  LIBRARIAN: 'Thủ thư',
  READER: 'Sinh viên / Độc giả',
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    section: 'Hoạt động chính',
    roles: ['ADMIN', 'LIBRARIAN'],
    icon: LayoutDashboard,
  },
  {
    id: 'reader-portal',
    label: 'Thẻ & Lịch sử mượn',
    section: 'Cổng độc giả UIT',
    roles: ['READER'],
    icon: UserCircle2,
  },
  {
    id: 'books',
    label: 'Kho sách & Tra cứu',
    readerLabel: 'Tra cứu học liệu',
    section: 'Học liệu & Độc giả',
    roles: ['ADMIN', 'LIBRARIAN', 'READER'],
    icon: BookCopy,
  },
  {
    id: 'knowledge-map',
    label: 'Bản đồ tri thức',
    section: 'Học liệu & Độc giả',
    roles: ['ADMIN', 'LIBRARIAN', 'READER'],
    icon: Network,
  },
  {
    id: 'readers',
    label: 'Quản lý độc giả',
    section: 'Học liệu & Độc giả',
    roles: ['ADMIN', 'LIBRARIAN'],
    icon: Users,
  },
  {
    id: 'loans',
    label: 'Cho mượn sách',
    section: 'Lưu thông & Tài chính',
    roles: ['ADMIN', 'LIBRARIAN'],
    icon: BookUp,
  },
  {
    id: 'returns',
    label: 'Nhận trả sách',
    section: 'Lưu thông & Tài chính',
    roles: ['ADMIN', 'LIBRARIAN'],
    icon: BookDown,
  },
  {
    id: 'fines',
    label: 'Thu tiền phạt',
    section: 'Lưu thông & Tài chính',
    roles: ['ADMIN', 'LIBRARIAN'],
    icon: CreditCard,
  },
  {
    id: 'reports',
    label: 'Báo cáo thống kê',
    section: 'Thống kê',
    roles: ['ADMIN', 'LIBRARIAN'],
    icon: BarChart3,
  },
  {
    id: 'regulations',
    label: 'Quy định thư viện',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN'],
    icon: SlidersHorizontal,
  },
  {
    id: 'accounts',
    label: 'Tài khoản & Phân quyền',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN'],
    icon: UserCircle2,
  },
  {
    id: 'audit',
    label: 'Nhật ký hoạt động',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN'],
    icon: History,
  },
  {
    id: 'backup',
    label: 'Sao lưu & Khôi phục',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN'],
    icon: DatabaseBackup,
  },
];
