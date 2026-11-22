import { BookOpen, Link2, Sparkles, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { KnowledgeNode } from '../../services/knowledgeMapService';
import type { Sach } from '../../types/library';

const TYPE_LABELS: Record<KnowledgeNode['type'], string> = {
  MAJOR: 'Ngành đào tạo UIT',
  CATEGORY: 'Thể loại học liệu',
  BOOK: 'Đầu sách / Tài liệu',
  AUTHOR: 'Tác giả',
};

interface KnowledgeMapDrawerProps {
  node: KnowledgeNode | null;
  neighbors: KnowledgeNode[];
  onSelectNeighbor: (node: KnowledgeNode) => void;
  onClearSelection: () => void;
  onOpenBookDetail?: (book: Sach) => void;
}

export function KnowledgeMapDrawer({
  node,
  neighbors,
  onSelectNeighbor,
  onClearSelection,
  onOpenBookDetail,
}: KnowledgeMapDrawerProps) {
  if (!node) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-[540px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0054A6]/10 text-[#0054A6] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Chi tiết nút tri thức</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhấn vào bất kỳ nút <strong>Ngành học</strong>, <strong>Thể loại</strong>,{' '}
            <strong>Đầu sách</strong> hoặc <strong>Tác giả</strong> trên bản đồ bên trái để làm nổi
            bật mạng lưới liên kết và xem tình trạng sách theo thời gian thực.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Mẹo thao tác nhanh</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Cuộn chuột để phóng to / thu nhỏ đồ thị.</li>
            <li>Kéo thả từng nút để sắp xếp lại cụm tri thức.</li>
            <li>Lọc theo Ngành học (VD: An toàn Thông tin) để tập trung tài liệu chuyên ngành.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-[540px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
        <div className="min-w-0">
          <span
            className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold text-white mb-1.5"
            style={{ backgroundColor: node.color }}
          >
            {TYPE_LABELS[node.type]}
          </span>
          <h2 className="text-sm font-bold text-slate-900 leading-snug break-words">
            {node.label}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{node.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClearSelection}
          aria-label="Bỏ chọn nút"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="space-y-2">
          {Object.entries(node.meta).map(([key, val]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-3 text-xs py-1.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-slate-500 shrink-0">{key}</span>
              <span className="text-slate-900 font-medium text-right break-words">{val}</span>
            </div>
          ))}
        </div>

        {node.book && onOpenBookDetail ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full gap-1.5"
            onClick={() => onOpenBookDetail(node.book!)}
          >
            <BookOpen className="w-4 h-4" />
            Mở hồ sơ chi tiết sách
          </Button>
        ) : null}

        {/* Connected Nodes */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-[#0054A6]" />
            Liên kết trực tiếp ({neighbors.length})
          </p>
          <div className="space-y-1.5">
            {neighbors.map((nb) => (
              <button
                key={nb.id}
                type="button"
                onClick={() => onSelectNeighbor(nb)}
                className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-[#0054A6]/50 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2.5"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: nb.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{nb.label}</p>
                  <p className="text-[11px] text-slate-500 truncate">{nb.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
