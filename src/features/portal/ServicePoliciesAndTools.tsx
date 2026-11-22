import * as React from 'react';
import { BookOpen, ExternalLink, FileText, Globe, KeyRound, ShieldCheck } from 'lucide-react';
import type { ThamSo } from '../../types/library';

const UIT_EXTERNAL_MODULES = [
  {
    title: 'Kho số & Đề cương môn học UIT',
    desc: 'Truy cập giáo trình điện tử, luận văn và tài liệu theo môn học (M4, M5)',
    url: 'https://ir.vnulib.edu.vn/',
  },
  {
    title: 'Mục lục OPAC & Tài nguyên mở (43 CSDL)',
    desc: 'Tra cứu Hệ thống Thư viện ĐHQG-HCM, Tủ sách suốt đời & Văn hóa Nhật Bản (M3, M10)',
    url: 'https://thuvien.uit.edu.vn/page/csdl-nguon-mo',
  },
  {
    title: 'Văn bản Pháp luật & Quy định UIT',
    desc: '39 văn bản pháp luật và 6 văn bản hướng dẫn nội bộ Thư viện UIT (M11)',
    url: 'https://thuvien.uit.edu.vn/page/van-ban-uit',
  },
  {
    title: 'Quên mật khẩu tài khoản thư viện (LDAP)',
    desc: 'Đặt lại mật khẩu tài khoản 13 số dùng cho OPAC, VNUHCM Libraries & CSDL (L3)',
    url: 'https://ldap.vnulib.edu.vn/',
  },
];

export function ServicePoliciesAndTools({ params }: { params: ThamSo | null }) {
  const [roleType, setRoleType] = React.useState<'SV' | 'CBGV'>('SV');
  const [codeInput, setCodeInput] = React.useState('23520001');

  const cleanCode = codeInput.replace(/\s+/g, '');
  const account13 = cleanCode
    ? roleType === 'SV'
      ? `15000${cleanCode}`
      : `15000000${cleanCode}`
    : '—';

  return (
    <div className="space-y-6">
      {/* 13-digit Account Lookup Tool (M7, L3) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#0a2b86]">
          <KeyRound className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">
            Tra cứu quy tắc Tài khoản 13 số &amp; Thẻ điện tử (M7)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setRoleType('SV');
                  setCodeInput('23520001');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                  roleType === 'SV'
                    ? 'bg-[#0a2b86] text-white border-[#0a2b86]'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Sinh viên / Học viên UIT
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleType('CBGV');
                  setCodeInput('01234');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                  roleType === 'CBGV'
                    ? 'bg-[#0a2b86] text-white border-[#0a2b86]'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Cán bộ / Giảng viên
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder={roleType === 'SV' ? 'Nhập MSSV (vd: 23520001)' : 'Nhập mã cán bộ'}
                className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#1556d6]"
              />
              <div className="h-10 px-4 rounded-lg bg-[#f3f8ff] border border-[#1556d6]/30 flex items-center gap-2 text-xs">
                <span className="text-slate-500">Tên đăng nhập:</span>
                <span className="font-mono font-bold text-[#0a2b86]">{account13}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Dùng chung cho OPAC, ứng dụng <strong>VNUHCM Libraries</strong> (thẻ điện tử có hiệu lực
              từ 01/01/2022), kho số và CSDL dùng chung ĐHQG-HCM. Hỗ trợ kỹ thuật: máy lẻ{' '}
              <strong>154</strong>.
            </p>
          </div>

          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <p className="font-bold text-slate-900">Phí đăng ký / gia hạn CSDL ĐHQG-HCM (L6)</p>
            <ul className="space-y-1 text-slate-600">
              <li>• Cán bộ, giảng viên: <strong className="text-emerald-700">Miễn phí</strong></li>
              <li>• Sinh viên: Miễn phí năm đầu, từ năm 2 là <strong>25.000đ/năm</strong></li>
              <li>• Học viên cao học: <strong>45.000đ</strong> lần đầu, <strong>25.000đ/năm</strong> gia hạn</li>
            </ul>
            <p className="text-[11px] text-slate-500 pt-1">
              Liên hệ Zalo Thư viện Trung tâm tại <span className="font-semibold">vnulib.edu.vn</span> kèm mã 13 số.
            </p>
          </div>
        </div>
      </section>

      {/* UIT Circulation Rules (M8, L4, L5) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#0a2b86]">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">
            Chính sách Mượn – Trả – Gia hạn chuẩn Thư viện UIT (M8)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <RuleTile
            title="Giáo trình (Mã vạch #5 = 2)"
            value="5 cuốn · 90 ngày"
            sub="Gia hạn tối đa 2 lần, mỗi lần +15 ngày"
          />
          <RuleTile
            title="Tham khảo (Mã vạch #5 = 1)"
            value="3 cuốn · 21 ngày"
            sub="Gia hạn tối đa 2 lần, mỗi lần +7 ngày"
          />
          <RuleTile
            title="Luận án, luận văn, khóa luận"
            value="Đọc tại chỗ"
            sub="Không cho mượn về nhà · Tra cứu kho số IR"
          />
          <RuleTile
            title="Liên thông Hệ thống ĐHQG-HCM"
            value="5 cuốn · 21 ngày"
            sub={
              params
                ? `Gia hạn +7 ngày · Tối đa ${params.SoSachMuonToiDa} quyển/thẻ`
                : 'Gia hạn tối đa 2 lần (+7 ngày/lần)'
            }
          />
        </div>
      </section>

      {/* Digital Resources, Open Access & Legal Docs (M9, M10, M11) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#0a2b86]">
          <Globe className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">
            Tài nguyên số, Văn bản &amp; Cổng hệ thống ngoài (M3–M11)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {UIT_EXTERNAL_MODULES.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#1556d6]/50 transition-colors flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 group-hover:text-[#1556d6] flex items-center gap-1.5">
                  {item.url.includes('van-ban') ? (
                    <FileText className="w-4 h-4 text-[#1556d6]" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-[#1556d6]" />
                  )}
                  {item.title}
                </p>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#1556d6] shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function RuleTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-[#f3f8ff]/60 space-y-1.5">
      <p className="font-semibold text-slate-600">{title}</p>
      <p className="text-base font-bold text-[#0a2b86]">{value}</p>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  );
}
