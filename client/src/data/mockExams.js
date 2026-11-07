export const mockUsers = [
  {
    id: "user-student",
    name: "Nguyễn Văn An",
    email: "student@test.com",
    password: "123",
    role: "student",
    roleName: "Sinh viên"
  },
  {
    id: "user-admin",
    name: "Quản trị viên",
    email: "admin@test.com",
    password: "123",
    role: "admin",
    roleName: "Admin"
  }
];

export const initialExams = [
{
  "id": "exam-lan-bai1",
  "title": "CÔNG NGHỆ MẠNG LAN - BÀI 1",
  "subject": "Công nghệ mạng LAN",
  "level": "Đại học",
  "duration": 30,
  "totalQuestions": 30,
  "author": "Bộ môn Mạng máy tính",
  "className": "Lớp học phần Công nghệ mạng LAN",
  "statusBadge": "30 Qs",
  "cardTheme": "blue",
  "assigned": true,
  "bottomText": "30 câu hỏi bài 1",
  "bottomType": "purple_pill",
  "questions": [
    {
      "id": 1,
      "type": "single",
      "question": "Câu 1: Hub được coi là thiết bị ở tầng (layer) nào trong mô hình OSI?",
      "options": [
        {
          "id": "A",
          "text": "Layer 2"
        },
        {
          "id": "B",
          "text": "Layer 1"
        },
        {
          "id": "C",
          "text": "Layer 4"
        },
        {
          "id": "D",
          "text": "Layer 3"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 2,
      "type": "single",
      "question": "Câu 2: Để giảm thiểu tình trạng đụng độ (Collission) trong mạng Ethernet, thiết bị nào thường được sử dụng?",
      "options": [
        {
          "id": "A",
          "text": "Bridge"
        },
        {
          "id": "B",
          "text": "Firewall"
        },
        {
          "id": "C",
          "text": "Repeater"
        },
        {
          "id": "D",
          "text": "Hub"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 3,
      "type": "single",
      "question": "Câu 3: Công nghệ CSMA/CD được sử dụng để làm gì trong mạng LAN?",
      "options": [
        {
          "id": "A",
          "text": "Ngăn chặn quảng bá"
        },
        {
          "id": "B",
          "text": "Tăng tốc độ truyền"
        },
        {
          "id": "C",
          "text": "Phát hiện đụng độ"
        },
        {
          "id": "D",
          "text": "Chuyển gói dữ liệu"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 4,
      "type": "single",
      "question": "Câu 4: Loại băng thông nào được đề cập đến trong Ethernet 10BASE-T?",
      "options": [
        {
          "id": "A",
          "text": "1 Mbps"
        },
        {
          "id": "B",
          "text": "100 Mbps"
        },
        {
          "id": "C",
          "text": "10 Mbps"
        },
        {
          "id": "D",
          "text": "1 Gbps"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 5,
      "type": "single",
      "question": "Câu 5: Repeater hoạt động ở lớp nào trong mô hình OSI?",
      "options": [
        {
          "id": "A",
          "text": "Lớp 1"
        },
        {
          "id": "B",
          "text": "Lớp 3"
        },
        {
          "id": "C",
          "text": "Lớp 4"
        },
        {
          "id": "D",
          "text": "Lớp 2"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 6,
      "type": "single",
      "question": "Câu 6: Tại sao đụng độ (Collission) thường xảy ra trong mạng Ethernet?",
      "options": [
        {
          "id": "A",
          "text": "Thiếu băng thông"
        },
        {
          "id": "B",
          "text": "Thiết bị hoạt động không đồng thời"
        },
        {
          "id": "C",
          "text": "Tài nguyên mạng"
        },
        {
          "id": "D",
          "text": "Nhiều thiết bị truyền đồng thời"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 7,
      "type": "single",
      "question": "Câu 7: Tại sao việc sử dụng Repeater có thể gây ra vấn đề về quảng bá trong mạng LAN?",
      "options": [
        {
          "id": "A",
          "text": "Tăng độ tin cậy"
        },
        {
          "id": "B",
          "text": "Giảm băng thông"
        },
        {
          "id": "C",
          "text": "Làm giảm tốc độ"
        },
        {
          "id": "D",
          "text": "Tăng kích thước miền quảng bá"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 8,
      "type": "single",
      "question": "Câu 8: Thiết bị nào được sử dụng để phân đoạn mạng LAN?",
      "options": [
        {
          "id": "A",
          "text": "Repeater"
        },
        {
          "id": "B",
          "text": "Firewall"
        },
        {
          "id": "C",
          "text": "Switch"
        },
        {
          "id": "D",
          "text": "Hub"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 9,
      "type": "single",
      "question": "Câu 9: Thời gian trễ khi sử dụng Bridge là khoảng bao nhiêu phần trăm?",
      "options": [
        {
          "id": "A",
          "text": "5% đến 10%"
        },
        {
          "id": "B",
          "text": "10% đến 30%"
        },
        {
          "id": "C",
          "text": "30% đến 50%"
        },
        {
          "id": "D",
          "text": "50% đến 70%"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 10,
      "type": "single",
      "question": "Câu 10: Khi một thiết bị gửi gói quảng bá lớp 2, địa chỉ MAC đích sẽ là gì?",
      "options": [
        {
          "id": "A",
          "text": "11:11:11:11:11:11"
        },
        {
          "id": "B",
          "text": "FF:FF:FF:FF:FF:FF"
        },
        {
          "id": "C",
          "text": "00:00:00:00:00:00"
        },
        {
          "id": "D",
          "text": "12:34:56:78:9A"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 11,
      "type": "single",
      "question": "Câu 11: Bridge và Switch có thể thu hẹp miền gì trong mạng?",
      "options": [
        {
          "id": "A",
          "text": "Miền liên mạng"
        },
        {
          "id": "B",
          "text": "Miền đụng độ"
        },
        {
          "id": "C",
          "text": "Miền giao thức"
        },
        {
          "id": "D",
          "text": "Miền dịch vụ"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 12,
      "type": "single",
      "question": "Câu 12: Khác biệt chính giữa Bridge và Router là gì?",
      "options": [
        {
          "id": "A",
          "text": "Bridge không chuyển gói quảng bá, Router chuyển gói quảng bá"
        },
        {
          "id": "B",
          "text": "Bridge không phân đoạn mạng, Router phân đoạn mạng"
        },
        {
          "id": "C",
          "text": "Bridge hoạt động ở lớp 3, Router ở lớp 2"
        },
        {
          "id": "D",
          "text": "Bridge phân đoạn trong một mạng, Router kết nối nhiều mạng khác nhau"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 13,
      "type": "single",
      "question": "Câu 13: Khi một gói quảng bá được gửi từ một thiết bị trong mạng, điều gì xảy ra với các thiết bị khác?",
      "options": [
        {
          "id": "A",
          "text": "Gói bị chặn lại"
        },
        {
          "id": "B",
          "text": "Tất cả thiết bị trong miền quảng bá đều nhận gói"
        },
        {
          "id": "C",
          "text": "Không thiết bị nào nhận gói quảng bá"
        },
        {
          "id": "D",
          "text": "Chỉ thiết bị đích nhận gói"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 14,
      "type": "single",
      "question": "Câu 14: Ta có thể sử dụng thiết nào sau đây để phân đoạn mạng?",
      "options": [
        {
          "id": "A",
          "text": "Hub và Repeater"
        },
        {
          "id": "B",
          "text": "Switch và Repeater"
        },
        {
          "id": "C",
          "text": "Switch và Router"
        },
        {
          "id": "D",
          "text": "Switch và Hub"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 15,
      "type": "single",
      "question": "Câu 15: Tiêu chuẩn của mạng Ethernet có dây là?",
      "options": [
        {
          "id": "A",
          "text": "802.15"
        },
        {
          "id": "B",
          "text": "802.3"
        },
        {
          "id": "C",
          "text": "802.11b"
        },
        {
          "id": "D",
          "text": "802.11a"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 16,
      "type": "single",
      "question": "Câu 16: Switch trong mạng LAN là thiết bị thuộc lớp mấy?",
      "options": [
        {
          "id": "A",
          "text": "Thiết bị lớp 2"
        },
        {
          "id": "B",
          "text": "Thiết bị lớp 7"
        },
        {
          "id": "C",
          "text": "Thiết bị lớp 4"
        },
        {
          "id": "D",
          "text": "Thiết bị lớp 1"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 17,
      "type": "single",
      "question": "Câu 17: Thời gian trễ trong mạng Ethernet không phụ thuộc vào yếu tố nào?",
      "options": [
        {
          "id": "A",
          "text": "Loại cáp"
        },
        {
          "id": "B",
          "text": "Loại giao thức"
        },
        {
          "id": "C",
          "text": "Số lượng thiết bị"
        },
        {
          "id": "D",
          "text": "Khoảng cách giữa các thiết bị"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 18,
      "type": "single",
      "question": "Câu 18: Đặc điểm nào của Bridge giúp cải thiện hiệu suất mạng?",
      "options": [
        {
          "id": "A",
          "text": "Phân đoạn mạng"
        },
        {
          "id": "B",
          "text": "Chặn gói quảng bá"
        },
        {
          "id": "C",
          "text": "Tăng khả năng giảm nhiễu"
        },
        {
          "id": "D",
          "text": "Khuếch đại tín hiệu"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 19,
      "type": "single",
      "question": "Câu 19: Mạng bán song công (Half Duplex) có gì khác với mạng song công (Full Duplex)?",
      "options": [
        {
          "id": "A",
          "text": "Không cần địa chỉ MAC"
        },
        {
          "id": "B",
          "text": "Sử dụng cáp quang"
        },
        {
          "id": "C",
          "text": "Không thể truyền đồng thời"
        },
        {
          "id": "D",
          "text": "Tốc độ thấp hơn"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 20,
      "type": "single",
      "question": "Câu 20: Phương pháp truy cập nào được sử dụng trong mỗi Segment của mạng LAN?",
      "options": [
        {
          "id": "A",
          "text": "FDMA"
        },
        {
          "id": "B",
          "text": "Token Ring"
        },
        {
          "id": "C",
          "text": "CSMA/CD"
        },
        {
          "id": "D",
          "text": "TDMA"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 21,
      "type": "single",
      "question": "Câu 21: Bridge hoạt động ở lớp nào trong mô hình OSI?",
      "options": [
        {
          "id": "A",
          "text": "Lớp 1"
        },
        {
          "id": "B",
          "text": "Lớp 3"
        },
        {
          "id": "C",
          "text": "Lớp 4"
        },
        {
          "id": "D",
          "text": "Lớp 2"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 22,
      "type": "single",
      "question": "Câu 22: Tại sao việc phân đoạn mạng LAN lại quan trọng?",
      "options": [
        {
          "id": "A",
          "text": "Để tăng cường bảo mật cho mạng"
        },
        {
          "id": "B",
          "text": "Để giảm thiểu nghẽn mạch và tăng băng thông cho mỗi user"
        },
        {
          "id": "C",
          "text": "Để tăng mật độ giao thông trong mạng"
        },
        {
          "id": "D",
          "text": "Để giảm số lượng thiết bị kết nối"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 23,
      "type": "single",
      "question": "Câu 23: Tại sao khi sử dụng Switch lại giảm được xung đột trong mạng?",
      "options": [
        {
          "id": "A",
          "text": "Vì Switch chỉ chuyển tiếp Frame khi biết giao thức mạng"
        },
        {
          "id": "B",
          "text": "Vì Switch chỉ chuyển tiếp Frame khi biết địa chỉ IP"
        },
        {
          "id": "C",
          "text": "Vì Switch chỉ chuyển tiếp Frame khi biết địa chỉ MAC"
        },
        {
          "id": "D",
          "text": "Vì Switch chỉ chuyển tiếp Frame khi biết địa chỉ NumberPort"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 24,
      "type": "single",
      "question": "Câu 24: Một Switch có 24 cổng FastEthernet, ta có thể phân chia thành bao nhiêu đoạn mạng?",
      "options": [
        {
          "id": "A",
          "text": "24"
        },
        {
          "id": "B",
          "text": "48"
        },
        {
          "id": "C",
          "text": "1"
        },
        {
          "id": "D",
          "text": "12"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 25,
      "type": "single",
      "question": "Câu 25: Thiết bị Router hoạt động ở lớp nào trong mô hình OSI?",
      "options": [
        {
          "id": "A",
          "text": "Lớp 1"
        },
        {
          "id": "B",
          "text": "Lớp 2"
        },
        {
          "id": "C",
          "text": "Lớp 4"
        },
        {
          "id": "D",
          "text": "Lớp 3"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 26,
      "type": "single",
      "question": "Câu 26: Chuyển mạch LAN giúp giảm tình trạng gì trong mạng?",
      "options": [
        {
          "id": "A",
          "text": "Lưu lượng"
        },
        {
          "id": "B",
          "text": "Chi phí"
        },
        {
          "id": "C",
          "text": "Độ trễ"
        },
        {
          "id": "D",
          "text": "Thiếu hụt băng thông"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 27,
      "type": "single",
      "question": "Câu 27: Khi một máy kết nối vào Switch, nó tạo ra?",
      "options": [
        {
          "id": "A",
          "text": "Một miền giao thức"
        },
        {
          "id": "B",
          "text": "Một miền đụng độ riêng"
        },
        {
          "id": "C",
          "text": "Một thiết bị lưu trữ"
        },
        {
          "id": "D",
          "text": "Một kết nối internet"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 28,
      "type": "single",
      "question": "Câu 28: Cấu trúc Ethernet đầu tiên được gọi là gì?",
      "options": [
        {
          "id": "A",
          "text": "LAN Ethernet"
        },
        {
          "id": "B",
          "text": "Fast Ethernet"
        },
        {
          "id": "C",
          "text": "Thick Ethernet"
        },
        {
          "id": "D",
          "text": "Gigabit Ethernet"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 29,
      "type": "single",
      "question": "Câu 29: MicroSegment là gì?",
      "options": [
        {
          "id": "A",
          "text": "Một loại dịch vụ"
        },
        {
          "id": "B",
          "text": "Một loại thiết bị"
        },
        {
          "id": "C",
          "text": "Một miền đụng độ nhỏ"
        },
        {
          "id": "D",
          "text": "Một loại giao thức"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 30,
      "type": "single",
      "question": "Câu 30: Điều gì xảy ra khi có đụng độ xảy ra trong mạng Ethernet?",
      "options": [
        {
          "id": "A",
          "text": "Các thiết bị tiếp tục truyền dữ liệu"
        },
        {
          "id": "B",
          "text": "Giao thông trong mạng bị ngưng lại"
        },
        {
          "id": "C",
          "text": "Không ảnh hưởng đến quá trình tuyền tin"
        },
        {
          "id": "D",
          "text": "Tín hiệu được khuếch đại để truyền tiếp"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    }
  ]
},

{
  "id": "exam-demo-cloze-essay",
  "title": "BÀI THI MẪU: ĐỤC LỖ & TỰ LUẬN (AI CHẤM)",
  "subject": "Lịch sử & Triết học",
  "level": "Đại học",
  "duration": 15,
  "totalQuestions": 2,
  "author": "Hệ thống Wayground",
  "className": "Lớp học trải nghiệm tính năng mới",
  "statusBadge": "2 Qs",
  "cardTheme": "teal",
  "assigned": true,
  "bottomText": "Đục lỗ & Tự luận AI",
  "bottomType": "accuracy",
  "accuracy": "Mới",
  "questions": [
    {
      "id": 1,
      "type": "fill_blank",
      "question": "Điền các từ/cụm từ còn thiếu vào các chỗ trống sau:",
      "template": "Đảng Cộng sản Việt Nam được thành lập vào ngày [...] năm 1930 tại [...] do lãnh tụ Nguyễn Ái Quốc chủ trì.",
      "blanks": [
        {
          "id": 1,
          "correctAnswer": ["3/2", "3-2", "3/2/1930", "03/02", "ngày 3 tháng 2"]
        },
        {
          "id": 2,
          "correctAnswer": ["Hương Cảng", "Hong Kong", "Hương Cảng, Trung Quốc", "Hương Cảng (Trung Quốc)"]
        }
      ],
      "explanation": "Hội nghị thành lập Đảng diễn ra từ ngày 6/1 đến 7/2/1930 tại Hương Cảng (Trung Quốc), lấy ngày 3/2 hàng năm làm ngày kỷ niệm."
    },
    {
      "id": 2,
      "type": "essay",
      "question": "Trình bày ý nghĩa lịch sử to lớn của sự kiện thành lập Đảng Cộng sản Việt Nam ngày 3/2/1930 đối với phong trào cách mạng nước ta?",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10: Nêu được sự chấm dứt khủng hoảng đường lối cứu nước (4đ), Khẳng định vai trò lãnh đạo của giai cấp công nhân (3đ), Mở ra thời đại mới đưa cách mạng Việt Nam gắn liền với cách mạng thế giới (3đ). Lập luận mạch lạc, hành văn trong sáng.",
      "sampleAnswer": "Sự kiện thành lập Đảng Cộng sản Việt Nam ngày 3/2/1930 là bước ngoặt vô cùng quan trọng: 1. Chấm dứt thời kỳ khủng hoảng sâu sắc về đường lối cứu nước và giai cấp lãnh đạo kéo dài nhiều thập kỷ; 2. Chứng tỏ giai cấp công nhân Việt Nam đã trưởng thành và đủ sức lãnh đạo cách mạng; 3. Đưa cách mạng Việt Nam trở thành một bộ phận khăng khít của phong trào cách mạng vô sản thế giới; 4. Là nhân tố hàng đầu quyết định mọi thắng lợi của cách mạng Việt Nam sau này.",
      "explanation": "Đảng ra đời là kết quả tất yếu của sự kết hợp giữa chủ nghĩa Mác - Lênin với phong trào công nhân và phong trào yêu nước Việt Nam."
    }
  ]
},
{
  "id": "exam-lsd-bai1",
  "title": "LỊCH SỬ ĐẢNG VIỆT NAM - BÀI 1",
  "subject": "Lịch sử Đảng",
  "level": "Đại học",
  "duration": 30,
  "totalQuestions": 30,
  "author": "Bộ môn Lịch sử Đảng",
  "className": "Lớp học phần Lịch sử Đảng",
  "statusBadge": "30 Qs",
  "cardTheme": "coral",
  "assigned": true,
  "bottomText": "30 câu hỏi bài 1",
  "bottomType": "purple_pill",
  "questions": [
    {
      "id": 1,
      "type": "single",
      "question": "Chọn đáp án đầy đủ, chính xác nhất cho câu hỏi sau: Nhiệm vụ của môn học Lịch sử Đảng Cộng sản Việt Nam là gì?",
      "options": [
        {
          "id": "A",
          "text": "Trình bày có hệ thống đường lối, Cương lĩnh của Đảng. Tái hiện, tổng kết tiến trình lịch sử lãnh đạo, đấu tranh của Đảng"
        },
        {
          "id": "B",
          "text": "Tổng kết lịch sử của Đảng, lãnh đạo cách mạng"
        },
        {
          "id": "C",
          "text": "Tái hiện tiến trình lịch sử lãnh đạo, đấu tranh của Đảng, phân tích các vấn đề chính trị"
        },
        {
          "id": "D",
          "text": "Trình bày có hệ thống đường lối, Cương lĩnh của Đảng, phân tích các vấn đề chính trị- xã hội"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 2,
      "type": "single",
      "question": "Các phương pháp cơ bản trong nghiên cứu môn Lịch sử Đảng Cộng sản Việt Nam là gì?",
      "options": [
        {
          "id": "A",
          "text": "Phương pháp nêu vấn đề, phương pháp thống kê"
        },
        {
          "id": "B",
          "text": "Phương pháp thống kê, phương pháp thuyết trình, phương pháp tổng kết thực tiễn lịch sử, phương pháp so sánh"
        },
        {
          "id": "C",
          "text": "Phương pháp liệt kê, phương pháp nêu vấn đề"
        },
        {
          "id": "D",
          "text": "Phương pháp lịch sử, phương pháp logic, phương pháp tổng kết thực tiễn lịch sử, phương pháp so sánh, phương pháp làm việc nhóm"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 3,
      "type": "single",
      "question": "Chức năng của môn học Lịch sử Đảng Cộng sản Việt Nam là:",
      "options": [
        {
          "id": "A",
          "text": "Chức năng định hướng, chức năng biện luận, chức năng dự báo và phê phán"
        },
        {
          "id": "B",
          "text": "Chức năng nhận thức, chức năng giáo dục, chức năng dự báo và phê phán"
        },
        {
          "id": "C",
          "text": "Chức năng biện luận, chức năng dự báo và phê phán"
        },
        {
          "id": "D",
          "text": "Chức năng tổng kết, chức năng giáo dục"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 4,
      "type": "single",
      "question": "Ba thời kỳ nổi bật của lịch sử Đảng Cộng sản Việt Nam là những thời kỳ nào?",
      "options": [
        {
          "id": "A",
          "text": "1930-1945; 1945-1954 và 1975 đến nay"
        },
        {
          "id": "B",
          "text": "1930-1945; 1945-1954 và 1954-1975"
        },
        {
          "id": "C",
          "text": "1930-1945; 1975-1986 và 1986 đến nay"
        },
        {
          "id": "D",
          "text": "1930-1945; 1945-1975 và 1975 đến nay"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 5,
      "type": "single",
      "question": "“Làm rõ vai trò, sức chiến đấu của hệ thống tổ chức đảng từ Trung ương đến cơ sở trong lãnh đạo, tổ chức thực tiễn” là:",
      "options": [
        {
          "id": "A",
          "text": "Một đối tượng của khoa học Lịch sử Đảng Cộng sản Việt Nam"
        },
        {
          "id": "B",
          "text": "Một chức năng của khoa học Lịch sử Đảng Cộng sản Việt Nam"
        },
        {
          "id": "C",
          "text": "Một vai trò của khoa học Lịch sử Đảng Cộng sản Việt Nam"
        },
        {
          "id": "D",
          "text": "Một nhiệm vụ của khoa học Lịch sử Đảng Cộng sản Việt Nam"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 6,
      "type": "single",
      "question": "Ngày lễ kỷ niệm thành lập Đảng Cộng sản Việt Nam là ngày nào?",
      "options": [
        {
          "id": "A",
          "text": "Ngày 3/2"
        },
        {
          "id": "B",
          "text": "Ngày 6/1"
        },
        {
          "id": "C",
          "text": "Ngày 6/2"
        },
        {
          "id": "D",
          "text": "Ngày 24/2"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 7,
      "type": "single",
      "question": "Cương lĩnh chính trị đầu tiên của Đảng do Nguyễn Ái Quốc soạn thảo xác định phương hướng chiến lược của cách mạng Việt Nam là gì?",
      "options": [
        {
          "id": "A",
          "text": "Cách mạng tư sản dân quyền và thổ địa cách mạng để đi tới xã hội cộng sản"
        },
        {
          "id": "B",
          "text": "Cách mạng tư sản và cách mạng dân chủ tư sản"
        },
        {
          "id": "C",
          "text": "Cách mạng ruộng đất và cách mạng tư sản"
        },
        {
          "id": "D",
          "text": "Cách mạng vô sản, cách mạng xã hội chủ nghĩa bỏ qua tư bản chủ nghĩa"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 8,
      "type": "single",
      "question": "Nguyễn Ái Quốc lựa chọn con đường giải phóng dân tộc theo khuynh hướng chính trị nào?",
      "options": [
        {
          "id": "A",
          "text": "Khuynh hướng tư sản"
        },
        {
          "id": "B",
          "text": "Khuynh hướng vô sản"
        },
        {
          "id": "C",
          "text": "Khuynh hướng dân chủ tư sản"
        },
        {
          "id": "D",
          "text": "Khuynh hướng phong kiến"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 9,
      "type": "single",
      "question": "Tháng 6/1925, từ lực lượng nòng cốt là nhóm Cộng sản Đoàn, Nguyễn Ái Quốc đã thành lập tổ chức nào?",
      "options": [
        {
          "id": "A",
          "text": "Tân Việt cách mạng Đảng"
        },
        {
          "id": "B",
          "text": "Việt Nam Quốc dân Đảng"
        },
        {
          "id": "C",
          "text": "Tâm tâm xã"
        },
        {
          "id": "D",
          "text": "Hội Việt Nam cách mạng Thanh niên"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 10,
      "type": "single",
      "question": "Tổ chức tiền thân của Đảng Cộng sản Việt Nam do đồng chí Nguyễn Ái Quốc sáng lập là:",
      "options": [
        {
          "id": "A",
          "text": "Đông Dương Cộng sản Liên đoàn"
        },
        {
          "id": "B",
          "text": "Hội Việt Nam Cách mạng Thanh niên"
        },
        {
          "id": "C",
          "text": "An Nam Cộng sản Đảng"
        },
        {
          "id": "D",
          "text": "Đông Dương Cộng sản Đảng"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 11,
      "type": "single",
      "question": "Tổng Bí thư đầu tiên của Đảng Cộng sản Đông Dương là ai?",
      "options": [
        {
          "id": "A",
          "text": "Hà Huy Tập"
        },
        {
          "id": "B",
          "text": "Hồ Chí Minh"
        },
        {
          "id": "C",
          "text": "Lê Hồng Phong"
        },
        {
          "id": "D",
          "text": "Trần Phú"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 12,
      "type": "single",
      "question": "Trong giai đoạn hiện nay, vai trò của Đảng Cộng sản Việt Nam được xác định là:",
      "options": [
        {
          "id": "A",
          "text": "Lãnh đạo cách mạng"
        },
        {
          "id": "B",
          "text": "Vai trò định hướng cho cách mạng Việt Nam"
        },
        {
          "id": "C",
          "text": "Vai trò nòng cốt"
        },
        {
          "id": "D",
          "text": "Động lực cách mạng"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 13,
      "type": "single",
      "question": "Cương lĩnh chính trị đầu tiên của Đảng cộng sản Việt Nam đã kết hợp đúng đắn vấn đề:",
      "options": [
        {
          "id": "A",
          "text": "Phong kiến và tư sản"
        },
        {
          "id": "B",
          "text": "Kinh tế và chính trị"
        },
        {
          "id": "C",
          "text": "Dân tộc và giai cấp"
        },
        {
          "id": "D",
          "text": "Dân tộc và quân chủ"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 14,
      "type": "single",
      "question": "Nhân tố hàng đầu mang tính quyết định cho những thắng lợi về sau của cách mạng Việt Nam là:",
      "options": [
        {
          "id": "A",
          "text": "Sự phát triển mạnh mẽ của đất nước về kinh tế, chính trị"
        },
        {
          "id": "B",
          "text": "Sự lãnh đạo đúng đắn của Đảng Cộng sản Việt Nam"
        },
        {
          "id": "C",
          "text": "Tinh thần đại đoàn kết của các tầng lớp nhân dân"
        },
        {
          "id": "D",
          "text": "Sự giúp đỡ của các lực lượng dân chủ thế giới"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 15,
      "type": "single",
      "question": "Sự kiện quan trọng mở ra thời kì mới của phong trào cách mạng Đông Dương đầu thế kỉ XX là:",
      "options": [
        {
          "id": "A",
          "text": "Liên minh công-nông hình thành"
        },
        {
          "id": "B",
          "text": "Chủ nghĩa Tôn Trung Sơn được truyền bá"
        },
        {
          "id": "C",
          "text": "Sự ra đời của Tân Việt cách mạng Đảng"
        },
        {
          "id": "D",
          "text": "Đảng Cộng sản Việt Nam ra đời"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 16,
      "type": "single",
      "question": "Quy luật ra đời và phát triển của Đảng Cộng sản Việt Nam là:",
      "options": [
        {
          "id": "A",
          "text": "Phong trào yêu nước kết hợp với tư tưởng Hồ Chí Minh"
        },
        {
          "id": "B",
          "text": "Chủ nghĩa Mác -Lênin và phong trào yêu nước"
        },
        {
          "id": "C",
          "text": "Chủ nghĩa Mác -Lênin kết hợp với phong trào công nhân và phong trào yêu nước"
        },
        {
          "id": "D",
          "text": "Chủ nghĩa Mác -Lênin và phong trào công nhân"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 17,
      "type": "single",
      "question": "Phương pháp cơ bản để nghiên cứu môn học Lịch sử Đảng Cộng sản Việt Nam là gì?",
      "options": [
        {
          "id": "A",
          "text": "Phương pháp lịch sử, phương pháp phân tích"
        },
        {
          "id": "B",
          "text": "Phương pháp tổng kết thực tiễn, phương pháp thống kê"
        },
        {
          "id": "C",
          "text": "Phương pháp so sánh, tổng hợp"
        },
        {
          "id": "D",
          "text": "Phương pháp lịch sử, phương pháp logic"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 18,
      "type": "single",
      "question": "Hội nghị thành lập Đảng năm 1930 do ai chủ trì?",
      "options": [
        {
          "id": "A",
          "text": "Nguyễn Đức Cảnh"
        },
        {
          "id": "B",
          "text": "Nguyễn Ái Quốc"
        },
        {
          "id": "C",
          "text": "Trần Phú"
        },
        {
          "id": "D",
          "text": "Trịnh Đình Cửu"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 19,
      "type": "single",
      "question": "Phong trào công nhân Việt Nam phát triển từ tự phát lên tự giác vào thời gian nào?",
      "options": [
        {
          "id": "A",
          "text": "Năm 1925 (cuộc bãi công Ba Son)"
        },
        {
          "id": "B",
          "text": "Năm 1920 (tổ chức công hội ở Sài Gòn được thành lập)"
        },
        {
          "id": "C",
          "text": "Năm 1929 (sự ra đời ba tổ chức cộng sản)"
        },
        {
          "id": "D",
          "text": "Năm 1930 (Đảng Cộng sản Việt Nam ra đời)"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Đáp án đúng là A."
    },
    {
      "id": 20,
      "type": "single",
      "question": "Đâu không phải là luận điểm chứng minh việc thành lập Đảng Cộng sản Việt Nam là một bước ngoặt vĩ đại của lịch sử Việt Nam?",
      "options": [
        {
          "id": "A",
          "text": "Đánh dấu phong trào công nhân hoàn toàn trở thành một phong trào tự giác"
        },
        {
          "id": "B",
          "text": "Đánh dấu khối liên minh công- nông đã được hình thành trong thực tế"
        },
        {
          "id": "C",
          "text": "Là sự chuẩn bị tất yếu đầu tiên có tính quyết định cho những bước phát triển tiếp theo"
        },
        {
          "id": "D",
          "text": "Chấm dứt cuộc khủng hoảng về đường lối cách mạng"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 21,
      "type": "single",
      "question": "Năm 1929 ở Việt Nam đã xuất hiện các tổ chức cộng sản nào?",
      "options": [
        {
          "id": "A",
          "text": "Tổ chức Việt Minh, Đông Dương Cộng sản liên đoàn"
        },
        {
          "id": "B",
          "text": "An Nam Cộng sản Đảng, Đông Dương Cộng sản Đảng và Đông Dương Cộng sản liên đoàn"
        },
        {
          "id": "C",
          "text": "Tân Việt, An Nam Cộng sản Đảng"
        },
        {
          "id": "D",
          "text": "Việt Nam cách mạng thanh niên, Việt Nam độc lập đồng minh"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 22,
      "type": "single",
      "question": "Phan Bội Châu là đại diện cho xu hướng nào trong phong trào đấu tranh theo khuynh hướng dân chủ tư sản ở Việt Nam đầu thế kỷ XX?",
      "options": [
        {
          "id": "A",
          "text": "Xu hướng cải cách"
        },
        {
          "id": "B",
          "text": "Xu hướng đấu tranh bằng phương pháp hòa bình"
        },
        {
          "id": "C",
          "text": "Xu hướng bạo động"
        },
        {
          "id": "D",
          "text": "Xu hướng quốc gia cải lương"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 23,
      "type": "single",
      "question": "Cơ quan ngôn luận của Hội Việt Nam Cách mạng Thanh niên là:",
      "options": [
        {
          "id": "A",
          "text": "Báo Nhân đạo"
        },
        {
          "id": "B",
          "text": "Báo Đời sống công nhân"
        },
        {
          "id": "C",
          "text": "Báo Thanh niên"
        },
        {
          "id": "D",
          "text": "Báo Lao động"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 24,
      "type": "single",
      "question": "Mâu thuẫn cơ bản và chủ yếu ở Việt Nam đầu thế kỷ XX là:",
      "options": [
        {
          "id": "A",
          "text": "Mâu thuẫn giữa công nhân và nông dân với đế quốc và phong kiến"
        },
        {
          "id": "B",
          "text": "Mâu thuẫn giữa giai cấp nông dân với giai cấp địa chủ phong kiến"
        },
        {
          "id": "C",
          "text": "Mâu thuẫn giữa dân tộc Việt Nam với đế quốc xâm lược và tay sai của chúng"
        },
        {
          "id": "D",
          "text": "Mâu thuẫn giữa giai cấp công nhân với giai cấp tư sản"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 25,
      "type": "single",
      "question": "Đảng Cộng sản Việt Nam ra đời là kết quả của: (chọn đáp án đúng và đầy đủ nhất)",
      "options": [
        {
          "id": "A",
          "text": "Sự phát triển mạnh của phong trào yêu nước theo khuynh hướng vô sản"
        },
        {
          "id": "B",
          "text": "Cuộc đấu tranh dân tộc và giai cấp quyết liệt của nhân dân Việt Nam"
        },
        {
          "id": "C",
          "text": "Cuộc đấu tranh mạnh mẽ của giai cấp công nhân Việt Nam"
        },
        {
          "id": "D",
          "text": "Các phong trào yêu nước của dân tộc phát triển mạnh mẽ"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Đáp án đúng là B."
    },
    {
      "id": 26,
      "type": "single",
      "question": "Đối tượng nghiên cứu của môn học Lịch sử Đảng Cộng sản Việt Nam là gì?",
      "options": [
        {
          "id": "A",
          "text": "Sự phát triển của các hình thái kinh tế xã hội"
        },
        {
          "id": "B",
          "text": "Chủ nghĩa Mác- Lê nin"
        },
        {
          "id": "C",
          "text": "Tư tưởng Hồ Chí Minh"
        },
        {
          "id": "D",
          "text": "Sự ra đời, phát triển và hoạt động lãnh đạo của Đảng qua các thời kỳ lịch sử"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Đáp án đúng là D."
    },
    {
      "id": 27,
      "type": "single",
      "question": "Hội Việt Nam Cách mạng Thanh niên phát động phong trào \"vô sản hoá\" vào thời gian nào?",
      "options": [
        {
          "id": "A",
          "text": "Cuối năm 1927"
        },
        {
          "id": "B",
          "text": "Cuối năm 1926"
        },
        {
          "id": "C",
          "text": "Cuối năm 1928"
        },
        {
          "id": "D",
          "text": "Cuối năm 1929"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 28,
      "type": "single",
      "question": "Nội dung nào sau đây phản ánh không đúng ý nghĩa thành lập Đảng cộng sản Việt Nam?",
      "options": [
        {
          "id": "A",
          "text": "Là sự chuẩn bị tất yếu đầu tiên có tính chất quyết định cho những bước phát triển nhảy vọt mới trong lịch sử dân tộc Việt Nam"
        },
        {
          "id": "B",
          "text": "Là bước ngoặt vĩ đại trong lịch sử cách mạng Việt Nam, chấm dứt thời kỳ khủng hoảng, bế tắc về đường lối và giai cấp lãnh đạo cách mạng"
        },
        {
          "id": "C",
          "text": "Là một xu thế khách quan của cuộc vận động giải phóng dân tộc ở Việt Nam theo con đường cách mạng tư sản"
        },
        {
          "id": "D",
          "text": "Là sản phẩm của sự kết hợp giữa chủ nghĩa Mác - Lênin với phong trào công nhân và phong trào yêu nước ở Việt Nam trong thời đại mới"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 29,
      "type": "single",
      "question": "Nguyên nhân trực tiếp đặt ra yêu cầu thành lập chi bộ cộng sản đầu tiên của Việt Nam?",
      "options": [
        {
          "id": "A",
          "text": "Do chủ nghĩa Mác- Lênin được truyền bá vào Việt Nam"
        },
        {
          "id": "B",
          "text": "Do Bắc Kỳ là trung tâm cuộc khai thác thuộc địa lần thứ hai"
        },
        {
          "id": "C",
          "text": "Do sự phát triển của phong trào cách mạng, trình độ giác ngộ của công nhân cao"
        },
        {
          "id": "D",
          "text": "Do Bắc Kỳ tập trung nhiều trung tâm công nghiệp"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    },
    {
      "id": 30,
      "type": "single",
      "question": "Chọn đáp án đúng và đầy đủ nhất cho câu hỏi: Đảng lãnh đạo cách mạng giải phóng dân tộc, xây dựng và phát triển đất nước bằng gì?",
      "options": [
        {
          "id": "A",
          "text": "Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội"
        },
        {
          "id": "B",
          "text": "Chính sách cụ thể đặt ra trong từng thời kỳ lịch sử"
        },
        {
          "id": "C",
          "text": "Cương lĩnh, đường lối, chủ trương, chính sách lớn của Đảng"
        },
        {
          "id": "D",
          "text": "Cương lĩnh chính trị đầu tiên của Đảng"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Đáp án đúng là C."
    }
  ]
}
];
