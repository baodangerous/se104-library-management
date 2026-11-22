import * as React from 'react';
import {
  Armchair,
  BookOpen,
  BookOpenCheck,
  CalendarCheck,
  ExternalLink,
  Headset,
  Laptop,
  Layers,
  Trash2,
  Users,
  VolumeX,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { portalService } from '../../services/portalService';
import type { PortalTabId } from '../../types/portal';
import { GuideFloorViewer } from './GuideFloorViewer';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Headset,
  BookOpenCheck,
  Users,
  BookOpen,
  VolumeX,
  Armchair,
  Trash2,
};

export function LibraryGuideSection({
  onNavigateTab,
}: {
  onNavigateTab: (tab: PortalTabId) => void;
}) {
  const guide = React.useMemo(() => portalService.getGuide(), []);
  const [floorId, setFloorId] = React.useState<'ground' | 'floor2'>('floor2');
  const activeFloor = guide.tang.find((t) => t.id === floorId) || guide.tang[0];
  const [activePhoto, setActivePhoto] = React.useState(activeFloor.anhChinh);

  React.useEffect(() => {
    setActivePhoto(activeFloor.anhChinh);
  }, [activeFloor]);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="h-1 w-full uit-light-strip" />
      <div className="p-6 space-y-6">
        {/* Header + Floor Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3a86ff] to-[#1556d6] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Hướng dẫn sử dụng &amp; Khám phá Không gian Thư viện UIT
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn tầng để xem khu vực học tập thực tế, đặt phòng nhóm và quy tắc sử dụng
              </p>
            </div>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
            {guide.tang.map((t) => {
              const selected = t.id === floorId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFloorId(t.id)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    selected
                      ? 'bg-gradient-to-r from-[#3a86ff] to-[#1556d6] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {t.tenTang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Showcase: Real Photos Left + Zones & Links Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <GuideFloorViewer
            floor={activeFloor}
            activePhoto={activePhoto}
            onSelectPhoto={setActivePhoto}
          />

          {/* Floor Zones + Group Room Links */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2.5">
              {activeFloor.khuVuc.map((zone) => {
                const Icon = ICON_MAP[zone.icon] || BookOpen;
                return (
                  <div
                    key={zone.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0054A6]/10 text-[#0054A6] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-900">{zone.tenKhuVuc}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {zone.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{zone.moTaNgan}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Group Study Room Quick Links */}
            <div className="grid grid-cols-2 gap-2">
              {guide.lienKetDatPhong.map((item) =>
                item.loai === 'internal' ? (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigateTab(item.url as PortalTabId)}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#3a86ff] to-[#1556d6] text-white text-left hover:brightness-110 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">{item.tieuDe}</span>
                      <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <p className="text-[10px] text-sky-100 mt-0.5 truncate">{item.moTa}</p>
                  </button>
                ) : (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#1556d6]/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between gap-1 text-slate-900 group-hover:text-[#0054A6]">
                      <span className="text-xs font-bold truncate">{item.tieuDe}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{item.moTa}</p>
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Visual Etiquette Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {guide.noiQuyTrucQuan.map((rule) => {
            const Icon = ICON_MAP[rule.icon] || Headset;
            return (
              <div
                key={rule.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0054A6]/10 text-[#0054A6] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{rule.tieuDe}</p>
                  <p className="text-[11px] text-slate-500 truncate">{rule.nhan}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
