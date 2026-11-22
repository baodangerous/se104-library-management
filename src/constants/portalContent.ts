import type { TinHoatDong, TuSachChuyenDe } from '../types/portal';

export const UIT_LIBRARY_INFO = {
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
};

export const PORTAL_NEWS: TinHoatDong[] = [
  {
    id: 'news-1',
    tieuDe: 'Bổ sung hơn 120 đầu sách Ngoại văn mới về An toàn Thông tin & DevOps',
    ngayDang: '18/11/2026',
    chuyenMuc: 'Học liệu mới',
    tomTat:
      'Thư viện UIT vừa đưa vào phục vụ bộ sách CompTIA Security+, Learning DevOps và Cryptography bản ấn hành mới nhất tại tầng 2.',
  },
  {
    id: 'news-2',
    tieuDe: 'Mở đăng ký phòng học nhóm trực tuyến phục vụ mùa đồ án cuối kỳ',
    ngayDang: '12/11/2026',
    chuyenMuc: 'Dịch vụ độc giả',
    tomTat:
      'Sinh viên có thể đặt trước phòng thảo luận nhóm trang bị màn hình trình chiếu 65 inch theo khung giờ 2 tiếng ngay trên cổng thư viện.',
  },
  {
    id: 'news-3',
    tieuDe: 'Workshop: Kỹ năng khai thác CSDL IEEE Xplore & Quản lý trích dẫn khoa học',
    ngayDang: '05/11/2026',
    chuyenMuc: 'Sự kiện học thuật',
    tomTat:
      'Hướng dẫn sinh viên năm 3, năm 4 và học viên cao học tìm kiếm bài báo hội nghị quốc tế phục vụ khóa luận tốt nghiệp.',
  },
];

export const THEMATIC_SHELVES: TuSachChuyenDe[] = [
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

export const ROOM_TIME_SLOTS = [
  '08:00 – 10:00',
  '10:00 – 12:00',
  '13:30 – 15:30',
  '15:30 – 17:30',
];

export const LIBRARY_RULES = [
  'Xuất trình thẻ sinh viên / thẻ độc giả UIT khi vào phòng đọc và làm thủ tục mượn sách.',
  'Giữ trật tự tại khu vực tự học yên tĩnh; thảo luận nhóm đúng khu vực phòng họp đã đặt lịch.',
  'Bảo quản nguyên vẹn sách, giáo trình và thiết bị; không viết vẽ, gấp trang hay làm rách tài liệu.',
  'Hoàn trả tài liệu đúng hạn để tránh phát sinh phí quá hạn và duy trì quyền lợi mượn sách liên tục.',
  'Không mang thức ăn có mùi hoặc đồ uống không nắp đậy vào khu vực giá sách và máy tính tra cứu.',
];
