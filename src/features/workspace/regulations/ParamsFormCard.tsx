import * as React from 'react';
import { Save } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { Input, Label } from '../../../components/ui/input';
import type { ThamSo } from '../../../types/library';

interface ParamsFormCardProps {
  params: ThamSo | null;
  saving: boolean;
  onChangeField: (key: keyof Omit<ThamSo, 'MaThamSo'>, value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ParamsFormCard({
  params,
  saving,
  onChangeField,
  onSubmit,
}: ParamsFormCardProps) {
  return (
    <Card className="lg:col-span-6">
      <CardHeader
        title="Tham số hoạt động thư viện"
        description="Hiệu lực với thẻ độc giả và phiếu mượn lập mới sau thời điểm lưu."
      />
      <CardBody>
        {params ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-min-age">Tuổi tối thiểu (năm)</Label>
                <Input
                  id="p-min-age"
                  type="number"
                  min={1}
                  value={params.TuoiToiThieu}
                  onChange={(e) => onChangeField('TuoiToiThieu', Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-max-age">Tuổi tối đa (năm)</Label>
                <Input
                  id="p-max-age"
                  type="number"
                  min={2}
                  value={params.TuoiToiDa}
                  onChange={(e) => onChangeField('TuoiToiDa', Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-card-months">Thời hạn thẻ độc giả (tháng)</Label>
                <Input
                  id="p-card-months"
                  type="number"
                  min={1}
                  value={params.ThoiHanThe}
                  onChange={(e) => onChangeField('ThoiHanThe', Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-pub-gap">Khoảng cách năm xuất bản tối đa (năm)</Label>
                <Input
                  id="p-pub-gap"
                  type="number"
                  min={1}
                  value={params.KhoangCachNamXuatBan}
                  onChange={(e) =>
                    onChangeField('KhoangCachNamXuatBan', Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-max-books">Số sách mượn tối đa (quyển)</Label>
                <Input
                  id="p-max-books"
                  type="number"
                  min={1}
                  value={params.SoSachMuonToiDa}
                  onChange={(e) => onChangeField('SoSachMuonToiDa', Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-max-days">Số ngày mượn tối đa (ngày)</Label>
                <Input
                  id="p-max-days"
                  type="number"
                  min={1}
                  value={params.SoNgayMuonToiDa}
                  onChange={(e) => onChangeField('SoNgayMuonToiDa', Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4" />
                {saving ? 'Đang lưu...' : 'Lưu thay đổi quy định'}
              </Button>
            </div>
          </form>
        ) : null}
      </CardBody>
    </Card>
  );
}
