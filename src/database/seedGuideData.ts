import type { LibraryGuideData } from '../types/portal';

export const SEED_HUONGDAN: LibraryGuideData = {
  tang: [
    {
      id: 'ground',
      tenTang: 'Tầng trệt',
      tieuDe: 'Khu vực vào học tự do',
      anhChinh: '/resources/library/ground-pair-collab.jpg',
      boSuuTap: [
        { src: '/resources/library/ground-pair-collab.jpg', caption: 'Không gian học tập tự do & trao đổi nhóm tầng trệt' },
        { src: '/resources/library/ground-group-laptop.jpg', caption: 'Nhóm sinh viên cùng lập trình & làm đồ án' },
        { src: '/resources/library/ground-carrel-study.jpg', caption: 'Dãy bàn tự học có vách ngăn riêng tư' },
        { src: '/resources/library/ground-window-study.jpg', caption: 'Góc tự học yên tĩnh bên cửa sổ sáng' },
        { src: '/resources/library/ground-solo-focus.jpg', caption: 'Khu vực ôn tập cá nhân tập trung cao độ' },
        { src: '/resources/library/ground-open-space.jpg', caption: 'Bàn học mở trang bị ổ điện cho laptop' },
        { src: '/resources/library/ground-discussion.jpg', caption: 'Khu vực sinh hoạt học thuật gần quầy tiếp đón' },
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
        { src: '/resources/library/floor2-study-window.jpg', caption: 'Khu vực đọc tại chỗ & tự học yên tĩnh bên cửa sổ' },
        { src: '/resources/library/floor2-shelf-read.jpg', caption: 'Sinh viên tra cứu giáo trình ngay tại giá sách' },
        { src: '/resources/library/floor2-shelf-pick.jpg', caption: 'Kệ sách chuyên ngành kho đọc mở tầng 2' },
        { src: '/resources/library/floor2-english-shelf.jpg', caption: 'Khu vực tài liệu ngoại văn & ôn luyện TOEIC' },
        { src: '/resources/library/floor2-student-browse.jpg', caption: 'Không gian tìm kiếm học liệu đa ngành tại tầng 2' },
        { src: '/resources/library/floor2-group.jpg', caption: 'Phòng học & thảo luận nhóm' },
        { src: '/resources/library/floor2-counter.png', caption: 'Quầy mượn trả sách & hỗ trợ bạn đọc' },
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

