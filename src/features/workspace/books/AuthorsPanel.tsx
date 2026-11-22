import * as React from 'react';
import { Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import { ConfirmDialog, ModalDialog } from '../../../components/ui/dialog';
import { Input, Label } from '../../../components/ui/input';
import { bookService } from '../../../services/bookService';
import type { TacGia, UserRole } from '../../../types/library';

type AuthorRow = TacGia & { SoLuongSach?: number };

export function AuthorsPanel({ userRole }: { userRole: UserRole }) {
  const canAdd = userRole === 'ADMIN' || userRole === 'HEAD_LIBRARIAN' || userRole === 'LIBRARIAN';
  const canEditDelete = userRole === 'ADMIN' || userRole === 'HEAD_LIBRARIAN';

  const [authors, setAuthors] = React.useState<AuthorRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AuthorRow | null>(null);
  const [nameInput, setNameInput] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<AuthorRow | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      setAuthors(await bookService.listAuthors());
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh sách tác giả.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return authors;
    return authors.filter((a) => a.TenTacGia.toLowerCase().includes(q));
  }, [authors, search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await bookService.updateAuthor(editing.MaTacGia, nameInput.trim());
        toast.success('Đã cập nhật tên tác giả.');
      } else {
        await bookService.createAuthor(nameInput.trim());
        toast.success('Đã thêm tác giả mới.');
      }
      setModalOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Không thể lưu tác giả.');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await bookService.removeAuthor(deleting.MaTacGia);
      toast.success(`Đã xóa tác giả "${deleting.TenTacGia}".`);
      setDeleting(null);
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Không thể xóa tác giả.');
    }
  }

  return (
    <SurfaceCard>
      <SurfaceCardHeader
        title="Danh mục Tác giả"
        description={`${filtered.length} / ${authors.length} tác giả trong hệ thống`}
        action={
          canAdd ? (
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setNameInput('');
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Thêm tác giả
            </Button>
          ) : null
        }
      />

      <div className="p-4 border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên tác giả..."
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">Đang tải danh sách tác giả...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 w-24">Mã</th>
                <th className="px-4 py-2.5">Tên tác giả</th>
                <th className="px-4 py-2.5 w-32 text-right">Số đầu sách</th>
                {canEditDelete ? <th className="px-4 py-2.5 w-28 text-right">Thao tác</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.MaTacGia} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">#{a.MaTacGia}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {a.TenTacGia}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs text-slate-600">
                    {a.SoLuongSach ?? 0}
                  </td>
                  {canEditDelete ? (
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Sửa ${a.TenTacGia}`}
                          onClick={() => {
                            setEditing(a);
                            setNameInput(a.TenTacGia);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Xóa ${a.TenTacGia}`}
                          onClick={() => setDeleting(a)}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? 'Cập nhật tác giả' : 'Thêm tác giả mới'}
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="author-name">Tên tác giả</Label>
            <Input
              id="author-name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="VD: TS. Nguyễn Văn An"
              required
              minLength={2}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Thêm tác giả'}
            </Button>
          </div>
        </form>
      </ModalDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Xác nhận xóa tác giả"
        description={
          deleting
            ? `Bạn có chắc chắn muốn xóa tác giả "${deleting.TenTacGia}"? (Chỉ xóa được khi không còn gắn với đầu sách nào.)`
            : ''
        }
        onConfirm={confirmDelete}
      />
    </SurfaceCard>
  );
}
