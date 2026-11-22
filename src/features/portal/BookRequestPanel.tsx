import * as React from 'react';
import { BookPlus, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { FieldLabel, SelectInput, TextInput } from '../../components/ui/input';
import { getMajorName, UIT_MAJORS } from '../../constants/majors';
import { formatDateVN } from '../../lib/utils';
import { serviceRequestService } from '../../services/serviceRequestService';
import type { AuthUser } from '../../types/library';
import type { YeuCauTaiLieu } from '../../types/portal';

interface BookRequestPanelProps {
  user: AuthUser | null;
}

export function BookRequestPanel({ user }: BookRequestPanelProps) {
  const [requests, setRequests] = React.useState<YeuCauTaiLieu[]>([]);
  const [tenTaiLieu, setTenTaiLieu] = React.useState('');
  const [tacGia, setTacGia] = React.useState('');
  const [maNganh, setMaNganh] = React.useState('ATTT');
  const [nguoiGui, setNguoiGui] = React.useState(user?.HoTen || '');
  const [email, setEmail] = React.useState(user?.TenDangNhap || '');
  const [lyDo, setLyDo] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const loadList = React.useCallback(async () => {
    const rows = await serviceRequestService.listBookRequests();
    setRequests(rows);
  }, []);

  React.useEffect(() => {
    loadList();
  }, [loadList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenTaiLieu.trim() || !nguoiGui.trim()) {
      toast.error('Vui lòng nhập tên tài liệu và họ tên người đề xuất.');
      return;
    }
    setSubmitting(true);
    try {
      await serviceRequestService.createBookRequest({
        TenTaiLieu: tenTaiLieu,
        TacGia: tacGia,
        MaNganh: maNganh,
        NguoiGui: nguoiGui,
        Email: email,
        LyDo: lyDo,
      });
      toast.success('Đã gửi đề xuất bổ sung tài liệu tới Thư viện UIT.');
      setTenTaiLieu('');
      setTacGia('');
      setLyDo('');
      await loadList();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gửi yêu cầu thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0054A6]/10 text-[#0054A6] flex items-center justify-center">
            <BookPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Đề xuất bổ sung sách / giáo trình</h3>
            <p className="text-xs text-slate-500">
              Giảng viên &amp; sinh viên UIT đề xuất mua mới học liệu phục vụ học tập, nghiên cứu.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <FieldLabel htmlFor="req-title" required>Tên tài liệu / Đầu sách</FieldLabel>
            <TextInput
              id="req-title"
              value={tenTaiLieu}
              onChange={(e) => setTenTaiLieu(e.target.value)}
              placeholder="VD: Designing Data-Intensive Applications (2nd Ed)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <FieldLabel htmlFor="req-author">Tác giả / NXB</FieldLabel>
              <TextInput
                id="req-author"
                value={tacGia}
                onChange={(e) => setTacGia(e.target.value)}
                placeholder="Martin Kleppmann · O'Reilly"
              />
            </div>
            <div>
              <FieldLabel htmlFor="req-major">Ngành học liên quan</FieldLabel>
              <SelectInput
                id="req-major"
                value={maNganh}
                onChange={(e) => setMaNganh(e.target.value)}
              >
                {UIT_MAJORS.map((m) => (
                  <option key={m.MaNganh} value={m.MaNganh}>{m.TenNganh}</option>
                ))}
              </SelectInput>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <FieldLabel htmlFor="req-sender" required>Họ tên người gửi</FieldLabel>
              <TextInput
                id="req-sender"
                value={nguoiGui}
                onChange={(e) => setNguoiGui(e.target.value)}
                placeholder="Họ tên sinh viên / giảng viên"
              />
            </div>
            <div>
              <FieldLabel htmlFor="req-email">Email liên hệ</FieldLabel>
              <TextInput
                id="req-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@uit.edu.vn"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="req-reason">Môn học / Lý do đề xuất</FieldLabel>
            <TextInput
              id="req-reason"
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              placeholder="Tài liệu tham khảo cho môn học hoặc khóa luận tốt nghiệp..."
            />
          </div>
        </div>

        <Button type="submit" variant="primary" disabled={submitting} className="gap-1.5">
          <Send className="w-4 h-4" />
          {submitting ? 'Đang gửi đề xuất...' : 'Gửi yêu cầu tài liệu'}
        </Button>
      </form>

      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Danh sách đề xuất đã tiếp nhận</h3>
          <span className="text-xs text-slate-500">{requests.length} yêu cầu</span>
        </div>

        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {requests.map((req) => (
            <div
              key={req.MaYeuCau}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{req.TenTaiLieu}</p>
                <span className="px-2 py-0.5 rounded bg-sky-50 text-[#0054A6] text-[11px] font-semibold shrink-0">
                  {req.TrangThai}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {req.TacGia} · Ngành {getMajorName(req.MaNganh)}
              </p>
              <p className="text-xs text-slate-500">{req.LyDo}</p>
              <p className="text-[11px] text-slate-400 pt-1">
                Đề xuất bởi {req.NguoiGui} · {formatDateVN(req.NgayGui)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
