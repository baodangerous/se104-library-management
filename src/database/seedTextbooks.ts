import type { TacGia } from '../types/library';
import type { SachRow, SachTacGiaRow } from './schema';

export const SEED_TEXTBOOK_AUTHORS: TacGia[] = [
  {
    "MaTacGia": 101,
    "TenTacGia": "Nguyễn Vinh Tiệp"
  },
  {
    "MaTacGia": 102,
    "TenTacGia": "Lê Đình Duy"
  },
  {
    "MaTacGia": 103,
    "TenTacGia": "Dương Anh Đức"
  },
  {
    "MaTacGia": 104,
    "TenTacGia": "Lê Thị Phương"
  },
  {
    "MaTacGia": 105,
    "TenTacGia": "Phan Trường Nhất"
  },
  {
    "MaTacGia": 106,
    "TenTacGia": "Huỳnh Tuấn Anh"
  },
  {
    "MaTacGia": 107,
    "TenTacGia": "Vũ Tuấn Hải"
  },
  {
    "MaTacGia": 108,
    "TenTacGia": "Trần Thị Điểm"
  },
  {
    "MaTacGia": 109,
    "TenTacGia": "Phạm Hoài Luân"
  },
  {
    "MaTacGia": 110,
    "TenTacGia": "Nguyễn Văn Tình"
  },
  {
    "MaTacGia": 111,
    "TenTacGia": "Dương Tôn Đảm"
  },
  {
    "MaTacGia": 112,
    "TenTacGia": "Nguyễn Đình Hiển"
  },
  {
    "MaTacGia": 113,
    "TenTacGia": "Nguyễn Thị Ngọc Diễm"
  },
  {
    "MaTacGia": 114,
    "TenTacGia": "Phạm Thi Vương"
  },
  {
    "MaTacGia": 115,
    "TenTacGia": "Phạm Xuân Hậu"
  },
  {
    "MaTacGia": 116,
    "TenTacGia": "Đỗ Văn Nhơn"
  },
  {
    "MaTacGia": 117,
    "TenTacGia": "Nguyễn Bích Vân"
  },
  {
    "MaTacGia": 118,
    "TenTacGia": "Huỳnh Thị Thanh Thương"
  },
  {
    "MaTacGia": 119,
    "TenTacGia": "Phạm Nguyễn Trường An"
  },
  {
    "MaTacGia": 120,
    "TenTacGia": "Mai Tiến Dũng"
  },
  {
    "MaTacGia": 121,
    "TenTacGia": "Nguyễn Thanh Sơn"
  },
  {
    "MaTacGia": 122,
    "TenTacGia": "Nguyễn Đình Thuân chủ biên"
  },
  {
    "MaTacGia": 123,
    "TenTacGia": "Nguyễn Minh Nhựt"
  },
  {
    "MaTacGia": 124,
    "TenTacGia": "Nguyễn Thị Viết Hương"
  },
  {
    "MaTacGia": 125,
    "TenTacGia": "Trịnh Thị Thanh Trúc"
  },
  {
    "MaTacGia": 126,
    "TenTacGia": "Lê Trung Quân"
  },
  {
    "MaTacGia": 127,
    "TenTacGia": "Lê Bảo Long"
  },
  {
    "MaTacGia": 128,
    "TenTacGia": "Quản Thành Thơ"
  },
  {
    "MaTacGia": 129,
    "TenTacGia": "Nguyễn Khánh Thuật"
  },
  {
    "MaTacGia": 130,
    "TenTacGia": "Lê Bảo Chương"
  },
  {
    "MaTacGia": 131,
    "TenTacGia": "Đỗ Thị Hương Lan"
  },
  {
    "MaTacGia": 132,
    "TenTacGia": "Trần Hồng Nghi"
  },
  {
    "MaTacGia": 133,
    "TenTacGia": "Trần Tuấn Dũng"
  },
  {
    "MaTacGia": 134,
    "TenTacGia": "Nguyễn Tấn Toàn chủ biên"
  },
  {
    "MaTacGia": 135,
    "TenTacGia": "Lê Kim Hùng"
  },
  {
    "MaTacGia": 136,
    "TenTacGia": "Tô Nguyễn Nhật Quang"
  },
  {
    "MaTacGia": 137,
    "TenTacGia": "Trần Thị Dung"
  },
  {
    "MaTacGia": 138,
    "TenTacGia": "Bùi Thị Thanh Bình"
  },
  {
    "MaTacGia": 139,
    "TenTacGia": "Dương Tôn Đảm chủ biên"
  },
  {
    "MaTacGia": 140,
    "TenTacGia": "Dương Tôn Thái Dương"
  },
  {
    "MaTacGia": 141,
    "TenTacGia": "Huỳnh Tố Uyên"
  },
  {
    "MaTacGia": 142,
    "TenTacGia": "Đỗ Thị Minh Phụng"
  },
  {
    "MaTacGia": 143,
    "TenTacGia": "Nguyễn Thị Kim Phụng biên soạn"
  },
  {
    "MaTacGia": 144,
    "TenTacGia": "Lê Thanh Trọng"
  },
  {
    "MaTacGia": 145,
    "TenTacGia": "Mai Trọng Khang"
  },
  {
    "MaTacGia": 146,
    "TenTacGia": "Nguyễn Huỳnh Quốc Việt biên soạn"
  },
  {
    "MaTacGia": 147,
    "TenTacGia": "Nguyễn Gia Tuấn Anh chủ biên"
  },
  {
    "MaTacGia": 148,
    "TenTacGia": "Nguyễn Văn Kiệt"
  },
  {
    "MaTacGia": 149,
    "TenTacGia": "Đỗ Trọng Hợp"
  },
  {
    "MaTacGia": 150,
    "TenTacGia": "Lưu Thanh Sơn"
  },
  {
    "MaTacGia": 151,
    "TenTacGia": "Nguyễn Tấn Cầm"
  },
  {
    "MaTacGia": 152,
    "TenTacGia": "Nguyễn Hoàng Tú Anh (chủ biên)"
  },
  {
    "MaTacGia": 153,
    "TenTacGia": "Võ Tấn Khoa"
  },
  {
    "MaTacGia": 154,
    "TenTacGia": "Nguyễn Thị Anh Thư"
  },
  {
    "MaTacGia": 155,
    "TenTacGia": "Võ Ngọc Tân"
  },
  {
    "MaTacGia": 156,
    "TenTacGia": "Hennessy"
  },
  {
    "MaTacGia": 157,
    "TenTacGia": "John L."
  },
  {
    "MaTacGia": 158,
    "TenTacGia": "Dịch: Nguyễn"
  },
  {
    "MaTacGia": 159,
    "TenTacGia": "Minh Sơn"
  },
  {
    "MaTacGia": 160,
    "TenTacGia": "Phan Đình Duy"
  },
  {
    "MaTacGia": 161,
    "TenTacGia": "Lầu Phi Tường"
  },
  {
    "MaTacGia": 162,
    "TenTacGia": "Nguyễn Thanh Thiện"
  },
  {
    "MaTacGia": 163,
    "TenTacGia": "Trương Văn Cương"
  },
  {
    "MaTacGia": 164,
    "TenTacGia": "Hà Lê Hoài Trung"
  },
  {
    "MaTacGia": 165,
    "TenTacGia": "Hồ Ngọc Diễm"
  },
  {
    "MaTacGia": 166,
    "TenTacGia": "Trần Đại Dương"
  },
  {
    "MaTacGia": 167,
    "TenTacGia": "Nguyễn Duy Xuân Bách"
  },
  {
    "MaTacGia": 168,
    "TenTacGia": "Tạ Thu Thủy"
  },
  {
    "MaTacGia": 169,
    "TenTacGia": "Đoàn Duy"
  },
  {
    "MaTacGia": 170,
    "TenTacGia": "Lê Hoài Nghĩa"
  },
  {
    "MaTacGia": 171,
    "TenTacGia": "Đỗ Phúc"
  },
  {
    "MaTacGia": 172,
    "TenTacGia": "Phan Hoàng Chương chủ biên"
  },
  {
    "MaTacGia": 173,
    "TenTacGia": "Đỗ Trung Hiếu"
  },
  {
    "MaTacGia": 174,
    "TenTacGia": "Nguyễn Xuân Huy"
  },
  {
    "MaTacGia": 175,
    "TenTacGia": "Lâm Đức Khải"
  },
  {
    "MaTacGia": 176,
    "TenTacGia": "Trương Hải Bằng"
  },
  {
    "MaTacGia": 177,
    "TenTacGia": "Huỳnh Văn Đặng"
  },
  {
    "MaTacGia": 178,
    "TenTacGia": "Nguyễn Anh Tuấn"
  },
  {
    "MaTacGia": 179,
    "TenTacGia": "Cao Thị Nhạn"
  },
  {
    "MaTacGia": 180,
    "TenTacGia": "Nguyễn Đình Loan Phương"
  },
  {
    "MaTacGia": 181,
    "TenTacGia": "Dương Minh Đức"
  },
  {
    "MaTacGia": 182,
    "TenTacGia": "Cao Thanh Tình"
  },
  {
    "MaTacGia": 183,
    "TenTacGia": "Hà Mạnh Linh"
  },
  {
    "MaTacGia": 184,
    "TenTacGia": "Lê Hoàng Tuấn"
  },
  {
    "MaTacGia": 185,
    "TenTacGia": "Lê Huỳnh Mỹ Vân"
  },
  {
    "MaTacGia": 186,
    "TenTacGia": "Trần Hoàng Lộc"
  },
  {
    "MaTacGia": 187,
    "TenTacGia": "Nguyễn Gia Tuấn Anh"
  },
  {
    "MaTacGia": 188,
    "TenTacGia": "Mai Văn Cường"
  },
  {
    "MaTacGia": 189,
    "TenTacGia": "Bùi Danh Hường"
  },
  {
    "MaTacGia": 190,
    "TenTacGia": "Nguyễn Thanh Hùng"
  },
  {
    "MaTacGia": 191,
    "TenTacGia": "Nguyễn Đức Nghĩa"
  },
  {
    "MaTacGia": 192,
    "TenTacGia": "Nguyễn Tuấn Đăng"
  },
  {
    "MaTacGia": 193,
    "TenTacGia": "Trịnh Minh Tuấn"
  },
  {
    "MaTacGia": 194,
    "TenTacGia": "Nguyễn Đình Thuân"
  },
  {
    "MaTacGia": 195,
    "TenTacGia": "Đỗ Duy Thanh"
  },
  {
    "MaTacGia": 196,
    "TenTacGia": "Đàm Quang Hồng Hải"
  },
  {
    "MaTacGia": 197,
    "TenTacGia": "Vũ Thanh Nguyên"
  },
  {
    "MaTacGia": 198,
    "TenTacGia": "Nguyễn Công Hoan"
  },
  {
    "MaTacGia": 199,
    "TenTacGia": "Phan Trung Hiếu"
  },
  {
    "MaTacGia": 200,
    "TenTacGia": "Lê Đình Tuấn"
  },
  {
    "MaTacGia": 201,
    "TenTacGia": "Trần Anh Dũng"
  },
  {
    "MaTacGia": 202,
    "TenTacGia": "Phan Nguyệt Minh"
  },
  {
    "MaTacGia": 203,
    "TenTacGia": "Võ Đức Khánh"
  },
  {
    "MaTacGia": 204,
    "TenTacGia": "Hoàng Kiếm"
  },
  {
    "MaTacGia": 205,
    "TenTacGia": "Ngô Trung Việt"
  },
  {
    "MaTacGia": 206,
    "TenTacGia": "Vũ Hải Quân"
  },
  {
    "MaTacGia": 207,
    "TenTacGia": "Đinh Nguyễn Anh Dũng"
  },
  {
    "MaTacGia": 208,
    "TenTacGia": "Vũ Đức Lung"
  },
  {
    "MaTacGia": 209,
    "TenTacGia": "Trần Ngọc Đức"
  },
  {
    "MaTacGia": 210,
    "TenTacGia": "Đặng Kiên Cường"
  },
  {
    "MaTacGia": 211,
    "TenTacGia": "Lê Quang Minh"
  },
  {
    "MaTacGia": 212,
    "TenTacGia": "Tô Anh Dũng"
  },
  {
    "MaTacGia": 213,
    "TenTacGia": "Huỳnh Minh Trí"
  },
  {
    "MaTacGia": 214,
    "TenTacGia": "Nguyễn Đình Quyền"
  },
  {
    "MaTacGia": 215,
    "TenTacGia": "Mai Xuân Hùng"
  },
  {
    "MaTacGia": 216,
    "TenTacGia": "Nguyễn Thị Thanh Trúc"
  },
  {
    "MaTacGia": 217,
    "TenTacGia": "Nguyễn Trác Thức"
  },
  {
    "MaTacGia": 218,
    "TenTacGia": "Dương Kiều Hoa"
  },
  {
    "MaTacGia": 219,
    "TenTacGia": "Tôn Thất Hòa An"
  },
  {
    "MaTacGia": 220,
    "TenTacGia": "Trần Hạnh Nhi"
  },
  {
    "MaTacGia": 221,
    "TenTacGia": "Lê Khắc Nhiên Ân"
  },
  {
    "MaTacGia": 222,
    "TenTacGia": "Lê Hoàng Thái"
  },
  {
    "MaTacGia": 223,
    "TenTacGia": "Lê Hoài Bắc"
  },
  {
    "MaTacGia": 224,
    "TenTacGia": "Nguyễn Phương Thảo"
  },
  {
    "MaTacGia": 225,
    "TenTacGia": "Nguyễn Tấn Trần Minh Khang"
  },
  {
    "MaTacGia": 226,
    "TenTacGia": "Huỳnh Ngọc Tín"
  },
  {
    "MaTacGia": 227,
    "TenTacGia": "Nguyễn Minh Sơn"
  },
  {
    "MaTacGia": 228,
    "TenTacGia": "Nguyễn Trần Sơn"
  },
  {
    "MaTacGia": 229,
    "TenTacGia": "Trần Thị Như Nguyệt"
  },
  {
    "MaTacGia": 230,
    "TenTacGia": "Hồ Long Vân"
  },
  {
    "MaTacGia": 231,
    "TenTacGia": "Nguyễn Thịnh"
  },
  {
    "MaTacGia": 232,
    "TenTacGia": "Nguyễn Mạnh Cường"
  },
  {
    "MaTacGia": 233,
    "TenTacGia": "Nguyễn Bình Dương"
  },
  {
    "MaTacGia": 234,
    "TenTacGia": "Nguyễn Đăng Tỵ"
  },
  {
    "MaTacGia": 235,
    "TenTacGia": "Bùi Thanh Hiếu"
  },
  {
    "MaTacGia": 236,
    "TenTacGia": "Nguyễn Đức Thắng"
  },
  {
    "MaTacGia": 237,
    "TenTacGia": "Nguyễn Lưu Thùy Ngân"
  },
  {
    "MaTacGia": 238,
    "TenTacGia": "Ngô Quốc Hưng"
  },
  {
    "MaTacGia": 239,
    "TenTacGia": "Nghiêm Quốc Minh"
  },
  {
    "MaTacGia": 240,
    "TenTacGia": "Cao Thị Kim Tuyến"
  },
  {
    "MaTacGia": 241,
    "TenTacGia": "Nguyễn Văn Xanh"
  },
  {
    "MaTacGia": 242,
    "TenTacGia": "Đinh Đức Anh Vũ"
  },
  {
    "MaTacGia": 243,
    "TenTacGia": "Hồ Thị Kim Hoàng"
  },
  {
    "MaTacGia": 244,
    "TenTacGia": "Trịnh Quốc Sơn"
  },
  {
    "MaTacGia": 245,
    "TenTacGia": "Lê Thị Bích Khoa"
  },
  {
    "MaTacGia": 246,
    "TenTacGia": "Nguyễn Thị Trà Linh"
  },
  {
    "MaTacGia": 247,
    "TenTacGia": "Hầu Nguyễn Thành Nam"
  },
  {
    "MaTacGia": 248,
    "TenTacGia": "Cáp Phạm Đình Thăng"
  },
  {
    "MaTacGia": 249,
    "TenTacGia": "Lê Minh Trí"
  },
  {
    "MaTacGia": 250,
    "TenTacGia": "Nguyễn Phương Anh"
  },
  {
    "MaTacGia": 251,
    "TenTacGia": "Nguyễn Vĩnh Kha"
  },
  {
    "MaTacGia": 252,
    "TenTacGia": "Đỗ Văn Tiến"
  },
  {
    "MaTacGia": 253,
    "TenTacGia": "han Nguyệt Minh"
  },
  {
    "MaTacGia": 254,
    "TenTacGia": "Nguyễn Hoàng Vũ"
  },
  {
    "MaTacGia": 255,
    "TenTacGia": "Lê Văn La"
  },
  {
    "MaTacGia": 256,
    "TenTacGia": "Cao Văn Hưng"
  },
  {
    "MaTacGia": 257,
    "TenTacGia": "Lê Mạnh"
  }
];

