import * as React from 'react';
import {
  ArrowLeftRight,
  BarChart3,
  BookCopy,
  BookDown,
  BookUp,
  ClipboardCheck,
  Compass,
  CreditCard,
  DatabaseBackup,
  DoorOpen,
  GraduationCap,
  History,
  LayoutDashboard,
  Network,
  Newspaper,
  PackagePlus,
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
  | 'acquisitions'
  | 'transfers'
  | 'inventory'
  | 'service-requests'
  | 'fines'
  | 'reports'
  | 'news'
  | 'regulations'
  | 'accounts'
  | 'audit'
  | 'backup'
  | 'reader-portal'
  | 'reader-services'
  | 'reader-majors'
  | 'reader-about';

export interface NavItem {
  id: NavPageId;
  label: string;
  readerLabel?: string;
  section: string;
  roles: UserRole[];
  icon: React.ComponentType<{ className?: string }>;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Quản trị hệ thống',
  HEAD_LIBRARIAN: 'Quản lý thư viện',
  LIBRARIAN: 'Thủ thư',
  CATALOGER: 'Nhân viên biên mục',
  READER: 'Sinh viên / Độc giả',
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    section: 'Hoạt động chính',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER'],
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
    id: 'reader-services',
    label: 'Đặt phòng & Yêu cầu',
    section: 'Cổng độc giả UIT',
    roles: ['READER'],
    icon: DoorOpen,
  },
  {
    id: 'reader-majors',
    label: 'Giáo trình theo ngành',
    section: 'Học liệu & Độc giả',
    roles: ['READER'],
    icon: GraduationCap,
  },
  {
    id: 'reader-about',
    label: 'Tin tức, Nội quy & CSDL',
    section: 'Cổng độc giả UIT',
    roles: ['READER'],
    icon: Compass,
  },
  {
    id: 'books',
    label: 'Kho sách & Bản sao',
    readerLabel: 'Tra cứu học liệu',
    section: 'Học liệu & Độc giả',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER', 'READER'],
    icon: BookCopy,
  },
  {
    id: 'knowledge-map',
    label: 'Bản đồ tri thức',
    section: 'Học liệu & Độc giả',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER', 'READER'],
    icon: Network,
  },
  {
    id: 'acquisitions',
    label: 'Bổ sung & Mua sắm',
    section: 'Học liệu & Độc giả',
    roles: ['HEAD_LIBRARIAN', 'CATALOGER'],
    icon: PackagePlus,
  },
  {
    id: 'transfers',
    label: 'Điều chuyển chi nhánh',
    section: 'Học liệu & Độc giả',
    roles: ['HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER'],
    icon: ArrowLeftRight,
  },
  {
    id: 'inventory',
    label: 'Kiểm kê & Thanh lý',
    section: 'Học liệu & Độc giả',
    roles: ['HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER'],
    icon: ClipboardCheck,
  },
  {
    id: 'readers',
    label: 'Quản lý độc giả',
    section: 'Học liệu & Độc giả',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'],
    icon: Users,
  },
  {
    id: 'loans',
    label: 'Cho mượn sách',
    section: 'Lưu thông & Tài chính',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'],
    icon: BookUp,
  },
  {
    id: 'returns',
    label: 'Nhận trả sách',
    section: 'Lưu thông & Tài chính',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'],
    icon: BookDown,
  },
  {
    id: 'service-requests',
    label: 'Yêu cầu & Đặt phòng',
    section: 'Lưu thông & Tài chính',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'],
    icon: SlidersHorizontal,
  },
  {
    id: 'fines',
    label: 'Thu tiền phạt',
    section: 'Lưu thông & Tài chính',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'],
    icon: CreditCard,
  },
  {
    id: 'reports',
    label: 'Báo cáo thống kê',
    section: 'Thống kê',
    roles: ['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'],
    icon: BarChart3,
  },
  {
    id: 'news',
    label: 'Tin tức & Sự kiện',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN', 'HEAD_LIBRARIAN'],
    icon: Newspaper,
  },
  {
    id: 'regulations',
    label: 'Quy định thư viện',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN', 'HEAD_LIBRARIAN'],
    icon: SlidersHorizontal,
  },
  {
    id: 'accounts',
    label: 'Tài khoản & Phân quyền',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN', 'HEAD_LIBRARIAN'],
    icon: UserCircle2,
  },
  {
    id: 'audit',
    label: 'Nhật ký hoạt động',
    section: 'Quản trị hệ thống',
    roles: ['ADMIN', 'HEAD_LIBRARIAN'],
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
