import type { LibraryGuideData } from '../types/portal';

export const SEED_HUONGDAN: LibraryGuideData = {
  tang: [
    {
      id: 'ground',
      tenTang: 'Tầng trệt',
      tieuDe: 'Khu vực vào học tự do',
      anhChinh: '/resources/library/floor-ground.png',
      boSuuTap: [
        { src: '/resources/library/floor-ground.png', caption: 'Khu vực tự học tự do tầng trệt' },
        { src: '/resources/library/uit-lib-space-1.jpg', caption: 'Không gian học tập mở UIT' },
      ],
      khuVuc: [
        {
          id: 'free-study',
          tenKhuVuc: 'Khu vực vào học tự do',
          moTaNgan: 'Mở cửa tự do cho sinh viên UIT tự học cá nhân',
          icon: 'Laptop',
          badge: 'Vào tự do',
        },
        {
          id: 'ground-desk',
          tenKhuVuc: 'Quầy tiếp đón & Hướng dẫn',
          moTaNgan: 'Hỗ trợ thông tin chung ngay lối vào thư viện',
          icon: 'Headset',
          badge: 'Hỗ trợ trực tiếp',
        },
      ],
    },
    {
      id: 'floor2',
      tenTang: 'Tầng 2',
      tieuDe: 'Mượn trả sách · Phòng học nhóm · Đọc tại chỗ',
      anhChinh: '/resources/library/floor2-main.jpg',
      boSuuTap: [
        { src: '/resources/library/floor2-main.jpg', caption: 'Toàn cảnh không gian Thư viện Tầng 2' },
        { src: '/resources/library/floor2-reading.jpg', caption: 'Khu vực đọc tài liệu tại chỗ' },
        { src: '/resources/library/floor2-group.jpg', caption: 'Phòng học & thảo luận nhóm' },
        { src: '/resources/library/floor2-counter.png', caption: 'Quầy mượn trả sách & hỗ trợ bạn đọc' },
        { src: '/resources/library/floor2-zone.png', caption: 'Kệ sách chuyên ngành & khu tra cứu' },
      ],
      khuVuc: [
        {
          id: 'borrow-return',
          tenKhuVuc: 'Khu vực mượn trả sách',
          moTaNgan: 'Thủ tục mượn, trả, gia hạn và giải đáp thẻ độc giả',
          icon: 'BookOpenCheck',
          badge: 'Quầy thủ thư',
        },
        {
          id: 'group-room',
          tenKhuVuc: 'Phòng học nhóm',
          moTaNgan: 'Thảo luận đồ án theo khung giờ đăng ký trước',
          icon: 'Users',
          badge: 'Cần đặt lịch',
        },
        {
          id: 'quiet-reading',
          tenKhuVuc: 'Khu vực đọc tại chỗ',
          moTaNgan: 'Không gian yên tĩnh tra cứu giáo trình, luận văn',
          icon: 'BookOpen',
          badge: 'Yên tĩnh',
        },
      ],
    },
  ],
  noiQuyTrucQuan: [
    { id: 'quiet', tieuDe: 'Giữ trật tự', nhan: 'Không trao đổi ồn ào', icon: 'VolumeX' },
    { id: 'chair', tieuDe: 'Xếp ghế gọn gàng', nhan: 'Không tự ý di chuyển ghế', icon: 'Armchair' },
    { id: 'trash', tieuDe: 'Giữ gìn vệ sinh', nhan: 'Bỏ rác đúng nơi quy định', icon: 'Trash2' },
    { id: 'support', tieuDe: 'Cần hỗ trợ?', nhan: 'Liên hệ Anh/Chị Quầy phục vụ', icon: 'Headset' },
  ],
  lienKetDatPhong: [
    {
      id: 'portal-book',
      tieuDe: 'Đặt phòng trên Cổng',
      moTa: 'Đăng ký nhanh trực tuyến',
      url: 'services',
      loai: 'internal',
    },
    {
      id: 'uit-web',
      tieuDe: 'Website Thư viện',
      moTa: 'thuvien.uit.edu.vn',
      url: 'http://thuvien.uit.edu.vn',
      loai: 'external',
    },
    {
      id: 'schedule-sheet',
      tieuDe: 'Lịch theo dõi đăng ký',
      moTa: 'Google Sheets lịch phòng',
      url: 'https://docs.google.com/spreadsheets/d/1hkXB35c3WUNgr1XN_uVJeN9lRCIF09SAxe6I3enLyZA/edit#gid=0',
      loai: 'external',
    },
    {
      id: 'register-form',
      tieuDe: 'Link đăng ký phòng',
      moTa: 'Google Forms chính thức',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSclitu3dwMTcHxlf1ZJLc8HQv066VavPOu5qURmeC4gWxliAA/viewform',
      loai: 'external',
    },
  ],
};

