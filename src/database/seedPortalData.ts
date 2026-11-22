import type { LibraryPortalConfig, TinHoatDong, TuSachChuyenDe } from '../types/portal';
export { SEED_NGANHHOC } from './seedMajors';
export const SEED_TINTUC: TinHoatDong[] = [
  {
    id: 'news-1',
    tieuDe: 'Khép lại thành công Ngày hội “Thư viện đồng hành cùng sinh viên ĐHQG-HCM” lần XI – 2026',
    ngayDang: '21/10/2026',
    chuyenMuc: 'Sự kiện nổi bật',
    hinhAnh: '/resources/events/ngay-hoi-2026.jpg',
    duongDan: 'https://thuvien.uit.edu.vn/bai-viet/khep-lai-thanh-cong-ngay-hoi-thu-vien-dong-hanh-cung-sinh-vien-dhqg-hcm-lan-xi-nam-2026',
    tomTat: 'Ngày hội lần XI khép lại thành công tại Hội trường A – UIT (17/10/2026), hẹn gặp lại năm 2027.',
  },
  {
    id: 'news-2',
    tieuDe: 'Sản phẩm KHCN tại Ngày hội Thư viện: VR 3D, Robot cứu hỏa & Hệ thống nhúng',
    ngayDang: '21/10/2026',
    chuyenMuc: 'Khoa học công nghệ',
    hinhAnh: '/resources/events/khcn-vr.jpg',
    duongDan: 'https://thuvien.uit.edu.vn/bai-viet/hinh-anh-mot-so-san-pham-khoa-hoc-cong-nghe-tai-ngay-hoi-thu-vien-dong-hanh-cung-sinh-vien-nam-2026',
    tomTat: 'Trưng bày các sản phẩm công nghệ nổi bật của sinh viên UIT: trải nghiệm thực tế ảo VR 3D, robot và thiết bị nhúng.',
  },
  {
    id: 'news-3',
    tieuDe: 'Talkshow: “Chuyển đổi số và AI” cùng TS. Ngô Đức Thành thu hút gần 1.400 sinh viên',
    ngayDang: '19/10/2026',
    chuyenMuc: 'Hội thảo AI',
    hinhAnh: '/resources/events/talkshow-ai.jpg',
    duongDan: 'https://thuvien.uit.edu.vn/bai-viet/hinh-anh-talkshow-chuyen-doi-so-va-ai',
    tomTat: 'Chia sẻ chuyên sâu về xu hướng AI tạo sinh, chuyển đổi số và kỹ năng nghiên cứu học thuật tại UIT.',
  },
  {
    id: 'news-4',
    tieuDe: 'Trao giải cuộc thi “Để trở thành bạn đọc thông minh dễ hay khó” & Tập huấn ĐHQG-HCM',
    ngayDang: '21/10/2026',
    chuyenMuc: 'Hoạt động bạn đọc',
    hinhAnh: '/resources/events/ban-doc-thong-minh.jpg',
    duongDan: 'https://thuvien.uit.edu.vn/bai-viet/trao-giai-cuoc-thi-trac-nghiem-truc-tuyen-de-tro-thanh-ban-doc-thong-minh-de-hay-kho-nam-2026',
    tomTat: 'Vinh danh 10 sinh viên xuất sắc và chuỗi tập huấn khai thác hiệu quả Hệ thống Thư viện ĐHQG-HCM.',
  },
  {
    id: 'news-5',
    tieuDe: 'Webinar “Tăng tốc nghiên cứu cùng Leapspace – AI Research Solutions” (Elsevier)',
    ngayDang: '24/09/2026',
    chuyenMuc: 'Học liệu số',
    hinhAnh: '/resources/events/webinar-elsevier.jpg',
    duongDan: 'https://thuvien.uit.edu.vn/bai-viet/3092026-gioi-thieu-webinar-tang-toc-nghien-cuu-cung-leapspace-ai-research-solutions-tu-nxb-elsevier',
    tomTat: 'Giới thiệu giải pháp AI hỗ trợ tìm kiếm và tổng hợp tài liệu nghiên cứu khoa học từ NXB Elsevier.',
  },
];
export const SEED_TUSACHCHUYENDE: TuSachChuyenDe[] = [
  {
    id: 'ho-chi-minh',
    tenTuSach: 'Không gian văn hóa Hồ Chí Minh',
    moTa: 'Tuyển tập sách về tư tưởng, đạo đức, phong cách Hồ Chí Minh và lịch sử Đại học Quốc gia TP.HCM.',
    soTaiLieuMinhHoa: 68,
    accentColor: '#B91C1C',
  },
  {
    id: 'hoc-tap-suot-doi',
    tenTuSach: 'Tủ sách Học tập suốt đời',
    moTa: 'Phương pháp nghiên cứu khoa học, tư duy phản biện, kỹ năng đọc nhanh và phát triển sự nghiệp công nghệ.',
    soTaiLieuMinhHoa: 94,
    accentColor: '#0054A6',
  },
  {
    id: 'van-hoa-nhat-ban',
    tenTuSach: 'Tủ sách Văn hóa Nhật Bản',
    moTa: 'Tài liệu tiếng Nhật CNTT (JLPT N3–N1), văn hóa doanh nghiệp Nhật và kỹ nghệ phần mềm chuẩn Nhật Bản.',
    soTaiLieuMinhHoa: 52,
    accentColor: '#0F766E',
  },
];
export const SEED_CAUHINHCONG: LibraryPortalConfig = {
  tenDonVi: 'Thư viện Trường Đại học Công nghệ Thông tin – ĐHQG-HCM',
  tenNgan: 'Thư viện UIT',
  hotline: '(028) 372 51993',
  email: 'thuvien@uit.edu.vn',
  diaChi: 'Tòa nhà A, Khu phố 6, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',
  gioMoCuaNgan: 'T2–T6: 07:30–18:00 | T7: 08:00–16:00',
  gioMoCuaChiTiet: [
    { thu: 'Thứ 2 – Thứ 6', gio: '07:30 – 18:00', ghiChu: 'Phục vụ liên tục không nghỉ trưa' },
    { thu: 'Thứ 7', gio: '08:00 – 16:00', ghiChu: 'Phòng đọc mở & phòng học nhóm' },
    { thu: 'Chủ nhật & Ngày lễ', gio: 'Nghỉ phục vụ', ghiChu: 'Tra cứu trực tuyến 24/7' },
  ],
  khungGioDatPhong: ['08:00 – 10:00', '10:00 – 12:00', '13:30 – 15:30', '15:30 – 17:30'],
  noiQuyThuVien: [
    'Xuất trình thẻ sinh viên / thẻ độc giả UIT khi vào phòng đọc và làm thủ tục mượn sách.',
    'Giữ trật tự tại khu vực tự học yên tĩnh; thảo luận nhóm đúng khu vực phòng họp đã đặt lịch.',
    'Bảo quản nguyên vẹn sách, giáo trình và thiết bị; không viết vẽ, gấp trang hay làm rách tài liệu.',
    'Hoàn trả tài liệu đúng hạn để tránh phát sinh phí quá hạn và duy trì quyền lợi mượn sách liên tục.',
    'Không mang thức ăn có mùi hoặc đồ uống không nắp đậy vào khu vực giá sách và máy tính tra cứu.',
  ],
};
