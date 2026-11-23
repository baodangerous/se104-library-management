import * as React from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Tài khoản & Thẻ',
    question: 'Tên đăng nhập và mật khẩu mặc định tài khoản Thư viện UIT là gì?',
    answer:
      'Tên đăng nhập gồm 13 chữ số: Sinh viên dùng 15000 + MSSV (ví dụ: 1500023520230), Cán bộ – Giảng viên dùng 15000000 + mã cán bộ. Sau khi đăng nhập cổng thông tin hoặc Workspace, bạn có thể bấm nút "Đổi mật khẩu" ngay trên thanh công cụ để đổi sang mật khẩu cá nhân, hoặc đặt lại qua ldap.vnulib.edu.vn nếu quên mật khẩu.',
  },
  {
    id: 'faq-2',
    category: 'Mượn – Trả & Gia hạn',
    question: 'Sinh viên được mượn tối đa bao nhiêu cuốn sách và gia hạn như thế nào?',
    answer:
      'Giáo trình: tối đa 5 cuốn trong 90 ngày (gia hạn 2 lần, mỗi lần 15 ngày). Sách tham khảo: tối đa 3 cuốn trong 21 ngày (gia hạn 2 lần, mỗi lần 7 ngày). Mượn liên thông trong Hệ thống Thư viện ĐHQG-HCM: 5 cuốn trong 21 ngày. Luận văn, luận án và khóa luận chỉ phục vụ đọc tại chỗ. Bạn có thể bấm gia hạn trực tuyến trước ngày hết hạn 1–2 ngày.',
  },
  {
    id: 'faq-3',
    category: 'Đặt phòng nhóm',
    question: 'Cách đăng ký phòng học nhóm A2.01, A2.02 và mượn khóa tủ cá nhân?',
    answer:
      'Bạn chọn mục Dịch vụ → Đặt phòng họp nhóm (tối thiểu 3 người/nhóm), chọn phòng A2.01 hoặc A2.02 và khung giờ phù hợp. Khi đến giờ sử dụng, đại diện nhóm mang thẻ sinh viên/thẻ thư viện đến quầy tầng 2 để xuất trình và nhận chìa khóa phòng hoặc khóa tủ giữ đồ.',
  },
  {
    id: 'faq-4',
    category: 'CSDL & Nguồn mở',
    question: 'Làm sao truy cập từ xa các CSDL IEEE Xplore, Scopus, Springer và kho số UIT?',
    answer:
      'Tài khoản thư viện 13 số dùng chung cho OPAC, ứng dụng VNUHCM Libraries, kho số ir.vnulib.edu.vn và cổng tìm kiếm tập trung EDS. Để kích hoạt hoặc gia hạn quyền truy cập CSDL dùng chung ĐHQG-HCM, bạn kết nối Zalo Thư viện Trung tâm (vnulib.edu.vn), gửi mã 13 số kèm nội dung "Đăng ký/Gia hạn truy cập CSDL" (CB-GV miễn phí; Sinh viên miễn phí năm đầu, từ năm 2 là 25.000đ/năm).',
  },
  {
    id: 'faq-5',
    category: 'Đề xuất tài liệu',
    question: 'Sinh viên muốn đề xuất mua thêm sách mới hoặc nộp luận văn thì làm ở đâu?',
    answer:
      'Để đề xuất bổ sung giáo trình/sách chuyên ngành mới, bạn gửi biểu mẫu tại mục Dịch vụ → Yêu cầu bổ sung tài liệu; Thủ thư và Phụ trách thư viện sẽ tiếp nhận và cập nhật trạng thái duyệt mua ngay trên hệ thống. Đối với luận văn/khóa luận tốt nghiệp, bạn nộp bản in tại quầy và tải bản số lên kho lưu trữ ir.vnulib.edu.vn.',
  },
  {
    id: 'faq-6',
    category: 'Giờ phục vụ & Hỗ trợ',
    question: 'Thư viện UIT mở cửa vào khung giờ nào và liên hệ ai khi gặp sự cố?',
    answer:
      'Thư viện UIT (Tòa nhà A, Khu phố 34, P. Linh Xuân, TP.HCM) mở cửa Thứ 2 – Thứ 6 từ 07:30 đến 18:00, Thứ 7 từ 08:00 đến 16:00 (nghỉ Chủ nhật và ngày lễ). Khi cần hỗ trợ mượn trả hoặc lỗi tài khoản, vui lòng gọi máy lẻ 128 (Quầy phục vụ) hoặc 154 (Kỹ thuật & Tài khoản), hoặc gửi email về thuvien@uit.edu.vn.',
  },
];

export function PortalFaqSection() {
  const [openId, setOpenId] = React.useState<string | null>('faq-1');

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0054A6] text-white flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0a1f4d]">
              Câu hỏi thường gặp (FAQ)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Giải đáp nhanh quy định mượn trả, tài khoản 13 số, phòng học nhóm và truy cập CSDL điện tử tại Thư viện UIT.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 shrink-0">
          <PhoneCall className="w-3.5 h-3.5 text-[#0054A6]" />
          <span>
            Hỗ trợ nhanh: <strong className="text-slate-900">máy lẻ 128 / 154</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                'rounded-xl border transition-all',
                isOpen
                  ? 'border-[#0054A6]/40 bg-[#f7faff] shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full text-left px-4 py-3.5 flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0054A6]/10 text-[#0054A6]">
                    {item.category}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {item.question}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200',
                    isOpen && 'rotate-180 text-[#0054A6]'
                  )}
                />
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 pt-0 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1 pt-2.5">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