export const SEED_TEXTBOOK_BOOKS: SachRow[] = [
  {
    "MaSach": "GT001",
    "TenSach": "Giáo trình các kỹ thuật học sâu và ứng dụng",
    "MaTheLoai": "A",
    "NamXuatBan": 2026,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2026-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 116",
    "AnhBia": "/resources/textbooks/gt_001.jpeg",
    "MoTa": "Vị trí: Kệ 116 | OPAC: opac.vnulib.edu.vn/record=b1437256~S1*vie | Bản điện tử (Online_116): ir.vnulib.edu.vn/handle/VNUHCM/41570"
  },
  {
    "MaSach": "GT002",
    "TenSach": "Giáo trình kỹ năng nghề nghiệp : kỹ năng giao tiếp và làm việc nhóm cho sinh viên lĩnh vực công nghệ thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2026,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2026-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 115",
    "AnhBia": "/resources/textbooks/gt_002.png",
    "MoTa": "Vị trí: Kệ 115 | OPAC: opac.vnulib.edu.vn/record=b1436768~S1*vie | Bản điện tử (Online_115): ir.vnulib.edu.vn/entities/publication/14cb9244-4c06-4013-8318-b8a09db68d1d"
  },
  {
    "MaSach": "GT003",
    "TenSach": "Tài liệu tham khảo các phương pháp lập trình hiện đại",
    "MaTheLoai": "A",
    "NamXuatBan": 2026,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2026-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 114",
    "AnhBia": "/resources/textbooks/gt_003.jpeg",
    "MoTa": "Vị trí: Kệ 114 | OPAC: opac.vnulib.edu.vn/record=b1436326~S1*vie | Bản điện tử (Online_114): ir.vnulib.edu.vn/handle/VNUHCM/40302"
  },
  {
    "MaSach": "GT004",
    "TenSach": "Thiết kế hệ thống SoC trên FPGA",
    "MaTheLoai": "A",
    "NamXuatBan": 2026,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2026-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 113",
    "AnhBia": "/resources/textbooks/gt_004.jpeg",
    "MoTa": "Vị trí: Kệ 113 | OPAC: opac.vnulib.edu.vn/record=b1435156~S1*vie | Bản điện tử (Online_113): ir.vnulib.edu.vn/handle/VNUHCM/39595"
  },
  {
    "MaSach": "GT005",
    "TenSach": "Toán cho công nghệ thông tin : sách chuyên khảo",
    "MaTheLoai": "A",
    "NamXuatBan": 2025,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2025-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 112",
    "AnhBia": "/resources/textbooks/gt_005.jpeg",
    "MoTa": "Vị trí: Kệ 112 | OPAC: opac.vnulib.edu.vn/record=b1432572~S1*vie | Bản điện tử (Online_112): ir.vnulib.edu.vn/handle/VNUHCM/38454"
  },
  {
    "MaSach": "GT006",
    "TenSach": "Lập trình symbolic trong trí tuệ nhân tạo",
    "MaTheLoai": "A",
    "NamXuatBan": 2025,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2025-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 111",
    "AnhBia": "/resources/textbooks/gt_006.jpeg",
    "MoTa": "Vị trí: Kệ 111 | OPAC: opac.vnulib.edu.vn/record=b1431834~S1*vie | Bản điện tử (Online_111): ir.vnulib.edu.vn/entities/publication/c7888299-d26d-412d-addf-807c138b6b35"
  },
  {
    "MaSach": "GT007",
    "TenSach": "Tài liệu hướng dẫn thực hành nhập môn lập trình",
    "MaTheLoai": "A",
    "NamXuatBan": 2025,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2025-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 110",
    "AnhBia": "/resources/textbooks/gt_007.jpeg",
    "MoTa": "Vị trí: Kệ 110 | OPAC: opac.vnulib.edu.vn/record=b1428562~S1*vie | Bản điện tử (Online_110): ir.vnulib.edu.vn/handle/VNUHCM/35976"
  },
  {
    "MaSach": "GT008",
    "TenSach": "Giáo trình phân tích dữ liệu kinh doanh",
    "MaTheLoai": "A",
    "NamXuatBan": 2025,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2025-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": true,
    "MaKeSach": "Kệ 109",
    "AnhBia": "/resources/textbooks/gt_008.jpeg",
    "MoTa": "Vị trí: Kệ 109 | OPAC: opac.vnulib.edu.vn/record=b1426606~S1*vie | Bản điện tử (Online_109): ir.vnulib.edu.vn/handle/VNUHCM/34974"
  },
  {
    "MaSach": "GT009",
    "TenSach": "Giải pháp công nghệ IoTs sử dụng kỹ thuật xử lý dữ liệu lớn và trí tuệ nhân tạo cho đô thị thông minh",
    "MaTheLoai": "A",
    "NamXuatBan": 2024,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2024-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 108",
    "AnhBia": "/resources/textbooks/gt_009.jpg",
    "MoTa": "Vị trí: Kệ 108 | OPAC: opac.vnulib.edu.vn/record=b1424304~S1*vie | Bản điện tử (Online_108): ir.vnulib.edu.vn/handle/VNUHCM/34715"
  },
  {
    "MaSach": "GT010",
    "TenSach": "Tài liệu hướng dẫn thực hành lập trình mạng căn bản",
    "MaTheLoai": "A",
    "NamXuatBan": 2024,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2024-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 107",
    "AnhBia": "/resources/textbooks/gt_010.jpg",
    "MoTa": "Vị trí: Kệ 107 | OPAC: opac.vnulib.edu.vn/record=b1423662~S17*vie | Bản điện tử (Online_107): ir.vnulib.edu.vn/handle/VNUHCM/34714"
  },
  {
    "MaSach": "GT011",
    "TenSach": "Phát triển ứng dụng web với Python, Django Và PostgreSQL",
    "MaTheLoai": "A",
    "NamXuatBan": 2024,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2024-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 106",
    "AnhBia": "/resources/textbooks/gt_011.jpg",
    "MoTa": "Vị trí: Kệ 106 | OPAC: opac.vnulib.edu.vn/record=b1423268~S17*vie | Bản điện tử (Online_106): ir.vnulib.edu.vn/handle/VNUHCM/34713"
  },
  {
    "MaSach": "GT012",
    "TenSach": "Tài liệu hướng dẫn thực hành nhập môn ứng dụng di động",
    "MaTheLoai": "A",
    "NamXuatBan": 2024,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2024-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 105",
    "AnhBia": "/resources/textbooks/gt_012.jpg",
    "MoTa": "Vị trí: Kệ 105 | OPAC: opac.vnulib.edu.vn/record=b1419097~S17*vie | Bản điện tử (Online_105): ir.vnulib.edu.vn/handle/VNUHCM/32865"
  },
  {
    "MaSach": "GT013",
    "TenSach": "Chính sách an toàn thông tin cho doanh nghiệp",
    "MaTheLoai": "A",
    "NamXuatBan": 2022,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2022-09-01",
    "TriGia": 120000,
    "MaNganh": "ATTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 104",
    "AnhBia": "/resources/textbooks/gt_013.jpg",
    "MoTa": "Vị trí: Kệ 104 | OPAC: opac.vnulib.edu.vn/record=b1418537~S17*vie | Bản điện tử (Online_104): ir.vnulib.edu.vn/handle/VNUHCM/32855"
  },
  {
    "MaSach": "GT014",
    "TenSach": "Toán mờ và ứng dụng",
    "MaTheLoai": "A",
    "NamXuatBan": 2024,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2024-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 103",
    "AnhBia": "/resources/textbooks/gt_014.jpg",
    "MoTa": "Vị trí: Kệ 103 | OPAC: opac.vnulib.edu.vn/record=b1416058~S17*vie | Bản điện tử (Online_103): ir.vnulib.edu.vn/handle/VNUHCM/31320"
  },
  {
    "MaSach": "GT015",
    "TenSach": "Tài liệu hướng dẫn thực hành hệ quản trị cơ sở dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2023,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2023-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 102",
    "AnhBia": "/resources/textbooks/gt_015.png",
    "MoTa": "Vị trí: Kệ 102 | OPAC: opac.vnulib.edu.vn/record=b1415888~S17*vie | Bản điện tử (Online_102): ir.vnulib.edu.vn/handle/VNUHCM/32863"
  },
  {
    "MaSach": "GT016",
    "TenSach": "Tài liệu hướng dẫn thực hành lập trình Java",
    "MaTheLoai": "A",
    "NamXuatBan": 2023,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2023-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 101",
    "AnhBia": "/resources/textbooks/gt_016.jpg",
    "MoTa": "Vị trí: Kệ 101 | OPAC: opac.vnulib.edu.vn/record=b1415693~S17*vie | Bản điện tử (Online_101): ir.vnulib.edu.vn/handle/VNUHCM/32861"
  },
  {
    "MaSach": "GT017",
    "TenSach": "Tài liệu hướng dẫn thực hành truyền dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2023,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2023-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 100",
    "AnhBia": "/resources/textbooks/gt_017.jpg",
    "MoTa": "Vị trí: Kệ 100 | OPAC: opac.vnulib.edu.vn/record=b1415692~S17*vie | Bản điện tử (Online_100): ir.vnulib.edu.vn/handle/VNUHCM/32864"
  },
  {
    "MaSach": "GT018",
    "TenSach": "Giáo trình thu thập và tiền xử lý dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2023,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2023-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 099",
    "AnhBia": "/resources/textbooks/gt_018.jpg",
    "MoTa": "Vị trí: Kệ 099 | OPAC: opac.vnulib.edu.vn/record=b1415406~S17*vie | Bản điện tử (Online_099): ir.vnulib.edu.vn/handle/VNUHCM/32862"
  },
  {
    "MaSach": "GT019",
    "TenSach": "Nhập môn bảo đảm và an ninh thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2022,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2022-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 098",
    "AnhBia": "/resources/textbooks/gt_019.jpg",
    "MoTa": "Vị trí: Kệ 098 | OPAC: opac.vnulib.edu.vn/record=b1414356~S17*vie | Bản điện tử (Online_098): ir.vnulib.edu.vn/handle/VNUHCM/32857"
  },
  {
    "MaSach": "GT020",
    "TenSach": "Nhập môn internet & công nghệ Web",
    "MaTheLoai": "A",
    "NamXuatBan": 2023,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2023-09-01",
    "TriGia": 120000,
    "MaNganh": "MMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 097",
    "AnhBia": "/resources/textbooks/gt_020.jpg",
    "MoTa": "Vị trí: Kệ 097 | OPAC: opac.vnulib.edu.vn/record=b1413901~S17*vie | Bản điện tử (Online_097): ir.vnulib.edu.vn/handle/VNUHCM/32859"
  },
  {
    "MaSach": "GT021",
    "TenSach": "Giáo trình kiến trúc máy tính",
    "MaTheLoai": "A",
    "NamXuatBan": 2023,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2023-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 096",
    "AnhBia": "/resources/textbooks/gt_021.jpg",
    "MoTa": "Vị trí: Kệ 096 | OPAC: opac.vnulib.edu.vn/record=b1410662~S17*vie | Bản điện tử (Online_096): ir.vnulib.edu.vn/handle/VNUHCM/16788"
  },
  {
    "MaSach": "GT022",
    "TenSach": "Quản lý thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2023,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2023-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 095",
    "AnhBia": "/resources/textbooks/gt_022.png",
    "MoTa": "Vị trí: Kệ 095 | OPAC: opac.vnulib.edu.vn/record=b1410504~S17*vie | Bản điện tử (Online_095): ir.vnulib.edu.vn/handle/VNUHCM/34871"
  },
  {
    "MaSach": "GT023",
    "TenSach": "Các hệ cơ sở tri thức",
    "MaTheLoai": "A",
    "NamXuatBan": 2022,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2022-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 094",
    "AnhBia": "/resources/textbooks/gt_023.png",
    "MoTa": "Vị trí: Kệ 094 | OPAC: opac.vnulib.edu.vn/record=b1409619~S17*vie | Bản điện tử (Online_094): ir.vnulib.edu.vn/handle/VNUHCM/15924"
  },
  {
    "MaSach": "GT024",
    "TenSach": "Giáo trình thiết kế hệ thống nhúng",
    "MaTheLoai": "A",
    "NamXuatBan": 2020,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2020-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 093",
    "AnhBia": "/resources/textbooks/gt_024.png",
    "MoTa": "Vị trí: Kệ 093 | OPAC: opac.vnulib.edu.vn/record=b1406510~S17*vie | Bản điện tử (Online_093): ir.vnulib.edu.vn/handle/VNUHCM/32858"
  },
  {
    "MaSach": "GT025",
    "TenSach": "Khai thác dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2022,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2022-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 092",
    "AnhBia": "/resources/textbooks/gt_025.jpg",
    "MoTa": "Vị trí: Kệ 092 | OPAC: opac.vnulib.edu.vn/record=b1406507~S17*vie | Bản điện tử (Online_092): ir.vnulib.edu.vn/handle/VNUHCM/15925"
  },
  {
    "MaSach": "GT026",
    "TenSach": "Nhập môn máy tính lượng tử",
    "MaTheLoai": "A",
    "NamXuatBan": 2021,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2021-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 091",
    "AnhBia": "/resources/textbooks/gt_026.jpg",
    "MoTa": "Vị trí: Kệ 091 | OPAC: opac.vnulib.edu.vn/record=b1363874~S17*vie | Bản điện tử (Online_091): ir.vnulib.edu.vn/handle/VNUHCM/8917"
  },
  {
    "MaSach": "GT027",
    "TenSach": "Tài liệu hướng dẫn thực hành thiết kế luận lý số",
    "MaTheLoai": "A",
    "NamXuatBan": 2021,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2021-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 090",
    "AnhBia": "/resources/textbooks/gt_027.jpg",
    "MoTa": "Vị trí: Kệ 090 | OPAC: opac.vnulib.edu.vn/record=b1363872~S17*vie | Bản điện tử (Online_090): ir.vnulib.edu.vn/handle/VNUHCM/8920"
  },
  {
    "MaSach": "GT028",
    "TenSach": "Xác suất và thống kê chuyên sâu",
    "MaTheLoai": "A",
    "NamXuatBan": 2022,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2022-09-01",
    "TriGia": 120000,
    "MaNganh": "KHDL",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 089",
    "AnhBia": "/resources/textbooks/gt_028.jpg",
    "MoTa": "Vị trí: Kệ 089 | OPAC: opac.vnulib.edu.vn/record=b1363551~S17*vie | Bản điện tử (Online_089): ir.vnulib.edu.vn/handle/VNUHCM/34820"
  },
  {
    "MaSach": "GT029",
    "TenSach": "Phương pháp tích hợp Ontology dựa trên lý thuyết đồng thuận",
    "MaTheLoai": "A",
    "NamXuatBan": 2021,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2021-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 088",
    "AnhBia": "/resources/textbooks/gt_029.jpg",
    "MoTa": "Vị trí: Kệ 088 | OPAC: opac.vnulib.edu.vn/record=b1363326~S17*vie | Bản điện tử (Online_088): ir.vnulib.edu.vn/handle/VNUHCM/8918"
  },
  {
    "MaSach": "GT030",
    "TenSach": "Công nghệ internet of things và ứng dụng",
    "MaTheLoai": "A",
    "NamXuatBan": 2021,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2021-09-01",
    "TriGia": 120000,
    "MaNganh": "MMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 087",
    "AnhBia": "/resources/textbooks/gt_030.jpg",
    "MoTa": "Vị trí: Kệ 087 | OPAC: opac.vnulib.edu.vn/record=b1363322~S17*vie | Bản điện tử (Online_087): ir.vnulib.edu.vn/handle/VNUHCM/8915"
  },
  {
    "MaSach": "GT031",
    "TenSach": "Tài liệu hướng dẫn thực hành nhập môn mạch số",
    "MaTheLoai": "A",
    "NamXuatBan": 2021,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2021-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 086",
    "AnhBia": "/resources/textbooks/gt_031.jpg",
    "MoTa": "Vị trí: Kệ 086 | OPAC: opac.vnulib.edu.vn/record=b1363324~S17*vie | Bản điện tử (Online_086): ir.vnulib.edu.vn/handle/VNUHCM/8919"
  },
  {
    "MaSach": "GT032",
    "TenSach": "Giáo trình nhập môn lập trình",
    "MaTheLoai": "A",
    "NamXuatBan": 2021,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2021-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 085",
    "AnhBia": "/resources/textbooks/gt_032.jpg",
    "MoTa": "Vị trí: Kệ 085 | OPAC: opac.vnulib.edu.vn/record=b1361897~S17*vie | Bản điện tử (Online_085): ir.vnulib.edu.vn/handle/VNUHCM/8916"
  },
  {
    "MaSach": "GT033",
    "TenSach": "Phát triển ứng dụng trên thiết bị di động",
    "MaTheLoai": "A",
    "NamXuatBan": 2020,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2020-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 084",
    "AnhBia": "/resources/textbooks/gt_033.jpg",
    "MoTa": "Vị trí: Kệ 084 | OPAC: opac.vnulib.edu.vn/record=b1345414~S17*vie | Bản điện tử (Online_084): ir.vnulib.edu.vn/handle/VNUHCM/34821"
  },
  {
    "MaSach": "GT034",
    "TenSach": "Hướng dẫn thực hành phát triển ứng dụng trên thiết bị di động",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 083",
    "AnhBia": "/resources/textbooks/gt_034.jpg",
    "MoTa": "Vị trí: Kệ 083 | OPAC: opac.vnulib.edu.vn/record=b1347079~S17*vie | Bản điện tử (Online_083): ir.vnulib.edu.vn/handle/VNUHCM/16693"
  },
  {
    "MaSach": "GT035",
    "TenSach": "Thiết kế luận lý số 2",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 082",
    "AnhBia": "/resources/textbooks/gt_035.jpg",
    "MoTa": "Vị trí: Kệ 082 | OPAC: opac.vnulib.edu.vn/record=b1347078~S17*vie | Bản điện tử (Online_082): ir.vnulib.edu.vn/handle/VNUHCM/8265"
  },
  {
    "MaSach": "GT036",
    "TenSach": "Phân tích thiết kế hệ thống thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 081",
    "AnhBia": "/resources/textbooks/gt_036.jpg",
    "MoTa": "Vị trí: Kệ 081 | OPAC: opac.vnulib.edu.vn/record=b1347077~S17*vie | Bản điện tử (Online_081): ir.vnulib.edu.vn/handle/VNUHCM/8264"
  },
  {
    "MaSach": "GT037",
    "TenSach": "Phân tích dữ liệu lớn",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "KHDL",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 080",
    "AnhBia": "/resources/textbooks/gt_037.jpg",
    "MoTa": "Vị trí: Kệ 080 | OPAC: opac.vnulib.edu.vn/record=b1347076~S17*vie | Bản điện tử (Online_080): ir.vnulib.edu.vn/handle/VNUHCM/8263"
  },
  {
    "MaSach": "GT038",
    "TenSach": "Hệ điều hành Linux",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 079",
    "AnhBia": "/resources/textbooks/gt_038.jpg",
    "MoTa": "Vị trí: Kệ 079 | OPAC: opac.vnulib.edu.vn/record=b1347059~S17*vie | Bản điện tử (Online_079): ir.vnulib.edu.vn/handle/VNUHCM/16201"
  },
  {
    "MaSach": "GT039",
    "TenSach": "Tài liệu hướng dẫn thực hành cơ sở dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 078",
    "AnhBia": "/resources/textbooks/gt_039.jpg",
    "MoTa": "Vị trí: Kệ 078 | OPAC: opac.vnulib.edu.vn/record=b1347057~S17*vie | Bản điện tử (Online_078): ir.vnulib.edu.vn/handle/VNUHCM/8912"
  },
  {
    "MaSach": "GT040",
    "TenSach": "Ẩn thông tin trong dữ liệu số và ứng dụng",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 077",
    "AnhBia": "/resources/textbooks/gt_040.jpg",
    "MoTa": "Vị trí: Kệ 077 | OPAC: opac.vnulib.edu.vn/record=b1347051~S17*vie | Bản điện tử (Online_077): ir.vnulib.edu.vn/handle/VNUHCM/8259"
  },
  {
    "MaSach": "GT041",
    "TenSach": "Lập trình nhúng trên thiết bị di động",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 076",
    "AnhBia": "/resources/textbooks/gt_041.jpg",
    "MoTa": "Vị trí: Kệ 076 | OPAC: opac.vnulib.edu.vn/record=b1347050~S17*vie | Bản điện tử (Online_076): ir.vnulib.edu.vn/handle/VNUHCM/8911"
  },
  {
    "MaSach": "GT042",
    "TenSach": "Đại số tuyến tính",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 075",
    "AnhBia": "/resources/textbooks/gt_042.jpg",
    "MoTa": "Vị trí: Kệ 075 | OPAC: opac.vnulib.edu.vn/record=b1347049~S17*vie | Bản điện tử (Online_075): ir.vnulib.edu.vn/handle/VNUHCM/8907"
  },
  {
    "MaSach": "GT043",
    "TenSach": "Tài liệu hướng dẫn thực hành hệ điều hành",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 074",
    "AnhBia": "/resources/textbooks/gt_043.jpg",
    "MoTa": "Vị trí: Kệ 074 | OPAC: opac.vnulib.edu.vn/record=b1347007~S17*vie | Bản điện tử (Online_074): ir.vnulib.edu.vn/handle/VNUHCM/16694"
  },
  {
    "MaSach": "GT044",
    "TenSach": "Cơ sở dữ liệu nâng cao : tài liệu tham khảo (Nosol - Newsol - Blockchain)",
    "MaTheLoai": "A",
    "NamXuatBan": 2019,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2019-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 073",
    "AnhBia": "/resources/textbooks/gt_044.jpg",
    "MoTa": "Vị trí: Kệ 073 | OPAC: opac.vnulib.edu.vn/record=b1347008~S17*vie | Bản điện tử (Online_073): ir.vnulib.edu.vn/handle/VNUHCM/8905"
  },
  {
    "MaSach": "GT045",
    "TenSach": "Lý thuyết đồ thị",
    "MaTheLoai": "A",
    "NamXuatBan": 2008,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 072",
    "AnhBia": "/resources/textbooks/gt_045.jpg",
    "MoTa": "Vị trí: Kệ 072 | OPAC: opac.vnulib.edu.vn/record=b1345790~S17*vie | Bản điện tử (Online_072): ir.vnulib.edu.vn/handle/VNUHCM/34969"
  },
  {
    "MaSach": "GT046",
    "TenSach": "Các kỹ thuật trong xử lý ngôn ngữ tự nhiên",
    "MaTheLoai": "A",
    "NamXuatBan": 2017,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2017-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 071",
    "AnhBia": "/resources/textbooks/gt_046.jpg",
    "MoTa": "Vị trí: Kệ 071 | OPAC: opac.vnulib.edu.vn/record=b1346847~S17*vie | Bản điện tử (Online_071): ir.vnulib.edu.vn/handle/VNUHCM/8248"
  },
  {
    "MaSach": "GT047",
    "TenSach": "Các hệ cơ sở tri thức",
    "MaTheLoai": "A",
    "NamXuatBan": 2017,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2017-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 070",
    "AnhBia": "/resources/textbooks/gt_047.jpg",
    "MoTa": "Vị trí: Kệ 070 | OPAC: opac.vnulib.edu.vn/record=b1346846~S17*vie | Bản điện tử (Online_070): ir.vnulib.edu.vn/handle/VNUHCM/8247"
  },
  {
    "MaSach": "GT048",
    "TenSach": "Các hệ suy diễn mờ",
    "MaTheLoai": "A",
    "NamXuatBan": 2017,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2017-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 069",
    "AnhBia": "/resources/textbooks/gt_048.jpg",
    "MoTa": "Vị trí: Kệ 069 | OPAC: opac.vnulib.edu.vn/record=b1346845~S17*vie | Bản điện tử (Online_069): ir.vnulib.edu.vn/handle/VNUHCM/8260"
  },
  {
    "MaSach": "GT049",
    "TenSach": "Khai phá dữ liệu (Data Mining)",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "KHDL",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 068",
    "AnhBia": "/resources/textbooks/gt_049.jpg",
    "MoTa": "Vị trí: Kệ 068 | OPAC: opac.vnulib.edu.vn/record=b1346844~S17*vie | Bản điện tử (Online_068): ir.vnulib.edu.vn/handle/VNUHCM/8904"
  },
  {
    "MaSach": "GT050",
    "TenSach": "Phân tích mạng xã hội và ứng dụng",
    "MaTheLoai": "A",
    "NamXuatBan": 2017,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2017-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 067",
    "AnhBia": "/resources/textbooks/gt_050.jpg",
    "MoTa": "Vị trí: Kệ 067 | OPAC: opac.vnulib.edu.vn/record=b1346842~S17*vie | Bản điện tử (Online_067): ir.vnulib.edu.vn/handle/VNUHCM/8262"
  },
  {
    "MaSach": "GT051",
    "TenSach": "Hướng dẫn giải bài tập xác suất và thống kê toán học",
    "MaTheLoai": "A",
    "NamXuatBan": 2017,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2017-09-01",
    "TriGia": 120000,
    "MaNganh": "KHDL",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 066",
    "AnhBia": "/resources/textbooks/gt_051.jpg",
    "MoTa": "Vị trí: Kệ 066 | OPAC: opac.vnulib.edu.vn/record=b1346841~S17*vie | Bản điện tử (Online_066): ir.vnulib.edu.vn/handle/VNUHCM/8261"
  },
  {
    "MaSach": "GT052",
    "TenSach": "Thiết kế cơ sở dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2012,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 065",
    "AnhBia": "/resources/textbooks/gt_052.jpg",
    "MoTa": "Vị trí: Kệ 065 | OPAC: opac.vnulib.edu.vn/record=b1346840~S17*vie | Bản điện tử (Online_065): ir.vnulib.edu.vn/handle/VNUHCM/8272"
  },
  {
    "MaSach": "GT053",
    "TenSach": "Xử lý ngôn ngữ tự nhiên",
    "MaTheLoai": "A",
    "NamXuatBan": 2017,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2017-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 064",
    "AnhBia": "/resources/textbooks/gt_053.jpg",
    "MoTa": "Vị trí: Kệ 064 | OPAC: opac.vnulib.edu.vn/record=b1346839~S17*vie | Bản điện tử (Online_064): ir.vnulib.edu.vn/handle/VNUHCM/8254"
  },
  {
    "MaSach": "GT054",
    "TenSach": "Hoạch định nguồn lực doanh nghiệp - ERP",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 063",
    "AnhBia": "/resources/textbooks/gt_054.jpg",
    "MoTa": "Vị trí: Kệ 063 | OPAC: opac.vnulib.edu.vn/record=b1346838~S17*vie | Bản điện tử (Online_063): ir.vnulib.edu.vn/handle/VNUHCM/8255"
  },
  {
    "MaSach": "GT055",
    "TenSach": "Pháp chứng kỹ thuật số",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 062",
    "AnhBia": "/resources/textbooks/gt_055.jpg",
    "MoTa": "Vị trí: Kệ 062 | OPAC: opac.vnulib.edu.vn/record=b1346837~S17*vie | Bản điện tử (Online_062): ir.vnulib.edu.vn/handle/VNUHCM/8258"
  },
  {
    "MaSach": "GT056",
    "TenSach": "Phát triển phần mềm mã nguồn mở",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 060",
    "AnhBia": "/resources/textbooks/gt_056.jpg",
    "MoTa": "Vị trí: Kệ 060 | OPAC: opac.vnulib.edu.vn/record=b1346835~S17*vie | Bản điện tử (Online_060): ir.vnulib.edu.vn/handle/VNUHCM/8251"
  },
  {
    "MaSach": "GT057",
    "TenSach": "Tài liệu hướng dẫn thực hành lập trình hướng đối tượng",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 059",
    "AnhBia": "/resources/textbooks/gt_057.jpg",
    "MoTa": "Vị trí: Kệ 059 | OPAC: opac.vnulib.edu.vn/record=b1346834~S17*vie | Bản điện tử (Online_059): ir.vnulib.edu.vn/handle/VNUHCM/8257"
  },
  {
    "MaSach": "GT058",
    "TenSach": "Xử lý ảnh",
    "MaTheLoai": "A",
    "NamXuatBan": 2010,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 058",
    "AnhBia": "/resources/textbooks/gt_058.jpg",
    "MoTa": "Vị trí: Kệ 058 | OPAC: opac.vnulib.edu.vn/record=b1345798~S17*vie | Bản điện tử (Online_058): ir.vnulib.edu.vn/handle/VNUHCM/34858"
  },
  {
    "MaSach": "GT059",
    "TenSach": "Quản lý dự án công nghệ thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2010,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KTPM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 057",
    "AnhBia": "/resources/textbooks/gt_059.jpg",
    "MoTa": "Vị trí: Kệ 057 | OPAC: opac.vnulib.edu.vn/record=b1345776~S17*vie | Bản điện tử (Online_057): ir.vnulib.edu.vn/handle/VNUHCM/16698"
  },
  {
    "MaSach": "GT060",
    "TenSach": "Đồ họa máy tính",
    "MaTheLoai": "A",
    "NamXuatBan": 2010,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "TTDPT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 056",
    "AnhBia": "/resources/textbooks/gt_060.jpg",
    "MoTa": "Vị trí: Kệ 056 | OPAC: opac.vnulib.edu.vn/record=b1345817~S17*vie | Bản điện tử (Online_056): ir.vnulib.edu.vn/handle/VNUHCM/34856"
  },
  {
    "MaSach": "GT061",
    "TenSach": "Các hệ cơ sở tri thức",
    "MaTheLoai": "A",
    "NamXuatBan": 2012,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 055",
    "AnhBia": "/resources/textbooks/gt_061.jpg",
    "MoTa": "Vị trí: Kệ 055 | OPAC: opac.vnulib.edu.vn/record=b1345808~S17*vie | Bản điện tử (Online_055): ir.vnulib.edu.vn/handle/VNUHCM/34859"
  },
  {
    "MaSach": "GT062",
    "TenSach": "Nhập môn trí tuệ nhân tạo",
    "MaTheLoai": "A",
    "NamXuatBan": 2011,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 054",
    "AnhBia": "/resources/textbooks/gt_062.jpg",
    "MoTa": "Vị trí: Kệ 054 | OPAC: opac.vnulib.edu.vn/record=b1345793~S17*vie | Bản điện tử (Online_054): ir.vnulib.edu.vn/handle/VNUHCM/8245"
  },
  {
    "MaSach": "GT063",
    "TenSach": "Khai thác dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2013,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2013-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 053",
    "AnhBia": "/resources/textbooks/gt_063.jpg",
    "MoTa": "Vị trí: Kệ 053 | OPAC: opac.vnulib.edu.vn/record=b1345786~S17*vie | Bản điện tử (Online_053): ir.vnulib.edu.vn/handle/VNUHCM/34861"
  },
  {
    "MaSach": "GT064",
    "TenSach": "Hệ thống nhúng",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 052",
    "AnhBia": "/resources/textbooks/gt_064.jpg",
    "MoTa": "Vị trí: Kệ 052 | OPAC: opac.vnulib.edu.vn/record=b1346833~S17*vie | Bản điện tử (Online_052): ir.vnulib.edu.vn/handle/VNUHCM/8903"
  },
  {
    "MaSach": "GT065",
    "TenSach": "Một số vấn đề chọn lọc về toán cho công nghệ thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 051",
    "AnhBia": "/resources/textbooks/gt_065.jpg",
    "MoTa": "Vị trí: Kệ 051 | OPAC: opac.vnulib.edu.vn/record=b1346236~S17*vie | Bản điện tử (Online_051): ir.vnulib.edu.vn/handle/VNUHCM/8250"
  },
  {
    "MaSach": "GT066",
    "TenSach": "Hướng dẫn giải bài tập toán giải tích",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 050",
    "AnhBia": "/resources/textbooks/gt_066.jpg",
    "MoTa": "Vị trí: Kệ 050 | OPAC: opac.vnulib.edu.vn/record=b1346235~S17*vie | Bản điện tử (Online_050): ir.vnulib.edu.vn/handle/VNUHCM/8256"
  },
  {
    "MaSach": "GT067",
    "TenSach": "Vi điều khiển",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 049",
    "AnhBia": "/resources/textbooks/gt_067.jpg",
    "MoTa": "Vị trí: Kệ 049 | OPAC: opac.vnulib.edu.vn/record=b1346234~S17*vie | Bản điện tử (Online_049): ir.vnulib.edu.vn/handle/VNUHCM/8249"
  },
  {
    "MaSach": "GT068",
    "TenSach": "Giáo trình xác suất thống kê",
    "MaTheLoai": "A",
    "NamXuatBan": 2008,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KHDL",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 048",
    "AnhBia": "/resources/textbooks/gt_068.jpg",
    "MoTa": "Vị trí: Kệ 048 | OPAC: opac.vnulib.edu.vn/record=b1345799~S17*vie | Bản điện tử (Online_048): ir.vnulib.edu.vn/handle/VNUHCM/16177"
  },
  {
    "MaSach": "GT069",
    "TenSach": "Lập trình C trên Windows",
    "MaTheLoai": "A",
    "NamXuatBan": 2010,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 047",
    "AnhBia": "/resources/textbooks/gt_069.jpg",
    "MoTa": "Vị trí: Kệ 047 | OPAC: opac.vnulib.edu.vn/record=b1345801~S17*vie | Bản điện tử (Online_047): ir.vnulib.edu.vn/handle/VNUHCM/16240"
  },
  {
    "MaSach": "GT070",
    "TenSach": "Giáo trình nhập môn công nghệ phần mềm",
    "MaTheLoai": "A",
    "NamXuatBan": 2011,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KTPM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 046",
    "AnhBia": "/resources/textbooks/gt_070.jpg",
    "MoTa": "Vị trí: Kệ 046 | OPAC: opac.vnulib.edu.vn/record=b1345814~S17*vie | Bản điện tử (Online_046): ir.vnulib.edu.vn/handle/VNUHCM/16175"
  },
  {
    "MaSach": "GT071",
    "TenSach": "Phân tích hệ thống hướng đối tượng với UML",
    "MaTheLoai": "A",
    "NamXuatBan": 2011,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KTPM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 045",
    "AnhBia": "/resources/textbooks/gt_071.jpg",
    "MoTa": "Vị trí: Kệ 045 | OPAC: opac.vnulib.edu.vn/record=b1345804~S17*vie | Bản điện tử (Online_045): ir.vnulib.edu.vn/handle/VNUHCM/8270"
  },
  {
    "MaSach": "GT072",
    "TenSach": "Kiến trúc máy tính",
    "MaTheLoai": "A",
    "NamXuatBan": 2011,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 044",
    "AnhBia": "/resources/textbooks/gt_072.jpg",
    "MoTa": "Vị trí: Kệ 044 | OPAC: opac.vnulib.edu.vn/record=b1345783~S17*vie | Bản điện tử (Online_044): ir.vnulib.edu.vn/handle/VNUHCM/16229"
  },
  {
    "MaSach": "GT073",
    "TenSach": "Hệ điều hành",
    "MaTheLoai": "A",
    "NamXuatBan": 2010,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 043",
    "AnhBia": "/resources/textbooks/gt_073.jpg",
    "MoTa": "Vị trí: Kệ 043 | OPAC: opac.vnulib.edu.vn/record=b1345800~S17*vie | Bản điện tử (Online_043): ir.vnulib.edu.vn/handle/VNUHCM/16178"
  },
  {
    "MaSach": "GT074",
    "TenSach": "Giáo trình tin học đại cương A2",
    "MaTheLoai": "A",
    "NamXuatBan": 2013,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2013-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 042",
    "AnhBia": "/resources/textbooks/gt_074.jpg",
    "MoTa": "Vị trí: Kệ 042 | OPAC: opac.vnulib.edu.vn/record=b1345819~S17*vie | Bản điện tử (Online_042): ir.vnulib.edu.vn/handle/VNUHCM/8242"
  },
  {
    "MaSach": "GT075",
    "TenSach": "Giáo trình lập trình java",
    "MaTheLoai": "A",
    "NamXuatBan": 2012,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 041",
    "AnhBia": "/resources/textbooks/gt_075.jpg",
    "MoTa": "Vị trí: Kệ 041 | OPAC: opac.vnulib.edu.vn/record=b1345818~S17*vie | Bản điện tử (Online_041): ir.vnulib.edu.vn/handle/VNUHCM/6663"
  },
  {
    "MaSach": "GT076",
    "TenSach": "Thiết kế vi mạch số",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 040",
    "AnhBia": "/resources/textbooks/gt_076.jpg",
    "MoTa": "Vị trí: Kệ 040 | OPAC: opac.vnulib.edu.vn/record=b1346230~S17*vie | Bản điện tử (Online_040): ir.vnulib.edu.vn/handle/VNUHCM/8252"
  },
  {
    "MaSach": "GT077",
    "TenSach": "Biểu diễn tri thức và suy luận",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 039",
    "AnhBia": "/resources/textbooks/gt_077.jpg",
    "MoTa": "Vị trí: Kệ 039 | OPAC: opac.vnulib.edu.vn/record=b1346231~S17*vie | Bản điện tử (Online_039): ir.vnulib.edu.vn/handle/VNUHCM/8902"
  },
  {
    "MaSach": "GT078",
    "TenSach": "Tài liệu hướng dẫn thực hành kiến trúc máy tính nâng cao",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 038",
    "AnhBia": "/resources/textbooks/gt_078.jpg",
    "MoTa": "Vị trí: Kệ 038 | OPAC: opac.vnulib.edu.vn/record=b1346233~S17*vie | Bản điện tử (Online_038): ir.vnulib.edu.vn/handle/VNUHCM/16238"
  },
  {
    "MaSach": "GT079",
    "TenSach": "Tài liệu hướng dẫn thực hành trí tuệ nhân tạo",
    "MaTheLoai": "A",
    "NamXuatBan": 2016,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2016-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 037",
    "AnhBia": "/resources/textbooks/gt_079.jpg",
    "MoTa": "Vị trí: Kệ 037 | OPAC: opac.vnulib.edu.vn/record=b1346232~S17*vie | Bản điện tử (Online_037): ir.vnulib.edu.vn/handle/VNUHCM/8253"
  },
  {
    "MaSach": "GT080",
    "TenSach": "Đồ họa ứng dụng",
    "MaTheLoai": "A",
    "NamXuatBan": 2005,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "TTDPT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 036",
    "AnhBia": "/resources/textbooks/gt_080.jpg",
    "MoTa": "Vị trí: Kệ 036 | OPAC: opac.vnulib.edu.vn/record=b1345777~S17*vie | Bản điện tử (Online_036): ir.vnulib.edu.vn/handle/VNUHCM/17054"
  },
  {
    "MaSach": "GT081",
    "TenSach": "Toán cao cấp A2",
    "MaTheLoai": "A",
    "NamXuatBan": 2012,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 035",
    "AnhBia": "/resources/textbooks/gt_081.jpg",
    "MoTa": "Vị trí: Kệ 035 | OPAC: opac.vnulib.edu.vn/record=b1345803~S17*vie | Bản điện tử (Online_035): ir.vnulib.edu.vn/handle/VNUHCM/17050"
  },
  {
    "MaSach": "GT082",
    "TenSach": "Phân tích thiết kế hệ thống thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2008,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 034",
    "AnhBia": "/resources/textbooks/gt_082.jpg",
    "MoTa": "Vị trí: Kệ 034 | OPAC: opac.vnulib.edu.vn/record=b1345782~S17*vie | Bản điện tử (Online_034): ir.vnulib.edu.vn/handle/VNUHCM/34855"
  },
  {
    "MaSach": "GT083",
    "TenSach": "Mạng máy tính",
    "MaTheLoai": "A",
    "NamXuatBan": 2010,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "MMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 033",
    "AnhBia": "/resources/textbooks/gt_083.jpg",
    "MoTa": "Vị trí: Kệ 033 | OPAC: opac.vnulib.edu.vn/record=b1345792~S17*vie | Bản điện tử (Online_033): ir.vnulib.edu.vn/handle/VNUHCM/16692"
  },
  {
    "MaSach": "GT084",
    "TenSach": "Cơ sở dữ liệu",
    "MaTheLoai": "A",
    "NamXuatBan": 2010,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 032",
    "AnhBia": "/resources/textbooks/gt_084.jpg",
    "MoTa": "Vị trí: Kệ 032 | OPAC: opac.vnulib.edu.vn/record=b1345795~S17*vie | Bản điện tử (Online_032): ir.vnulib.edu.vn/handle/VNUHCM/16145"
  },
  {
    "MaSach": "GT085",
    "TenSach": "Lập trình hướng đối tượng",
    "MaTheLoai": "A",
    "NamXuatBan": 2011,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2012-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 031",
    "AnhBia": "/resources/textbooks/gt_085.jpg",
    "MoTa": "Vị trí: Kệ 031 | OPAC: opac.vnulib.edu.vn/record=b1345784~S17*vie | Bản điện tử (Online_031): ir.vnulib.edu.vn/handle/VNUHCM/16691"
  },
  {
    "MaSach": "GT086",
    "TenSach": "Lập trình hệ thống với Java",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 030",
    "AnhBia": "/resources/textbooks/gt_086.jpg",
    "MoTa": "Vị trí: Kệ 030 | OPAC: opac.vnulib.edu.vn/record=b1345787~S17*vie | Bản điện tử (Online_030): ir.vnulib.edu.vn/handle/VNUHCM/34970"
  },
  {
    "MaSach": "GT087",
    "TenSach": "Tin học đại cương",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 029",
    "AnhBia": "/resources/textbooks/gt_087.jpg",
    "MoTa": "Vị trí: Kệ 029 | OPAC: opac.vnulib.edu.vn/record=b1345813~S17*vie | Bản điện tử (Online_029): ir.vnulib.edu.vn/handle/VNUHCM/34865"
  },
  {
    "MaSach": "GT088",
    "TenSach": "Toán rời rạc",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 028",
    "AnhBia": "/resources/textbooks/gt_088.jpg",
    "MoTa": "Vị trí: Kệ 028 | OPAC: opac.vnulib.edu.vn/record=b1345785~S17*vie | Bản điện tử (Online_028): ir.vnulib.edu.vn/handle/VNUHCM/34839"
  },
  {
    "MaSach": "GT089",
    "TenSach": "Dịch máy",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 027",
    "AnhBia": "/resources/textbooks/gt_089.jpg",
    "MoTa": "Vị trí: Kệ 027 | OPAC: opac.vnulib.edu.vn/record=b1346214~S17*vie | Bản điện tử (Online_027): ir.vnulib.edu.vn/handle/VNUHCM/8866"
  },
  {
    "MaSach": "GT090",
    "TenSach": "Hướng dẫn thực hành Arcmap",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 026",
    "AnhBia": "/resources/textbooks/gt_090.jpg",
    "MoTa": "Vị trí: Kệ 026 | OPAC: opac.vnulib.edu.vn/record=b1346213~S17*vie | Bản điện tử (Online_026): ir.vnulib.edu.vn/handle/VNUHCM/8830"
  },
  {
    "MaSach": "GT091",
    "TenSach": "Giáo trình ngôn ngữ học máy tính",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 025",
    "AnhBia": "/resources/textbooks/gt_091.jpg",
    "MoTa": "Vị trí: Kệ 025 | OPAC: opac.vnulib.edu.vn/record=b1346212~S17*vie | Bản điện tử (Online_025): ir.vnulib.edu.vn/handle/VNUHCM/8872"
  },
  {
    "MaSach": "GT092",
    "TenSach": "Giáo trình lý thuyết mạch điện",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 024",
    "AnhBia": "/resources/textbooks/gt_092.jpg",
    "MoTa": "Vị trí: Kệ 024 | OPAC: opac.vnulib.edu.vn/record=b1346211~S17*vie | Bản điện tử (Online_024): ir.vnulib.edu.vn/handle/VNUHCM/8868"
  },
  {
    "MaSach": "GT093",
    "TenSach": "Thiết kế luận lý số",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 023",
    "AnhBia": "/resources/textbooks/gt_093.jpg",
    "MoTa": "Vị trí: Kệ 023 | OPAC: opac.vnulib.edu.vn/record=b1345789~S17*vie | Bản điện tử (Online_023): ir.vnulib.edu.vn/handle/VNUHCM/8901"
  },
  {
    "MaSach": "GT094",
    "TenSach": "Giáo trình cấu trúc dữ liệu và giải thuật",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 022",
    "AnhBia": "/resources/textbooks/gt_094.jpg",
    "MoTa": "Vị trí: Kệ 022 | OPAC: opac.vnulib.edu.vn/record=b1346210~S17*vie | Bản điện tử (Online_022): ir.vnulib.edu.vn/handle/VNUHCM/8861"
  },
  {
    "MaSach": "GT095",
    "TenSach": "Công nghệ thông tin trong thương mại điện tử",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 021",
    "AnhBia": "/resources/textbooks/gt_095.jpg",
    "MoTa": "Vị trí: Kệ 021 | OPAC: opac.vnulib.edu.vn/record=b1345807~S17*vie | Bản điện tử (Online_021): ir.vnulib.edu.vn/handle/VNUHCM/16146"
  },
  {
    "MaSach": "GT096",
    "TenSach": "Giáo trình phát triển ứng dụng Web",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 020",
    "AnhBia": "/resources/textbooks/gt_096.jpg",
    "MoTa": "Vị trí: Kệ 020 | OPAC: opac.vnulib.edu.vn/record=b1345802~S17*vie | Bản điện tử (Online_020): ir.vnulib.edu.vn/handle/VNUHCM/8876"
  },
  {
    "MaSach": "GT097",
    "TenSach": "Hệ quản trị cơ sở dữ liệu với Oracle",
    "MaTheLoai": "A",
    "NamXuatBan": 2013,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2013-09-01",
    "TriGia": 120000,
    "MaNganh": "HTTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 019",
    "AnhBia": "/resources/textbooks/gt_097.jpg",
    "MoTa": "Vị trí: Kệ 019 | OPAC: opac.vnulib.edu.vn/record=b1345778~S17*vie | Bản điện tử (Online_019): ir.vnulib.edu.vn/handle/VNUHCM/16200"
  },
  {
    "MaSach": "GT098",
    "TenSach": "Tài liệu hướng dẫn thực hành lập trình symbolic trong trí tuệ nhân tạo",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "TTNT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 018",
    "AnhBia": "/resources/textbooks/gt_098.jpg",
    "MoTa": "Vị trí: Kệ 018 | OPAC: opac.vnulib.edu.vn/record=b1345809~S17*vie | Bản điện tử (Online_018): ir.vnulib.edu.vn/handle/VNUHCM/8827"
  },
  {
    "MaSach": "GT099",
    "TenSach": "Toán cao cấp A3",
    "MaTheLoai": "A",
    "NamXuatBan": 2013,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2013-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 017",
    "AnhBia": "/resources/textbooks/gt_099.jpg",
    "MoTa": "Vị trí: Kệ 017 | OPAC: opac.vnulib.edu.vn/record=b1345781~S17*vie | Bản điện tử (Online_017): ir.vnulib.edu.vn/handle/VNUHCM/17052"
  },
  {
    "MaSach": "GT100",
    "TenSach": "Toán cao cấp A1",
    "MaTheLoai": "A",
    "NamXuatBan": 2013,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2013-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 016",
    "AnhBia": "/resources/textbooks/gt_100.jpg",
    "MoTa": "Vị trí: Kệ 016 | OPAC: opac.vnulib.edu.vn/record=b1345780~S17*vie | Bản điện tử (Online_016): ir.vnulib.edu.vn/handle/VNUHCM/17049"
  },
  {
    "MaSach": "GT101",
    "TenSach": "Giáo trình đặc tả hình thức",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 015",
    "AnhBia": "/resources/textbooks/gt_101.jpg",
    "MoTa": "Vị trí: Kệ 015 | OPAC: opac.vnulib.edu.vn/record=b1345797~S17*vie | Bản điện tử (Online_015): ir.vnulib.edu.vn/handle/VNUHCM/8825"
  },
  {
    "MaSach": "GT102",
    "TenSach": "Giáo trình nhập môn phát triển game",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 014",
    "AnhBia": "/resources/textbooks/gt_102.jpg",
    "MoTa": "Vị trí: Kệ 014 | OPAC: opac.vnulib.edu.vn/record=b1345794~S17*vie | Bản điện tử (Online_014): ir.vnulib.edu.vn/handle/VNUHCM/7992"
  },
  {
    "MaSach": "GT103",
    "TenSach": "Tài liệu hướng dẫn thực hành quản trị dự án công nghệ thông tin",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 013",
    "AnhBia": "/resources/textbooks/gt_103.jpg",
    "MoTa": "Vị trí: Kệ 013 | OPAC: opac.vnulib.edu.vn/record=b1345791~S17*vie | Bản điện tử (Online_013): ir.vnulib.edu.vn/handle/VNUHCM/8852"
  },
  {
    "MaSach": "GT104",
    "TenSach": "Tài liệu hướng dẫn thực hành công nghệ .NET",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 012",
    "AnhBia": "/resources/textbooks/gt_104.jpg",
    "MoTa": "Vị trí: Kệ 012 | OPAC: opac.vnulib.edu.vn/record=b1345820~S17*vie | Bản điện tử (Online_012): ir.vnulib.edu.vn/handle/VNUHCM/8842"
  },
  {
    "MaSach": "GT105",
    "TenSach": "Tài liệu hướng dẫn thực hành công nghệ web ASP.NET",
    "MaTheLoai": "A",
    "NamXuatBan": 2015,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2015-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 011",
    "AnhBia": "/resources/textbooks/gt_105.jpg",
    "MoTa": "Vị trí: Kệ 011 | OPAC: opac.vnulib.edu.vn/record=b1345815~S17*vie | Bản điện tử (Online_011): ir.vnulib.edu.vn/handle/VNUHCM/8826"
  },
  {
    "MaSach": "GT106",
    "TenSach": "Tài liệu hướng dẫn thực hành chuyên đề J2EE/JEE",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 010",
    "AnhBia": "/resources/textbooks/gt_106.jpg",
    "MoTa": "Vị trí: Kệ 010 | OPAC: opac.vnulib.edu.vn/record=b1345796~S17*vie | Bản điện tử (Online_010): ir.vnulib.edu.vn/handle/VNUHCM/8845"
  },
  {
    "MaSach": "GT107",
    "TenSach": "Lập trình nhúng căn bản",
    "MaTheLoai": "A",
    "NamXuatBan": 2017,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2017-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 009",
    "AnhBia": "/resources/textbooks/gt_107.jpg",
    "MoTa": "Vị trí: Kệ 009 | OPAC: opac.vnulib.edu.vn/record=b1019544~S17*vie | Bản điện tử (Online_009): ir.vnulib.edu.vn/handle/VNUHCM/7428"
  },
  {
    "MaSach": "GT108",
    "TenSach": "Tài liệu hướng dẫn thực hành lập trình nhúng căn bản",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 008",
    "AnhBia": "/resources/textbooks/gt_108.jpg",
    "MoTa": "Vị trí: Kệ 008 | OPAC: opac.vnulib.edu.vn/record=b1345816~S17*vie | Bản điện tử (Online_008): ir.vnulib.edu.vn/handle/VNUHCM/8092"
  },
  {
    "MaSach": "GT109",
    "TenSach": "Tài liệu hướng dẫn thực hành lập trình trên thiết bị di động",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 007",
    "AnhBia": "/resources/textbooks/gt_109.jpg",
    "MoTa": "Vị trí: Kệ 007 | OPAC: opac.vnulib.edu.vn/record=b1345806~S17*vie | Bản điện tử (Online_007): ir.vnulib.edu.vn/handle/VNUHCM/8831"
  },
  {
    "MaSach": "GT110",
    "TenSach": "Tài Liệu Hướng Dẫn Thực Hành Lập Trình Môi Trường Windows",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "KHMT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 006",
    "AnhBia": "/resources/textbooks/gt_110.jpg",
    "MoTa": "Vị trí: Kệ 006 | OPAC: opac.vnulib.edu.vn/record=b1345811~S17*vie | Bản điện tử (Online_006): ir.vnulib.edu.vn/handle/VNUHCM/8095"
  },
  {
    "MaSach": "GT111",
    "TenSach": "Tài liệu hướng dẫn thực hành điện - điện tử cơ bản",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 005",
    "AnhBia": "/resources/textbooks/gt_111.jpg",
    "MoTa": "Vị trí: Kệ 005 | OPAC: opac.vnulib.edu.vn/record=b1345812~S17*vie | Bản điện tử (Online_005): ir.vnulib.edu.vn/handle/VNUHCM/8094"
  },
  {
    "MaSach": "GT112",
    "TenSach": "Tài liệu hướng dẫn thực hành mạch số và thiết kế mạch số với verilog",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 004",
    "AnhBia": "/resources/textbooks/gt_112.jpg",
    "MoTa": "Vị trí: Kệ 004 | OPAC: opac.vnulib.edu.vn/record=b1345805~S17*vie | Bản điện tử (Online_004): ir.vnulib.edu.vn/handle/VNUHCM/8093"
  },
  {
    "MaSach": "GT113",
    "TenSach": "Linh kiện điện tử và vi mạch điện tử",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 003",
    "AnhBia": "/resources/textbooks/gt_113.jpg",
    "MoTa": "Vị trí: Kệ 003 | OPAC: opac.vnulib.edu.vn/record=b1345779~S17*vie | Bản điện tử (Online_003): ir.vnulib.edu.vn/handle/VNUHCM/16169"
  },
  {
    "MaSach": "GT114",
    "TenSach": "Thực hành xử lý tín hiệu số",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "CNTT",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 002",
    "AnhBia": "/resources/textbooks/gt_114.jpg",
    "MoTa": "Vị trí: Kệ 002 | OPAC: opac.vnulib.edu.vn/record=b1345788~S17*vie | Bản điện tử (Online_002): ir.vnulib.edu.vn/handle/VNUHCM/16697"
  },
  {
    "MaSach": "GT115",
    "TenSach": "Ngôn ngữ lập trình phần cứng verilog",
    "MaTheLoai": "A",
    "NamXuatBan": 2014,
    "NhaXuatBan": "NXB ĐHQG-HCM / Lưu hành nội bộ UIT",
    "NgayNhap": "2014-09-01",
    "TriGia": 120000,
    "MaNganh": "TKVM",
    "NgonNgu": "Tiếng Việt",
    "NguonTaiLieu": "Giáo trình UIT",
    "NoiBat": false,
    "MaKeSach": "Kệ 001",
    "AnhBia": "/resources/textbooks/gt_115.jpg",
    "MoTa": "Vị trí: Kệ 001 | OPAC: opac.vnulib.edu.vn/record=b1345810~S17*vie | Bản điện tử (Online_001): ir.vnulib.edu.vn/handle/VNUHCM/34971"
  }
];

