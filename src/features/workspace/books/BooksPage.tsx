import * as React from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import { DataTable } from '../../../components/ui/data-table';
import { ConfirmDialog } from '../../../components/ui/dialog';
import type { Sach, UserRole } from '../../../types/library';
import { buildBookColumns } from './bookColumns';
import { BookFormModal } from './BookFormModal';
import { useBooks } from './useBooks';

export function BooksPage({ userRole }: { userRole: UserRole }) {
  const canManage = userRole === 'ADMIN' || userRole === 'LIBRARIAN';
  const {
    books,
    categories,
    thamSo,
    loading,
    search,
    setSearch,
    catFilter,
    setCatFilter,
    statusFilter,
    setStatusFilter,
    saveBook,
    deleteBook,
  } = useBooks();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Sach | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Sach | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const columns = React.useMemo(
    () =>
      buildBookColumns(
        canManage,
        (book) => {
          setEditing(book);
          setModalOpen(true);
        },
        (book) => setDeleteTarget(book)
      ),
    [canManage]
  );

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBook(deleteTarget);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể xóa sách.');
    } finally {
      setDeleting(false);
    }
  }

  const availableCount = books.filter((b) => b.TinhTrang === 'Có sẵn').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {canManage ? 'Kho sách & Tra cứu học liệu' : 'Tra cứu học liệu Thư viện UIT'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Tình trạng sách được xác định động theo phiếu mượn/trả hiện hành ·{' '}
            <span className="tabular-nums font-medium text-slate-700">
              {availableCount} có sẵn / {books.length - availableCount} đang mượn
            </span>
          </p>
        </div>
        {canManage ? (
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Tiếp nhận sách mới
          </Button>
        ) : null}
      </div>

      <SurfaceCard>
        <SurfaceCardHeader
          title={`Danh mục học liệu (${books.length})`}
          description="Tìm theo mã sách, tên sách, tác giả, nhà xuất bản hoặc lọc theo thể loại và tình trạng"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  aria-label="Tìm kiếm sách"
                  placeholder="Tên sách, tác giả, NXB..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg w-56 focus:outline-none focus:border-[#0054A6]"
                />
              </div>
              <select
                aria-label="Lọc theo thể loại"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0054A6]"
              >
                <option value="ALL">Tất cả thể loại</option>
                {categories.map((c) => (
                  <option key={c.MaTheLoai} value={c.MaTheLoai}>
                    {c.TenTheLoai}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {[
                  { value: 'ALL', label: 'Tất cả' },
                  { value: 'Có sẵn', label: 'Có sẵn' },
                  { value: 'Đang mượn', label: 'Đang mượn' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatusFilter(opt.value)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      statusFilter === opt.value
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          }
        />

        <DataTable
          columns={columns}
          data={books}
          loading={loading}
          emptyTitle="Không tìm thấy đầu sách phù hợp"
          emptyDescription="Hãy điều chỉnh bộ lọc hoặc từ khóa tra cứu."
        />
      </SurfaceCard>

      {canManage ? (
        <BookFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          editing={editing}
          categories={categories}
          thamSo={thamSo}
          onSave={saveBook}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xác nhận xóa đầu sách"
        description={`Bạn có chắc muốn xóa sách ${deleteTarget?.MaSach} – "${deleteTarget?.TenSach}"? Sách đã từng phát sinh phiếu mượn sẽ không thể xóa.`}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
