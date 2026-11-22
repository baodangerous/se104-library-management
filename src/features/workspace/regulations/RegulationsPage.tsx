import { ConfirmDialog } from '../../../components/ui/dialog';
import { CategoriesCard } from './CategoriesCard';
import { CategoryModal } from './CategoryModal';
import { ParamsFormCard } from './ParamsFormCard';
import { useRegulations } from './useRegulations';

export function RegulationsPage() {
  const state = useRegulations();

  if (state.loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Đang tải tham số quy định...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Quy định thư viện</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Điều chỉnh tham số hoạt động và quản lý danh mục thể loại sách. Các thay đổi chỉ áp
          dụng cho thẻ và phiếu mượn tạo mới.
        </p>
      </div>

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
