import * as React from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import { DataTable } from '../../../components/ui/data-table';
import { ConfirmDialog } from '../../../components/ui/dialog';
import type { DocGia } from '../../../types/library';
import { buildReaderColumns } from './readerColumns';
import { ReaderFormModal } from './ReaderFormModal';
import { useReaders } from './useReaders';

export function ReadersPage() {
  const {
    readers,
    loaiList,
    thamSo,
    loading,
    search,
    setSearch,
    loaiFilter,
    setLoaiFilter,
    saveReader,
    deleteReader,
    renewReaderCard,
  } = useReaders();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DocGia | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<DocGia | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const columns = React.useMemo(
    () =>
      buildReaderColumns(
        (reader) => {
          setEditing(reader);
          setModalOpen(true);
        },
        (reader) => setDeleteTarget(reader),
        (reader) => {
          renewReaderCard(reader).catch((err: any) =>
            toast.error(err?.message || 'Không thể gia hạn thẻ.')
          );
        }
      ),
    [renewReaderCard]
  );

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteReader(deleteTarget);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể xóa độc giả.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý thẻ độc giả
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {thamSo
              ? `Độ tuổi lập thẻ từ ${thamSo.TuoiToiThieu} đến ${thamSo.TuoiToiDa} tuổi · Thời hạn thẻ ${thamSo.ThoiHanThe} tháng.`
              : 'Lập thẻ mới và theo dõi hiệu lực thẻ độc giả UIT.'}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Lập thẻ độc giả
        </Button>
      </div>

      <SurfaceCard>
        <SurfaceCardHeader
          title={`Danh sách độc giả (${readers.length})`}
          description="Tìm kiếm theo mã độc giả, họ tên, email hoặc lọc theo loại độc giả"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  aria-label="Tìm kiếm độc giả"
                  placeholder="Tìm mã, họ tên, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg w-56 focus:outline-none focus:border-[#0054A6]"
                />
              </div>
              <select
                aria-label="Lọc theo loại độc giả"
                value={loaiFilter}
                onChange={(e) => setLoaiFilter(e.target.value)}
                className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0054A6]"
              >
                <option value="ALL">Tất cả loại độc giả</option>
                {loaiList.map((l) => (
                  <option key={l.MaLoaiDocGia} value={l.MaLoaiDocGia}>
                    {l.TenLoaiDocGia}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        <DataTable
          columns={columns}
          data={readers}
          loading={loading}
          emptyTitle="Không tìm thấy độc giả"
          emptyDescription="Thử thay đổi từ khóa tìm kiếm hoặc nhấn Lập thẻ độc giả để thêm mới."
        />
      </SurfaceCard>

      <ReaderFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        loaiList={loaiList}
        thamSo={thamSo}
        onSave={saveReader}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xác nhận xóa thẻ độc giả"
        description={`Bạn có chắc muốn xóa thẻ độc giả ${deleteTarget?.MaDocGia} – ${deleteTarget?.HoTen}? Thao tác này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
