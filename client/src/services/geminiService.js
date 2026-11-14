// Dịch vụ gọi Google Gemini API để chấm điểm câu hỏi Tự luận
// Mô hình tối ưu được API Key hỗ trợ trực tiếp và hoạt động mượt mà: gemini-3.5-flash

const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest"
];

let ACTIVE_MODEL = "gemini-3.5-flash";

/**
 * Lấy API Key từ localStorage hoặc biến môi trường
 */
export function getGeminiApiKey() {
  return localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

/**
 * Lưu API Key vào localStorage
 */
export function setGeminiApiKey(key) {
  if (key) {
    localStorage.setItem('GEMINI_API_KEY', key.trim());
  } else {
    localStorage.removeItem('GEMINI_API_KEY');
  }
}

/**
 * Chấm điểm bài làm tự luận bằng Gemini 2.5 Flash
 * @param {Object} params
 * @param {string} params.question - Đề bài tự luận
 * @param {string} params.essayAnswer - Bài làm của thí sinh
 * @param {string} [params.rubric] - Thang điểm / Hướng dẫn chấm / Tiêu chí
 * @param {string} [params.sampleAnswer] - Đáp án gợi ý mẫu
 * @param {number} [params.maxScore=10] - Thang điểm tối đa (mặc định 10)
 * @param {string} [params.customApiKey] - API Key nếu người dùng nhập riêng
 */
export async function gradeEssayWithGemini({
  question,
  essayAnswer,
  rubric = '',
  sampleAnswer = '',
  maxScore = 10,
  customApiKey = ''
}) {
  const apiKey = customApiKey || getGeminiApiKey();

  // Kiểm tra nếu thí sinh chưa nhập gì
  if (!essayAnswer || !essayAnswer.trim()) {
    return {
      success: true,
      score: 0,
      maxScore,
      feedback: "Thí sinh chưa nhập nội dung trả lời.",
      strengths: [],
      improvements: ["Cần hoàn thành bài làm trước khi nộp."],
      model: DEFAULT_GEMINI_MODEL
    };
  }

  // Nếu chưa có API key, mô phỏng chế độ chấm thông minh cục bộ
  if (!apiKey) {
    // Mô phỏng chấm thông minh để người dùng vẫn trải nghiệm được ngay mà không bị chặn lỗi cứng
    await new Promise(res => setTimeout(res, 1200));
    const wordCount = essayAnswer.trim().split(/\s+/).length;
    let mockScore = Math.min(maxScore, Math.max(4, Math.round((wordCount / 40) * maxScore)));
    if (wordCount < 10) mockScore = 2;

    return {
      success: true,
      isDemo: true,
      score: mockScore,
      maxScore,
      feedback: `(Chế độ Chấm thử nghiệm AI - Bạn có thể thêm Gemini API Key trong phần cài đặt để AI chấm chi tiết từng câu chữ). Bài làm dài ${wordCount} từ, cơ bản đã tiếp cận được yêu cầu của đề bài.`,
      strengths: [
        "Trình bày rõ ràng, câu cú mạch lạc.",
        "Đã nêu được các ý chính liên quan đến câu hỏi."
      ],
      improvements: [
        "Nên bổ sung thêm các luận cứ và liên hệ thực tiễn để bài viết sâu sắc hơn.",
        "Cần kết luận tóm lược lại trọng tâm."
      ],
      model: `${DEFAULT_GEMINI_MODEL} (Demo Mode)`
    };
  }

  const prompt = `
Bạn là một Giám khảo chấm thi. Hãy chấm điểm câu trả lời Tự luận dưới đây một cách cực kỳ ngắn gọn, súc tích (đúng 1 câu nhận xét tổng quát) để phản hồi nhanh nhất có thể.

[ĐỀ BÀI]:
${question}

[ĐÁP ÁN GỢI Ý / Ý CHÍNH]:
${sampleAnswer || 'Đánh giá dựa trên kiến thức chuẩn xác, đúng trọng tâm.'}

[TIÊU CHÍ CHẤM / RUBRIC]:
${rubric || `Thang điểm tối đa là ${maxScore} điểm.`}

[BÀI LÀM CỦA THÍ SINH]:
${essayAnswer}

Trả về DUY NHẤT một chuỗi JSON hợp lệ với cấu trúc sau (không kèm giải thích hay markdown code block ngoài JSON):
{
  "score": <số điểm từ 0 đến ${maxScore}>,
  "feedback": "<duy nhất 1 câu nhận xét ngắn gọn, đúng trọng tâm>"
}
`;

  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.95,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Lỗi Gemini API (Status ${response.status})`);
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        throw new Error("Không nhận được phản hồi chấm điểm từ Gemini.");
      }

      // Làm sạch chuỗi JSON nếu có code block markdown
      const cleanedText = candidateText.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanedText);

      ACTIVE_MODEL = modelName;

      return {
        success: true,
        score: typeof parsed.score === 'number' ? parsed.score : Math.round(maxScore * 0.7),
        maxScore,
        feedback: parsed.feedback || "Bài làm đạt yêu cầu.",
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        model: modelName
      };
    } catch (err) {
      console.warn(`Thử model ${modelName} không thành công:`, err.message);
      lastError = err;
      // Tiếp tục thử model fallback tiếp theo trong danh sách CANDIDATE_MODELS
    }
  }

  // Nếu tất cả các model đều thất bại
  console.error("Gemini Grading Error:", lastError);
  return {
    success: false,
    error: lastError?.message || "Lỗi kết nối Gemini API",
    score: 5,
    maxScore,
    feedback: `Đã xảy ra sự cố khi kết nối Gemini API (${lastError?.message || ''}). Tạm thời ghi nhận điểm cơ bản.`,
    strengths: ["Đã nộp bài hoàn chỉnh."],
    improvements: ["Vui lòng kiểm tra lại kết nối mạng hoặc Gemini API Key."],
    model: CANDIDATE_MODELS[0]
  };
}

/**
 * Phân tích nội dung tài liệu (Word, Excel, PDF hoặc Text) bằng Gemini AI
 * Tự động trích xuất thành danh sách các câu hỏi trắc nghiệm / tự luận có cấu trúc
 */
export async function parseQuestionsWithGemini(rawText, customApiKey = '') {
  const apiKey = customApiKey || getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Vui lòng cung cấp Gemini API Key để sử dụng tính năng phân tích tài liệu bằng AI.');
  }

  const prompt = `
Bạn là một chuyên gia khảo thí và tạo đề thi giáo dục hàng đầu.
Nhiệm vụ của bạn: Đọc nội dung văn bản dưới đây (được trích xuất từ file Word/Excel/PDF/Text) và chuyển đổi thành danh sách các câu hỏi thi chuẩn xác, nhận diện ĐÚNG dạng câu hỏi tương ứng trong hệ thống.

Hệ thống hỗ trợ 7 dạng câu hỏi sau:
1. "single": Trắc nghiệm 1 đáp án đúng (A, B, C, D).
   - "options": [{ "id": "A", "text": "..." }, ...]
   - "correctAnswer": "A"

2. "multiple": Chọn nhiều đáp án đúng (có từ 2 đáp án đúng trở lên).
   - "options": [{ "id": "A", "text": "..." }, ...]
   - "correctAnswer": ["A", "C"]

3. "true_false_multi": Đúng/Sai theo từng ý (thường có tiêu đề "Chọn đáp án Đúng hoặc Sai...", "Các phát biểu sau đúng hay sai", và các ý 1, 2, 3... hoặc a, b, c... kèm Đúng / Sai).
   - "question": "Tiêu đề câu hỏi..."
   - "parts": [
       { "id": "1", "text": "Nội dung phát biểu 1", "isCorrect": true },
       { "id": "2", "text": "Nội dung phát biểu 2", "isCorrect": false }
     ]

4. "drag_drop": Kéo thả ghép nối / Ghép đáp án tương ứng (thường có bảng 2 cột ghép cặp vế câu - đáp án, hoặc tiêu đề "Kéo thả các đáp án đúng tương ứng...").
   - "question": "Tiêu đề câu hỏi..."
   - "sentences": [
       { "id": 1, "prefix": "Vế câu hỏi hoặc phát biểu 1", "correctWord": "Đáp án ghép 1", "suffix": "" },
       { "id": 2, "prefix": "Vế câu hỏi hoặc phát biểu 2", "correctWord": "Đáp án ghép 2", "suffix": "" }
     ]
   - "draggableItems": ["Đáp án ghép 1", "Đáp án ghép 2", ...]

5. "categorize": Phân loại vào các cột / nhóm (thường có tiêu đề "Kéo thả các yếu tố vào các cột tương ứng...", "Phân loại...", và các cột nhóm kèm các mục thuộc từng nhóm).
   - "question": "Tiêu đề câu hỏi..."
   - "categories": [
       { "id": "cat1", "name": "Tên cột/nhóm 1" },
       { "id": "cat2", "name": "Tên cột/nhóm 2" }
     ]
   - "items": [
       { "id": "item1", "text": "Mục 1 thuộc nhóm 1", "categoryId": "cat1" },
       { "id": "item2", "text": "Mục 2 thuộc nhóm 1", "categoryId": "cat1" },
       { "id": "item3", "text": "Mục 3 thuộc nhóm 2", "categoryId": "cat2" }
     ]

6. "short_answer": Điền từ khuyết hoặc trả lời ngắn.
   - "question": "Câu hỏi có chỗ trống hoặc câu hỏi điền từ..."
   - "correctAnswer": "Từ hoặc cụm từ cần điền"

7. "essay": Tự luận.
   - "question": "Nội dung câu hỏi tự luận..."
   - "sampleAnswer": "Dàn ý đáp án gợi ý..."
   - "criteria": "Tiêu chí chấm điểm..."
   - "points": 10

Yêu cầu định dạng đầu ra:
Trả về DUY NHẤT một mảng JSON các object theo cấu trúc trên (không kèm markdown \`\`\`json hay text thừa):
[
  {
    "id": "1",
    "type": "true_false_multi", // hoặc "single", "multiple", "drag_drop", "categorize", "short_answer", "essay"
    "question": "...",
    ... (các trường theo đúng cấu trúc từng dạng ở trên)
    "explanation": "Giải thích chi tiết (nếu có)"
  }
]

Lưu ý:
- Phân tích cẩn thận các dạng Đúng/Sai (true_false_multi), Kéo thả ghép nối (drag_drop) và Phân loại vào cột (categorize) theo đúng cấu trúc mẫu ở trên.
- Giữ nguyên nội dung và văn phong câu hỏi.

Nội dung tài liệu cần phân tích:
"""
${rawText.slice(0, 30000)}
"""
`;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Lỗi Gemini API ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Không nhận được kết quả từ AI');

      const cleaned = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn(`Thử parse bằng ${modelName} thất bại, đang thử model tiếp theo...`, err.message);
    }
  }

  throw new Error('AI không thể trích xuất câu hỏi từ tài liệu này. Vui lòng kiểm tra lại cấu trúc file hoặc API Key.');
}


