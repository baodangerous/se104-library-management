import type {
  BanSao,
  BienBanKiemKe,
  ChiNhanh,
  DanhGiaSach,
  DonDatMua,
  GiaoDichThanhToan,
  KeHoachMuaSam,
  KeSach,
  LichSuCauHinh,
  LichSuTrangThaiBanSao,
  NgoaiLeMuon,
  NhaCungCap,
  PhamViChiNhanh,
  PhieuBoiThuong,
  PhieuDieuChinh,
  PhieuDieuChuyen,
  PhieuThanhLy,
  PhieuTiepNhan,
  QuyenItem,
  TaiNguyenSo,
  TheThuVien,
  TransferStatus,
  UserRole,
  VaiTroQuyen,
} from '../types/library';
import { apiRequest } from './apiClient';

export const operationalService = {
  // Branches & Shelves
  getBranches(): Promise<{ branches: ChiNhanh[]; shelves: KeSach[] }> {
    return apiRequest('/ops/branches');
  },
  createBranch(payload: ChiNhanh): Promise<ChiNhanh> {
    return apiRequest('/ops/branches', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  createShelf(payload: { MaKe: string; MaCN: string; ViTri: string }): Promise<KeSach> {
    return apiRequest('/ops/shelves', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Physical Copies & History
  listCopies(params?: { maSach?: string; maCN?: string; q?: string }): Promise<BanSao[]> {
    const sp = new URLSearchParams();
    if (params?.maSach) sp.set('maSach', params.maSach);
    if (params?.maCN) sp.set('maCN', params.maCN);
    if (params?.q) sp.set('q', params.q);
    const qs = sp.toString();
    return apiRequest(`/ops/copies${qs ? `?${qs}` : ''}`);
  },
  createCopies(payload: {
    MaSach: string;
    MaCN: string;
    MaKe?: string | null;
    SoLuong: number;
  }): Promise<{ created: string[] }> {
    return apiRequest('/ops/copies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateCopyStatus(
    maBanSao: string,
    payload: { TinhTrang: BanSao['TinhTrang']; MaKe?: string | null; LyDo?: string }
  ): Promise<{ ok: boolean }> {
    return apiRequest(`/ops/copies/${encodeURIComponent(maBanSao)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
  getCopyHistory(maBanSao: string): Promise<LichSuTrangThaiBanSao[]> {
    return apiRequest(`/ops/copies/${encodeURIComponent(maBanSao)}/history`);
  },

  // Card Lifecycle
  listCards(maDocGia: string): Promise<TheThuVien[]> {
    return apiRequest(`/ops/cards/${encodeURIComponent(maDocGia)}`);
  },
  renewCard(maDocGia: string): Promise<{ MaDocGia: string; NgayHetHan: string }> {
    return apiRequest(`/ops/cards/${encodeURIComponent(maDocGia)}/renew`, { method: 'POST' });
  },
  lockCard(maDocGia: string, LyDoKhoa: string): Promise<{ ok: boolean }> {
    return apiRequest(`/ops/cards/${encodeURIComponent(maDocGia)}/lock`, {
      method: 'POST',
      body: JSON.stringify({ LyDoKhoa }),
    });
  },
  reportLostCard(maDocGia: string): Promise<{ MaTheMoi: string; NgayHetHan: string }> {
    return apiRequest(`/ops/cards/${encodeURIComponent(maDocGia)}/report-lost`, { method: 'POST' });
  },

  // Permissions & Branch Scope
  getPermissionMatrix(): Promise<{
    permissions: QuyenItem[];
    rolePermissions: VaiTroQuyen[];
    branchScopes: PhamViChiNhanh[];
    branches: ChiNhanh[];
  }> {
    return apiRequest('/ops/permissions/matrix');
  },
  toggleRolePermission(payload: {
    MaVaiTro: UserRole;
    MaQuyen: string;
    enabled: boolean;
  }): Promise<{ ok: boolean }> {
    return apiRequest('/ops/permissions/role', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  toggleBranchScope(payload: {
    MaTaiKhoan: number;
    MaCN: string;
    enabled: boolean;
  }): Promise<{ ok: boolean }> {
    return apiRequest('/ops/permissions/branch-scope', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Effective-dated Config History
  getRegulationHistory(): Promise<LichSuCauHinh[]> {
    return apiRequest('/ops/regulations/history');
  },

  // Acquisitions
  getAcquisitions(): Promise<{
    plans: KeHoachMuaSam[];
    suppliers: NhaCungCap[];
    orders: DonDatMua[];
    receipts: PhieuTiepNhan[];
    suggestions: Array<{
      MaYeuCau: string;
      TenTaiLieu: string;
      TacGia: string;
      MaNganh: string;
      NguoiGui: string;
      Email: string;
      LyDo: string;
      NgayGui: string;
      TrangThai: string;
    }>;
  }> {
    return apiRequest('/ops/acquisitions');
  },
  createPlan(payload: {
    TenKeHoach: string;
    NganSach: number;
    NgayBatDau: string;
    NgayKetThuc?: string;
  }): Promise<{ MaKeHoach: string }> {
    return apiRequest('/ops/acquisitions/plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  createSupplier(payload: {
    TenNCC: string;
    DiaChi?: string;
    SDT?: string;
    Email?: string;
  }): Promise<{ MaNCC: string }> {
    return apiRequest('/ops/acquisitions/suppliers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  createOrder(payload: {
    MaKeHoach: string;
    MaNCC: string;
    ChiTiet: Array<{ TenTaiLieuDat: string; SoLuongDat: number; DonGia: number }>;
  }): Promise<{ MaDonDatMua: string; TongTien: number }> {
    return apiRequest('/ops/acquisitions/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  receiveOrder(payload: {
    MaDonDatMua: string;
    SoLuongThucNhan: number;
    TinhTrangHang: 'Đạt' | 'Thiếu' | 'Thừa' | 'Lỗi chất lượng';
    GhiChuChenhLech?: string;
  }): Promise<{ MaPhieuTiepNhan: string; TrangThaiDon: string }> {
    return apiRequest('/ops/acquisitions/receive', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Inter-branch Transfers
  listTransfers(): Promise<PhieuDieuChuyen[]> {
    return apiRequest('/ops/transfers');
  },
  createTransfer(payload: { MaBanSao: string; ChiNhanhNhan: string }): Promise<{ SoPhieuDC: string }> {
    return apiRequest('/ops/transfers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  transitionTransfer(
    soPhieu: string,
    nextStatus: Exclude<TransferStatus, 'Nháp' | 'Chờ duyệt'>
  ): Promise<{ SoPhieuDC: string; TrangThai: string }> {
    return apiRequest(`/ops/transfers/${encodeURIComponent(soPhieu)}/transition`, {
      method: 'POST',
      body: JSON.stringify({ nextStatus }),
    });
  },

  // Inventory, Disposal & Compensation
  getInventoryOverview(): Promise<{
    sessions: BienBanKiemKe[];
    disposals: PhieuThanhLy[];
    compensations: PhieuBoiThuong[];
  }> {
    return apiRequest('/ops/inventory');
  },
  createInventorySession(payload: {
    MaCN: string;
    ChiTiet: Array<{ MaSach: string; SoLuongThucTe: number }>;
  }): Promise<{ MaBBKK: string }> {
    return apiRequest('/ops/inventory', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  approveInventory(maBBKK: string): Promise<{ ok: boolean }> {
    return apiRequest(`/ops/inventory/${encodeURIComponent(maBBKK)}/approve`, { method: 'POST' });
  },
  createDisposal(payload: { MaBanSao: string; LyDo: string }): Promise<{ SoPhieuTL: string }> {
    return apiRequest('/ops/disposals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  decideDisposal(soPhieu: string, decision: 'Đã duyệt' | 'Từ chối'): Promise<{ ok: boolean }> {
    return apiRequest(`/ops/disposals/${encodeURIComponent(soPhieu)}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    });
  },
  createCompensation(payload: {
    MaDocGia: string;
    MaBanSao: string;
    LoaiSuCo: 'Mất' | 'Hư hỏng';
  }): Promise<{ SoPhieuBT: string; TongBoiThuong: number }> {
    return apiRequest('/ops/compensations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Finance Reconciliation, Adjustments & Online Payment
  getFinanceReconcile(): Promise<{
    totalSystemCash: number;
    totalOnline: number;
    totalApprovedAdjustments: number;
    netReconciled: number;
    onlineTransactions: GiaoDichThanhToan[];
    adjustments: PhieuDieuChinh[];
  }> {
    return apiRequest('/ops/finance/reconcile');
  },
  createAdjustment(payload: {
    LoaiChungTu: 'PhieuPhat' | 'PhieuBoiThuong' | 'GiaoDichThanhToan';
    MaChungTuGoc: string;
    SoTienDieuChinh: number;
    LyDo: string;
  }): Promise<{ MaPhieuDieuChinh: string }> {
    return apiRequest('/ops/finance/adjustments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  decideAdjustment(maPhieu: string, decision: 'Đã duyệt' | 'Từ chối'): Promise<{ ok: boolean }> {
    return apiRequest(`/ops/finance/adjustments/${encodeURIComponent(maPhieu)}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    });
  },
  payOnline(payload: {
    MaDocGia: string;
    KenhThanhToan: 'VNPay' | 'Momo' | 'ZaloPay';
    SoTien: number;
    MaGD_CongThanhToan: string;
  }): Promise<{ MaGD: string; ConLai: number }> {
    return apiRequest('/ops/finance/online-pay', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Quota Overrides
  listOverrides(): Promise<NgoaiLeMuon[]> {
    return apiRequest('/ops/overrides');
  },
  createOverride(payload: {
    MaDocGia: string;
    SoLuongThem: number;
    LyDo: string;
    HanApDung: string;
  }): Promise<{ MaNgoaiLe: string }> {
    return apiRequest('/ops/overrides', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  decideOverride(maNgoaiLe: string, decision: 'Đã duyệt' | 'Từ chối'): Promise<{ ok: boolean }> {
    return apiRequest(`/ops/overrides/${encodeURIComponent(maNgoaiLe)}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    });
  },

  // Book Extras (Copies, Digital Resource, Reviews)
  getBookExtras(maSach: string): Promise<{
    reviews: DanhGiaSach[];
    digital: TaiNguyenSo | null;
    copies: BanSao[];
  }> {
    return apiRequest(`/ops/books/${encodeURIComponent(maSach)}/extras`);
  },
  submitBookReview(maSach: string, payload: { SoSao: number; NoiDung: string }): Promise<{ ok: boolean }> {
    return apiRequest(`/ops/books/${encodeURIComponent(maSach)}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