export const SEED_TEXTBOOK_BOOK_AUTHORS: SachTacGiaRow[] = [
  {
    "MaSachTacGia": 201,
    "MaSach": "GT001",
    "MaTacGia": 101
  },
  {
    "MaSachTacGia": 202,
    "MaSach": "GT001",
    "MaTacGia": 102
  },
  {
    "MaSachTacGia": 203,
    "MaSach": "GT001",
    "MaTacGia": 103
  },
  {
    "MaSachTacGia": 204,
    "MaSach": "GT002",
    "MaTacGia": 104
  },
  {
    "MaSachTacGia": 205,
    "MaSach": "GT002",
    "MaTacGia": 105
  },
  {
    "MaSachTacGia": 206,
    "MaSach": "GT003",
    "MaTacGia": 106
  },
  {
    "MaSachTacGia": 207,
    "MaSach": "GT003",
    "MaTacGia": 107
  },
  {
    "MaSachTacGia": 208,
    "MaSach": "GT004",
    "MaTacGia": 108
  },
  {
    "MaSachTacGia": 209,
    "MaSach": "GT004",
    "MaTacGia": 109
  },
  {
    "MaSachTacGia": 210,
    "MaSach": "GT004",
    "MaTacGia": 110
  },
  {
    "MaSachTacGia": 211,
    "MaSach": "GT005",
    "MaTacGia": 111
  },
  {
    "MaSachTacGia": 212,
    "MaSach": "GT006",
    "MaTacGia": 112
  },
  {
    "MaSachTacGia": 213,
    "MaSach": "GT006",
    "MaTacGia": 113
  },
  {
    "MaSachTacGia": 214,
    "MaSach": "GT006",
    "MaTacGia": 114
  },
  {
    "MaSachTacGia": 215,
    "MaSach": "GT006",
    "MaTacGia": 115
  },
  {
    "MaSachTacGia": 216,
    "MaSach": "GT006",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 217,
    "MaSach": "GT007",
    "MaTacGia": 117
  },
  {
    "MaSachTacGia": 218,
    "MaSach": "GT007",
    "MaTacGia": 118
  },
  {
    "MaSachTacGia": 219,
    "MaSach": "GT007",
    "MaTacGia": 119
  },
  {
    "MaSachTacGia": 220,
    "MaSach": "GT007",
    "MaTacGia": 120
  },
  {
    "MaSachTacGia": 221,
    "MaSach": "GT007",
    "MaTacGia": 121
  },
  {
    "MaSachTacGia": 222,
    "MaSach": "GT008",
    "MaTacGia": 122
  },
  {
    "MaSachTacGia": 223,
    "MaSach": "GT008",
    "MaTacGia": 123
  },
  {
    "MaSachTacGia": 224,
    "MaSach": "GT008",
    "MaTacGia": 124
  },
  {
    "MaSachTacGia": 225,
    "MaSach": "GT008",
    "MaTacGia": 125
  },
  {
    "MaSachTacGia": 226,
    "MaSach": "GT009",
    "MaTacGia": 126
  },
  {
    "MaSachTacGia": 227,
    "MaSach": "GT009",
    "MaTacGia": 127
  },
  {
    "MaSachTacGia": 228,
    "MaSach": "GT009",
    "MaTacGia": 128
  },
  {
    "MaSachTacGia": 229,
    "MaSach": "GT009",
    "MaTacGia": 129
  },
  {
    "MaSachTacGia": 230,
    "MaSach": "GT009",
    "MaTacGia": 130
  },
  {
    "MaSachTacGia": 231,
    "MaSach": "GT010",
    "MaTacGia": 131
  },
  {
    "MaSachTacGia": 232,
    "MaSach": "GT010",
    "MaTacGia": 132
  },
  {
    "MaSachTacGia": 233,
    "MaSach": "GT011",
    "MaTacGia": 133
  },
  {
    "MaSachTacGia": 234,
    "MaSach": "GT012",
    "MaTacGia": 134
  },
  {
    "MaSachTacGia": 235,
    "MaSach": "GT012",
    "MaTacGia": 106
  },
  {
    "MaSachTacGia": 236,
    "MaSach": "GT013",
    "MaTacGia": 135
  },
  {
    "MaSachTacGia": 237,
    "MaSach": "GT013",
    "MaTacGia": 136
  },
  {
    "MaSachTacGia": 238,
    "MaSach": "GT013",
    "MaTacGia": 137
  },
  {
    "MaSachTacGia": 239,
    "MaSach": "GT013",
    "MaTacGia": 138
  },
  {
    "MaSachTacGia": 240,
    "MaSach": "GT014",
    "MaTacGia": 139
  },
  {
    "MaSachTacGia": 241,
    "MaSach": "GT014",
    "MaTacGia": 140
  },
  {
    "MaSachTacGia": 242,
    "MaSach": "GT014",
    "MaTacGia": 141
  },
  {
    "MaSachTacGia": 243,
    "MaSach": "GT015",
    "MaTacGia": 142
  },
  {
    "MaSachTacGia": 244,
    "MaSach": "GT015",
    "MaTacGia": 143
  },
  {
    "MaSachTacGia": 245,
    "MaSach": "GT016",
    "MaTacGia": 144
  },
  {
    "MaSachTacGia": 246,
    "MaSach": "GT016",
    "MaTacGia": 145
  },
  {
    "MaSachTacGia": 247,
    "MaSach": "GT016",
    "MaTacGia": 107
  },
  {
    "MaSachTacGia": 248,
    "MaSach": "GT017",
    "MaTacGia": 69
  },
  {
    "MaSachTacGia": 249,
    "MaSach": "GT017",
    "MaTacGia": 146
  },
  {
    "MaSachTacGia": 250,
    "MaSach": "GT018",
    "MaTacGia": 147
  },
  {
    "MaSachTacGia": 251,
    "MaSach": "GT018",
    "MaTacGia": 148
  },
  {
    "MaSachTacGia": 252,
    "MaSach": "GT018",
    "MaTacGia": 149
  },
  {
    "MaSachTacGia": 253,
    "MaSach": "GT018",
    "MaTacGia": 150
  },
  {
    "MaSachTacGia": 254,
    "MaSach": "GT019",
    "MaTacGia": 151
  },
  {
    "MaSachTacGia": 255,
    "MaSach": "GT020",
    "MaTacGia": 152
  },
  {
    "MaSachTacGia": 256,
    "MaSach": "GT020",
    "MaTacGia": 153
  },
  {
    "MaSachTacGia": 257,
    "MaSach": "GT020",
    "MaTacGia": 154
  },
  {
    "MaSachTacGia": 258,
    "MaSach": "GT020",
    "MaTacGia": 155
  },
  {
    "MaSachTacGia": 259,
    "MaSach": "GT021",
    "MaTacGia": 156
  },
  {
    "MaSachTacGia": 260,
    "MaSach": "GT021",
    "MaTacGia": 157
  },
  {
    "MaSachTacGia": 261,
    "MaSach": "GT021",
    "MaTacGia": 158
  },
  {
    "MaSachTacGia": 262,
    "MaSach": "GT021",
    "MaTacGia": 159
  },
  {
    "MaSachTacGia": 263,
    "MaSach": "GT021",
    "MaTacGia": 160
  },
  {
    "MaSachTacGia": 264,
    "MaSach": "GT021",
    "MaTacGia": 161
  },
  {
    "MaSachTacGia": 265,
    "MaSach": "GT021",
    "MaTacGia": 162
  },
  {
    "MaSachTacGia": 266,
    "MaSach": "GT021",
    "MaTacGia": 163
  },
  {
    "MaSachTacGia": 267,
    "MaSach": "GT021",
    "MaTacGia": 164
  },
  {
    "MaSachTacGia": 268,
    "MaSach": "GT021",
    "MaTacGia": 165
  },
  {
    "MaSachTacGia": 269,
    "MaSach": "GT021",
    "MaTacGia": 166
  },
  {
    "MaSachTacGia": 270,
    "MaSach": "GT021",
    "MaTacGia": 167
  },
  {
    "MaSachTacGia": 271,
    "MaSach": "GT022",
    "MaTacGia": 151
  },
  {
    "MaSachTacGia": 272,
    "MaSach": "GT022",
    "MaTacGia": 168
  },
  {
    "MaSachTacGia": 273,
    "MaSach": "GT022",
    "MaTacGia": 150
  },
  {
    "MaSachTacGia": 274,
    "MaSach": "GT023",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 275,
    "MaSach": "GT023",
    "MaTacGia": 112
  },
  {
    "MaSachTacGia": 276,
    "MaSach": "GT023",
    "MaTacGia": 113
  },
  {
    "MaSachTacGia": 277,
    "MaSach": "GT024",
    "MaTacGia": 169
  },
  {
    "MaSachTacGia": 278,
    "MaSach": "GT024",
    "MaTacGia": 170
  },
  {
    "MaSachTacGia": 279,
    "MaSach": "GT025",
    "MaTacGia": 171
  },
  {
    "MaSachTacGia": 280,
    "MaSach": "GT026",
    "MaTacGia": 172
  },
  {
    "MaSachTacGia": 281,
    "MaSach": "GT026",
    "MaTacGia": 107
  },
  {
    "MaSachTacGia": 282,
    "MaSach": "GT026",
    "MaTacGia": 173
  },
  {
    "MaSachTacGia": 283,
    "MaSach": "GT026",
    "MaTacGia": 174
  },
  {
    "MaSachTacGia": 284,
    "MaSach": "GT027",
    "MaTacGia": 175
  },
  {
    "MaSachTacGia": 285,
    "MaSach": "GT027",
    "MaTacGia": 166
  },
  {
    "MaSachTacGia": 286,
    "MaSach": "GT028",
    "MaTacGia": 111
  },
  {
    "MaSachTacGia": 287,
    "MaSach": "GT028",
    "MaTacGia": 140
  },
  {
    "MaSachTacGia": 288,
    "MaSach": "GT029",
    "MaTacGia": 176
  },
  {
    "MaSachTacGia": 289,
    "MaSach": "GT030",
    "MaTacGia": 126
  },
  {
    "MaSachTacGia": 290,
    "MaSach": "GT030",
    "MaTacGia": 177
  },
  {
    "MaSachTacGia": 291,
    "MaSach": "GT030",
    "MaTacGia": 129
  },
  {
    "MaSachTacGia": 292,
    "MaSach": "GT031",
    "MaTacGia": 175
  },
  {
    "MaSachTacGia": 293,
    "MaSach": "GT031",
    "MaTacGia": 166
  },
  {
    "MaSachTacGia": 294,
    "MaSach": "GT032",
    "MaTacGia": 120
  },
  {
    "MaSachTacGia": 295,
    "MaSach": "GT032",
    "MaTacGia": 121
  },
  {
    "MaSachTacGia": 296,
    "MaSach": "GT032",
    "MaTacGia": 118
  },
  {
    "MaSachTacGia": 297,
    "MaSach": "GT032",
    "MaTacGia": 117
  },
  {
    "MaSachTacGia": 298,
    "MaSach": "GT032",
    "MaTacGia": 119
  },
  {
    "MaSachTacGia": 299,
    "MaSach": "GT033",
    "MaTacGia": 178
  },
  {
    "MaSachTacGia": 300,
    "MaSach": "GT033",
    "MaTacGia": 132
  },
  {
    "MaSachTacGia": 301,
    "MaSach": "GT033",
    "MaTacGia": 69
  },
  {
    "MaSachTacGia": 302,
    "MaSach": "GT034",
    "MaTacGia": 132
  },
  {
    "MaSachTacGia": 303,
    "MaSach": "GT034",
    "MaTacGia": 69
  },
  {
    "MaSachTacGia": 304,
    "MaSach": "GT035",
    "MaTacGia": 175
  },
  {
    "MaSachTacGia": 305,
    "MaSach": "GT035",
    "MaTacGia": 165
  },
  {
    "MaSachTacGia": 306,
    "MaSach": "GT035",
    "MaTacGia": 166
  },
  {
    "MaSachTacGia": 307,
    "MaSach": "GT036",
    "MaTacGia": 179
  },
  {
    "MaSachTacGia": 308,
    "MaSach": "GT036",
    "MaTacGia": 180
  },
  {
    "MaSachTacGia": 309,
    "MaSach": "GT037",
    "MaTacGia": 171
  },
  {
    "MaSachTacGia": 310,
    "MaSach": "GT038",
    "MaTacGia": 178
  },
  {
    "MaSachTacGia": 311,
    "MaSach": "GT039",
    "MaTacGia": 142
  },
  {
    "MaSachTacGia": 312,
    "MaSach": "GT040",
    "MaTacGia": 181
  },
  {
    "MaSachTacGia": 313,
    "MaSach": "GT040",
    "MaTacGia": 103
  },
  {
    "MaSachTacGia": 314,
    "MaSach": "GT041",
    "MaTacGia": 175
  },
  {
    "MaSachTacGia": 315,
    "MaSach": "GT041",
    "MaTacGia": 162
  },
  {
    "MaSachTacGia": 316,
    "MaSach": "GT042",
    "MaTacGia": 182
  },
  {
    "MaSachTacGia": 317,
    "MaSach": "GT042",
    "MaTacGia": 183
  },
  {
    "MaSachTacGia": 318,
    "MaSach": "GT042",
    "MaTacGia": 184
  },
  {
    "MaSachTacGia": 319,
    "MaSach": "GT042",
    "MaTacGia": 185
  },
  {
    "MaSachTacGia": 320,
    "MaSach": "GT043",
    "MaTacGia": 160
  },
  {
    "MaSachTacGia": 321,
    "MaSach": "GT043",
    "MaTacGia": 162
  },
  {
    "MaSachTacGia": 322,
    "MaSach": "GT043",
    "MaTacGia": 166
  },
  {
    "MaSachTacGia": 323,
    "MaSach": "GT043",
    "MaTacGia": 186
  },
  {
    "MaSachTacGia": 324,
    "MaSach": "GT044",
    "MaTacGia": 187
  },
  {
    "MaSachTacGia": 325,
    "MaSach": "GT044",
    "MaTacGia": 188
  },
  {
    "MaSachTacGia": 326,
    "MaSach": "GT044",
    "MaTacGia": 189
  },
  {
    "MaSachTacGia": 327,
    "MaSach": "GT045",
    "MaTacGia": 190
  },
  {
    "MaSachTacGia": 328,
    "MaSach": "GT045",
    "MaTacGia": 191
  },
  {
    "MaSachTacGia": 329,
    "MaSach": "GT046",
    "MaTacGia": 192
  },
  {
    "MaSachTacGia": 330,
    "MaSach": "GT047",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 331,
    "MaSach": "GT047",
    "MaTacGia": 112
  },
  {
    "MaSachTacGia": 332,
    "MaSach": "GT048",
    "MaTacGia": 176
  },
  {
    "MaSachTacGia": 333,
    "MaSach": "GT049",
    "MaTacGia": 171
  },
  {
    "MaSachTacGia": 334,
    "MaSach": "GT050",
    "MaTacGia": 171
  },
  {
    "MaSachTacGia": 335,
    "MaSach": "GT051",
    "MaTacGia": 111
  },
  {
    "MaSachTacGia": 336,
    "MaSach": "GT051",
    "MaTacGia": 183
  },
  {
    "MaSachTacGia": 337,
    "MaSach": "GT051",
    "MaTacGia": 184
  },
  {
    "MaSachTacGia": 338,
    "MaSach": "GT052",
    "MaTacGia": 193
  },
  {
    "MaSachTacGia": 339,
    "MaSach": "GT053",
    "MaTacGia": 192
  },
  {
    "MaSachTacGia": 340,
    "MaSach": "GT054",
    "MaTacGia": 194
  },
  {
    "MaSachTacGia": 341,
    "MaSach": "GT054",
    "MaTacGia": 195
  },
  {
    "MaSachTacGia": 342,
    "MaSach": "GT055",
    "MaTacGia": 196
  },
  {
    "MaSachTacGia": 343,
    "MaSach": "GT055",
    "MaTacGia": 138
  },
  {
    "MaSachTacGia": 344,
    "MaSach": "GT055",
    "MaTacGia": 136
  },
  {
    "MaSachTacGia": 345,
    "MaSach": "GT055",
    "MaTacGia": 137
  },
  {
    "MaSachTacGia": 346,
    "MaSach": "GT056",
    "MaTacGia": 197
  },
  {
    "MaSachTacGia": 347,
    "MaSach": "GT056",
    "MaTacGia": 198
  },
  {
    "MaSachTacGia": 348,
    "MaSach": "GT056",
    "MaTacGia": 199
  },
  {
    "MaSachTacGia": 349,
    "MaSach": "GT056",
    "MaTacGia": 200
  },
  {
    "MaSachTacGia": 350,
    "MaSach": "GT057",
    "MaTacGia": 114
  },
  {
    "MaSachTacGia": 351,
    "MaSach": "GT057",
    "MaTacGia": 201
  },
  {
    "MaSachTacGia": 352,
    "MaSach": "GT057",
    "MaTacGia": 202
  },
  {
    "MaSachTacGia": 353,
    "MaSach": "GT057",
    "MaTacGia": 144
  },
  {
    "MaSachTacGia": 354,
    "MaSach": "GT058",
    "MaTacGia": 203
  },
  {
    "MaSachTacGia": 355,
    "MaSach": "GT058",
    "MaTacGia": 204
  },
  {
    "MaSachTacGia": 356,
    "MaSach": "GT059",
    "MaTacGia": 205
  },
  {
    "MaSachTacGia": 357,
    "MaSach": "GT060",
    "MaTacGia": 103
  },
  {
    "MaSachTacGia": 358,
    "MaSach": "GT060",
    "MaTacGia": 206
  },
  {
    "MaSachTacGia": 359,
    "MaSach": "GT060",
    "MaTacGia": 102
  },
  {
    "MaSachTacGia": 360,
    "MaSach": "GT061",
    "MaTacGia": 204
  },
  {
    "MaSachTacGia": 361,
    "MaSach": "GT061",
    "MaTacGia": 171
  },
  {
    "MaSachTacGia": 362,
    "MaSach": "GT061",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 363,
    "MaSach": "GT062",
    "MaTacGia": 204
  },
  {
    "MaSachTacGia": 364,
    "MaSach": "GT062",
    "MaTacGia": 207
  },
  {
    "MaSachTacGia": 365,
    "MaSach": "GT063",
    "MaTacGia": 171
  },
  {
    "MaSachTacGia": 366,
    "MaSach": "GT064",
    "MaTacGia": 208
  },
  {
    "MaSachTacGia": 367,
    "MaSach": "GT064",
    "MaTacGia": 209
  },
  {
    "MaSachTacGia": 368,
    "MaSach": "GT065",
    "MaTacGia": 111
  },
  {
    "MaSachTacGia": 369,
    "MaSach": "GT065",
    "MaTacGia": 210
  },
  {
    "MaSachTacGia": 370,
    "MaSach": "GT066",
    "MaTacGia": 111
  },
  {
    "MaSachTacGia": 371,
    "MaSach": "GT067",
    "MaTacGia": 208
  },
  {
    "MaSachTacGia": 372,
    "MaSach": "GT067",
    "MaTacGia": 211
  },
  {
    "MaSachTacGia": 373,
    "MaSach": "GT067",
    "MaTacGia": 160
  },
  {
    "MaSachTacGia": 374,
    "MaSach": "GT068",
    "MaTacGia": 212
  },
  {
    "MaSachTacGia": 375,
    "MaSach": "GT068",
    "MaTacGia": 213
  },
  {
    "MaSachTacGia": 376,
    "MaSach": "GT069",
    "MaTacGia": 214
  },
  {
    "MaSachTacGia": 377,
    "MaSach": "GT069",
    "MaTacGia": 215
  },
  {
    "MaSachTacGia": 378,
    "MaSach": "GT070",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 379,
    "MaSach": "GT070",
    "MaTacGia": 216
  },
  {
    "MaSachTacGia": 380,
    "MaSach": "GT070",
    "MaTacGia": 217
  },
  {
    "MaSachTacGia": 381,
    "MaSach": "GT071",
    "MaTacGia": 218
  },
  {
    "MaSachTacGia": 382,
    "MaSach": "GT071",
    "MaTacGia": 219
  },
  {
    "MaSachTacGia": 383,
    "MaSach": "GT072",
    "MaTacGia": 208
  },
  {
    "MaSachTacGia": 384,
    "MaSach": "GT073",
    "MaTacGia": 220
  },
  {
    "MaSachTacGia": 385,
    "MaSach": "GT073",
    "MaTacGia": 221
  },
  {
    "MaSachTacGia": 386,
    "MaSach": "GT074",
    "MaTacGia": 222
  },
  {
    "MaSachTacGia": 387,
    "MaSach": "GT074",
    "MaTacGia": 223
  },
  {
    "MaSachTacGia": 388,
    "MaSach": "GT074",
    "MaTacGia": 224
  },
  {
    "MaSachTacGia": 389,
    "MaSach": "GT074",
    "MaTacGia": 225
  },
  {
    "MaSachTacGia": 390,
    "MaSach": "GT075",
    "MaTacGia": 226
  },
  {
    "MaSachTacGia": 391,
    "MaSach": "GT075",
    "MaTacGia": 219
  },
  {
    "MaSachTacGia": 392,
    "MaSach": "GT075",
    "MaTacGia": 217
  },
  {
    "MaSachTacGia": 393,
    "MaSach": "GT075",
    "MaTacGia": 204
  },
  {
    "MaSachTacGia": 394,
    "MaSach": "GT076",
    "MaTacGia": 227
  },
  {
    "MaSachTacGia": 395,
    "MaSach": "GT076",
    "MaTacGia": 228
  },
  {
    "MaSachTacGia": 396,
    "MaSach": "GT077",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 397,
    "MaSach": "GT078",
    "MaTacGia": 175
  },
  {
    "MaSachTacGia": 398,
    "MaSach": "GT078",
    "MaTacGia": 229
  },
  {
    "MaSachTacGia": 399,
    "MaSach": "GT079",
    "MaTacGia": 112
  },
  {
    "MaSachTacGia": 400,
    "MaSach": "GT079",
    "MaTacGia": 113
  },
  {
    "MaSachTacGia": 401,
    "MaSach": "GT079",
    "MaTacGia": 230
  },
  {
    "MaSachTacGia": 402,
    "MaSach": "GT080",
    "MaTacGia": 231
  },
  {
    "MaSachTacGia": 403,
    "MaSach": "GT081",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 404,
    "MaSach": "GT081",
    "MaTacGia": 232
  },
  {
    "MaSachTacGia": 405,
    "MaSach": "GT082",
    "MaTacGia": 226
  },
  {
    "MaSachTacGia": 406,
    "MaSach": "GT083",
    "MaTacGia": 233
  },
  {
    "MaSachTacGia": 407,
    "MaSach": "GT083",
    "MaTacGia": 196
  },
  {
    "MaSachTacGia": 408,
    "MaSach": "GT084",
    "MaTacGia": 234
  },
  {
    "MaSachTacGia": 409,
    "MaSach": "GT084",
    "MaTacGia": 171
  },
  {
    "MaSachTacGia": 410,
    "MaSach": "GT085",
    "MaTacGia": 176
  },
  {
    "MaSachTacGia": 411,
    "MaSach": "GT086",
    "MaTacGia": 235
  },
  {
    "MaSachTacGia": 412,
    "MaSach": "GT087",
    "MaTacGia": 204
  },
  {
    "MaSachTacGia": 413,
    "MaSach": "GT087",
    "MaTacGia": 236
  },
  {
    "MaSachTacGia": 414,
    "MaSach": "GT087",
    "MaTacGia": 207
  },
  {
    "MaSachTacGia": 415,
    "MaSach": "GT088",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 416,
    "MaSach": "GT089",
    "MaTacGia": 237
  },
  {
    "MaSachTacGia": 417,
    "MaSach": "GT089",
    "MaTacGia": 238
  },
  {
    "MaSachTacGia": 418,
    "MaSach": "GT089",
    "MaTacGia": 239
  },
  {
    "MaSachTacGia": 419,
    "MaSach": "GT090",
    "MaTacGia": 240
  },
  {
    "MaSachTacGia": 420,
    "MaSach": "GT090",
    "MaTacGia": 241
  },
  {
    "MaSachTacGia": 421,
    "MaSach": "GT091",
    "MaTacGia": 192
  },
  {
    "MaSachTacGia": 422,
    "MaSach": "GT092",
    "MaTacGia": 242
  },
  {
    "MaSachTacGia": 423,
    "MaSach": "GT092",
    "MaTacGia": 243
  },
  {
    "MaSachTacGia": 424,
    "MaSach": "GT093",
    "MaTacGia": 242
  },
  {
    "MaSachTacGia": 425,
    "MaSach": "GT094",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 426,
    "MaSach": "GT094",
    "MaTacGia": 244
  },
  {
    "MaSachTacGia": 427,
    "MaSach": "GT095",
    "MaTacGia": 194
  },
  {
    "MaSachTacGia": 428,
    "MaSach": "GT095",
    "MaTacGia": 195
  },
  {
    "MaSachTacGia": 429,
    "MaSach": "GT095",
    "MaTacGia": 245
  },
  {
    "MaSachTacGia": 430,
    "MaSach": "GT096",
    "MaTacGia": 194
  },
  {
    "MaSachTacGia": 431,
    "MaSach": "GT096",
    "MaTacGia": 215
  },
  {
    "MaSachTacGia": 432,
    "MaSach": "GT097",
    "MaTacGia": 246
  },
  {
    "MaSachTacGia": 433,
    "MaSach": "GT098",
    "MaTacGia": 112
  },
  {
    "MaSachTacGia": 434,
    "MaSach": "GT098",
    "MaTacGia": 230
  },
  {
    "MaSachTacGia": 435,
    "MaSach": "GT098",
    "MaTacGia": 113
  },
  {
    "MaSachTacGia": 436,
    "MaSach": "GT099",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 437,
    "MaSach": "GT100",
    "MaTacGia": 116
  },
  {
    "MaSachTacGia": 438,
    "MaSach": "GT101",
    "MaTacGia": 197
  },
  {
    "MaSachTacGia": 439,
    "MaSach": "GT101",
    "MaTacGia": 247
  },
  {
    "MaSachTacGia": 440,
    "MaSach": "GT102",
    "MaTacGia": 197
  },
  {
    "MaSachTacGia": 441,
    "MaSach": "GT102",
    "MaTacGia": 207
  },
  {
    "MaSachTacGia": 442,
    "MaSach": "GT103",
    "MaTacGia": 216
  },
  {
    "MaSachTacGia": 443,
    "MaSach": "GT103",
    "MaTacGia": 248
  },
  {
    "MaSachTacGia": 444,
    "MaSach": "GT104",
    "MaTacGia": 201
  },
  {
    "MaSachTacGia": 445,
    "MaSach": "GT104",
    "MaTacGia": 249
  },
  {
    "MaSachTacGia": 446,
    "MaSach": "GT104",
    "MaTacGia": 250
  },
  {
    "MaSachTacGia": 447,
    "MaSach": "GT104",
    "MaTacGia": 114
  },
  {
    "MaSachTacGia": 448,
    "MaSach": "GT105",
    "MaTacGia": 114
  },
  {
    "MaSachTacGia": 449,
    "MaSach": "GT105",
    "MaTacGia": 251
  },
  {
    "MaSachTacGia": 450,
    "MaSach": "GT105",
    "MaTacGia": 249
  },
  {
    "MaSachTacGia": 451,
    "MaSach": "GT106",
    "MaTacGia": 226
  },
  {
    "MaSachTacGia": 452,
    "MaSach": "GT106",
    "MaTacGia": 252
  },
  {
    "MaSachTacGia": 453,
    "MaSach": "GT107",
    "MaTacGia": 208
  },
  {
    "MaSachTacGia": 454,
    "MaSach": "GT107",
    "MaTacGia": 209
  },
  {
    "MaSachTacGia": 455,
    "MaSach": "GT108",
    "MaTacGia": 253
  },
  {
    "MaSachTacGia": 456,
    "MaSach": "GT108",
    "MaTacGia": 251
  },
  {
    "MaSachTacGia": 457,
    "MaSach": "GT108",
    "MaTacGia": 106
  },
  {
    "MaSachTacGia": 458,
    "MaSach": "GT109",
    "MaTacGia": 114
  },
  {
    "MaSachTacGia": 459,
    "MaSach": "GT109",
    "MaTacGia": 248
  },
  {
    "MaSachTacGia": 460,
    "MaSach": "GT109",
    "MaTacGia": 247
  },
  {
    "MaSachTacGia": 461,
    "MaSach": "GT110",
    "MaTacGia": 114
  },
  {
    "MaSachTacGia": 462,
    "MaSach": "GT110",
    "MaTacGia": 249
  },
  {
    "MaSachTacGia": 463,
    "MaSach": "GT110",
    "MaTacGia": 254
  },
  {
    "MaSachTacGia": 464,
    "MaSach": "GT111",
    "MaTacGia": 255
  },
  {
    "MaSachTacGia": 465,
    "MaSach": "GT111",
    "MaTacGia": 256
  },
  {
    "MaSachTacGia": 466,
    "MaSach": "GT111",
    "MaTacGia": 160
  },
  {
    "MaSachTacGia": 467,
    "MaSach": "GT112",
    "MaTacGia": 175
  },
  {
    "MaSachTacGia": 468,
    "MaSach": "GT112",
    "MaTacGia": 229
  },
  {
    "MaSachTacGia": 469,
    "MaSach": "GT113",
    "MaTacGia": 257
  },
  {
    "MaSachTacGia": 470,
    "MaSach": "GT114",
    "MaTacGia": 235
  },
  {
    "MaSachTacGia": 471,
    "MaSach": "GT115",
    "MaTacGia": 208
  },
  {
    "MaSachTacGia": 472,
    "MaSach": "GT115",
    "MaTacGia": 175
  },
  {
    "MaSachTacGia": 473,
    "MaSach": "GT115",
    "MaTacGia": 160
  }
];
