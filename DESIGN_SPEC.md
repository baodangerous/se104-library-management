# DESIGN_SPEC.md — UIT Library (Knowledge Grid)

## 1. Product Vision & Strategy
UIT Library is a unified university library platform for **Trường Đại học Công nghệ Thông tin — ĐHQG-HCM (UIT–VNUHCM)** combining:
1. **Reader Discovery Portal**: Search, filter, 3D symbolic/cover browsing, interactive Obsidian-style Knowledge Map, room booking, document suggestions, personal loan/fine history, online fine payment, and self-service card lifecycle.
2. **Role-Specific Operational Workspace**: Dedicated workspaces for **5 roles** (`READER`, `LIBRARIAN`, `CATALOGER`, `HEAD_LIBRARIAN`, `ADMIN`) backed by a real SQLite database and Express REST API.

## 2. Visual Concept: KNOWLEDGE GRID
- **Palette & Tokens**: Deep navy (`#030a24` / `#0054A6`), technology blue (`#1556d6`), accent cyan (`#4de1ff`), alert amber/rose, and clean off-white (`#f8fafc`).
- **Typography**: Unified `Inter` sans-serif across all UI surfaces with strict numeric clarity (`tabular-nums`) and Vietnamese diacritic support.
- **Density Rule**: Visual-first scanning — compact headers, tabular operational grids, status badges, and modal/drawer progressive disclosure instead of long prose walls.

## 3. Role-Specific Workspaces (5 Roles)
| Role | Vietnamese Title | Primary Workspace Focus |
|---|---|---|
| `READER` | Độc giả / Sinh viên | Discovery, reservations, loan renewal, online fine payment, card renewal/lost report, room booking |
| `LIBRARIAN` | Thủ thư | Circulation desk (borrow/return), reader & card lifecycle, transfers, stock-taking, counter fine collection |
| `CATALOGER` | Nhân viên biên mục | Bibliographic records, physical copies (`BANSAO`), suppliers, purchase order receiving, disposal proposals |
| `HEAD_LIBRARIAN` | Quản lý thư viện | Approvals (transfers, inventory adjustments, disposals, financial adjustments, quota overrides), plans/budgets, news, regulations, reports |
| `ADMIN` | Quản trị hệ thống | Accounts, granular permission matrix (`QUYEN` / `VAITROQUYEN`), branch scope (`PHAMVICHINHANH`), audit logs, SQLite backup/restore |

## 4. Accessibility & Responsive Behavior
- Responsive sidebar + mobile drawer (`AppShell`) and horizontally scrollable data tables.
- Visible keyboard focus rings (`focus:ring-2`), semantic `<button type="button">` controls, and `aria-label` attributes on icon controls.
