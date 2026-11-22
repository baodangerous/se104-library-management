import { cn } from '../../lib/utils';
import type { LibraryFloorGuide } from '../../types/portal';

interface GuideFloorViewerProps {
  floor: LibraryFloorGuide;
  activePhoto: string;
  onSelectPhoto: (src: string) => void;
}

export function GuideFloorViewer({
  floor,
  activePhoto,
  onSelectPhoto,
}: GuideFloorViewerProps) {
  const activeCaption =
    floor.boSuuTap.find((p) => p.src === activePhoto)?.caption || floor.tieuDe;

  return (
    <div className="lg:col-span-7 space-y-3">
      <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
        <img
          src={activePhoto}
          alt={activeCaption}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent p-4 flex items-end justify-between gap-2">
          <div>
            <span className="inline-block px-2 py-0.5 rounded bg-[#f2b84a] text-[#0a1f4d] text-[10px] font-bold uppercase tracking-wider mb-1">
              {floor.tenTang}
            </span>
            <p className="text-sm font-bold text-white">{activeCaption}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {floor.boSuuTap.map((photo) => {
          const isCurrent = photo.src === activePhoto;
          return (
            <button
              key={photo.src}
              type="button"
              onClick={() => onSelectPhoto(photo.src)}
              className={cn(
                'shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                isCurrent
                  ? 'border-[#1556d6] ring-2 ring-[#3a86ff]/30 scale-[1.02]'
                  : 'border-slate-200 opacity-75 hover:opacity-100'
              )}
            >
              <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

