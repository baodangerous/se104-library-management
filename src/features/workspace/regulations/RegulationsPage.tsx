import * as React from 'react';
import { ConfirmDialog } from '../../../components/ui/dialog';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { operationalService } from '../../../services/operationalService';
import type { ChiNhanh, KeSach, LichSuCauHinh } from '../../../types/library';
import { CategoriesCard } from './CategoriesCard';
import { CategoryModal } from './CategoryModal';
import { ParamsFormCard } from './ParamsFormCard';
import { useRegulations } from './useRegulations';

export function RegulationsPage() {
  const state = useRegulations();
  const [history, setHistory] = React.useState<LichSuCauHinh[]>([]);
  const [branches, setBranches] = React.useState<ChiNhanh[]>([]);
  const [shelves, setShelves] = React.useState<KeSach[]>([]);

  React.useEffect(() => {
    operationalService.getRegulationHistory().then(setHistory).catch(() => {});
    operationalService
      .getBranches()
      .then((d) => {
        setBranches(d.branches);
        setShelves(d.shelves);
      })
      .catch(() => {});
  }, [state.savingParams]);

  if (state.loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Đang tải tham số quy định...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Quản trị & Cấu hình"
        title="Quy định thư viện"
        description="Điều chỉnh tham số hoạt động, theo dõi lịch sử hiệu lực (QĐ31) và quản lý thể loại, chi nhánh."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <ParamsFormCard
          params={state.params}
          saving={state.savingParams}
          onChangeField={state.updateParamField}
          onSubmit={state.saveParams}
        />
        <CategoriesCard
          categories={state.categories}
          onAdd={state.openAddCategory}
          onEdit={state.openEditCategory}
          onRequestDelete={state.setDeletingCat}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-900">
            Lịch sử hiệu lực cấu hình (QĐ31)
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Tham số</th>
                <th className="px-4 py-2.5">Giá trị</th>
                <th className="px-4 py-2.5">Hiệu lực</th>
                <th className="px-4 py-2.5">Người đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h) => (
                <tr key={h.MaLichSuCauHinh}>
                  <td className="px-4 py-2 font-mono font-semibold">{h.MaCauHinh}</td>
                  <td className="px-4 py-2 font-bold text-[#0054A6]">{h.GiaTri}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {h.NgayHieuLuc} → {h.NgayHetHieuLuc || 'Đang áp dụng'}
                  </td>
                  <td className="px-4 py-2 text-slate-500">{h.NguoiThayDoi || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Chi nhánh &amp; Kệ sách ({branches.length} CN · {shelves.length} kệ)</h3>
          <div className="space-y-2">
            {branches.map((b) => (
              <div key={b.MaCN} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <p className="font-semibold text-slate-900">{b.MaCN} — {b.TenCN}</p>
                <p className="text-slate-500 mt-0.5">{b.DiaChi} · {b.SDT}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryModal
        open={state.catModalOpen}
        editingCat={state.editingCat}
        catCode={state.catCode}
        catName={state.catName}
        saving={state.savingCat}
        onOpenChange={state.setCatModalOpen}
        onChangeCode={state.setCatCode}
        onChangeName={state.setCatName}
        onSubmit={state.saveCategory}
      />

      <ConfirmDialog
        open={Boolean(state.deletingCat)}
        onOpenChange={(open) => !open && state.setDeletingCat(null)}
        title="Xác nhận xóa thể loại sách"
        description={
          state.deletingCat
            ? `Xóa thể loại "${state.deletingCat.TenTheLoai}" (${state.deletingCat.MaTheLoai})? Thao tác sẽ bị từ chối nếu đang có sách thuộc thể loại này.`
            : ''
        }
        onConfirm={state.confirmDeleteCategory}
      />
    </div>
  );
}
