import * as React from 'react';
import { AlertTriangle, DatabaseBackup, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { ConfirmDialog } from '../../../components/ui/dialog';
import { adminService } from '../../../services/adminService';

export function BackupPage() {
  const [exporting, setExporting] = React.useState(false);
  const [restoring, setRestoring] = React.useState(false);
  const [pendingSnapshot, setPendingSnapshot] = React.useState<Record<string, unknown> | null>(
    null
  );
  const [pendingFilename, setPendingFilename] = React.useState('');
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function handleExport() {
    try {
      setExporting(true);
      const data = await adminService.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      a.href = url;
      a.download = `UIT_Library_Backup_${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Đã xuất bản sao lưu toàn bộ 12 bảng nghiệp vụ (JSON).');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xuất sao lưu');
    } finally {
      setExporting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== 'object' || !parsed.tables) {
          toast.error('File JSON không đúng định dạng sao lưu của Thư viện UIT.');
          return;
        }
        setPendingSnapshot(parsed);
        setPendingFilename(file.name);
      } catch {
        toast.error('Không thể đọc file JSON sao lưu.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function confirmRestore() {
    if (!pendingSnapshot) return;
    try {
      setRestoring(true);
      await adminService.restoreBackup(pendingSnapshot);
      toast.success('Đã khôi phục dữ liệu từ bản sao lưu thành công.');
      setPendingSnapshot(null);
      setPendingFilename('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Khôi phục dữ liệu thất bại');
    } finally {
      setRestoring(false);
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Quản trị & Bảo mật"
        title="Sao lưu & Khôi phục dữ liệu"
        description="Xuất bản sao lưu dữ liệu thư viện dưới dạng tệp JSON an toàn hoặc khôi phục lại trạng thái hệ thống."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader
            title="Xuất bản sao lưu"
            description="Bao gồm toàn bộ dữ liệu độc giả, danh mục sách, tác giả, phiếu mượn trả, thu phạt và quy định."
          />
          <CardBody className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3 text-xs text-slate-600">
              <DatabaseBackup className="w-8 h-8 text-[#0054A6] shrink-0" />
              <p>
                Bản sao lưu lưu trữ cấu trúc dữ liệu đầy đủ để phục hồi nhanh khi cần bảo trì
                hoặc chuyển đổi máy chủ thư viện.
              </p>
            </div>
            <Button onClick={handleExport} disabled={exporting} className="w-full">
              <Download className="w-4 h-4" />
              {exporting ? 'Đang tạo bản sao lưu...' : 'Tải xuống file sao lưu (.JSON)'}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Khôi phục dữ liệu (Restore)"
            description="Ghi đè toàn bộ 12 bảng nghiệp vụ từ file JSON sao lưu hợp lệ."
          />
          <CardBody className="space-y-4">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Thao tác khôi phục sẽ thay thế dữ liệu nghiệp vụ hiện tại bằng nội dung trong
                file sao lưu. Tài khoản đăng nhập và Nhật ký thao tác vẫn được giữ nguyên.
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4" /> Chọn file sao lưu (.JSON) để khôi phục
            </Button>
          </CardBody>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(pendingSnapshot)}
        onOpenChange={(open) => !open && setPendingSnapshot(null)}
        title="Xác nhận khôi phục cơ sở dữ liệu"
        description={`Bạn có chắc chắn muốn ghi đè toàn bộ 12 bảng nghiệp vụ từ file "${pendingFilename}"? Thao tác này không thể tự động hoàn tác.`}
        confirmLabel="Khôi phục ngay"
        onConfirm={confirmRestore}
        loading={restoring}
      />
    </div>
  );
}
