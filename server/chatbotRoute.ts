import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { Router } from 'express';
import { z } from 'zod';

export const chatbotRouter = Router();

const askSchema = z.object({
  query: z.string().trim().min(1).max(600),
  context: z.object({
    totalBooks: z.number(),
    availableBooks: z.number(),
    readyRooms: z.number(),
    params: z.object({
      TuoiToiThieu: z.number(),
      TuoiToiDa: z.number(),
      ThoiHanThe: z.number(),
      KhoangCachNamXuatBan: z.number(),
      SoSachMuonToiDa: z.number(),
      SoNgayMuonToiDa: z.number(),
    }),
    matchedBooks: z
      .array(
        z.object({
          MaSach: z.string(),
          TenSach: z.string(),
          TenNganh: z.string().optional(),
          TinhTrang: z.string(),
          MaKeSach: z.string().optional(),
          TacGiaList: z.array(z.string()),
        })
      )
      .max(6),
  }),
});

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
}

chatbotRouter.post('/ask', async (req, res) => {
  const parsed = askSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Câu hỏi không hợp lệ.' });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.json({ configured: false, text: null });
    return;
  }

  const { query, context } = parsed.data;
  const bookSummary =
    context.matchedBooks.length > 0
      ? context.matchedBooks
          .map(
            (b) =>
              `- [${b.MaSach}] "${b.TenSach}" (${b.TacGiaList.join(', ')}) | Ngành: ${b.TenNganh || 'CNTT'} | Kệ: ${b.MaKeSach || 'Kho mở'} | Tình trạng: ${b.TinhTrang}`
          )
          .join('\n')
      : '(Không có đầu sách cụ thể nào khớp trực tiếp với từ khóa)';

  const systemInstruction = [
    'Bạn là UIT LibBot – Trợ lý Thư viện Trường Đại học Công nghệ Thông tin (ĐHQG-HCM).',
    'Trả lời ngắn gọn (2–4 câu, tối đa 85 từ), thân thiện, lịch sự bằng tiếng Việt tự nhiên.',
    'TUYỆT ĐỐI CHỈ sử dụng dữ liệu thật trong NGỮ CẢNH HỆ THỐNG bên dưới, KHÔNG tự bịa tên sách, số liệu hay quy định.',
    'KHÔNG sử dụng ký hiệu kỹ thuật như SE104, BM1-BM7, QĐ8, RBAC.',
    '',
    'NGỮ CẢNH HỆ THỐNG HIỆN HÀNH:',
    `- Kho sách: ${context.availableBooks}/${context.totalBooks} đầu sách đang có sẵn.`,
    `- Quy định mượn: tối đa ${context.params.SoSachMuonToiDa} quyển / ${context.params.SoNgayMuonToiDa} ngày; phí trễ hạn 1.000đ/ngày.`,
    `- Quy định thẻ: tuổi ${context.params.TuoiToiThieu}–${context.params.TuoiToiDa}, thời hạn thẻ ${context.params.ThoiHanThe} tháng; tiếp nhận sách xuất bản trong vòng ${context.params.KhoangCachNamXuatBan} năm.`,
    `- Giờ mở cửa: Thứ 2–Thứ 6 (07:30–18:00), Thứ 7 (08:00–16:00). Hotline: (028) 372 51993. Email: thuvien@uit.edu.vn.`,
    `- Phòng học nhóm sẵn sàng đặt lịch trực tuyến: ${context.readyRooms} phòng.`,
    `- Sách khớp truy vấn:\n${bookSummary}`,
  ].join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: query,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });
    const text = response.text?.trim() || null;
    res.json({ configured: true, text });
  } catch (err) {
    console.warn('UIT LibBot Gemini fallback triggered:', err instanceof Error ? err.message : err);
    res.json({ configured: false, text: null });
  }
});
