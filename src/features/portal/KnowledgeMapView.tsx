import * as React from 'react';
import { BookOpen, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { portalService } from '../../services/portalService';
import {
  buildKnowledgeGraph,
  knowledgeMapService,
  searchRelatedCatalog,
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
  const [searchQuery, setSearchQuery] = React.useState<string>('');
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
    () => buildKnowledgeGraph(books, categories, { majorFilter, categoryFilter, query: searchQuery }),
    [books, categories, majorFilter, categoryFilter, searchQuery]
  );

  const searchHits = React.useMemo(
    () => (searchQuery.trim() ? searchRelatedCatalog(books, searchQuery, 18) : []),
    [books, searchQuery]
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
    setSearchQuery('');
    setSelectedNodeId(null);
  };

  const QUICK_TOPICS = ['Deep learning', 'FPGA', 'An toàn thông tin', 'Blockchain', 'IoT', 'NLP'];

  return (
    <div className="space-y-5">
      {/* Header + Search Engine + Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Bản đồ Tri thức Học liệu UIT</h1>
            <p className="text-xs text-slate-500 mt-1">
              Tìm kiếm theo chủ đề, môn học, tác giả hoặc nhấn vào nút trên đồ thị để khám phá tài liệu liên quan ({graphData.nodes.length} nút · {graphData.links.length} liên kết).
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

        {/* Search Engine Bar */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tài liệu & chủ đề liên quan (VD: deepfake, FPGA, CS231, Nguyễn Vinh Tiệp)..."
                className="w-full h-10 pl-9 pr-9 rounded-lg border border-slate-200 bg-slate-50/70 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0054A6] focus:outline-none focus:ring-2 focus:ring-[#0054A6]/15"
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Xóa từ khóa"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 inline-flex items-center gap-1 mr-0.5">
                <Sparkles className="w-3 h-3 text-[#0054A6]" /> Gợi ý:
              </span>
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSearchQuery(topic)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === topic.toLowerCase()
                      ? 'bg-[#0054A6] text-white border-[#0054A6]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0054A6]/50 hover:text-[#0054A6]'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {searchQuery.trim() ? (
            <div className="space-y-1.5">
              <p className="text-xs text-slate-600">
                {searchHits.length > 0 ? (
                  <>
                    Tìm thấy <strong className="text-[#0054A6]">{searchHits.filter((h) => h.matchType === 'direct').length}</strong> tài liệu khớp trực tiếp
                    {searchHits.some((h) => h.matchType === 'related')
                      ? ` và ${searchHits.filter((h) => h.matchType === 'related').length} tài liệu liên quan cùng ngành/tác giả`
                      : ''}
                    . Nhấn vào kết quả để định vị trên bản đồ:
                  </>
                ) : (
                  'Không tìm thấy tài liệu phù hợp với từ khóa này.'
                )}
              </p>
              {searchHits.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {searchHits.map(({ book, matchType }) => {
                    const active = selectedNodeId === `BOOK:${book.MaSach}`;
                    return (
                      <button
                        key={book.MaSach}
                        type="button"
                        onClick={() => setSelectedNodeId(`BOOK:${book.MaSach}`)}
                        className={`shrink-0 max-w-[260px] text-left px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                          active
                            ? 'bg-[#0054A6]/10 border-[#0054A6] text-[#0054A6]'
                            : 'bg-white border-slate-200 hover:border-[#0054A6]/50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-mono text-[10px] font-semibold text-slate-500 inline-flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-[#0054A6]" />
                            {book.MaSach} · {book.MaNganh || 'CNTT'}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9.5px] font-semibold ${
                              matchType === 'direct'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {matchType === 'direct' ? 'Khớp' : 'Liên quan'}
                          </span>
                        </div>
                        <p className="font-semibold line-clamp-1">{book.TenSach}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {book.TacGiaList.join(', ')} ({book.NamXuatBan})
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
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
