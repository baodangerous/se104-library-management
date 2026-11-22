import * as React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { portalService } from '../../services/portalService';
import {
  buildKnowledgeGraph,
  knowledgeMapService,
  type KnowledgeNode,
} from '../../services/knowledgeMapService';
import type { Sach, TheLoai } from '../../types/library';
import { KnowledgeMapCanvas } from './KnowledgeMapCanvas';
import { KnowledgeMapDrawer } from './KnowledgeMapDrawer';

interface KnowledgeMapViewProps {
  initialMajor?: string;
  initialBookId?: string | null;
  onOpenBookDetail?: (book: Sach) => void;
}

export function KnowledgeMapView({
  initialMajor = 'ALL',
  initialBookId = null,
  onOpenBookDetail,
}: KnowledgeMapViewProps) {
  const UIT_MAJORS = React.useMemo(() => portalService.listMajors(), []);
  const [books, setBooks] = React.useState<Sach[]>([]);
  const [categories, setCategories] = React.useState<TheLoai[]>([]);
  const [majorFilter, setMajorFilter] = React.useState<string>(initialMajor);
  const [categoryFilter, setCategoryFilter] = React.useState<string>('ALL');
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(
    initialBookId ? `BOOK:${initialBookId}` : null
  );

  React.useEffect(() => {
    setMajorFilter(initialMajor);
    if (initialMajor !== 'ALL' && !initialBookId) {
      setSelectedNodeId(`MAJOR:${initialMajor}`);
    }
  }, [initialMajor, initialBookId]);

  React.useEffect(() => {
    if (initialBookId) {
      setSelectedNodeId(`BOOK:${initialBookId}`);
    }
  }, [initialBookId]);

  React.useEffect(() => {
    knowledgeMapService.fetchCatalog().then(({ books: b, categories: c }) => {
      setBooks(b);
      setCategories(c);
    });
  }, []);

  const graphData = React.useMemo(
    () => buildKnowledgeGraph(books, categories, { majorFilter, categoryFilter }),
    [books, categories, majorFilter, categoryFilter]
  );

  const selectedNode = React.useMemo(
    () => graphData.nodes.find((n) => n.id === selectedNodeId) || null,
    [graphData.nodes, selectedNodeId]
  );

  const { connectedNodeIds, neighbors } = React.useMemo(() => {
    const idSet = new Set<string>();
    if (!selectedNodeId) return { connectedNodeIds: idSet, neighbors: [] as KnowledgeNode[] };
    idSet.add(selectedNodeId);
    for (const link of graphData.links) {
      const src = typeof link.source === 'object' ? (link.source as KnowledgeNode).id : String(link.source);
      const tgt = typeof link.target === 'object' ? (link.target as KnowledgeNode).id : String(link.target);
      if (src === selectedNodeId) idSet.add(tgt);
      if (tgt === selectedNodeId) idSet.add(src);
    }
    const list = graphData.nodes.filter((n) => n.id !== selectedNodeId && idSet.has(n.id));
    return { connectedNodeIds: idSet, neighbors: list };
  }, [graphData, selectedNodeId]);

  const handleReset = () => {
    setMajorFilter('ALL');
    setCategoryFilter('ALL');
    setSelectedNodeId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header + Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bản đồ Tri thức Học liệu UIT</h1>
          <p className="text-xs text-slate-500 mt-1">
            Mạng lưới kết nối trực quan giữa Ngành đào tạo, Thể loại, Đầu sách và Tác giả. Nhấn vào
            một nút để xem liên kết và tình trạng lưu thông.
          </p>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0">
          <select
            aria-label="Lọc đồ thị theo ngành học"
            value={majorFilter}
            onChange={(e) => {
              const val = e.target.value;
              setMajorFilter(val);
              setSelectedNodeId(val === 'ALL' ? null : `MAJOR:${val}`);
            }}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
          >
            <option value="ALL">Tất cả 12 ngành UIT</option>
            {UIT_MAJORS.map((m) => (
              <option key={m.MaNganh} value={m.MaNganh}>
                {m.TenNganh}
              </option>
            ))}
          </select>

          <select
            aria-label="Lọc đồ thị theo thể loại"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
          >
            <option value="ALL">Tất cả thể loại</option>
            {categories.map((c) => (
              <option key={c.MaTheLoai} value={c.MaTheLoai}>
                {c.TenTheLoai}
              </option>
            ))}
          </select>

          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 whitespace-nowrap">
            <RotateCcw className="w-3.5 h-3.5" />
            Toàn cảnh
          </Button>
        </div>
      </div>

      {/* Interactive Graph + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <KnowledgeMapCanvas
            graphData={graphData}
            selectedNodeId={selectedNodeId}
            connectedNodeIds={connectedNodeIds}
            onSelectNode={(node) => setSelectedNodeId(node.id)}
          />
        </div>
        <div className="lg:col-span-4">
          <KnowledgeMapDrawer
            node={selectedNode}
            neighbors={neighbors}
            onSelectNeighbor={(nb) => setSelectedNodeId(nb.id)}
            onClearSelection={() => setSelectedNodeId(null)}
            onOpenBookDetail={onOpenBookDetail}
          />
        </div>
      </div>
    </div>
  );
}
