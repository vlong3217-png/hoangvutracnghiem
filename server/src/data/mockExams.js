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
  "id": "exam-ptudpt-bai1",
  "title": "PHÁT TRIỂN ỨNG DỤNG PHÂN TÁN - BÀI 1",
  "subject": "Phát triển ứng dụng phân tán",
  "level": "Đại học",
  "duration": 60,
  "totalQuestions": 51,
  "author": "Bộ môn Công nghệ phần mềm",
  "className": "Lớp học phần Ứng dụng phân tán",
  "statusBadge": "51 Qs",
  "cardTheme": "purple",
  "assigned": true,
  "bottomText": "15 trắc nghiệm + 36 tự luận AI",
  "bottomType": "purple_pill",
  "questions": [
    {
      "id": 1,
      "type": "single",
      "question": "Câu 1: Điểm khác biệt quan trọng về giao tiếp giữa ứng dụng đơn khối và ứng dụng phân tán là gì?",
      "options": [
        {
          "id": "A",
          "text": "Ứng dụng phân tán không cần quan tâm đến định dạng dữ liệu"
        },
        {
          "id": "B",
          "text": "Ứng dụng đơn khối luôn dùng HTTP còn ứng dụng phân tán không dùng HTTP"
        },
        {
          "id": "C",
          "text": "Ứng dụng đơn khối không có xử lý nghiệp vụ"
        },
        {
          "id": "D",
          "text": "Ứng dụng đơn khối thường gọi trực tiếp trong cùng tiến trình, còn ứng dụng phân tán trao đổi qua mạng"
        }
      ],
      "explanation": "Đáp án đúng là D.",
      "correctAnswer": "D"
    },
    {
      "id": 2,
      "type": "single",
      "question": "Câu 2: Trong mô hình máy khách-máy chủ, thành phần nào được xem là máy khách trong một tương tác cụ thể?",
      "options": [
        {
          "id": "A",
          "text": "Thành phần có giao diện người dùng"
        },
        {
          "id": "B",
          "text": "Thành phần lưu cơ sở dữ liệu"
        },
        {
          "id": "C",
          "text": "Thành phần khởi tạo yêu cầu"
        },
        {
          "id": "D",
          "text": "Thành phần có tên chứa từ \"Client\""
        }
      ],
      "explanation": "Đáp án đúng là C.",
      "correctAnswer": "C"
    },
    {
      "id": 3,
      "type": "multiple",
      "question": "Câu 3: Hai đặc điểm nào đúng với truyền thông qua hàng đợi?",
      "options": [
        {
          "id": "A",
          "text": "Bên gửi có thể không cần chờ bên xử lý hoàn tất"
        },
        {
          "id": "B",
          "text": "Mỗi thông điệp luôn phải được gửi đồng thời tới mọi bên đăng ký"
        },
        {
          "id": "C",
          "text": "Bên gửi bắt buộc phải gọi trực tiếp dịch vụ xử lý nền"
        },
        {
          "id": "D",
          "text": "Hàng đợi giúp tách bên gửi công việc khỏi bên xử lý công việc"
        }
      ],
      "explanation": "Các đáp án đúng là: A, D.",
      "correctAnswer": [
        "A",
        "D"
      ]
    },
    {
      "id": 4,
      "type": "single",
      "question": "Câu 4: Trong publish-subscribe, bên phát sự kiện có đặc điểm nào?",
      "options": [
        {
          "id": "A",
          "text": "Phải chờ tất cả bên nhận phản hồi trước khi tiếp tục"
        },
        {
          "id": "B",
          "text": "Phải biết chính xác từng bên đăng ký và gọi trực tiếp từng bên"
        },
        {
          "id": "C",
          "text": "Chỉ được phép có một bên nhận sự kiện"
        },
        {
          "id": "D",
          "text": "Không nhất thiết phải biết có bao nhiêu bên nhận hoặc mỗi bên sẽ xử lý thế nào"
        }
      ],
      "explanation": "Đáp án đúng là D.",
      "correctAnswer": "D"
    },
    {
      "id": 5,
      "type": "single",
      "question": "Câu 5: Khi lựa chọn công nghệ cho một luồng giao tiếp phân tán, bước hợp lý trước tiên là gì?",
      "options": [
        {
          "id": "A",
          "text": "Chọn công nghệ phổ biến nhất rồi thiết kế tương tác theo công nghệ đó"
        },
        {
          "id": "B",
          "text": "Luôn chọn hàng đợi nếu hệ thống có từ hai thành phần trở lên"
        },
        {
          "id": "C",
          "text": "Luôn chọn REST API cho mọi loại tương tác"
        },
        {
          "id": "D",
          "text": "Xác định trước kiểu trao đổi thông điệp mà các thành phần cần sử dụng"
        }
      ],
      "explanation": "Đáp án đúng là D.",
      "correctAnswer": "D"
    },
    {
      "id": 6,
      "type": "single",
      "question": "Câu 6: Trong .NET, project được hiểu đúng nhất là gì?",
      "options": [
        {
          "id": "A",
          "text": "Đơn vị biên dịch được mô tả bởi file .csproj"
        },
        {
          "id": "B",
          "text": "Nhóm nhiều máy chủ cùng triển khai một ứng dụng"
        },
        {
          "id": "C",
          "text": "Một endpoint HTTP hoàn chỉnh"
        },
        {
          "id": "D",
          "text": "Một tiến trình đang chạy trên hệ điều hành"
        }
      ],
      "explanation": "Đáp án đúng là A.",
      "correctAnswer": "A"
    },
    {
      "id": 7,
      "type": "multiple",
      "question": "Câu 7: Hai phát biểu nào đúng về file project ASP.NET Core Web API trong ví dụ?",
      "options": [
        {
          "id": "A",
          "text": "ImplicitUsings dùng để khởi động máy chủ HTTP"
        },
        {
          "id": "B",
          "text": "Microsoft.NET.Sdk.Web xác định project web"
        },
        {
          "id": "C",
          "text": "TargetFramework chỉ ra phiên bản .NET mục tiêu"
        },
        {
          "id": "D",
          "text": "Nullable dùng để ánh xạ route tới handler"
        }
      ],
      "explanation": "Các đáp án đúng là: B, C.",
      "correctAnswer": [
        "B",
        "C"
      ]
    },
    {
      "id": 8,
      "type": "single",
      "question": "Câu 8: builder.Services được dùng chủ yếu để làm gì?",
      "options": [
        {
          "id": "A",
          "text": "Biên dịch solution thành file thực thi"
        },
        {
          "id": "B",
          "text": "Gửi HTTP response về máy khách"
        },
        {
          "id": "C",
          "text": "Khai báo status code cho endpoint"
        },
        {
          "id": "D",
          "text": "Đăng ký các dịch vụ để ứng dụng có thể sử dụng qua dependency injection"
        }
      ],
      "explanation": "Đáp án đúng là D.",
      "correctAnswer": "D"
    },
    {
      "id": 9,
      "type": "single",
      "question": "Câu 9: builder.Build() có vai trò gì trong luồng khởi tạo ứng dụng?",
      "options": [
        {
          "id": "A",
          "text": "Tự động tạo tất cả endpoint CRUD"
        },
        {
          "id": "B",
          "text": "Gửi request đầu tiên tới API"
        },
        {
          "id": "C",
          "text": "Dừng máy chủ HTTP"
        },
        {
          "id": "D",
          "text": "Tạo đối tượng ứng dụng từ cấu hình đã khai báo"
        }
      ],
      "explanation": "Đáp án đúng là D.",
      "correctAnswer": "D"
    },
    {
      "id": 10,
      "type": "single",
      "question": "Câu 10: Trong Minimal API, một endpoint thường được xác định bởi tổ hợp nào?",
      "options": [
        {
          "id": "A",
          "text": "HTTP method và route pattern"
        },
        {
          "id": "B",
          "text": "Tên project và tên solution"
        },
        {
          "id": "C",
          "text": "Status code và kiểu dữ liệu trả về"
        },
        {
          "id": "D",
          "text": "Tên service và target framework"
        }
      ],
      "explanation": "Đáp án đúng là A.",
      "correctAnswer": "A"
    },
    {
      "id": 11,
      "type": "single",
      "question": "Câu 11: Khi nghiệp vụ của một endpoint trở nên lớn, cách tổ chức nào phù hợp hơn?",
      "options": [
        {
          "id": "A",
          "text": "Chuyển mọi xử lý sang file .csproj"
        },
        {
          "id": "B",
          "text": "Chuyển logic chuyên trách sang service và để route handler điều phối ngắn gọn"
        },
        {
          "id": "C",
          "text": "Bỏ dependency injection để giảm số đối tượng"
        },
        {
          "id": "D",
          "text": "Đưa toàn bộ logic vào một biểu thức duy nhất trong Program.cs"
        }
      ],
      "explanation": "Đáp án đúng là B.",
      "correctAnswer": "B"
    },
    {
      "id": 12,
      "type": "multiple",
      "question": "Câu 12: Hai nguồn dữ liệu nào có thể được model binding trực tiếp vào tham số route handler?",
      "options": [
        {
          "id": "A",
          "text": "Query string"
        },
        {
          "id": "B",
          "text": "Chỉ file cấu hình project"
        },
        {
          "id": "C",
          "text": "Chỉ mã nguồn của solution"
        },
        {
          "id": "D",
          "text": "Route parameter"
        }
      ],
      "explanation": "Các đáp án đúng là: A, D.",
      "correctAnswer": [
        "A",
        "D"
      ]
    },
    {
      "id": 13,
      "type": "single",
      "question": "Câu 13: Một tham số kiểu service đã đăng ký trong builder.Services có thể được cung cấp cho handler thông qua cơ chế nào?",
      "options": [
        {
          "id": "A",
          "text": "Route rewriting"
        },
        {
          "id": "B",
          "text": "HTTP redirect"
        },
        {
          "id": "C",
          "text": "JSON serialization"
        },
        {
          "id": "D",
          "text": "Dependency injection"
        }
      ],
      "explanation": "Đáp án đúng là D.",
      "correctAnswer": "D"
    },
    {
      "id": 14,
      "type": "single",
      "question": "Câu 14: Results.Created(uri, value) biểu diễn phản hồi nào?",
      "options": [
        {
          "id": "A",
          "text": "200 OK và không có dữ liệu trả về"
        },
        {
          "id": "B",
          "text": "400 Bad Request do dữ liệu không hợp lệ"
        },
        {
          "id": "C",
          "text": "201 Created và có thể kèm địa chỉ tài nguyên qua header Location"
        },
        {
          "id": "D",
          "text": "500 Internal Server Error do lỗi máy chủ"
        }
      ],
      "explanation": "Đáp án đúng là C.",
      "correctAnswer": "C"
    },
    {
      "id": 15,
      "type": "single",
      "question": "Câu 15: Lỗi nào có thể làm API không khởi động được trên địa chỉ đã chọn?",
      "options": [
        {
          "id": "A",
          "text": "Project dùng Microsoft.NET.Sdk.Web"
        },
        {
          "id": "B",
          "text": "Route handler trả JSON"
        },
        {
          "id": "C",
          "text": "Có sử dụng dependency injection"
        },
        {
          "id": "D",
          "text": "Cổng đã bị tiến trình khác sử dụng"
        }
      ],
      "explanation": "Đáp án đúng là D.",
      "correctAnswer": "D"
    },
    {
      "id": 16,
      "type": "essay",
      "question": "Câu 16 (Tự luận): 1. Trình bày khái niệm hệ thống phân tán và nêu hai đặc điểm cốt lõi của hệ thống này.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: -  Khái niệm: Là tập hợp các phần tử tính toán tự trị phối hợp với nhau.\n- Đặc điểm 1: Gồm nhiều thành phần hoạt động độ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "-  Khái niệm: Là tập hợp các phần tử tính toán tự trị phối hợp với nhau.\n- Đặc điểm 1: Gồm nhiều thành phần hoạt động độc lập (tự trị).\n- Đặc điểm 2: Xuất hiện trước người dùng như một hệ thống thống nhất duy nhất.",
      "explanation": "-  Khái niệm: Là tập hợp các phần tử tính toán tự trị phối hợp với nhau.\n- Đặc điểm 1: Gồm nhiều thành phần hoạt động độc lập (tự trị).\n- Đặc điểm 2: Xuất hiện trước người dùng như một hệ thống thống nhất duy nhất."
    },
    {
      "id": 17,
      "type": "essay",
      "question": "Câu 17 (Tự luận): 2. Trình bày khái niệm ứng dụng phân tán dưới góc nhìn phát triển phần mềm.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Là ứng dụng có các thành phần xử lý không nhất thiết nằm trong cùng một tiến trình hoặc cùng một máy tính.\n- Các thành... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Là ứng dụng có các thành phần xử lý không nhất thiết nằm trong cùng một tiến trình hoặc cùng một máy tính.\n- Các thành phần này phối hợp với nhau qua mạng để thực hiện một mục tiêu chung.",
      "explanation": "- Là ứng dụng có các thành phần xử lý không nhất thiết nằm trong cùng một tiến trình hoặc cùng một máy tính.\n- Các thành phần này phối hợp với nhau qua mạng để thực hiện một mục tiêu chung."
    },
    {
      "id": 18,
      "type": "essay",
      "question": "Câu 18 (Tự luận): 3. Giải thích vì sao một ứng dụng có nhiều thành phần độc lập vẫn có thể xuất hiện trước người dùng như một hệ thống thống nhất.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Hệ thống phân tán che bớt sự độc lập của các thành phần bên trong.\n- Việc ẩn đi độ phức tạp này giúp người dùng hoặc c... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Hệ thống phân tán che bớt sự độc lập của các thành phần bên trong.\n- Việc ẩn đi độ phức tạp này giúp người dùng hoặc chương trình bên ngoài tương tác với nó như một chỉnh thể.",
      "explanation": "- Hệ thống phân tán che bớt sự độc lập của các thành phần bên trong.\n- Việc ẩn đi độ phức tạp này giúp người dùng hoặc chương trình bên ngoài tương tác với nó như một chỉnh thể."
    },
    {
      "id": 19,
      "type": "essay",
      "question": "Câu 19 (Tự luận): 4. Nêu khái niệm ứng dụng đơn khối (monolithic application).",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Là kiểu ứng dụng mà phần lớn chức năng được đóng gói, biên dịch, triển khai và vận hành như một đơn vị thống nhất.\n- M... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Là kiểu ứng dụng mà phần lớn chức năng được đóng gói, biên dịch, triển khai và vận hành như một đơn vị thống nhất.\n- Mọi thay đổi ở một phần thường kéo theo việc phải kiểm thử và triển khai lại toàn bộ ứng dụng.",
      "explanation": "- Là kiểu ứng dụng mà phần lớn chức năng được đóng gói, biên dịch, triển khai và vận hành như một đơn vị thống nhất.\n- Mọi thay đổi ở một phần thường kéo theo việc phải kiểm thử và triển khai lại toàn bộ ứng dụng."
    },
    {
      "id": 20,
      "type": "essay",
      "question": "Câu 20 (Tự luận): 5. Phân biệt cách giao tiếp giữa các thành phần trong ứng dụng đơn khối và ứng dụng phân tán.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Ứng dụng đơn khối: Các mô-đun gọi hàm trực tiếp trong cùng một tiến trình (đồng bộ, tốc độ nhanh).\n- Ứng dụng phân tán... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Ứng dụng đơn khối: Các mô-đun gọi hàm trực tiếp trong cùng một tiến trình (đồng bộ, tốc độ nhanh).\n- Ứng dụng phân tán: Các thành phần giao tiếp bằng cách gửi thông điệp qua mạng (có độ trễ, chịu ảnh hưởng của đường truyền).",
      "explanation": "- Ứng dụng đơn khối: Các mô-đun gọi hàm trực tiếp trong cùng một tiến trình (đồng bộ, tốc độ nhanh).\n- Ứng dụng phân tán: Các thành phần giao tiếp bằng cách gửi thông điệp qua mạng (có độ trễ, chịu ảnh hưởng của đường truyền)."
    },
    {
      "id": 21,
      "type": "essay",
      "question": "Câu 21 (Tự luận): 6. Giải thích vì sao giao tiếp qua mạng làm phát sinh thêm những vấn đề cần xử lý so với lời gọi hàm trong cùng tiến trình.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Lời gọi chịu ảnh hưởng của mạng, phát sinh độ trễ và rủi ro lỗi kết nối.\n- Lập trình viên phải xử lý thêm các yếu tố: ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Lời gọi chịu ảnh hưởng của mạng, phát sinh độ trễ và rủi ro lỗi kết nối.\n- Lập trình viên phải xử lý thêm các yếu tố: quá thời gian chờ (timeout), gửi lại, định dạng dữ liệu, xác thực, bảo mật và khả năng quan sát hệ thống.",
      "explanation": "- Lời gọi chịu ảnh hưởng của mạng, phát sinh độ trễ và rủi ro lỗi kết nối.\n- Lập trình viên phải xử lý thêm các yếu tố: quá thời gian chờ (timeout), gửi lại, định dạng dữ liệu, xác thực, bảo mật và khả năng quan sát hệ thống."
    },
    {
      "id": 22,
      "type": "essay",
      "question": "Câu 22 (Tự luận): 7. Giải thích vì sao một ứng dụng có các tiến trình độc lập giao tiếp qua mạng vẫn có thể là ứng dụng phân tán khi các tiến trình chạy trên cùng một máy tính.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Vì các thành phần đã được tách thành những tiến trình độc lập.\n- Ranh giới giao tiếp giữa chúng vẫn diễn ra qua giao t... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Vì các thành phần đã được tách thành những tiến trình độc lập.\n- Ranh giới giao tiếp giữa chúng vẫn diễn ra qua giao thức mạng hoặc cơ chế truyền thông điệp, thay vì gọi hàm nội bộ.",
      "explanation": "- Vì các thành phần đã được tách thành những tiến trình độc lập.\n- Ranh giới giao tiếp giữa chúng vẫn diễn ra qua giao thức mạng hoặc cơ chế truyền thông điệp, thay vì gọi hàm nội bộ."
    },
    {
      "id": 23,
      "type": "essay",
      "question": "Câu 23 (Tự luận): 8. Trình bày khái niệm và vai trò của máy khách và máy chủ trong kiến trúc client–server.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Máy khách (Client): Là thành phần khởi tạo yêu cầu.\n- Máy chủ (Server): Là thành phần tiếp nhận yêu cầu, xử lý nghiệp ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Máy khách (Client): Là thành phần khởi tạo yêu cầu.\n- Máy chủ (Server): Là thành phần tiếp nhận yêu cầu, xử lý nghiệp vụ và trả kết quả.",
      "explanation": "- Máy khách (Client): Là thành phần khởi tạo yêu cầu.\n- Máy chủ (Server): Là thành phần tiếp nhận yêu cầu, xử lý nghiệp vụ và trả kết quả."
    },
    {
      "id": 24,
      "type": "essay",
      "question": "Câu 24 (Tự luận): 9. Giải thích vì sao vai trò máy khách và máy chủ phụ thuộc vào từng tương tác, thay vì cố định cho một thành phần phần mềm.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Vai trò được xác định theo chiều của lời gọi tại thời điểm đó, không phụ thuộc vào tên gọi cố định của thành phần.\n- M... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Vai trò được xác định theo chiều của lời gọi tại thời điểm đó, không phụ thuộc vào tên gọi cố định của thành phần.\n- Một dịch vụ có thể đóng vai trò máy chủ khi nhận yêu cầu, nhưng lại là máy khách khi nó tiếp tục gọi sang một dịch vụ khác.",
      "explanation": "- Vai trò được xác định theo chiều của lời gọi tại thời điểm đó, không phụ thuộc vào tên gọi cố định của thành phần.\n- Một dịch vụ có thể đóng vai trò máy chủ khi nhận yêu cầu, nhưng lại là máy khách khi nó tiếp tục gọi sang một dịch vụ khác."
    },
    {
      "id": 25,
      "type": "essay",
      "question": "Câu 25 (Tự luận): 10. Mô tả các bước cơ bản của một tương tác yêu cầu–phản hồi giữa máy khách và máy chủ.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Bước 1: Máy khách tạo yêu cầu (gồm địa chỉ, thao tác, dữ liệu, xác thực).\n- Bước 2: Yêu cầu được truyền qua mạng tới m... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Bước 1: Máy khách tạo yêu cầu (gồm địa chỉ, thao tác, dữ liệu, xác thực).\n- Bước 2: Yêu cầu được truyền qua mạng tới máy chủ.\n- Bước 3: Máy chủ kiểm tra, thực thi nghiệp vụ và truy xuất dữ liệu.\n- Bước 4: Máy chủ trả phản hồi để máy khách hiển thị hoặc xử lý tiếp.",
      "explanation": "- Bước 1: Máy khách tạo yêu cầu (gồm địa chỉ, thao tác, dữ liệu, xác thực).\n- Bước 2: Yêu cầu được truyền qua mạng tới máy chủ.\n- Bước 3: Máy chủ kiểm tra, thực thi nghiệp vụ và truy xuất dữ liệu.\n- Bước 4: Máy chủ trả phản hồi để máy khách hiển thị hoặc xử lý tiếp."
    },
    {
      "id": 26,
      "type": "essay",
      "question": "Câu 26 (Tự luận): 11. Trình bày khái niệm mô hình trao đổi thông điệp (Message Exchange Pattern — MEP).",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Mô hình trao đổi thông điệp (Message Exchange Pattern) mô tả cách các thành phần gửi, nhận và phản hồi thông điệp.\n- M... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Mô hình trao đổi thông điệp (Message Exchange Pattern) mô tả cách các thành phần gửi, nhận và phản hồi thông điệp.\n- MEP không bị gắn cứng với bất kỳ một công nghệ cụ thể nào.",
      "explanation": "- Mô hình trao đổi thông điệp (Message Exchange Pattern) mô tả cách các thành phần gửi, nhận và phản hồi thông điệp.\n- MEP không bị gắn cứng với bất kỳ một công nghệ cụ thể nào."
    },
    {
      "id": 27,
      "type": "essay",
      "question": "Câu 27 (Tự luận): 12. Giải thích vì sao cần xác định kiểu trao đổi thông điệp trước khi lựa chọn công nghệ giao tiếp.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Để hiểu rõ các thành phần cần \"kiểu trao đổi\" nào (cần phản hồi ngay hay xử lý nền, gửi một lần hay liên tục).\n- Khi x... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Để hiểu rõ các thành phần cần \"kiểu trao đổi\" nào (cần phản hồi ngay hay xử lý nền, gửi một lần hay liên tục).\n- Khi xác định được kiểu trao đổi, người thiết kế mới có thể chọn chính xác giao thức, framework và hạ tầng phù hợp.",
      "explanation": "- Để hiểu rõ các thành phần cần \"kiểu trao đổi\" nào (cần phản hồi ngay hay xử lý nền, gửi một lần hay liên tục).\n- Khi xác định được kiểu trao đổi, người thiết kế mới có thể chọn chính xác giao thức, framework và hạ tầng phù hợp."
    },
    {
      "id": 28,
      "type": "essay",
      "question": "Câu 28 (Tự luận): 13. Trình bày đặc điểm của mô hình yêu cầu–phản hồi (request–response).",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Một bên gửi yêu cầu, bên còn lại xử lý và trả phản hồi.\n- Máy khách thường bị ràng buộc thời gian và phải chờ phản hồi... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Một bên gửi yêu cầu, bên còn lại xử lý và trả phản hồi.\n- Máy khách thường bị ràng buộc thời gian và phải chờ phản hồi trước khi tiếp tục luồng xử lý.",
      "explanation": "- Một bên gửi yêu cầu, bên còn lại xử lý và trả phản hồi.\n- Máy khách thường bị ràng buộc thời gian và phải chờ phản hồi trước khi tiếp tục luồng xử lý."
    },
    {
      "id": 29,
      "type": "essay",
      "question": "Câu 29 (Tự luận): 14. Giải thích ưu điểm và hạn chế của mô hình yêu cầu–phản hồi đối với các tác vụ xử lý lâu.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Ưu điểm: Dễ hiểu, dễ gỡ lỗi, phù hợp với thao tác cần kết quả ngay.\n- Nhược điểm (khi xử lý lâu): Máy khách phải chờ đ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Ưu điểm: Dễ hiểu, dễ gỡ lỗi, phù hợp với thao tác cần kết quả ngay.\n- Nhược điểm (khi xử lý lâu): Máy khách phải chờ đợi (hoặc quá thời gian chờ); nên giới hạn dùng để ghi nhận yêu cầu ban đầu rồi chuyển xử lý chính sang chạy nền.",
      "explanation": "- Ưu điểm: Dễ hiểu, dễ gỡ lỗi, phù hợp với thao tác cần kết quả ngay.\n- Nhược điểm (khi xử lý lâu): Máy khách phải chờ đợi (hoặc quá thời gian chờ); nên giới hạn dùng để ghi nhận yêu cầu ban đầu rồi chuyển xử lý chính sang chạy nền."
    },
    {
      "id": 30,
      "type": "essay",
      "question": "Câu 30 (Tự luận): 15. Trình bày đặc điểm của mô hình thông điệp một chiều (one-way message).",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Một thành phần gửi thông điệp đi mà không chờ bên kia phản hồi nghiệp vụ.\n- Bên gửi chỉ cần xác nhận thông điệp đã đượ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Một thành phần gửi thông điệp đi mà không chờ bên kia phản hồi nghiệp vụ.\n- Bên gửi chỉ cần xác nhận thông điệp đã được chấp nhận gửi hoặc đưa vào kênh truyền.",
      "explanation": "- Một thành phần gửi thông điệp đi mà không chờ bên kia phản hồi nghiệp vụ.\n- Bên gửi chỉ cần xác nhận thông điệp đã được chấp nhận gửi hoặc đưa vào kênh truyền."
    },
    {
      "id": 31,
      "type": "essay",
      "question": "Câu 31 (Tự luận): 16. Giải thích vì sao việc không chờ phản hồi nghiệp vụ trong mô hình thông điệp một chiều làm tăng nhu cầu theo dõi và xử lý lỗi.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Vì bên gửi không nhận được kết quả xử lý trực tiếp, lỗi ở phía nhận có thể bị che khuất.\n- Hệ thống bắt buộc phải có c... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Vì bên gửi không nhận được kết quả xử lý trực tiếp, lỗi ở phía nhận có thể bị che khuất.\n- Hệ thống bắt buộc phải có cơ chế theo dõi trạng thái và ghi nhật ký để truy vết khi thất bại.",
      "explanation": "- Vì bên gửi không nhận được kết quả xử lý trực tiếp, lỗi ở phía nhận có thể bị che khuất.\n- Hệ thống bắt buộc phải có cơ chế theo dõi trạng thái và ghi nhật ký để truy vết khi thất bại."
    },
    {
      "id": 32,
      "type": "essay",
      "question": "Câu 32 (Tự luận): 17. Trình bày nguyên lý trao đổi thông điệp qua hàng đợi (queue-based messaging).",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Sử dụng hàng đợi trung gian để tách rời bên gửi công việc và bên xử lý công việc.\n- Bên gửi đưa thông điệp vào hàng đợ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Sử dụng hàng đợi trung gian để tách rời bên gửi công việc và bên xử lý công việc.\n- Bên gửi đưa thông điệp vào hàng đợi, dịch vụ xử lý nền (worker) tự lấy ra và xử lý mà bên gửi không cần chờ đợi hoàn tất.",
      "explanation": "- Sử dụng hàng đợi trung gian để tách rời bên gửi công việc và bên xử lý công việc.\n- Bên gửi đưa thông điệp vào hàng đợi, dịch vụ xử lý nền (worker) tự lấy ra và xử lý mà bên gửi không cần chờ đợi hoàn tất."
    },
    {
      "id": 33,
      "type": "essay",
      "question": "Câu 33 (Tự luận): 18. Giải thích vì sao hàng đợi giúp giảm sự phụ thuộc về thời gian giữa bên gửi và bên xử lý.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Công việc không bắt buộc phải hoàn thành ngay; worker có thể xử lý sau giúp hệ thống tự điều tiết tải.\n- Cho phép API ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Công việc không bắt buộc phải hoàn thành ngay; worker có thể xử lý sau giúp hệ thống tự điều tiết tải.\n- Cho phép API phản hồi trạng thái nhanh (ví dụ: đang xử lý) để người dùng không phải chờ đợi toàn bộ quá trình.",
      "explanation": "- Công việc không bắt buộc phải hoàn thành ngay; worker có thể xử lý sau giúp hệ thống tự điều tiết tải.\n- Cho phép API phản hồi trạng thái nhanh (ví dụ: đang xử lý) để người dùng không phải chờ đợi toàn bộ quá trình."
    },
    {
      "id": 34,
      "type": "essay",
      "question": "Câu 34 (Tự luận): 19. Trình bày nguyên lý của mô hình phát hành–đăng ký (publish–subscribe).",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Một thành phần phát ra sự kiện (publisher).\n- Nhiều thành phần độc lập khác đăng ký (subscriber) để nhận và tự quyết đ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Một thành phần phát ra sự kiện (publisher).\n- Nhiều thành phần độc lập khác đăng ký (subscriber) để nhận và tự quyết định cách xử lý sự kiện đó mà bên phát không cần quan tâm chi tiết.",
      "explanation": "- Một thành phần phát ra sự kiện (publisher).\n- Nhiều thành phần độc lập khác đăng ký (subscriber) để nhận và tự quyết định cách xử lý sự kiện đó mà bên phát không cần quan tâm chi tiết."
    },
    {
      "id": 35,
      "type": "essay",
      "question": "Câu 35 (Tự luận): 20. Phân biệt mục đích và cách phân phối thông điệp trong mô hình hàng đợi và mô hình phát hành–đăng ký.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Qua hàng đợi: Một thông điệp đại diện cho một công việc và chỉ phân phối cho một dịch vụ xử lý nền trong nhóm xử lý.\n-... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Qua hàng đợi: Một thông điệp đại diện cho một công việc và chỉ phân phối cho một dịch vụ xử lý nền trong nhóm xử lý.\n- Phát hành-đăng ký: Một thông điệp đại diện cho một sự kiện đã xảy ra và được phát cho nhiều bên đăng ký độc lập cùng lúc.",
      "explanation": "- Qua hàng đợi: Một thông điệp đại diện cho một công việc và chỉ phân phối cho một dịch vụ xử lý nền trong nhóm xử lý.\n- Phát hành-đăng ký: Một thông điệp đại diện cho một sự kiện đã xảy ra và được phát cho nhiều bên đăng ký độc lập cùng lúc."
    },
    {
      "id": 36,
      "type": "essay",
      "question": "Câu 36 (Tự luận): 21. Trình bày đặc điểm chung của truyền luồng (streaming) và đẩy dữ liệu (push).",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Dữ liệu được gửi liên tục hoặc máy chủ chủ động đẩy thông điệp về máy khách ngay khi có thay đổi.\n- Hai bên thường duy... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Dữ liệu được gửi liên tục hoặc máy chủ chủ động đẩy thông điệp về máy khách ngay khi có thay đổi.\n- Hai bên thường duy trì một kết nối dài (long-lived connection).",
      "explanation": "- Dữ liệu được gửi liên tục hoặc máy chủ chủ động đẩy thông điệp về máy khách ngay khi có thay đổi.\n- Hai bên thường duy trì một kết nối dài (long-lived connection)."
    },
    {
      "id": 37,
      "type": "essay",
      "question": "Câu 37 (Tự luận): 22. Giải thích sự khác biệt giữa việc máy chủ chủ động đẩy dữ liệu và mô hình yêu cầu–phản hồi thông thường.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Máy khách không nhất thiết phải gửi một yêu cầu mới mỗi lần muốn lấy bản cập nhật. Máy chủ sẽ tự động đẩy dữ liệu khi ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Máy khách không nhất thiết phải gửi một yêu cầu mới mỗi lần muốn lấy bản cập nhật. Máy chủ sẽ tự động đẩy dữ liệu khi cần.",
      "explanation": "- Máy khách không nhất thiết phải gửi một yêu cầu mới mỗi lần muốn lấy bản cập nhật. Máy chủ sẽ tự động đẩy dữ liệu khi cần."
    },
    {
      "id": 38,
      "type": "essay",
      "question": "Câu 38 (Tự luận): 23. Nêu vai trò khái quát của REST API, GraphQL, gRPC, bộ môi giới thông điệp và SignalR trong giao tiếp của ứng dụng phân tán.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - REST API / GraphQL: Phục vụ tương tác yêu cầu-phản hồi (giao tiếp API phía máy khách).\n- gRPC: Phục vụ giao tiếp dịch ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- REST API / GraphQL: Phục vụ tương tác yêu cầu-phản hồi (giao tiếp API phía máy khách).\n- gRPC: Phục vụ giao tiếp dịch vụ-dịch vụ nội bộ với hiệu năng cao.\n- Bộ môi giới thông điệp (RabbitMQ): Phục vụ truyền thông qua hàng đợi (xử lý nền) và phát hành-đăng ký.\n- SignalR: Phục vụ truyền luồng và đẩy dữ liệu cập nhật thời gian thực.",
      "explanation": "- REST API / GraphQL: Phục vụ tương tác yêu cầu-phản hồi (giao tiếp API phía máy khách).\n- gRPC: Phục vụ giao tiếp dịch vụ-dịch vụ nội bộ với hiệu năng cao.\n- Bộ môi giới thông điệp (RabbitMQ): Phục vụ truyền thông qua hàng đợi (xử lý nền) và phát hành-đăng ký.\n- SignalR: Phục vụ truyền luồng và đẩy dữ liệu cập nhật thời gian thực."
    },
    {
      "id": 39,
      "type": "essay",
      "question": "Câu 39 (Tự luận): 24. Giải thích vì sao một ứng dụng phân tán có thể cần phối hợp nhiều mô hình trao đổi thông điệp.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Vì một quy trình nghiệp vụ thực tế chứa nhiều dạng tương tác khác nhau.\n- Ví dụ: Luồng nộp bài dùng yêu cầu-phản hồi k... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Vì một quy trình nghiệp vụ thực tế chứa nhiều dạng tương tác khác nhau.\n- Ví dụ: Luồng nộp bài dùng yêu cầu-phản hồi khi nhận lệnh, dùng hàng đợi để chấm bài chạy nền, dùng pub/sub khi chấm xong để phát sự kiện, và dùng đẩy dữ liệu để thông báo trạng thái về máy khách.",
      "explanation": "- Vì một quy trình nghiệp vụ thực tế chứa nhiều dạng tương tác khác nhau.\n- Ví dụ: Luồng nộp bài dùng yêu cầu-phản hồi khi nhận lệnh, dùng hàng đợi để chấm bài chạy nền, dùng pub/sub khi chấm xong để phát sự kiện, và dùng đẩy dữ liệu để thông báo trạng thái về máy khách."
    },
    {
      "id": 40,
      "type": "essay",
      "question": "Câu 40 (Tự luận): 1. Trình bày khái niệm project và solution trong hệ sinh thái .NET.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Project: Là đơn vị biên dịch, chứa mã nguồn và file .csproj khai báo SDK, framework và các tùy chọn biên dịch.\n- Solut... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Project: Là đơn vị biên dịch, chứa mã nguồn và file .csproj khai báo SDK, framework và các tùy chọn biên dịch.\n- Solution: Là cấu trúc tổ chức dùng để nhóm một hoặc nhiều project có liên quan và hỗ trợ build chúng bằng một lệnh.",
      "explanation": "- Project: Là đơn vị biên dịch, chứa mã nguồn và file .csproj khai báo SDK, framework và các tùy chọn biên dịch.\n- Solution: Là cấu trúc tổ chức dùng để nhóm một hoặc nhiều project có liên quan và hỗ trợ build chúng bằng một lệnh."
    },
    {
      "id": 41,
      "type": "essay",
      "question": "Câu 41 (Tự luận): 2. Phân biệt vai trò của project và solution trong việc tổ chức một hệ thống phần mềm.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Project: Chứa mã nguồn của một ứng dụng hoặc thư viện, có thể được biên dịch và thực thi.\n- Solution: Dùng để quản lý,... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Project: Chứa mã nguồn của một ứng dụng hoặc thư viện, có thể được biên dịch và thực thi.\n- Solution: Dùng để quản lý, tổ chức nhiều project liên quan trong cùng một hệ thống.\n- Solution không phải là một tiến trình chạy mà chỉ phục vụ tổ chức và build.",
      "explanation": "- Project: Chứa mã nguồn của một ứng dụng hoặc thư viện, có thể được biên dịch và thực thi.\n- Solution: Dùng để quản lý, tổ chức nhiều project liên quan trong cùng một hệ thống.\n- Solution không phải là một tiến trình chạy mà chỉ phục vụ tổ chức và build."
    },
    {
      "id": 42,
      "type": "essay",
      "question": "Câu 42 (Tự luận): 3. Nêu các trách nhiệm cơ bản của môi trường hosting trong một ứng dụng ASP.NET Core Web API.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Quản lý vòng đời ứng dụng.\n- Quản lý cấu hình và ghi nhật ký (logging).\n- Cung cấp cơ chế tiêm phụ thuộc (Dependency I... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Quản lý vòng đời ứng dụng.\n- Quản lý cấu hình và ghi nhật ký (logging).\n- Cung cấp cơ chế tiêm phụ thuộc (Dependency Injection).\n- Quản lý máy chủ HTTP.",
      "explanation": "- Quản lý vòng đời ứng dụng.\n- Quản lý cấu hình và ghi nhật ký (logging).\n- Cung cấp cơ chế tiêm phụ thuộc (Dependency Injection).\n- Quản lý máy chủ HTTP."
    },
    {
      "id": 43,
      "type": "essay",
      "question": "Câu 43 (Tự luận): 4. Giải thích sự khác nhau giữa giai đoạn cấu hình ứng dụng và giai đoạn ứng dụng được tạo để chạy trong hosting model của ASP.NET Core.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Giai đoạn cấu hình: Sử dụng WebApplicationBuilder để đọc cấu hình và đăng ký các dịch vụ thông qua builder.Services.\n-... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Giai đoạn cấu hình: Sử dụng WebApplicationBuilder để đọc cấu hình và đăng ký các dịch vụ thông qua builder.Services.\n- Giai đoạn tạo và chạy: Gọi builder.Build() để tạo WebApplication, ánh xạ endpoint và gọi app.Run() để khởi động máy chủ HTTP.",
      "explanation": "- Giai đoạn cấu hình: Sử dụng WebApplicationBuilder để đọc cấu hình và đăng ký các dịch vụ thông qua builder.Services.\n- Giai đoạn tạo và chạy: Gọi builder.Build() để tạo WebApplication, ánh xạ endpoint và gọi app.Run() để khởi động máy chủ HTTP."
    },
    {
      "id": 44,
      "type": "essay",
      "question": "Câu 44 (Tự luận): 5. Trình bày khái niệm endpoint trong Web API.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Endpoint là điểm mà một yêu cầu HTTP được nối với mã xử lý trong ứng dụng.\n- Đây là điểm vào để máy khách gọi và sử dụ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Endpoint là điểm mà một yêu cầu HTTP được nối với mã xử lý trong ứng dụng.\n- Đây là điểm vào để máy khách gọi và sử dụng chức năng của máy chủ.",
      "explanation": "- Endpoint là điểm mà một yêu cầu HTTP được nối với mã xử lý trong ứng dụng.\n- Đây là điểm vào để máy khách gọi và sử dụng chức năng của máy chủ."
    },
    {
      "id": 45,
      "type": "essay",
      "question": "Câu 45 (Tự luận): 6. Giải thích mối quan hệ giữa phương thức HTTP, mẫu đường dẫn (route pattern) và hàm xử lý (route handler) khi xác định một endpoint.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Phương thức HTTP: Xác định loại thao tác như GET, POST, PUT, DELETE.\n- Route pattern: Xác định đường dẫn mà máy khách ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Phương thức HTTP: Xác định loại thao tác như GET, POST, PUT, DELETE.\n- Route pattern: Xác định đường dẫn mà máy khách gọi.\n- Route handler: Là hàm thực hiện xử lý yêu cầu và trả kết quả.\n- Phương thức HTTP kết hợp với route pattern xác định endpoint và endpoint sẽ gọi route handler tương ứng.",
      "explanation": "- Phương thức HTTP: Xác định loại thao tác như GET, POST, PUT, DELETE.\n- Route pattern: Xác định đường dẫn mà máy khách gọi.\n- Route handler: Là hàm thực hiện xử lý yêu cầu và trả kết quả.\n- Phương thức HTTP kết hợp với route pattern xác định endpoint và endpoint sẽ gọi route handler tương ứng."
    },
    {
      "id": 46,
      "type": "essay",
      "question": "Câu 46 (Tự luận): 7. Trình bày đặc điểm cơ bản của mô hình lập trình Minimal API.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Khai báo endpoint trực tiếp bằng các phương thức như MapGet, MapPost, MapPut, MapDelete.\n- Giảm số lượng file và lớp c... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Khai báo endpoint trực tiếp bằng các phương thức như MapGet, MapPost, MapPut, MapDelete.\n- Giảm số lượng file và lớp cần tạo.\n- Cú pháp ngắn gọn, dễ đọc và dễ triển khai.\n- Vẫn hỗ trợ Dependency Injection và Middleware.",
      "explanation": "- Khai báo endpoint trực tiếp bằng các phương thức như MapGet, MapPost, MapPut, MapDelete.\n- Giảm số lượng file và lớp cần tạo.\n- Cú pháp ngắn gọn, dễ đọc và dễ triển khai.\n- Vẫn hỗ trợ Dependency Injection và Middleware."
    },
    {
      "id": 47,
      "type": "essay",
      "question": "Câu 47 (Tự luận): 8. Giải thích vì sao Minimal API phù hợp với việc xây dựng API có cấu trúc gọn và vì sao logic nghiệp vụ vẫn có thể cần tách khỏi route handler.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Minimal API phù hợp vì giảm số lượng file, lớp và mã nguồn cần viết, thích hợp cho ví dụ nhập môn, microservice nhỏ ho... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Minimal API phù hợp vì giảm số lượng file, lớp và mã nguồn cần viết, thích hợp cho ví dụ nhập môn, microservice nhỏ hoặc prototype.\n- Khi nghiệp vụ lớn hơn, nên tách logic nghiệp vụ thành các service chuyên trách để route handler không chứa quá nhiều xử lý, giúp mã nguồn dễ quản lý hơn.",
      "explanation": "- Minimal API phù hợp vì giảm số lượng file, lớp và mã nguồn cần viết, thích hợp cho ví dụ nhập môn, microservice nhỏ hoặc prototype.\n- Khi nghiệp vụ lớn hơn, nên tách logic nghiệp vụ thành các service chuyên trách để route handler không chứa quá nhiều xử lý, giúp mã nguồn dễ quản lý hơn."
    },
    {
      "id": 48,
      "type": "essay",
      "question": "Câu 48 (Tự luận): 9. Trình bày khái niệm model binding trong quá trình tiếp nhận yêu cầu HTTP.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Model binding là cơ chế ASP.NET Core tự động lấy dữ liệu từ request hoặc Dependency Injection dựa trên khai báo tham s... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Model binding là cơ chế ASP.NET Core tự động lấy dữ liệu từ request hoặc Dependency Injection dựa trên khai báo tham số của route handler.\n- Sau đó ánh xạ dữ liệu thành các tham số C# có kiểu tương ứng.",
      "explanation": "- Model binding là cơ chế ASP.NET Core tự động lấy dữ liệu từ request hoặc Dependency Injection dựa trên khai báo tham số của route handler.\n- Sau đó ánh xạ dữ liệu thành các tham số C# có kiểu tương ứng."
    },
    {
      "id": 49,
      "type": "essay",
      "question": "Câu 49 (Tự luận): 10. Giải thích ý nghĩa của việc ánh xạ dữ liệu từ route, query string và request body thành các tham số có kiểu của hàm xử lý.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Giúp tự động chuyển dữ liệu HTTP thành các tham số C# có kiểu rõ ràng.\n- Route: Lấy dữ liệu từ đường dẫn URL.\n- Query ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Giúp tự động chuyển dữ liệu HTTP thành các tham số C# có kiểu rõ ràng.\n- Route: Lấy dữ liệu từ đường dẫn URL.\n- Query string: Lấy dữ liệu từ chuỗi truy vấn trên URL.\n- Request body: Lấy dữ liệu JSON trong thân request và chuyển thành đối tượng C#.\n- Giúp lập trình viên không phải tự tách chuỗi URL hoặc phân tích JSON.",
      "explanation": "- Giúp tự động chuyển dữ liệu HTTP thành các tham số C# có kiểu rõ ràng.\n- Route: Lấy dữ liệu từ đường dẫn URL.\n- Query string: Lấy dữ liệu từ chuỗi truy vấn trên URL.\n- Request body: Lấy dữ liệu JSON trong thân request và chuyển thành đối tượng C#.\n- Giúp lập trình viên không phải tự tách chuỗi URL hoặc phân tích JSON."
    },
    {
      "id": 50,
      "type": "essay",
      "question": "Câu 50 (Tự luận): 11. Nêu vai trò của dependency injection trong việc cung cấp dịch vụ cho thành phần xử lý yêu cầu.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Dependency Injection giúp cung cấp các dịch vụ đã đăng ký trong builder.Services cho route handler.\n- Giúp tách biệt x... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Dependency Injection giúp cung cấp các dịch vụ đã đăng ký trong builder.Services cho route handler.\n- Giúp tách biệt xử lý nghiệp vụ khỏi route handler và dễ quản lý các thành phần của ứng dụng.",
      "explanation": "- Dependency Injection giúp cung cấp các dịch vụ đã đăng ký trong builder.Services cho route handler.\n- Giúp tách biệt xử lý nghiệp vụ khỏi route handler và dễ quản lý các thành phần của ứng dụng."
    },
    {
      "id": 51,
      "type": "essay",
      "question": "Câu 51 (Tự luận): 12. Giải thích vì sao API cần sử dụng các mã trạng thái HTTP khác nhau để biểu thị kết quả xử lý yêu cầu.",
      "maxScore": 10,
      "rubric": "Chấm thang điểm 10. Trả lời đúng trọng tâm các luận điểm: - Giúp máy khách nhận biết chính xác kết quả xử lý yêu cầu từ máy chủ.\n- Một số mã trạng thái thường gặp:\n- 200 OK: Yêu ... Diễn đạt mạch lạc, chính xác.",
      "sampleAnswer": "- Giúp máy khách nhận biết chính xác kết quả xử lý yêu cầu từ máy chủ.\n- Một số mã trạng thái thường gặp:\n- 200 OK: Yêu cầu thành công.\n- 201 Created: Đã tạo tài nguyên mới.\n- 400 Bad Request: Dữ liệu đầu vào không hợp lệ.\n- Giúp máy khách biết yêu cầu thành công hay thất bại để xử lý phù hợp.",
      "explanation": "- Giúp máy khách nhận biết chính xác kết quả xử lý yêu cầu từ máy chủ.\n- Một số mã trạng thái thường gặp:\n- 200 OK: Yêu cầu thành công.\n- 201 Created: Đã tạo tài nguyên mới.\n- 400 Bad Request: Dữ liệu đầu vào không hợp lệ.\n- Giúp máy khách biết yêu cầu thành công hay thất bại để xử lý phù hợp."
    }
  ]
},

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
  "author": "Hệ thống Quizizz",
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
