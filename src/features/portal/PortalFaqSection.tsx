import * as React from 'react';
import { ChevronDown, ChevronsUpDown, HelpCircle, PhoneCall, Sparkles } from 'lucide-react';
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
    question: 'Tên đăng nhập và mật khẩu tài khoản Thư viện UIT được quy định ra sao?',
    answer:
      'Sinh viên đăng nhập bằng mã tài khoản thư viện gắn với MSSV (dạng 15000 + MSSV), Cán bộ – Giảng viên dùng mã tài khoản theo mã cán bộ. Sau khi đăng nhập cổng thông tin hoặc Workspace, bạn có thể bấm nút "Đổi mật khẩu" ngay trên thanh công cụ để đổi sang mật khẩu cá nhân, hoặc đặt lại qua ldap.vnulib.edu.vn nếu quên mật khẩu.',
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
      'Tài khoản thư viện dùng chung cho OPAC, ứng dụng VNUHCM Libraries, kho số ir.vnulib.edu.vn và cổng tìm kiếm tập trung EDS. Để kích hoạt hoặc gia hạn quyền truy cập CSDL dùng chung ĐHQG-HCM, bạn kết nối Zalo Thư viện Trung tâm (vnulib.edu.vn), gửi mã thẻ thư viện kèm nội dung "Đăng ký/Gia hạn truy cập CSDL" (CB-GV miễn phí; Sinh viên miễn phí năm đầu, từ năm 2 là 25.000đ/năm).',
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
  const [sectionOpen, setSectionOpen] = React.useState(false);
  const [openIds, setOpenIds] = React.useState<Set<string>>(() => new Set(['faq-1']));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allExpanded = openIds.size === FAQ_ITEMS.length;
  const toggleAllItems = () => {
    setOpenIds(allExpanded ? new Set() : new Set(FAQ_ITEMS.map((i) => i.id)));
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all">
      {/* Interactive Collapsible Header */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={sectionOpen}
        onClick={() => setSectionOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSectionOpen((prev) => !prev);
          }
        }}
        className="w-full text-left p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0054A6] to-[#1556d6] text-white flex items-center justify-center shrink-0 shadow-xs">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0a1f4d]">
                Câu hỏi thường gặp (FAQ)
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0054A6]/10 text-[#0054A6]">
                <Sparkles className="w-3 h-3" />
                {FAQ_ITEMS.length} giải đáp nhanh
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Quy định mượn trả, gia hạn trực tuyến, phòng học nhóm A2.01/A2.02 và truy cập CSDL điện tử UIT.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#0054A6]" />
            <span>
              Máy lẻ <strong className="text-slate-900">128 / 154</strong>
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0054A6] text-white text-xs font-semibold shadow-2xs">
            <span>{sectionOpen ? 'Thu gọn FAQ' : 'Xem giải đáp'}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-300',
                sectionOpen && 'rotate-180'
              )}
            />
          </span>
        </div>
      </div>

      {/* Smooth Animated Collapsible Body */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          sectionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Nhấp vào từng câu hỏi để xem hướng dẫn chi tiết</span>
              <button
                type="button"
                onClick={toggleAllItems}
                className="inline-flex items-center gap-1 font-semibold text-[#0054A6] hover:underline cursor-pointer"
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
                {allExpanded ? 'Thu gọn tất cả' : 'Mở tất cả'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openIds.has(item.id);
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
                      onClick={() => toggleItem(item.id)}
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
                      <div className="px-4 pb-4 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1 pt-2.5">
                        {item.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
