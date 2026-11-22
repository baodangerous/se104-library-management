import type { NganhHoc } from '../types/portal';

export const UIT_MAJORS: NganhHoc[] = [
  {
    MaNganh: 'TKVM',
    TenNganh: 'Thiết kế Vi mạch',
    Khoa: 'Khoa Kỹ thuật Máy tính',
    ChuongTrinh: ['ĐH chính quy', 'Sau ĐH'],
    MoTaNgan: 'Thiết kế mạch tích hợp số/tương tự, FPGA, SoC và kiểm chứng vi mạch bán dẫn.',
  },
  {
    MaNganh: 'ATTT',
    TenNganh: 'An toàn Thông tin',
    Khoa: 'Khoa Mạng máy tính & Truyền thông',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Mật mã học, bảo mật hệ thống, điều tra số, phòng thủ mạng và an ninh ứng dụng.',
  },
  {
    MaNganh: 'KHDL',
    TenNganh: 'Khoa học Dữ liệu',
    Khoa: 'Khoa Khoa học & Kỹ thuật Thông tin',
    ChuongTrinh: ['ĐH chính quy', 'Sau ĐH'],
    MoTaNgan: 'Phân tích dữ liệu lớn, khai phá dữ liệu, học thống kê và trực quan hóa dữ liệu.',
  },
  {
    MaNganh: 'KHMT',
    TenNganh: 'Khoa học máy tính',
    Khoa: 'Khoa Khoa học Máy tính',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Thuật toán nâng cao, thị giác máy tính, xử lý ngôn ngữ tự nhiên và tính toán thông minh.',
  },
  {
    MaNganh: 'HTTT',
    TenNganh: 'Hệ thống thông tin',
    Khoa: 'Khoa Hệ thống Thông tin',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Quản trị cơ sở dữ liệu, phân tích thiết kế hệ thống, ERP và trí tuệ doanh nghiệp.',
  },
  {
    MaNganh: 'KTPM',
    TenNganh: 'Kỹ thuật phần mềm',
    Khoa: 'Khoa Công nghệ Phần mềm',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Quy trình phát triển phần mềm, kiến trúc hiện đại, kiểm thử tự động và DevOps.',
  },
  {
    MaNganh: 'TTNT',
    TenNganh: 'Trí tuệ Nhân tạo',
    Khoa: 'Khoa Khoa học Máy tính',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Học sâu, mô hình ngôn ngữ lớn, hệ chuyên gia, robot thông minh và AI tạo sinh.',
  },
  {
    MaNganh: 'KTMT',
    TenNganh: 'Kỹ thuật máy tính',
    Khoa: 'Khoa Kỹ thuật Máy tính',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Hệ thống nhúng, kiến trúc máy tính, IoT và lập trình phần cứng thời gian thực.',
  },
  {
    MaNganh: 'CNTT',
    TenNganh: 'Công nghệ thông tin',
    Khoa: 'Khoa Khoa học & Kỹ thuật Thông tin',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Phát triển ứng dụng đa nền tảng, điện toán đám mây và tích hợp hệ thống số.',
  },
  {
    MaNganh: 'TMDT',
    TenNganh: 'Thương mại Điện tử',
    Khoa: 'Khoa Hệ thống Thông tin',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh'],
    MoTaNgan: 'Kinh doanh số, thanh toán điện tử, phân tích hành vi khách hàng và quản trị chuỗi cung ứng.',
  },
  {
    MaNganh: 'TTDPT',
    TenNganh: 'Truyền thông Đa phương tiện',
    Khoa: 'Khoa Khoa học Máy tính',
    ChuongTrinh: ['ĐH chính quy'],
    MoTaNgan: 'Thiết kế tương tác UI/UX, đồ họa 3D, xử lý âm thanh hình ảnh và sản xuất nội dung số.',
  },
  {
    MaNganh: 'MMT',
    TenNganh: 'Mạng máy tính & Truyền thông Dữ liệu',
    Khoa: 'Khoa Mạng máy tính & Truyền thông',
    ChuongTrinh: ['ĐH chính quy', 'CT Tiếng Anh', 'Sau ĐH'],
    MoTaNgan: 'Hạ tầng mạng doanh nghiệp, điện toán biên, mạng không dây 5G và ảo hóa hệ thống.',
  },
];

export function getMajorName(maNganh?: string): string {
  if (!maNganh) return 'Chung';
  return UIT_MAJORS.find((m) => m.MaNganh === maNganh)?.TenNganh || maNganh;
}
