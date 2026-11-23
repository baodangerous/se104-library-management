import * as React from 'react';
import ForceGraph2D, { type ForceGraphMethods } from 'react-force-graph-2d';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import type { KnowledgeGraphData, KnowledgeNode } from '../../services/knowledgeMapService';

interface KnowledgeMapCanvasProps {
  graphData: KnowledgeGraphData;
  selectedNodeId: string | null;
  connectedNodeIds: Set<string>;
  onSelectNode: (node: KnowledgeNode) => void;
}

export function KnowledgeMapCanvas({
  graphData,
  selectedNodeId,
  connectedNodeIds,
  onSelectNode,
}: KnowledgeMapCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fgRef = React.useRef<ForceGraphMethods | undefined>(undefined);
  const [size, setSize] = React.useState({ width: 820, height: 540 });

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setSize({
        width: Math.max(300, Math.floor(el.clientWidth)),
        height: Math.max(340, Math.floor(el.clientHeight)),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const fg = fgRef.current;
    if (fg) {
      const charge = fg.d3Force('charge') as { strength?: (n: number) => void } | undefined;
      charge?.strength?.(-320);
      const linkForce = fg.d3Force('link') as { distance?: (n: number) => void } | undefined;
      linkForce?.distance?.(85);
      fg.d3ReheatSimulation();
    }
    const timer = window.setTimeout(() => {
      fgRef.current?.zoomToFit(450, 76);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [graphData]);

  const handleZoom = (factor: number) => {
    const current = fgRef.current?.zoom();
    if (typeof current === 'number') {
      fgRef.current?.zoom(current * factor, 250);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] rounded-xl border border-slate-200 bg-slate-950 overflow-hidden"
    >
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 backdrop-blur-xs">
        <button
          type="button"
          onClick={() => handleZoom(1.25)}
          aria-label="Phóng to"
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(0.8)}
          aria-label="Thu nhỏ"
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => fgRef.current?.zoomToFit(400, 76)}
          aria-label="Căn giữa toàn bộ đồ thị"
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-3 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-[11px] text-slate-200 backdrop-blur-xs">
        <LegendDot color="#6366F1" sizeClass="w-4 h-4" label="Ngành UIT (Lớn nhất)" />
        <LegendDot color="#F59E0B" sizeClass="w-3.5 h-3.5" label="Thể loại (Trung-lớn)" />
        <LegendDot color="#0EA5E9" sizeClass="w-2.5 h-2.5" label="Sách có sẵn" />
        <LegendDot color="#EC4899" sizeClass="w-2.5 h-2.5" label="Luận văn UIT" />
        <LegendDot color="#F97316" sizeClass="w-2.5 h-2.5" label="Đang mượn" />
        <LegendDot color="#10B981" sizeClass="w-2 h-2" label="Tác giả (Nhỏ)" />
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={size.width}
        height={size.height}
        graphData={graphData}
        backgroundColor="#0B1220"
        cooldownTicks={100}
        linkColor={(link) => {
          if (!selectedNodeId) return 'rgba(148, 163, 184, 0.28)';
          const src = typeof link.source === 'object' ? (link.source as KnowledgeNode).id : String(link.source);
          const tgt = typeof link.target === 'object' ? (link.target as KnowledgeNode).id : String(link.target);
          return src === selectedNodeId || tgt === selectedNodeId
            ? 'rgba(56, 189, 248, 0.92)'
            : 'rgba(148, 163, 184, 0.08)';
        }}
        linkWidth={(link) => {
          if (!selectedNodeId) return 1;
          const src = typeof link.source === 'object' ? (link.source as KnowledgeNode).id : String(link.source);
          const tgt = typeof link.target === 'object' ? (link.target as KnowledgeNode).id : String(link.target);
          return src === selectedNodeId || tgt === selectedNodeId ? 2 : 0.7;
        }}
        onNodeClick={(node) => {
          onSelectNode(node as KnowledgeNode);
        }}
        nodeCanvasObject={(rawNode, ctx, globalScale) => {
          const node = rawNode as KnowledgeNode & { x?: number; y?: number };
          const x = node.x ?? 0;
          const y = node.y ?? 0;
          const isSelected = node.id === selectedNodeId;
          const isHighlighted = !selectedNodeId || connectedNodeIds.has(node.id);
          const radius = Math.sqrt(Math.max(4, node.val || 6)) * 1.9;

          ctx.save();
          ctx.globalAlpha = isHighlighted ? 1 : 0.2;

          if (isSelected) {
            ctx.beginPath();
            ctx.arc(x, y, radius + 4, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color;
          ctx.fill();
          ctx.lineWidth = isSelected ? 1.8 / Math.max(1, globalScale * 0.5) : 0.8;
          ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.45)';
          ctx.stroke();

          const showLabel =
            isSelected ||
            node.type === 'MAJOR' ||
            (selectedNodeId ? connectedNodeIds.has(node.id) : globalScale >= 1.25 || node.type === 'CATEGORY');

          if (showLabel) {
            const screenPx = isSelected || node.type === 'MAJOR' ? 12 : 10.5;
            const fontSize = Math.max(3, Math.min(11, screenPx / Math.max(0.75, globalScale)));
            ctx.font = `${isSelected || node.type === 'MAJOR' ? '600' : '500'} ${fontSize}px Inter, system-ui, sans-serif`;
            const text = node.label.length > 24 ? `${node.label.slice(0, 23)}…` : node.label;
            const textWidth = ctx.measureText(text).width;
            const padX = fontSize * 0.4;
            const padY = fontSize * 0.2;
            const labelY = y + radius + fontSize * 0.45;

            ctx.fillStyle = 'rgba(11, 18, 32, 0.82)';
            ctx.fillRect(x - textWidth / 2 - padX, labelY - padY, textWidth + padX * 2, fontSize + padY * 2);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = isHighlighted ? '#F8FAFC' : 'rgba(226,232,240,0.45)';
            ctx.fillText(text, x, labelY);
          }

          ctx.restore();
        }}
      />
    </div>
  );
}

function LegendDot({
  color,
  sizeClass = 'w-2.5 h-2.5',
  label,
}: {
  color: string;
  sizeClass?: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`${sizeClass} rounded-full shrink-0 ring-1 ring-white/30`}
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </span>
  );
}
