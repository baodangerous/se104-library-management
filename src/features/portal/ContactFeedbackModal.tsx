import * as React from 'react';
import { Mail, MapPin, MessageSquarePlus, PhoneCall, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { ModalDialog } from '../../components/ui/dialog';
import { Input, Label, Select } from '../../components/ui/input';
import { serviceRequestService } from '../../services/serviceRequestService';
import type { AuthUser } from '../../types/library';

interface ContactFeedbackModalProps {
  open: boolean;
  user: AuthUser | null;
  onOpenChange: (open: boolean) => void;
}

export function ContactFeedbackModal({
  open,
  user,
  onOpenChange,
}: ContactFeedbackModalProps) {
  const [name, setName] = React.useState(user?.HoTen || '');
  const [email, setEmail] = React.useState(user?.TenDangNhap || '');
  const [topic, setTopic] = React.useState('Góp ý chất lượng dịch vụ thư viện');
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName((prev) => prev || user?.HoTen || '');
      setEmail((prev) => prev || user?.TenDangNhap || '');
    } else {
      setMessage('');
    }
  }, [open, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error('Vui lòng nhập họ tên và nội dung góp ý.');
      return;
    }
    setSending(true);
    try {
      await serviceRequestService.createBookRequest({
        TenTaiLieu: `[Góp ý / Liên hệ] ${topic}`,
        TacGia: 'Bạn đọc UIT',
        MaNganh: 'CNTT',
        NguoiGui: name.trim(),
        Email: email.trim() || 'bandoc@uit.edu.vn',
        LyDo: message.trim(),
      });
      toast.success('Đã gửi ý kiến đóng góp đến Thư viện UIT. Cảm ơn bạn!');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể gửi góp ý lúc này.');
    } finally {
      setSending(false);
    }
  }

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Liên hệ & Đóng góp ý kiến"
      description="Kết nối trực tiếp với Thư viện Trường ĐH Công nghệ Thông tin – ĐHQG-HCM"
      maxWidthClass="max-w-lg"
    >
      <div className="space-y-5">
        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <PhoneCall className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">(028) 3725 2002</p>
              <p className="text-slate-500">Thư viện Trường ĐH CNTT</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">thuvien@uit.edu.vn</p>
              <p className="text-slate-500">T2–T6: 07:30–18:00 · T7: 08:00–16:00</p>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-start gap-2 pt-1.5 border-t border-slate-200/80">
            <MapPin className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
            <p className="text-slate-600">
              Tòa nhà A, Khu phố 34, Phường Linh Xuân, TP. Hồ Chí Minh
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fb-name">Họ và tên</Label>
              <Input
                id="fb-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Nguyễn Văn An"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fb-email">Email / MSSV</Label>
              <Input
                id="fb-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="VD: 23520230@gm.uit.edu.vn"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-topic">Chủ đề</Label>
            <Select
              id="fb-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="Góp ý chất lượng dịch vụ thư viện">
                Góp ý chất lượng dịch vụ thư viện
              </option>
              <option value="Hỗ trợ tài khoản, gia hạn & OPAC">
                Hỗ trợ tài khoản, gia hạn &amp; OPAC
              </option>
              <option value="Đề xuất bổ sung sách / tài liệu">
                Đề xuất bổ sung sách / tài liệu
              </option>
              <option value="Phản ánh cơ sở vật chất & phòng học nhóm">
                Phản ánh cơ sở vật chất &amp; phòng học nhóm
              </option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-msg">Nội dung góp ý / liên hệ</Label>
            <textarea
              id="fb-msg"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập câu hỏi, phản ánh hoặc đề xuất của bạn dành cho Thư viện UIT..."
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button type="submit" disabled={sending} className="gap-1.5">
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Đang gửi...' : 'Gửi ý kiến'}
            </Button>
          </div>
        </form>
      </div>
    </ModalDialog>
  );
}

export { MessageSquarePlus };
