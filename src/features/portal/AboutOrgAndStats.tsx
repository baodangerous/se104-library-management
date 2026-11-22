import { Building2, ExternalLink, Printer, UserCheck, Users, Wifi } from 'lucide-react';

const UIT_STAFF = [
  'Hồ Thị Minh Phượng',
  'Nguyễn Thị Lan Sa',
  'Lê Hoàng Lâm',
  'Phan Trường Nhất',
];

const YEARLY_RESOURCES = [
  { nam: '2024', tua: '2.426', banIn: '17.017', sachTua: '2.126', luanVan: '300' },
  { nam: '2025', tua: '2.885', banIn: '19.107', sachTua: '2.519', luanVan: '366' },
  { nam: '2026', tua: '2.999', banIn: '19.487', sachTua: '2.579', luanVan: '420' },
];

export function AboutOrgAndStats() {
  return (
    <div className="space-y-6">
      {/* Official UIT Library Statistics (up to 28/08/2026) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Số liệu thống kê chính thức Thư viện UIT
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Số liệu tính đến 28/08/2026 · Nguồn: thuvien.uit.edu.vn
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://thuvien.uit.edu.vn/page/so-lieu-thong-ke"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#1556d6] hover:underline"
            >
              Trang số liệu
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://thuvien.uit.edu.vn/page/chinh-sach-the-thu-vien"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#1556d6] hover:underline"
            >
              Chính sách thẻ thư viện
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MiniStat label="Diện tích phục vụ" value="1.266 m²" sub="Tầng trệt & khu đọc tầng trên" />
          <MiniStat label="Tài nguyên bản in (2026)" value="19.487 bản" sub="2.999 tựa · 420 luận án/luận văn" />
          <MiniStat label="Bạn đọc còn hạn (2026)" value="12.232" sub="11.269 SV · 609 HVCH · 354 GV/VC" />
          <MiniStat label="Lượt ra vào Thư viện" value="700–1.000" sub="lượt/ngày · 11.525 lượt mượn (2025)" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Growth Table 2024-2026 */}
          <div className="lg:col-span-7 overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f3f8ff] text-[#0a1f4d] border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 font-bold">Năm</th>
                  <th className="px-3 py-2.5 font-bold">Bản in (Tựa)</th>
                  <th className="px-3 py-2.5 font-bold">Bản in (SL bản)</th>
                  <th className="px-3 py-2.5 font-bold">Sách (Tựa)</th>
                  <th className="px-3 py-2.5 font-bold">Luận án, luận văn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {YEARLY_RESOURCES.map((row) => (
                  <tr key={row.nam} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2 font-bold text-[#0a2b86]">{row.nam}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">{row.tua}</td>
                    <td className="px-3 py-2 text-slate-700">{row.banIn}</td>
                    <td className="px-3 py-2 text-slate-700">{row.sachTua}</td>
                    <td className="px-3 py-2 text-slate-700">{row.luanVan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Facilities & Shared VNU-HCM */}
          <div className="lg:col-span-5 space-y-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-bold text-slate-900">Cơ sở vật chất &amp; Học liệu liên kết</p>
            <p className="flex items-start gap-2">
              <Printer className="w-4 h-4 text-[#1556d6] shrink-0 mt-0.5" />
              <span>02 máy đa chức năng (photocopy, scan, in), 01 máy in, 01 máy scan.</span>
            </p>
            <p className="flex items-start gap-2">
              <Wifi className="w-4 h-4 text-[#1556d6] shrink-0 mt-0.5" />
              <span>02 khu vực phục vụ có máy lạnh; 05 điểm phát WiFi tốc độ cao.</span>
            </p>
            <p className="pt-1 border-t border-slate-200 text-[11px] text-slate-500">
              Liên thông Hệ thống Thư viện ĐHQG-HCM: 30.000 tựa / 114.979 bản học liệu dùng chung.
            </p>
          </div>
        </div>
      </section>

      {/* Organization & Personnel */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#0a2b86]">
          <Building2 className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">
            Cơ cấu tổ chức &amp; Nhân sự Thư viện
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-[#f3f8ff]/60 space-y-2">
            <p className="font-bold text-[#0a1f4d]">Đơn vị &amp; Đoàn thể</p>
            <p className="font-semibold text-slate-800">
              Phòng Đảm bảo chất lượng, Thư viện và Pháp chế
            </p>
            <ul className="space-y-1 text-slate-600">
              <li>a. Chi bộ Khối phòng ban 2</li>
              <li>b. Công đoàn bộ phận 4</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-[#f3f8ff]/60 space-y-2">
            <p className="font-bold text-[#0a1f4d] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#1556d6]" />
              Phụ trách Thư viện
            </p>
            <p className="text-sm font-bold text-[#0a2b86]">Lê Văn Ngọc</p>
            <p className="text-slate-600 leading-relaxed">
              Phó trưởng phòng, Phòng Đảm bảo chất lượng, Thư viện và Pháp chế – Phụ trách Thư viện và quản lý tài nguyên học thuật.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-[#f3f8ff]/60 space-y-2">
            <p className="font-bold text-[#0a1f4d] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#1556d6]" />
              Chuyên viên Thư viện
            </p>
            <ul className="space-y-1.5 text-slate-700 font-medium">
              {UIT_STAFF.map((name) => (
                <li key={name}>• {name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="text-lg font-bold text-[#0a1f4d]">{value}</p>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  );
}

