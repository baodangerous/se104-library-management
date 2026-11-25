import * as React from 'react';
import { Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { ConfirmDialog, ModalDialog } from '../../../components/ui/dialog';
import { Input, Label } from '../../../components/ui/input';
import { portalService } from '../../../services/portalService';
import type { TinHoatDong } from '../../../types/portal';

interface NewsFormState {
  tieuDe: string;
  ngayDang: string;
  chuyenMuc: string;
  hinhAnh: string;
  duongDan: string;
  tomTat: string;
}

const EMPTY_FORM: NewsFormState = {
  tieuDe: '',
  ngayDang: '',
  chuyenMuc: 'Sự kiện nổi bật',
  hinhAnh: '/resources/events/ngay-hoi-2026.jpg',
  duongDan: 'https://thuvien.uit.edu.vn/su-kien',
  tomTat: '',
};

export function NewsManagePage() {
  const [items, setItems] = React.useState<TinHoatDong[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TinHoatDong | null>(null);
  const [form, setForm] = React.useState<NewsFormState>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<TinHoatDong | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setItems(await portalService.listNewsAsync());
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh sách bài đăng.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    setEditing(null);
    setForm({ ...EMPTY_FORM, ngayDang: `${dd}/${mm}/${now.getFullYear()}` });
    setModalOpen(true);
  }

  function openEdit(item: TinHoatDong) {
    setEditing(item);
    setForm({
      tieuDe: item.tieuDe,
      ngayDang: item.ngayDang,
      chuyenMuc: item.chuyenMuc,
      hinhAnh: item.hinhAnh || '',
      duongDan: item.duongDan || '',
      tomTat: item.tomTat,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await portalService.updateNews(editing.id, form);
        toast.success('Đã cập nhật bài đăng & sự kiện.');
      } else {
        await portalService.createNews(form);
        toast.success('Đã đăng tin tức / sự kiện mới lên cổng thư viện.');
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Không thể lưu bài viết.');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await portalService.removeNews(deleting.id);
      toast.success('Đã xóa bài viết.');
      setDeleting(null);
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Không thể xóa bài viết.');
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Truyền thông Portal"
        title="Tin tức, Sự kiện & Bài đăng Portal"
        description="Đăng bài, chỉnh sửa và quản lý tin sự kiện hiển thị trên Cổng thư viện UIT."
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Đăng bài mới
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Danh sách tin tức & sự kiện"
          description={`${items.length} bài đăng đang hiển thị trên cổng`}
        />
        <CardBody className="divide-y divide-slate-100 p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Đang tải bài đăng...</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {item.hinhAnh ? (
                    <img
                      src={item.hinhAnh}
                      alt={item.tieuDe}
                      className="w-20 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Newspaper className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#0054A6]">{item.chuyenMuc}</span>
                      <span>·</span>
                      <span className="tabular-nums">{item.ngayDang}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 mt-0.5">
                      {item.tieuDe}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{item.tomTat}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <Button variant="ghost" size="icon" aria-label="Sửa bài" onClick={() => openEdit(item)}>
                    <Pencil className="w-4 h-4 text-slate-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Xóa bài"
                    onClick={() => setDeleting(item)}
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <ModalDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? 'Chỉnh sửa bài đăng' : 'Đăng tin tức / sự kiện mới'}
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="news-title">Tiêu đề bài viết</Label>
            <Input
              id="news-title"
              value={form.tieuDe}
              onChange={(e) => setForm((p) => ({ ...p, tieuDe: e.target.value }))}
              required
              minLength={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="news-cat">Chuyên mục</Label>
              <Input
                id="news-cat"
                value={form.chuyenMuc}
                onChange={(e) => setForm((p) => ({ ...p, chuyenMuc: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="news-date">Ngày đăng (DD/MM/YYYY)</Label>
              <Input
                id="news-date"
                value={form.ngayDang}
                onChange={(e) => setForm((p) => ({ ...p, ngayDang: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="news-img">Đường dẫn ảnh minh họa</Label>
            <Input
              id="news-img"
              value={form.hinhAnh}
              onChange={(e) => setForm((p) => ({ ...p, hinhAnh: e.target.value }))}
              placeholder="/resources/events/ngay-hoi-2026.jpg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="news-url">Liên kết chi tiết (tùy chọn)</Label>
            <Input
              id="news-url"
              value={form.duongDan}
              onChange={(e) => setForm((p) => ({ ...p, duongDan: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="news-summary">Tóm tắt nội dung</Label>
            <textarea
              id="news-summary"
              rows={3}
              value={form.tomTat}
              onChange={(e) => setForm((p) => ({ ...p, tomTat: e.target.value }))}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Đăng bài'}
            </Button>
          </div>
        </form>
      </ModalDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Xác nhận xóa bài viết"
        description={deleting ? `Bạn có chắc muốn xóa bài "${deleting.tieuDe}"?` : ''}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
