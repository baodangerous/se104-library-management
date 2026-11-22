import { Calendar } from 'lucide-react';
import type { TinHoatDong } from '../../types/portal';

interface PortalNewsSectionProps {
  news: TinHoatDong[];
  onOpenAbout?: () => void;
}

export function PortalNewsSection({ news, onOpenAbout }: PortalNewsSectionProps) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Sự kiện &amp; Tin hoạt động gần đây
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thông báo học liệu mới, sự kiện học thuật và hoạt động bạn đọc tại Thư viện UIT
          </p>
        </div>
        {onOpenAbout ? (
          <button
            type="button"
            onClick={onOpenAbout}
            className="text-xs font-semibold text-[#0054A6] hover:underline shrink-0 cursor-pointer"
          >
            Lịch phục vụ
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((item) => (
          <article
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#1556d6]/40 transition-colors flex gap-3.5 items-start"
          >
            {item.hinhAnh ? (
              <img
                src={item.hinhAnh}
                alt={item.tieuDe}
                className="w-28 h-20 rounded-lg object-cover shrink-0 border border-slate-200"
              />
            ) : null}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold px-2 py-0.5 rounded bg-[#0054A6]/10 text-[#0054A6]">
                  {item.chuyenMuc}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {item.ngayDang}
                </span>
              </div>
              {item.duongDan ? (
                <a
                  href={item.duongDan}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm font-semibold text-slate-900 hover:text-[#0054A6] leading-snug line-clamp-2"
                >
                  {item.tieuDe}
                </a>
              ) : (
                <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                  {item.tieuDe}
                </h3>
              )}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{item.tomTat}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

