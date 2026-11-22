import type { TacGia } from '../types/library';
import type { SachRow, SachTacGiaRow } from './schema';

const RAW_THESES_TSV = `
150070000919	Nâng cao khả năng phát hiện video DEEPFAKE khuôn mặt bằng mô hình học sâu kết hợp với các thuật toán tối ưu hóa	Nguyễn Minh Nhựt	2026
150070000918	Trích xuất và ánh xạ thông tin tình báo an ninh mạng với tiếp cận mô hình ngôn ngữ	Trần Bảo Ân	2026
150070000917	Phương pháp kết hợp để phát hiện DEEPFAKE âm thanh trong tiếng việt sử dụng các đặc trưng phổ và tần số	Nguyễn Thị Viết Hương	2026
150070000916	Xây dựng mô hình nhận dạng sinh trắc học dựa trên tín hiệu nhịp tim quang học	Trịnh Thị Thanh Trúc	2026
150070000915	Chẩn đoán và phân vùng khối u tuyến tiền liệt thông qua phân tích ảnh cộng hưởng từ hai tham số (BPMRI)	Đặng Vũ Phương Uyên	2026
150070000914	Hệ thống phân loại bốn cấp liệt miệng theo thời gian thực để phát hiện sớm đột quỵ bằng mô hình CNN nhẹ	Lê Hữu Lộc	2026
150070000913	Nghiên cứu một số phương pháp truyền tin bảo mật dựa trên mã hóa lượng tử	Nguyễn Dương Hoàng Duy	2026
150070000912	Hệ thống tường lửa phát hiện tấn công web bằng phương pháp học sâu ngữ nghĩa	Vũ Quang Huy	2026
150070000911	Phát hiện gian lận trong yêu cầu bồi thường bảo hiểm y tế sử dụng học bán giám sát và mạng nơ-ron đồ thị trên bộ dữ liệu CMS	Lê Ngọc Minh Hiền	2026
150070000910	Xây dựng mô hình biểu diễn tri thức và suy luận kết hợp trí tuệ nhân tạo tạo sinh	Ngạc Thị Kim Sang	2026
150070000909	Mô hình phát hiện bất thường và hỗ trợ ra quyết định cho dây chuyền đúc phôi thép dựa trên dữ liệu thời gian thực	Lê Thanh Nguyên	2026
150070000908	Thiết kế và triển khai ứng dụng dự báo kết quả học tập của sinh viên	Nguyễn Thị Ngọc Mai	2026
150070000907	Ứng dụng Explainable AI (XAI) trong hệ thống đề xuất kế hoạch du lịch cá nhân hóa dựa trên hành vi và dữ liệu của khách du lịch quốc tế tại Việt Nam	Nguyễn Thị Thu Huyền	2026
150070000906	Dự báo hành vi rời bỏ dịch vụ của đối tác trong ngành may mặc dựa trên mạng Nơ-ron học sâu	Đỗ Trung Thuận	2026
150070000905	Phương pháp xác minh chủ động dựa trên bản sao số với trọng số hiệu năng tăng cường khả năng chống chịu của học liên kết trong phát hiện xâm nhập IoT	Phạm Hoàng Hảo	2026
150070000904	Đánh giá khả năng tổng quát hóa của các mô hình học sâu trong nhận diện bệnh da trên đa dạng bộ dữ liệu	Đoàn Anh Tú	2026
150070000903	Tối ưu phương pháp đồ thị tự thích ứng cho bài toán phân cụm phổ với kỹ thuật gán nhãn mềm	Võ Huy Khôi	2026
150070000902	Đánh giá năng lực suy luận chiến lược của mô hình thị giác- ngôn ngữ trong môi trường mô phỏng	Huỳnh Khánh Hòa	2026
150070000901	Nâng cao hiệu quả phân đoạn ảnh y khoa bằng cách kết hợp convolutional Kan vào kiến trúc U-KAN	Phạm Nguyễn Thanh Bình	2026
150070000900	Hệ tri thức đầu tư thông minh dựa trên NEO4J hỗ trợ ra quyết định tài chính	Phan Văn Phước Thịnh	2026
150070000899	Nghiên cứu và phát triển phương pháp diễn giải cho bài toán phân loại quỹ đạo dựa trên nhiễu hóa phân đoạn	Lê Xuân Tùng	2026
150070000898	Ứng dụng ghép nối thử nghiệm lâm sàng cho người Việt	Nguyễn Thịnh Quyền	2026
150070000897	Giải pháp kết hợp ontology và mô hình ngôn ngữ lớn để thiết kế hệ thống tư vấn kiến thức về quy định đào tạo sau đại học	Lê Hồng Hiển	2026
150070000896	Thiết kế phương pháp Metaheuristic cho bài toán người bán hàng với ràng buộc sức chứa	Trần Đình Khang	2026
150070000895	Nghiên cứu đề xuất nền tảng IoT có tích hợp mật mã hậu lượng tử	Lê Thanh Hùng	2026
150070000894	Nghiên cứu mô hình học sâu tích hợp Autoencoder, Gan và Xgboost để phát hiện gian lận thẻ tín dụng	Nguyễn Duy Khánh	2026
150070000893	Kiến trúc End-to-end cho hệ thống chấm điểm tín dụng phi tập trung (Defi) sử dụng Zero-knowledge proof để bảo vệ quyền riêng tư cho dữ liệu người dùng và lưu trữ Off-chain để tối ưu chi phí gas	Lê Thanh Hòa	2026
150070000892	Phát hiện lỗ hổng bảo mật phần mềm với biểu diễn đồ thị mã nguồn có khả năng diễn giải	Nguyễn Đắc Thiên Ngân	2026
150070000891	Xây dựng đồ thị tri thức không đồng nhất dựa trên kết hợp đặc trưng đa nguồn từ tình báo mối đe dọa không gian mạng để hỗ trợ xác định nguồn gốc tấn công APT	Tô Thị Mỹ Âu	2026
150070000890	Một mô hình học gia tăng lớp và ít mẫu nhằm phát hiện xâm nhập dưới ảnh hưởng của concept drift	Cao Phan Xuân Quí	2026
150070000889	Ứng dụng tính toán tại biên trong xây dựng hệ thống theo dõi nguy cơ xảy ra đột quỵ	Nguyễn Đức Hoan	2026
150070000888	Ứng dụng học sâu trong bài toán phát hiện đa bệnh về phổi	Lê Thành Được	2026
150070000887	Xây dựng hệ thống trí tuệ nhân tạo đa tác tử kiểm thử tự động ứng dụng web dựa trên chuẩn OWASP	Trần Hoàng Nam	2026
150070000886	Xây dựng ứng dụng dự đoán khách hàng rời bỏ trong bảo hiểm nhân thọ bằng mô hình học máy	Nguyễn Thị Huệ	2026
150070000885	Đánh giá các phương pháp tìm kiếm kiến trúc mạng nơ - ron tiến hóa trong việc phát hiện các kiến trúc bền vững với huấn luyện đối kháng	Đỗ Vũ Gia Cần	2026
150070000884	Áp dụng AI tạo sinh trong mô phỏng phỏng vấn và đánh giá ứng viên	Lê Việt Thắng	2026
150070000883	Phân tích và dự báo xu hướng giao dịch bất động sản tại TP.HCM dựa trên dữ liệu thực đa nguồn	Phạm Xuân Vĩnh Hà	2026
150070000882	Thiết kế hệ thống nhận diện phụ nữ mang thai để cải tiến hệ thống an toàn trong xe	Ngô Thanh Nhân	2026
150070000881	Hệ thống theo dõi độ quan tâm của công chúng dành cho người nổi tiếng	Lê Nguyễn Kim Ngọc	2026
150070000880	Dự đoán mức tương tác của bài đăng marketing trên các nền tảng mạng xã hội	Nguyễn Thị Yến	2026
150070000879	Thiết kế hệ thống nhúng định lượng nồng độ BRIX không xâm lấn trên cà chua bi	Trần Hoàng Thiên Phú	2026
150070000878	Phát triển hệ thống phát hiện xâm nhập sử dụng mô hình học liên kết trên nền tảng NVIDIA BLUEFIELD-3	Nguyễn Tấn Kiệt	2026
150070000877	Phát hiện trầm cảm tự động dựa trên phân tích văn bản tiếng Việt	Huỳnh Thanh Tú	2026
150070000876	Phân loại rác thải từ ảnh không màu bằng phương pháp học sâu waste classification from grayscale images using deep learning	Phan Hùng Lực	2026
150070000875	Một cách tiếp cận hợp tác bảo vệ quyền lợi riêng tư cho hệ thống săn lùng mối đe dọa dựa trên đồ thị nguồn gốc	Ngô Đức Hoàng Sơn	2026
150070000874	Tối ưu chất lượng và tính đa dạng trong bài toán phát sinh dữ liệu với các mô hình tạo sinh	Nguyễn Thái Huy	2026
150070000873	ADD-ON tích hợp tạo mô hình từ ảnh cho Blender: Ứng dụng AI tạo sinh trong việc tạo tài sản số 3D	Lê Trường Long Hưng	2026
150070000872	Serverless and reinforcement learning-based resource management for quantum computing	Nguyễn Thanh Hòa	2026
150070000871	Tinh chỉnh các mô hình khuếch tán tiềm ẩn bằng phương pháp học tăng cường sử dụng kết hợp hình ảnh tự tạo và hình ảnh thật	Nguyễn Hoa	2026
150070000870	Ứng dụng học máy dự đoán sớm đái tháo đường thai kỳ từ dữ liệu lâm sàng	Trương Diệp Thanh	2026
150070000869	Phát triển hệ thống nhận diện bệnh lý trên lá sầu riêng sử dụng mô hình học sâu và triển khai trên thiết bị cận biên	Đặng Trần Phương Nam	2026
150070000868	Ứng dụng các mô hình ngôn ngữ lớn trong tạo câu hỏi phỏng vấn	Lê Đoàn Nhật Minh	2026
150070000867	Phân tích cảm xúc đánh giá dịch vụ sân bay	Trần Văn Khánh	2026
150070000866	Phân tích dữ liệu bán hàng và ứng dụng học máy trong dự báo kinh doanh ngành hoa tươi và bánh kem	Phan Ngọc Vũ	2026
150070000865	Nhận diện và phân loại nỗi đau tâm lý trong văn bản tự sự tiếng việt	Trần Trung Thu	2026
150070000864	Xây dựng khung làm việc phân loại khách hàng theo thời gian thực	Nguyễn Thị Mỹ Hải	2026
150070000863	Mô hình ngôn ngữ lớn được làm giàu về ngữ cảnh cho dự báo biến động cổ phiếu dựa trên tâm lý thị trường	Lê Tuấn Anh	2026
150070000862	DA-YOLO ứng dụng giám sát giao thông trong điều kiện thời tiết khác nhau	Nguyễn Quang Huy	2026
150070000861	Nhận diện biển số xe trong hệ thống giám sát giao thông	Nguyễn Thanh Khiêm	2026
150070000860	Xây dựng ứng dụng nhân bản giọng nói tiếng Việt kết hợp cảm xúc	Võ Ngô Văn Tiền	2026
150070000859	Energynet: Một mô hình dự đoán năng lượng hiệu quả cho học sâu trên các thiết bị android	Lê Minh Khánh Ân	2026
150070000857	Mô hình tính toán dựa vào học sâu cho phân loại chất lượng quả cà chua	Đinh Huỳnh Tuệ Tuệ	2026
150070000856	Xây dựng hệ thống nhận diện và theo dõi đa đối tượng trong video bóng đá	Bùi Thanh Ngọc Bách	2026
150070000855	Phân tích định lượng một số cổ phiếu theo tiếp cận chuỗi thời gian	Lê Nguyễn Thanh Thùy	2026
150070000848	Phân đoạn khối u não qua ảnh MRI sử dụng học giám sát yếu	Trương Thanh Luân	2026
150070000847	Xây dựng các cơ chế chú ý kết hợp cho bài toán dự đoán giá cổ phiếu	Võ Châu Nguyệt Dưỡng	2026
150070000846	Mô hình học sâu dựa vào Efficientnet-B4 cho phân loại bệnh trên lá cà chua	Đặng Thị Thạch Thảo	2026
150070000845	Chuẩn đoán bệnh phổi tắc nghẽn mãn tính và các bệnh phổi phổ biến dựa trên ảnh X-Quang sử dụng mạng thần kinh tích chập	Nguyễn Minh Nhật	2026
150070000854	Đánh giá và phát hiện bất thường giao thông từ dữ liệu không ảnh trong điều kiện thời tiết bất lợi	Nguyễn Cường Phát	2025
150070000853	Đề xuất mô hình phát hiện bất thường theo thời gian thực cho lò nướng công nghiệp dựa trên AI và IOT	Nguyễn Xuân Trường	2025
150070000852	Phương pháp lọc nhiễu dựa trên Diffusion trong phòng thủ đối kháng cho phân loại ảnh y khoa	Nguyễn Minh Châu	2025
150070000851	Nghiên cứu thuật toán ẩn tin văn bản trong ảnh kết hợp hai phương pháp spatial domain và transform domain	Trương Văn Tâm	2025
150070000850	Bộ khung tạo mã tự động để triển khai lỗ hổng trên honeypot sử dụng mô hình ngôn ngữ lớn	Lê Tuấn Anh	2025
150070000849	Truy vết đối tượng trên camera giám sát thông qua truy vẫn bằng hình ảnh và ngôn ngữ tự nhiên	Nguyễn Đức Huy	2025
150070000844	Nghiên cứu phát triển công cụ phân tích và dự đoán hiệu suất làm việc của nhân viên	Phan Thị Thanh Mai	2025
150070000843	Giải pháp bảo mật trong mạng khả lập trình dựa trên cơ chế bẫy sử dụng mô hình ngôn ngữ lớn và phòng thủ di chuyển mục tiêu	Phạm Lê Khoa	2025
150070000842	Nghiên cứu và phát triển hệ thống dịch máy Việt - K'Ho ứng dụng trong y tế cộng đồng	Trương Kiếm Ngọc Trâm	2025
150070000839	Phân tích theo khía cạnh đánh giá độ hài lòng của khách hàng thông qua nội dung cuộc gọi outbound chăm sóc khách hàng	Trương Thị Anh Đào	2025
150070000838	Phát hiện vi phạm vượt đèn đỏ của các phương tiện giao thông	Võ Sơn Hiệp	2025
150070000837	Ứng dụng trí tuệ nhân tạo để phân loại cảm xúc sinh viên qua bình luận trên mạng xã hội	Phạm Minh Dzuy	2025
150070000836	Phát hiện và giảm thiểu tấn công đầu độc mô hình trong học liên kết bằng SVM một lớp và lịch sử tin cậy	Cao Thị Yến Khoa	2025
150070000835	Ứng dụng học máy trong việc dự đoán kết quả học tập của học sinh	Nguyễn Thị Kim Oanh	2025
150070000834	Nghiên cứu phát triển hệ thống truy vấn sản phẩm thời trang dựa trên mô hình ngôn ngữ ảnh	Đinh Quang Hoàng	2025
150070000833	Sàng lọc tim thai nhi: phát hiện các mặt cắt ngang bất thường bằng Fuzzy rank-based ensemble dựa trên các mô hình CNN	Lê Phạm Hoài Yên	2025
150070000832	Ứng dụng phát hiện lỗi trên sản phẩm nội thất dựa trên nền tảng Yolo	Vũ Việt Trầm	2025
150070000831	Hỗ trợ lý ảo hỗ trợ tìm kiếm thông tin bảng và truy vấn siêu dữ liệu bảng trong kho dữ liệu	Hứa Văn Sơn	2025
150070000830	Phát hiện bất thường trong máy móc công nghiệp sử dụng các thuật toán máy học	Lê Thanh Dũng	2025
150070000829	Kết hợp mô hình CNN, LSTM và DEEP Q-NETWORK trong cảnh báo bất thường chỉ số chất lượng không khí	Trần Duy Phương	2025
150070000828	Tùy chỉnh hình ảnh có điều kiện dựa trên ngôn ngữ tự nhiên	Trương Quốc Trường	2025
150070000827	Nghiên cứu và đề xuất mô hình phân đoạn ngữ nghĩa chi phí thấp cho bài toán xe tự hành	Chế Quang Huy	2025
150070000826	Một nghiên cứu trong việc phát hiện mã độc PE bằng học máy dựa trên đặc trưng dạng âm thanh	Đinh Phương Nam	2025
150070000825	Nghiên cứu và ứng dụng conversational AL hỗ trợ tư vấn chuyển đổi số cho doanh nghiệp nhỏ và vừa	Ngô Trần Phương Linh	2025
150070000824	Phân tích dữ liệu điểm thi tốt nghiệp của học sinh tỉnh An Giang và xây dựng mô hình dự báo điểm số	Trần Thị Hà	2025
150070000823	Nghiên cứu hệ thống phát triển xâm nhập dựa trên dữ liệu nguồn gốc sử dụng phương pháp học biểu diễn đồ thị với ít mẫu dữ liệu	Phạm Trần Tiến Đạt	2025
150070000822	Nghiên cứu và phát triển nền tảng quyên góp từ thiện đáng tin cậy bằng công nghệ blockchain	Lê Trọng Tín	2025
150070000821	Thiết kế hệ thống nhúng định lượng nồng độ glucose không xâm lấn	Nguyễn Thành Nhân	2025
150070000820	Xây dựng dữ liệu và mô hình học sâu đánh giá tổn thương phổi do covid-19 trên hệ thống nhúng	Ngô Huy Tài	2025
150070000819	Thiết kế khung mô hình CNN kết hợp mờ trong phân loại ung thư buồng trứng sử dụng ảnh mô học tissue microarray	Vũ Xuân Tuấn Anh	2025
150070000818	Phát hiện sự kiện bất thường trong video	Trần Minh Tùng.	2025
150070000816	Một nghiên cứu so sánh về các phương pháp lựa chọn đặc trưng và học máy để phát hiện xâm nhập trong mạng IOT	Võ Hồng Như Ý	2025
150070000815	Mô hình biểu diễn kiến thức đa văn bản pháp luật và ứng dụng truy vấn luật lao động	Nguyễn Công Thành	2025
150070000814	Phương pháp kết hợp legalbert và generative AI cho hệ thống tra cứu kiến thức văn bản luật và ứng dụng	Nguyễn Hữu Thọ	2025
150070000813	Ứng dụng các mô hình học sâu trong phát hiện lúa cỏ bẳng ảnh từ UAV	Lê Trương Hồng Danh	2025
150070000812	Ước lượng mật độ phương tiện giao thông dựa trên camera giám sát giao thông	Trần Việt Nhân	2025
150070000811	Ứng dụng học sâu trên thiết bị mạng biên để phát hiện cháy	Nguyễn Thị Phượng	2025
150070000810	Nhận diện biển số phương tiện giao thông sử dụng công cụ xử lý dữ liệu lớn và học sâu	Ngô Quang Bảo	2025
150070000809	Áp dụng các mô hình học sâu trong nhận dạng, đo kích thước và phân loại hạt lúa, gạo	Nguyễn Bùi Hữu Hiệp	2025
150070000808	Ứng dụng phát hiện người xâm nhập bằng sóng vô tuyến trên thiết bị ESP32	Nguyễn Thanh Tịnh	2025
150070000807	Một nghiên cứu trong việc đánh giá hiệu năng các mô hình phát hiện mã độc trên điện thoại android	Võ Minh Quân	2025
150070000806	Nghiên cứu và phân tích xu hướng cổ phiếu ngành ngân hàng Việt Nam dựa trên dữ liệu thực	Trần Phương Duy	2025
150070000805	Phát hiện tấn công thay đổi giao diện website bằng học máy	Cao Xuân Đức	2025
150070000804	Thiết kế robot di động hỗ trợ theo dõi và phát hiện té ngã cho người cao tuổi	Trần Thế Tùng	2025
150070000803	Phân tích các yếu tố có thể tác động đến sản lượng thủy sản tỉnh Tiền Giang	Lê Thị Cẩm Tú	2025
150070000802	Xây dựng mô hình hợp tác để tăng tốc độ suy luận của mô hình DNN trong ngữ cảnh IOT	Trần Văn Như Ý	2025
150070000801	Ứng dụng thị giác máy tính trong phân tích thời gian kiểm soát bóng của một video trận đấu bóng đá	Trần Lâm Khánh Tường	2025
150070000800	Nghiên cứu và phát triển thuật toán học đa lớp cho phát hiện các cuộc tấn công mới trong các hệ thống phát hiện xâm nhập	Nguyễn Xuân Hà	2025
150070000799	Đánh giá tính bền vững của các ứng dụng tường lửa web dựa trên học sâu	Nguyễn Ngọc Thanh	2025
150070000798	Giải pháp đối chiếu và phát hiện thay đổi giữa các phiên bản luật dựa trên mô hình Legal - Onto và ứng dụng	Đỗ Đặng Thanh Huy	2025
150070000797	Nghiên cứu ảnh hưởng của các hàm mục tiêu huấn luyện đối với học tăng cường đa tác tử cho bài toán tối ưu năng lượng tiêu thụ trong các tòa nhà dân sự	Trần Văn Quang	2025
150070000796	Nghiên cứu ứng dụng một số phương pháp mô tả đặc trưng khuôn mặt cho bài toán truy vấn nhân vật trong phim	Hồ Diên Tuấn Anh	2025
150070000795	Tăng cường khả năng phòng chống tấn công trong mạng SDN	Phan Thế Duy.	2025
150070000794	Nghiên cứu, phát triển và tích hợp hệ thống nhận dạng tiếng nói tiếng Việt trong soạn thảo văn bản	Nguyễn Thành An	2025
150070000793	Nghiên cứu phương pháp đánh giá và tăng cường tính bền vững của trình phát hiện mã độc đối kháng android dựa trên học sâu đa phương thức	Đoàn Minh Trung	2025
150070000792	Phát hiện CHEAPFAKES dựa trên sự kết hợp của diễn giải ngữ nghĩa hình ảnh, mô hình tri thức và ngữ nghĩa văn bản	Lã Tuấn Vinh	2025
150070000791	Phát hiện hành vi bạo hành trong chuyện kể tiếng Việt theo cách tiếp cận mô hình ngôn ngữ lớn	Mai Phương Nga	2025
150070000790	Hệ thống đếm lưu lượng xe giao thông trên đường	Dương Quốc Khang	2025
150070000789	Tự động dự đoán viêm xương khớp đầu gối từ hình ảnh X-Quang bằng mô hình học sâu	Nguyễn Dương Trúc Phương	2025
150070000788	Phân tích chất lượng và dự báo độ mặn nước sông dựa trên các kỹ thuật máy học	Nguyễn Hữu Vinh	2025
150070000787	Xây dựng trợ lý ảo trên di động với mô hình ngôn ngữ lớn cho tự động hóa tác vụ	Phan Đình Minh Hiếu	2025
150070000786	Ứng dụng trí tuệ nhân tạo vào dự đoán tính đắng của phân tử hoá học	Nguyễn Thị Ngọc Hương	2025
150070000785	Sử dụng OPENAI API để đề xuất mẫu giáo án cho môn tin học 10 tại trường THPT phú nhuận	Cao Nguyễn Nam Hiền	2025
150070000784	Một nghiên cứu về việc phân loại mã độc PE bằng học liên kết	Nguyễn Vương Thịnh	2025
150070000783	Phát hiện tập tin pdf độc hại sử dụng mô hình học máy và trí tuệ nhân tạo khả diễn giải	Nguyễn Cẩm Hồng Phước	2025
150070000782	Phát hiện cuộc gọi lừa đảo sử dụng phương pháp học lớp không cân bằng trên đồ thị	Đinh Hoài Hiệp	2025
150070000781	Triển khai nền tảng dữ liệu khai thác bay theo kiến trúc Lakehouse	Trần Phước Duy	2025
150070000780	Phát triển mô hình dữ liệu tri thức cho bài toán phân tích đánh giá một số chỉ số kinh tế xã hội	Lê Quang Kỳ	2025
150070000779	Nhận diện người dùng rời bỏ dịch vụ sớm trong trò chơi di động miễn phí sử dụng hệ thống mô hình hai giai đoạn	Hà Đăng Hoàng	2025
150070000778	Triển khai ứng dụng nhận dạng hành vi té ngã của con người bằng sóng vô tuyến trên thiết bị ESP32	Đặng Hữu Ích	2025
150070000777	Thiết kế và thi công hệ thống giám sát thời tiết trong nông nghiệp ứng dụng công nghệ Lorawan	Nguyễn Văn Tam	2025
150070000776	Nhật ký canh tác thông minh và ứng dụng iot trong trồng trọt	Ninh Nguyễn Phúc Kha	2025
150070000775	Nhận dạng cấu trúc đoạn văn bản viết tay dựa trên mô hình nhận dạng ký tự quang học	Đỗ Chí Bảo	2025
150070000774	Xây dựng Hệ thống hỗ trợ tư vấn tuyển sinh tại Trường Cao đẳng Kinh tế - Công nghệ TP. Hồ Chí Minh tích hợp công nghệ chatbot	Vũ Linh	2025
150070000773	Giám sát và dự đoán tiêu thụ điện năng sử dụng thiết bị iot	Lê Thiện Tâm	2025
150070000772	Hệ thống phân tích và đánh giá chất lượng trong môi trường giáo dục sử dụng thị giác máy tính	Phạm Hữu Hiếu	2025
150070000771	Phân tích một số đặc trưng trong phản hồi của học sinh: định hướng cải thiện chất lượng giảng dạy	Đỗ Thị Thùy Linh	2025
150070000770	Xây dựng hệ thống nhận dạng côn trùng từ xa	Phan Thiện Huệ	2025
150070000769	Tối ưu hiệu quả phát hiện gian lận trong thương mại điện tử bằng mô hình máy học và lý thuyết mờ	Trần Thùy Dương	2025
150070000768	Tăng cường bảo mật cho cơ sở dữ liệu quan hệ điện toán đám mây bằng công nghệ Blockchain	Từ Quốc Huy	2025
150070000754	Phát triển nền tảng dựa trên tính toán cận biên cho ứng dụng camera thông minh	Nguyễn Văn Bảo	2025
150070000579	Hệ thống phát hiện xâm nhập phi tập trung khả diễn giải hỗ trợ học tiệm tiến	Nguyễn Hữu Quyền	2025
150070000767	Hệ thống hỗ trợ định tội danh và tư vấn một số điều của Bộ luật hình sự 2015	NguyễnTrần Lê	2024
150070000766	Phương pháp suy luận ngôn ngữ tự nhiên để xác thực tin tức ẩm thực vùng miền Việt Nam	Phan Ngô Hoàng Long	2024
150070000765	Phân tích dự báo dữ liệu chất lượng nước trong nuôi trồng thủy sản	Trương Quốc Tuấn	2024
150070000764	Nghiên cứu hệ nén lượng tử trong mã hóa ảnh hậu lượng tử	Trần Khánh Nguyên	2024
150070000763	Ứng dụng trí tuệ nhân tạo phân tích ảnh vệ tinh phục vụ đánh giá phân bổ xây dựng đô thị	Nguyễn Bá Lộc	2024
150070000762	Phân giải đồng tham chiếu trong văn bản tự sự tiếng Việt	Trần Hiếu Đại	2024
150070000761	Suy luận trực quan cho hỏi đáp trực quan trên tiếng việt	Trần Vĩnh Khiêm	2024
150070000760	Phân loại văn bản hành chính và tìm kiếm văn bản sử dụng học sâu	Trần An Khang	2024
150070000759	Ứng dụng các phương pháp trí tuệ nhân tạo trong bài toán xác định mẫu hình chứng khoán	Nguyễn Minh Dương	2024
150070000758	Hệ thống xác định tốc độ phương tiện giao thông dựa vào dữ liệu video giao thông	Nguyễn Văn Tài	2024
150070000757	Bài toán tìm mộ Liệt sĩ bằng công nghệ GIS	Nguyễn Hoàng Ân	2024
150070000756	Truy vấn video với ảnh khuôn mặt dựa trên phương pháp rút trích đặc trưng từ video	Trần Công Minh	2024
150070000755	Phát sinh quy trình vẽ tranh với tính toán tiến hóa và học sâu	Nguyễn Quan Duy Tùng	2024
150070000753	Kỹ thuật phân bổ tác vụ dựa trên học tăng cường sâu để tối ưu hóa hiệu suất trong môi trường tính toán cận biên IOT	Phan Trung Phát	2024
150070000752	Nghiên cứu thiết kế và chế tạo trạm mặt đất tiết kiệm năng lượng có khả năng giao tiếp vệ tinh LEO hỗ trợ công nghệ giao tiếp LORA và đề xuất cấu trúc S-I-P cho module	Nguyễn Bình Phương	2024
150070000751	Nghiên cứu và phát triển giải pháp thông minh tự bảo vệ ứng dụng web theo thời gian thực	Lê Thành Phúc	2024
150070000750	Phát hiện gian lận thẻ tín dụng sử dụng công nghệ dữ liệu lớn	Nguyễn Vũ Thái	2024
150070000748	Tìm kiếm thông tin trong kho bằng sáng chế theo giải pháp xử lý dữ liệu lớn	Trần Thanh Phong	2024
150070000747	Phương pháp thích ứng của huấn luyện không giám sát dựa trên phân cụm cho bài toán tái định danh người	Võ Duy Anh Vũ	2024
150070000746	Ứng dụng học bầy đàn vào hệ thống phát hiện xâm nhập để phát hiện lưu lượng mạng bất thường trong hệ thống IOT	Văn Thiên Luân	2024
150070000745	Dự báo luồng giao thông sử dụng chuỗi thời gian dựa trên các mô hình transformer	Trần Văn San	2024
150070000744	Phân loại mã độc android dựa trên hướng tiếp cận đa lớp đặc trưng	Phạm Nhật Duy	2024
150070000743	Phát hiện các gian lận kế toán bằng phương pháp máy học tổng hợp	Huỳnh Thị Tố Ngọc	2024
150070000742	Phát hiện thư rác tiếng việt sử dụng các mô hình học sâu	Ngô Thanh Bình	2024
150070000741	Nghiên cứu phương pháp xây dựng hệ thống quản lý tài liệu văn bản dựa trên ngữ nghĩa	Huỳnh Thị Thanh Thương.	2024
150070000740	Nhận diện bạo hành trong văn bản tự sự tiếng Việt	Nguyễn Như Thanh	2024
150070000739	Dự đoán lượng tiêu thụ nước trong hộ gia đình theo tháng bằng phương pháp học sâu	Lâm Vũ Dương	2024
150070000738	Hệ thống tự động tạo bản tóm tắt video dựa trên phân tích sự kiện quan trọng	Nguyễn Hữu Thái	2024
150070000737	Nghiên cứu và triển khai ứng dụng trích xuất thông tin từ hóa đơn thanh toán	Pốc Sồi Chanh	2024
150070000736	Nghiên cứu khả năng diễn giải của trình phát hiện mã độc dựa trên học tổng hợp đối với các mẫu đối kháng	Tô Trọng Nghĩa	2024
150070000735	Nhận dạng hành vi mất tập trung của tài xế trong video theo hướng tiếp cận đa góc nhìn	Đào Đức Quang	2024
150070000734	Phục hồi hình ảnh cũ sử dụng mô hình GANs	Võ Đình Nhã	2024
150070000733	Nghiên cứu và ứng dụng AI vào xây dựng module dự báo doanh thu cho hệ thống ERP Microsoft Dynamics AX	Nguyễn Đình Huy	2024
150070000732	Hệ thống chuyển đổi số lưu trữ dữ liệu trên website văn phòng điện tử đoàn phường Đa Kao	NguyễnLê Minh Dương	2024
150070000731	Phân tích phản hồi bình luận sinh viên sử dụng học sâu	Trần Ngọc Khánh Vinh	2024
150070000730	Ứng dụng AI dự đoán thuê bao rời mạng dịch vụ internet VNPT	Hoàng Hải Nam	2024
150070000729	Xây dựng mô hình mạng học sâu để tự động tạo chú thích hình ảnh	Dương Quang Sinh	2024
150070000728	Đánh giá sự tương quan giữa các nhóm thuốc và bệnh suy tim dựa vào phương pháp phân tích dữ liệu	Nguyễn Cao Thắng	2024
150070000727	Nghiên cứu về nhận diện biển báo giao thông sử dụng mô hình YOLOV7	Trần Thịnh Mạnh Đức	2024
150070000724	Hệ thống đọc truyện cổ tích cho trẻ em bằng giọng của cha mẹ	Đặng Hoài Thương	2024
150070000723	Nghiên cứu thiết kế và tích hợp công cụ giảng dạy trực tuyến cho lớp học LAI sử dụng công nghệ nhúng	Châu Minh Hòa	2024
150070000722	Một nghiên cứu trong việc xử lý vi phạm giao thông từ video	Mai Thị Hoàng Hạnh	2024
150070000721	Xây dựng hệ thống sắp thời khóa biểu cho khoa Thư viện - Thông tin học trường Đại học Khoa học xã hội và nhân văn dựa trên thuật giải di truyền	Đặng Hoàng Duyên	2024
150070000720	Ứng dụng Openai API và Elasticsearch để xây dựng chatbot về lĩnh vực sở hữu trí tuệ trên địa bàn tỉnh Bình Phước	Bùi Thanh Liêm	2024
150070000719	Phát hiện xâm nhập sử dụng XGBOOST để lựa chọn tính năng với logarithmic autoencoder và bidirectional LSTM	Nguyễn Trọng Minh Hồng Phước	2024
150070000718	Nhận dạng vân lòng bàn tay dựa vào việc học bộ mô tả đặc trưng hướng đường phân biệt	Phan Đình Duy Thông	2024
150070000717	BÁO CÁO ĐÁNH GIÁ SỰ BẢO VỆ CỦA CÁC TRÌNH DUYỆT WEB TRƯỚC COOKIES CỦA BÊN THỨ BA	LÂM NGỌC CHÂU	2023
150070000716	MÔ HÌNH KẾT HỢP CHO BÀI TOÁN RÚT TRÍCH THÔNG TIN TỪ ẢNH	Nguyễn Ngọc Thừa	2023
150070000715	XÂY DỰNG CHATBOT TIẾNG VIỆT VỚI MÔ HÌNH NGÔN NGỮ LỚN	Đoàn Vũ Thuận	2023
150070000714	NGHIÊN CỨU BÀI TOÁN CHUYỂN ĐỔI NGÔN NGỮ TỰ NHIÊN SANG CÂU TRUY VẤN SQL CHO TIẾNG VIỆT	Huỳnh Thiện Ý	2023
150070000713	PHÂN LOẠI BÌNH LUẬN THỜI GIAN THỰC SỬ DỤNG PHÂN TÍCH DỮ LIỆU LỚN TRONG THƯƠNG MẠI ĐIỆN TỬ	TRẦN BÌNH HẬU	2023
150070000712	DỰ BÁO TIN TỨC GIẢ BẰNG CÁCH TIẾP CẬN ĐỒ THỊ TRI THỨC	Nguyễn Dương Kim Vỹ	2023
150070000711	PHÁT HIỆN GIAN LẬN TRONG THẺ TÍN DỤNG BẰNG CÁCH SỬ DỤNG HỌC MÁY VÀ LOGIC MỜ	TRẦN ĐỨC THUẬN	2023
150070000710	TRÍCH XUẤT VÀ PHÂN TÍCH THÔNG TIN TRÊN GOOGLE VỀ XU HƯỚNG PHỤC VỤ TRONG LĨNH VỰC CHĂM SÓC SẮC ĐẸP	Võ Huỳnh Quang Hiếu	2023
150070000709	THIẾT KẾ VÀ ỨNG DỤNG CÁC KỸ THUẬT METAHEURISTICS CHUYÊN DỤNG CHO BÀI TOÁN TÌM KIẾM KIẾN TRÚC MẠNG NEURAL	Phan Minh Quân	2023
150070000708	XÂY DỰNG IDS DỰA TRÊN HỌC SÂU CHO BẢO MẬT MẠNG IOT	ĐỖ THỊ PHƯƠNG UYÊN	2023
150070000707	Cải tiến mô hình đa ngôn ngữ cho các tác vụ hiểu ngôn ngữ tự nhiên tiếng Việt	Nguyễn Xuân Vĩnh Phú	2023
150070000706	XÂY DỰNG FRAMEWORK SSOLOGIN ĐĂNG NHẬP WEBSITE TỰ ĐỘNG BẰNG XÁC THỰC MỘT LẦN ĐỂ ĐO LƯỜNG TÍNH RIÊNG TƯ TRÊN WEB	Phạm Tiến Huy	2023
150070000705	PHÁT HIỆN GÓI TIN BẤT THƯỜNG TRONG HỆ THỐNG NHÀ THÔNG MINH BẰNG MÔ HÌNH HỌC MÁY	Nguyễn Thanh Bình	2023
150070000704	XÂY DỰNG VÀ PHÂN TÍCH HỆ THỐNG KHẢO SÁT HOẠT ĐỘNG GIẢNG DẠY CỦA GIẢNG VIÊN TRÊN MONGODB	Vũ Văn Việt	2023
150070000703	GOM NHÓM KHUÔN MẶT DÙNG MẠNG TÍCH CHẬP ĐỒ THỊ	NGUYỄN THANH TÚ	2023
150070000702	HỆ THỐNG ĐIỂM DANH BẰNG NHẬN DIỆN KHUÔN MẶT SỬ DỤNG MÁY TÍNH NHÚNG NVIDIA JETSON NANO	BÙI MINH QUỐC	2023
150070000701	ỨNG DỤNG DỰ ĐOÁN MỨC ĐỘ TỔN THƯƠNG CỦA PHỔI DO COVID-19 TỪ HÌNH ẢNH X-QUANG SỬ DỤNG MÔ HÌNH MẠNG NƠ-RON PHỨC HỢP (CNN)	Trần Thị Việt Trinh	2023
150070000700	PHÂN LOẠI MÃ ĐỘC ANDROID DỰA TRÊN QUYỀN HẠN, LỜI GỌI HÀM HỆ THỐNG VÀ DANH SÁCH THƯ VIỆN	Ngô Hữu Phúc	2023
150070000699	PHÂN TÍCH DỰ BÁO ĐỘ MẶN NƯỚC THÔ TRƯỚC XỬ LÝ BẰNG MÔ HÌNH DỰ BÁO THEO CHUỖI THỜI GIAN	Huỳnh Đức Tâm	2023
150070000698	XÂY DỰNG ỨNG DỤNG DỰ BÁO NHIỆT ĐỘ KHÔNG KHÍ DỰA THEO MÔ HÌNH BAYES VÀ CÔNG NGHỆ MÁY HỌC	NGUYỄN VĂN TÂM	2023
150070000697	XÂY DỰNG HỆ THỐNG Y BẠ ĐIỆN TỬ THEO CHUẨN HL7	TẠ NGUYỄN THANH NHÂN	2023
150070000696	MỘT NGHIÊN CỨU TRONG VIỆC PHÁT HIỆN VÀ GIẢM THIỂU TẤN CÔNG TỪ CHỐI DỊCH VỤ TRONG MẠNG KHẢ LẬP TRÌNH	Trần Đức Việt	2023
150070000695	PHÂN TÍCH DỮ LIỆU BÁN HÀNG CỦA CÔNG TY CỔ PHẦN BỘT GIẶT LIX VÀ XÂY DỰNG MÔ HÌNH DỰ BÁO DOANH SỐ	NGUYỄN HỒ KHÁNH	2023
150070000694	PHÂN ĐOẠN THỰC THỂ NGỤY TRANG DỰA TRÊN ĐẶC TRƯNG CÓ TÍNH PHÂN BIỆT CAO	NGUYỄN THÀNH DANH	2023
150070000693	ỨNG DỤNG BIẾN ĐỔI PHONG CÁCH GƯƠNG MẶT BẰNG NGÔN NGỮ TỰ NHIÊN	Trần Cao Khánh Ngọc	2023
150070000692	Mô hình và phương pháp lập luận để trả lời các câu hỏi "tại sao" dựa trên cách tiếp cận phân tích diễn ngôn tiếng Việt	Nguyễn Trọng Chỉnh.	2023
150070000691	Phát triển mô hình tích chập lượng tử động cho bài toán phân lớp ảnh	Vũ Tuấn Hải	2023
150070000690	Xây dựng hệ hỗ trợ tổ chức cơ sở tri thức trong văn bản luật và truy vấn kiên thức trên văn bản luật	Đặng Việt Dũng	2023
150070000689	Nghiên cứu và phát triển tầm nhìn sâu rộng về tập đa dữ liệu nhật ký cuộc sống thông qua mô hình học tập thích ứng	Nguyễn Phúc Thịnh	2023
150070000688	Ứng dụng big data quản lý và mô phỏng sự thay đổi nhiệt độ đô thị	Châu Ngọc Long Giang	2023
150070000687	Phân tích các yếu tố ảnh hưởng đến tiến độ và tỉ lệ nộp chứng chỉ tiếng anh của sinh viên trường Đại học Công nghệ Thông tin	Nguyễn Thị Hoài	2023
150070000686	Kết hợp kiến trúc self-attention và bert cho bài toán sửa lỗi chính tả tiếng Việt	Trần Hàm Dương	2023
150070000685	Một hàm mất mát mới cho bài toán phát hiện đối tượng trên tài liệu dạng ảnh tiếng Việt	Trương Quốc Dũng	2023
150070000684	Phương pháp tiếp cận bằng mô hình máy học để phát hiện lỗ hổng trong hợp đồng thông minh của Blockchain	Bùi Tống Nha	2023
150070000683	Tạo sinh tự động câu hỏi từ văn bản tiếng anh và ứng dụng	Trần Anh Tuấn	2023
150070000682	Nghiên cứu ảnh hưởng sự đa dạng về biến thể trong phát hiện đối tượng ít mẫu	Nguyễn Vũ Anh Khoa	2023
150070000681	Xây dựng hệ thống quản lý và hỗ trợ phát triển du lịch thành phố Cần Thơ trên nền tảng công nghệ GIS	Trần Lê Duy Anh	2023
150070000680	Xây dựng ứng dụng dự báo chất lượng nước dưới đất dựa vào công nghệ trí tuệ nhân tạo	Phan Thanh Tuấn	2023
150070000679	Phân loại hình ảnh mối hàn thép dựa trên công nghệ xử lý dữ liệu lớn	Nguyễn Xuân Huy	2023
150070000678	Xây dựng hệ thống nhận diện biển số xe ô tô theo thời gian thực sử dụng công nghệ dữ liệu lớn	Bùi Thanh Phương	2023
150070000677	Số hóa các chức năng an sinh xã hội tại một Phường ở Thành phố Hồ Chí Minh	Nguyễn Thị Thu Vân	2023
150070000676	Phát triển ứng dụng phân tích chất lượng và ước tính giá cà phê nhân sử dụng trí tuệ nhân tạo	Phạm Minh Khan	2023
150070000675	Nâng cao hiệu quả hoạt động của bộ mã hóa tự động kết hợp điều chế OFDM trong mạng di động 5G	Nguyễn Tiến Thành	2023
150070000674	Cải tiến mô hình phân cụm dựa trên vị trí thông qua mạng nơ ron đồ thị (GNN)	Tạ Vũ Hoài Thương	2023
150070000673	Một nghiên cứu trong việc phân loại mã độc android bằng học cộng tác	Võ Quốc Vương	2023
150070000672	Rút trích quan hệ giữa các thực thể trong văn bản tiếng việt	Phạm Minh Mẫn	2023
150070000671	Phát hiện lỗ hổng trên ứng dụng web sử dụng kỹ thuật phân tích động và thuật giải di truyền	Ngô Khánh Khoa	2023
150070000670	Nghiên cứu cải thiện hiệu năng phát hiện tấn công từ chối dịch vụ bằng máy học trong IoT	Nguyễn Gia Trung	2023
150070000666	Một phương pháp khai thác tiện ích với lợi nhuận âm bảo toàn tính riêng tư trong dữ liệu phân tán dọc	Lê Thị Quỳnh Chi	2023
150070000653	Xây dựng ứng dụng trong việc phân loại hạch ung thư phổi	Trần Lê Trọng Nhân	2023
150070000638	Xây dựng ứng dụng hỗ trợ tra cứu kiến thức môn thiết kế website cho sinh viên tại trường CĐ Bến Tre:	Đặng Phú Vinh	2023
150070000637	Dự báo giá đồng tiền mã hóa bitconin bằng cách kết hợp phương pháp tìm kiếm lưới, mô hình chuỗi thời gian, LSTM:	Bùi Dương Thủy Tiên	2023
150070000636	Hệ thống livestream P2P dựa trên webrtc có độ trễ thấp hiệu quả cao với chi phí thấp :	Phan Đại Thắng	2023
150070000635	Nghiên cứu phương pháp chống lại kỹ thuật né tránh máy ảo của mã độc trong phân tích động:	Phạm Ri Nép	2023
150070000634	Phát hiện học sinh thiếu tập trung trong lúc học bài trên bàn học thông minh :	Lê Mạnh Hùng	2023
150070000633	Nghiên cứu và hiện thực hệ thống điểm danh tự động trên bàn học thông minh :	Nguyễn Duy Diệu	2023
150070000632	Phát hiện đối tượng trên ấn phẩm tiếng việt sử dụng mạng học sâu	Lê Thanh Lực	2023
150070000631	Tiếp cận phương pháp khai thác mẫu tuần tự vào việc dự đoán xu hướng cổ phiếu	Nguyễn Tuấn Dũng	2023
150070000630	Mô hình xác định tác giả dựa trên văn phong của các văn bản Tiếng Việt	Đồng Đăng Khoa	2023
150070000629	Nghiên cứu hệ thống quản lý, tư vấn và chăm sóc sức khỏe tích hợp công nghệ blockchan	Lê Ngọc Hiển	2023
150070000628	Phân loại mã độc android bằng mạng sinh đối kháng và học máy	Nguyễn Công Danh	2023
150070000627	Ứng dụng mạng Nơ-ron hồi quy vào phát hiện hành động con người bằng tín hiệu WiFi	Đỗ Minh Tiến	2023
150070000626	Đếm phương tiện giao thông sử dụng phân tích dữ liệu lớn thời gian thực học và học sâu	Nguyễn Văn Viết	2023
150070000625	Xây dựng công cụ tóm tắt tin tức tiếng anh dựa trên transfer learning: ứng dụng cho lĩnh vực tài chính	Nguyễn Trần Duy	2023
150070000669	Dự đoán cung đường tránh tác động kẹt xe do mưa lớn	Trần Minh Đang	2022
150070000665	Kết hợp kỹ thuật khai phá dữ liệu và mô hình chuỗi thời gian có chu kỳ dự báo giá bitcoin	Ngô Hiển Đạt	2022
150070000664	Thiết kế hệ thống chẩn đoán bệnh và tư vấn chăm sóc cây cà chua thông minh trong nông nghiệp chính xác	Tạ Xuân Trường	2022
150070000663	Xây dựng ứng dụng hỗ trợ học lập trình CC++ cho học sinh trung học phổ thông	Phạm Trọng Huynh	2022
150070000662	Xây dựng ứng dụng dự báo chất lượng không khí đô thị	Nguyễn Thành Phong	2022
150070000661	Tìm hiểu kiến trúc mô hình transformer và ứng dụng mô hình vào phát hiện đối tượng trong bộ dữ liệu Visdrone	Nguyễn Hoàn Mỹ	2022
150070000660	Phát triển giải pháp nhà thông minh ứng dụng trí tuệ nhân tạo	Phan Bá Tùng	2022
150070000659	Nghiên cứu và phát triển hệ thống cận biên thông minh vào ứng dụng nhận diện mặt người không đeo khẩu trang	Lê Anh Tuấn	2022
150070000658	Nhận diện khuôn mặt sử dụng vision transformer và baby learning	Trần Chí Phúc	2022
150070000657	Phương pháp xác định đại từ nhân xưng theo giới tính ứng dụng trong voicebot tiếng Việt	Lưu Toàn Định	2022
150070000656	Phân vùng khối u gan trên ảnh CT ổ bụng sử dụng chuyển đổi hounsfield đa kênh	Lê Nhật Huy	2022
150070000655	Ảnh hưởng của hàm loss additive angular margin đối với vấn đề mất cân bằng dữ liệu trong phân loại ảnh bệnh nhân ung thư da	Phùng Đào Vĩnh Chung	2022
150070000654	Phương pháp triển khai hệ thống phát hiện xâm nhập từ xa hoạt động như dịch vụ trên các thiết bị mạng biên	Đỗ Xuân Thành	2022
150070000652	Nghiên cứu áp dụng mô hình máy học vào hệ thống truyền thông không dây mimo-ofdm (Research on applying deep learning on the MIMO-OFDM wireless communication system)	Nguyễn Lê Toàn Yến Linh	2022
150070000651	Phân tích cảm xúc cho tiếng Việt sử dụng mô hình kiến trúc transformer	Huỳnh Thanh Tú	2022
150070000650	Phân loại ảnh chụp đáy mắt hỗ trợ chẩn đoán bệnh võng mạc tiểu đường	Đặng Quốc Bảo	2022
150070000649	Tự động chọn camera quan sát trong hệ thống giám sát có nhiều camera	Tất Khải Vinh	2022
150070000648	Xây dựng ứng dụng dự đoán biển số xe bằng thuật toán nhận dạng đối tượng	Nguyễn Tường Duy	2022
150070000647	Ước lượng dung tích sống gắng sức bệnh xơ phổi dựa trên hình ảnh và dữ liệu lâm sàng	Bùi Thị Ánh Hoa	2022
150070000646	Phát triển ứng dụng chăm sóc sức khỏe thông minh dựa trên công nghệ tính toán cận biên	Nguyễn Châu Long	2022
150070000645	Ứng dụng phân tích dữ liệu lâm sàng để phân tầng nguy cơ tim mạch trên bệnh nhân đái tháo đường típ 2	Nguyễn Phúc Hoàng	2022
150070000644	Tóm tắt tự động đa văn bản tiếng Việt theo cách tiếp cận dựa trên mô hình BERT:	Tô Quốc Huy	2022
150070000643	Nhận diện quan hệ suy luận ngôn ngữ tự nhiên trên cấp độ câu cho tiếng Việt:	Huỳnh Văn Tín	2022
150070000642	Đề xuất một số kỹ thuật cải tiến về khai thác quy trình trong việc hoàn ứng và tạm ứng chi phí di chuyển:	Trần Lương Phán	2022
150070000641	Phân tích phản hồi của khách hàng trong lĩnh vực du lịch tiếp cận theo mô hình chủ đề kết hợp chỉ số đo lường sự hài lòng	Lê Bá Thiền	2022
150070000640	Nghiên cứu một giải pháp biểu diễn tri thức về luật đất đai và ứng dụng xây dựng hệ thống tra cứu kiến thức dựa trên cơ sở tri thức:	Nguyễn Hoàng Thịnh	2022
150070000639	Dự đoán hoàn trả khoản vay bằng cách sử dụng thuật toán học máy:	PhạmThanh Bình	2022
150070000624	Phát triển các thuật toán khai thác mẫu và mẫu đóng trên cơ sở dữ liệu định lượng	Bùi Danh Hường.	2022
150070000623	Nghiên cứu mô hình khai thác mạng thông tin không đồng nhất và ứng dụng =	Phạm Thế Anh Phú.	2022
150070000622	Phân loại ảnh X-quang tự động nhằm phát hiện bệnh lao phổi sử dụng các phương pháp học sâu	Lê Trường Minh	2022
150070000621	Ứng dụng mạng Nơ-ron tích chập để phân loại vận động thông qua điện não đồ	Trịnh Hoài Nhân	2022
150070000620	Ứng dụng nhận dạng khuôn mặt có khẩu trang cho nhân viên kho hàng	Phạm Đức Duy	2022
150070000619	Nghiên cứu kỹ thuật tấn công Bypass các phần mềm bảo mật thông qua việc khai thác các driver lỗi trên hệ điều hành windows	Phạm Hữu Danh	2022
150070000618	Ứng dụng deep neural network (DNN) nhận dạng người trong nhà thông qua sinh trắc học bằng giọng nói	Hồ Thị Minh Trâm	2022
150070000617	Hệ thống thu thập thông tin sử dụng giao tiếp Camera-led phục vụ an toàn giao thông	Sử Đăng Hoài	2022
150070000616	Hệ hỗ trợ chẩn đoán rối loạn suy giảm thần kinh vận động	Trần Thái Bình	2022
150070000615	Nhận dạng vân lòng bàn tay dựa vào mẫu hướng phân biệt và nổi bật cục bộ	Nguyễn Minh Thắng	2022
150070000614	Một hướng ứng dụng IOT cho máy lạnh nhằm tiết kiệm năng lượng tiêu thụ điện trong tòa nhà văn phòng thông minh	Nguyễn Quang Đạt	2022
150070000613	Phân tích và dự báo hiện tượng xâm nhập mặn tại Bến Tre	Huỳnh Thanh Tân	2022
150070000612	Xây dựng ứng dụng hỗ trợ khảo sát sản phẩm có tích hợp kỹ thuật phân tích cảm xúc theo khía cạnh	Phạm Tri Thức	2022
150070000611	Hệ tri thức hỗ trợ học tập về toán rời rạc và lý thuyết đồ thị cho sinh viên ngành công nghệ thông tin	Dương Ngọc Thạch Thảo	2022
150070000610	Xây dựng hệ thống cảm biến quan trắc và bộ cơ sở dữ liệu ô nhiễm môi trường (AQI)	Nguyễn Tài Tấn Lộc	2022
150070000609	Đề xuất xây dựng mô hình ứng dụng nền tảng điện toán đám mây riêng cho hệ thống y tế	Lê Gia Tự	2022
150070000608	Nghiên cứu hệ thống điều tra ứng dụng android	Đặng Trường Giang	2022
150070000607	Phân loại android malwware dựa vào giá trị thanh ghi	Nguyễn Vĩnh Tân	2022
150070000606	Phân tích các yếu tố ảnh hưởng đến kết quả học tập của học sinh	Nguyễn Hiếu Lễ	2022
150070000605	Nghiên cứu đề xuất mô hình lớp học thông minh trên nền tảng IoT	Hà Sơn Nhật	2022
150070000668	Phương pháp phát hiện đối tượng khó trong ảnh	Nguyễn Duy Khánh.	2021
150070000667	Khai thác mẫu tuần tự phổ biến dựa trên ràng buộc	Văn Thị Thiên Trang	2021
150070000604	Khai thác tập mục hữu ích cao trên cơ sở dữ liệu phân cấp	Nguyễn Thanh Tùng	2021
150070000603	Khai thác tập hữu ích cao với nhiều độ đo thú vị	Nguyễn Mạnh Hùng	2021
150070000602	Nghiên cứu và xây dựng giải pháp phân loại bệnh lý Glaucoma trên ảnh chụp đáy mắt sử dụng máy học	Hồ Phương Thanh Tài	2021
150070000601	Quản lý các tòa nhà trong thành phố thông minh	Đinh Việt Hùng	2021
150070000600	Hệ hỗ trợ quản lý thông tin nguồn nhân lực dựa trên công nghệ Blockchain	Lê Minh Trí	2021
150070000599	Ứng dụng hỗ trợ rèn chính tả Tiếng Việt cho học sinh tiểu học	Nguyễn Thị Thu Thủy	2021
150070000598	Phát hiện người dựa vào khuôn mặt trên nguồn video trực tiếp từ máy bay không người lái	Lương Văn Song	2021
150070000597	Nghiên cứu một số phương pháp nội suy và tiên đoán trên dữ liệu cảm biến di động nhằm tạo ra bản đồ ô nhiễm môi trường trong thời gian thực	Nguyễn Minh Tâm	2021
150070000596	Chìa khóa xe thông minh ứng dụng công nghệ RFID chủ động	Nguyễn Văn Xuân	2021
150070000595	Tìm kiếm thông minh trên cơ sở tri thức về kỹ thuật lập trình máy tính cho ngành công nghệ thông tin	Võ Hoàng Thái	2021
150070000594	Nghiên cứu và hiện thực hệ thống nhận diện chữ số đồng hồ nước sử dụng công nghệ điện toán biên trên thiết bị nhúng	Nguyễn Mạnh Thảo	2021
150070000593	Phân loại ảnh mô bệnh học của mô vú nhằm hỗ trợ chẩn đoán ung thư vú	Nguyễn Văn Phong	2021
150070000592	Xây dựng hệ thống quản lý thông tin công dân dựa trên công nghệ Blockchain	Nguyễn Thị Thanh Quyên	2021
150070000591	Dự đoán tuyến đường giảm thiểu tác động của ô nhiễm không khí dựa trên cơ sở dữ liệu quan trắc di động	Nguyễn Đặng Hiếu	2021
150070000590	Phát hiện các cuộc tấn công lừa đảo dựa trên URL và dựa trên sự tương đồng trực quan bằng cách sử dụng mạng đối kháng tạo sinh	Trịnh Nguyên Bác	2021
150070000589	Nghiên cứu và phát triển Lora Relay	Nguyễn Trần Tiến Đạt	2021
150070000588	Xây dựng cơ sở tri thức dựa vào thông tin trên Internet phục vụ người học hỏi đáp bằng ngôn ngữ tự nhiên	Hoàng Văn Hiếu	2021
150070000587	Nghiên cứu và ứng dụng kỹ thuật học sâu trong việc xây dựng hệ máy tính hỗ trợ chẩn đoán mức độ loãng xương trên ảnh X-quang cổ xương đùi	Trần Văn Long	2021
150070000586	Quản lý cấp nước sinh hoạt bằng bluetooth và webgis tại Tiền Giang	Nguyễn Hoài Linh	2021
150070000585	Hệ dự đoán chỉ số VN-Index dựa trên mô hình học sâu	Nguyễn Việt Phương	2021
150070000584	Hệ thống phân tích quy trình nghiệp vụ điều hành sản xuất kinh doanh	Lê Thị Mộng Linh	2021
150070000583	Phát hiện hành vi vượt đèn đỏ dựa trên phương pháp deep learning ở Việt Nam	Nguyễn Mạnh Phúc	2021
150070000582	Phát hiện mã độc android bằng học sâu và mạng sinh đối kháng	Nghi Hoàng Khoa	2021
150070000581	Phát hiện tự động câu bình luận có xúc phạm cho dữ liệu mạng xã hội Tiếng Việt	Lưu Thanh Sơn	2021
150070000580	Phát hiện đối tượng nhỏ trong ảnh sử dụng các phương pháp học sâu	Nguyễn Nhật Duy	2021
150070000438	Nhận dạng vân lòng bàn tay dựa vào đặc trưng mã hướng cục bộ	Đặng Hùng Kiệt	2021
150070000437	Phương pháp xác định ảnh khiêu dâm bằng phát hiện đối tượng	Trần Hoàng Lộc	2021
150070000435	Nghiên cứu tích hợp mạng chập sâu ứng dụng nhận dạng khuôn mặt người trong nhà thông minh	Nguyễn Trọng Trí	2021
150070000425	Mô hình học đồng thời cho tách từ và phân tích cú pháp thành tố tiếng việt	Nguyễn Đức Vũ	2021
150070000424	Áp dụng kỹ thuật học sâu vào bài toán an toàn thương hiệu dựa trên hình ảnh	Võ Minh Quân	2021
150070000422	Phát hiện nguy cơ thất thoát thông tin trên điện thoại di động Android	Nguyễn Tấn Cầm.	2021
150070000421	Mô hình biểu diễn trực quan dữ liệu không gian - thời gian đa biến	Nguyễn Thị Hồng.	2021
150070000405	Nghiên cứu thiết kế hệ thống điều khiển nhiệt độ tự động theo ngữ cảnh thời tiết ứng dụng trong nhà thông minh	Phạm Ngọc Vinh	2021
150070000404	Giải pháp nhận diện hành động con người thông qua CSI wifi và máy học	Vũ Ngọc Khoa	2021
150070000403	Thuật toán hiệu quả cho việc khai thác mẫu phổ biến trên cở sở dữ liệu định lượng tăng trưởng	Vương Đình Bắc	2021
150070000401	Nhận dạng vân mạch máu lòng bàn tay dựa vào đặc trưng hướng đường vân cục bộ	Dương Minh Chiến	2021
150070000400	Ứng dụng thuật giải tối ưu bầy đàn đa mục tiêu trong rút trích đề thi trắc nghiệm khách quan	Bùi Mạnh Toàn	2021
150070000399	Phát hiện đối tượng bảng trong tài liệu dạng ảnh sử dụng phương pháp học sâu	Dương Phi Long	2021
150070000529	Phân tích ý kiến theo khía cạnh cho bình luận về nhà hàng	Nguyễn Minh Hảo	2020
150070000526	Nhận diện cảm xúc mặt người dựa trên đa đặc trưng của mô hình học sâu cho SVM	Trần Ngọc Đông	2020
150070000519	Nghiên cứu ứng dụng tự điển vào bài toán phân tích ý kiến đánh giá môn học của sinh viên	Đỗ Thị Thanh Tâm	2020
150070000518	Phân loại tự động tên hồ sơ theo thời hạn bảo quản	Tôn Nữ Thị Sáu	2020
150070000513	Xây dựng ứng dụng dự báo nhiệt độ đô thị	Trần Nguyên Phúc	2020
150070000452	So sánh giữa Newsql với Nosql: lý thuyết và thực nghiệm	Lê Nguyễn Sơn Nguyên	2020
150070000447	Tóm tắt đoạn văn bản tiếng Việt dựa trên cách tiếp cận tạo sinh	Trần Trung.	2020
150070000440	Phát triển một số phương pháp nhận diện và phân tích rủi ro theo hướng tiếp cận gom cụm mờ	Đoàn Huấn.	2020
150070000439	Phương pháp biểu diễn tri thức theo cách tiếp cận đại số	Nguyễn Đình Hiển.	2020
150070000436	Hệ thống dự báo tình hình ùn tắc giao thông và khai phá điểm nóng giao thông tương lai theo thời gian sử dụng nhiều nguồn dữ liệu quan trắc đô thị	Nguyễn Ngọc Thanh	2020
150070000434	Một hướng tiếp cận tính riêng tư trong nhà thông minh sử dụng công nghệ Blockchain công suất lớn	Nguyễn Thanh Nhật An	2020
150070000433	Interactive Video Retrieval	Nguyễn Phương Anh	2020
150070000432	Ứng dụng hỗ trợ chẩn đoán ung thư tuyến tiền liệt trên ảnh đa thông số MP-MRI	Trần Trung Đức	2020
150070000431	Tái nhận dạng nhân vật sử dụng phương pháp học sâu Mask R-CNN	Nguyễn Thành Hiệp	2020
150070000430	Phát triển ứng dụng đo độ ô nhiễm không khí thông minh sử dụng giải pháp tái cấu hình	Lê Thanh Phương	2020
150070000429	Phương pháp triển khai các mô hình học sâu hoạt động như dịch vụ trên các nút mạng biên trong tính toán cạnh	Lê Minh Khánh Hội	2020
150070000428	Thương mại điện tử qua tư vấn trực tuyến	Hồ Diệu Khuôn	2020
150070000427	Ứng dụng Web hỗ trợ học lý thuyết đồ thị	Lê Hồng Thái	2020
150070000426	Xây dựng hệ thống suy luận mờ trong dự đoán thời tiết	Mai Ngọc Hiền	2020
150070000423	Mô hình tìm kiếm văn bản tiếng Việt dựa trên ngữ nghĩa	Đỗ Thị Thanh Tuyền.	2020
150070000420	Phương pháp đa tác vụ cho bài toán xác định cảm xúc theo khía cạnh	Đặng Văn Thìn	2020
150070000419	Xây dựng, phát triển mô hình phân lớp tổ hợp đa đặc trưng trong nhận dạng ảnh	Trần Sơn Hải.	2020
150070000402	Xây dựng hệ thống phát hiện tấn công mạng dựa trên máy học và tự động hóa xử lý	Nguyễn Ngọc Sáng	2020
150070000396	Xây dựng hệ thống nhà thông minh tích hợp trợ lý ảo để điều khiển bằng giọng nói tiếng Việt	Tống Duy Tân	2020
150070000395	Nghiên cứu kết hợp mô hình Samira với khai thác dữ liệu giải quyết bài toán dự báo chuỗi thời gian và cài đặt ứng dụng	Lê Thị Xuyến	2020
150070000392	Khai thác luật phân lớp kết hợp theo tập dự đoán	Nguyễn Anh Tú	2020
150070000391	Hệ thống xác thực, phân quyền và kiểm soát dựa trên blockchain cho kênh giao tiếp Northbound trong SDN	Đỗ Hoàng Hiển	2020
150070000389	Rút trích thông tin thẻ tín dụng	Phạm Văn Tuấn	2020
150070000374	Xây dựng ứng dụng hiển thị thông tin khí tượng, thủy văn tại đồng bằng sông Cửu Long trên thiết bị di động	Phạm Trường Giang	2020
150070000373	Xây dựng công cụ hỗ trợ dự báo phụ tải điện	Ca Chí Thuần	2020
150070000372	Hệ thống quản lý, phân tích và dự báo số liệu cây trồng tại tỉnh Long An	Trịnh Trường Hải	2020
150070000371	Nghiên cứu phương pháp giảm thiểu tấn công tràn bảng luồng trong mạng SDN	Lê Duy An	2020
150070000370	Hệ máy tính hỗ trợ chuẩn đoán ung thư vú trên nhũ ảnh	Phạm Thị Thùy	2020
150070000345	Tìm kiếm tương đồng trên mạng thông tin không đồng nhất	Nguyễn Văn Gia	2020
150070000344	Ứng dụng GIS trong việc tuần tra, kiểm soát của lực lượng cảnh sát tại thành phố Hồ Chí Minh	Hồ Nguyễn Xuân Thanh	2020
150070000571	Phát triển hệ thống thử nghiệm Iots với số lượng nốt lớn	Lý Trọng Nhân	2019
150070000551	Phương pháp xây dựng các câu trả lời phức hợp trong truy xuất thông tin	Hà Lam	2019
150070000550	Tìm tập key player tối thiểu cho một chiến dịch quảng cáo trên mạng xã hội	Lê Nhựt Trường	2019
150070000533	Một hướng tiếp cận bằng trình giả lập cho đánh giá hiệu suất và khai thác bảo mật trong mạng không dây	Đỗ Thị Thu Hiền	2019
150070000532	Khai phá luật kết hợp thời gian trên chuỗi thời gian đa biên	Khuất Bá Duy Lâm	2019
150070000530	Nhận diện tự động từ Hán - Việt trong văn bản	Đoàn Trí Dũng	2019
150070000528	Kiến trúc IoT có thể lập trình dựa trên công nghệ mạng định nghĩa bằng phần mềm và tái lập trình qua mạng	Huỳnh Văn Đặng	2019
150070000520	Phát hiện đạo văn tự động hướng đến ứng dụng trong trường đại học	Võ Ngọc Minh	2019
150070000502	Quản lý ngữ cảnh thông minh cho tái cấu hình trong internet of things	Nguyễn Khánh Thuật	2019
150070000495	Nghiên cứu thực nghiệm về phát hiện và giảm ảnh hưởng của tấn công DDOS trong mạng SDN	Nguyễn Thanh Hòa	2019
150070000494	Xác định đối tượng trong video clip giao thông đô thị	Trần Văn Định	2019
150070000470	Truy vấn sản phẩm đồ nội thất bằng ảnh vẽ tay	Đào Thị Ngọc Lan	2019
150070000469	Khai thác tập hữu ích tối đại dựa trên cấu trúc P-SET	Vũ Đình Bảo	2019
150070000468	Nghiên cứu và hiện thực hệ thống định vị trong tòa nhà cao tầng sử dụng công nghệ Lora	Huỳnh Hồ Thị Mộng Trinh	2019
150070000453	Nghiên cứu kĩ thuật theo vết và phân loại phương tiện giao thông, ứng dụng cho bãi giữ xe thông minh	Dương Thái Bảo	2019
150070000446	Truy vấn hiệu quả thông tin thị giác từ dữ liệu lớn để phát triển môi trường thông minh	Nguyễn Vinh Tiệp.	2019
150070000414	Định danh đối tượng theo thời gian thực sử dụng đặc trưng khuôn mặt	Phạm Quang Anh Kha	2019
150070000413	Xây dựng Website hỗ trợ học toán rời rạc	Phan Quốc Quang	2019
150070000412	Nghiên cứu hệ miễn dịch nhân tạo để ứng dụng vào phát hiện virus máy tính	Nguyễn Tấn Toàn	2019
150070000397	Áp dụng deep learning cho bài toán dự báo chuỗi thời gian	Lê Hữu Vinh	2019
150070000394	Dự đoán sự tồn tại và trọng số của liên kết trong đồ thị mạng dựa trên khả năng định hướng của các nút kết hợp với hướng tiếp cận máy học	Hồ Thị Minh Phượng	2019
150070000393	Hệ hỗ trợ và thi trắc nghiệm Toán trung học phổ thông	Nguyễn Thị Thu Hồng	2019
150070000390	Phát hiện, phân tích đặc trưng và đánh giá các biện pháp đối phó với các tài nguyên Web bị lạm dụng	Đào Thị Thu Hà	2019
150070000364	Phát hiện thảo luận mỉa mai tiếng anh trên mạng xã hội Twitter	Hoàng Anh Hùng	2019
150070000357	Xây dựng hệ thống phát hiện virus dựa trên phương pháp deep learning kết hợp với hệ miễn dịch nhân tạo	Lê Hoàng Dũng	2019
150070000340	Phát hiện sự hiện diện của xe ưu tiên trong một đoạn Video clip giao thông đô thị	Nguyễn Dung Hạnh	2019
150070000339	Xây dựng ứng dụng phân tán xác thực Universal second factor (U2F) dựa trên nền tảng Blockchain	Dương Phương Vũ	2019
150070000338	Thuật toán xử lý truy vấn trên cơ sở dữ liệu đồ thị NEO4J phân tán có chứa bản sao các quan hệ	Phạm Hữu Mão	2019
150070000337	Đánh giá các phương pháp rút ngắn tham số trong mô hình ước lượng phần mềm	Trần Thị Mỹ Thú	2019
150070000335	Khai thác dữ liệu mạng xã hội để tăng cường hiệu quả truy vấn thông tin theo hướng người dùng	Võ Hoàng Phúc	2019
150070000334	Khai thác tập phổ biến đóng trên cơ sở dữ liệu giao dịch có hạng mục được đánh trọng số	Phan Tấn Tài	2019
150070000332	Hệ hỗ trợ tư vấn luật đầu tư công trong lập dự toán cho dự án công nghệ thông tin	Phạm Đỗ Huân	2019
150070000331	Tái nhận diện người với Convolutional Neural Network	Trần Quang Khải	2019
150070000330	Xây dựng hệ thống dự đoán kết quả học tập của sinh viên nhằm hỗ trợ công tác cố vấn học tập	Lê Hoàng Yến	2019
150070000328	Nhận dạng và xác định vị trí cỏ dại trên luống hoa màu	Nguyễn Thị Cẩm Tú	2019
150070000327	Nghiên cứu thiết kế Smart camera ứng dụng trong nhà thông minh	Huỳnh Ngô Văn	2019
150070000316	Tra cứu vật phẩm game bằng hình ảnh dùng Convolutional neural	Huỳnh Phúc Trường Sơn	2019
150070000575	Phân tích mạng xã hội dựa theo mô hình chủ đề và ứng dụng	Hồ Trung Thành	2018
150070000573	Nâng cao hiệu quả tính toán tìm tập phổ biến theo hướng tiếp cận tập đóng	Nguyễn Thành Trung	2018
150070000552	Ứng dụng điều khiển khu vườn thông minh qua giao thức Zigbee	Phan Anh Thắng	2018
150070000527	Tìm kiếm ảnh dựa trên hình phát họa	Đặng Bảo Ân	2018
150070000524	Phát triển hệ thống hỗ trợ nhận biết tình trạng tươi sống của động vật	Nguyễn Mai Huy	2018
150070000516	Nghiên cứu sự hữu dụng của smartphone và werable sensor đối với việc tăng hiệu suất giảng dạy - học tập	Lê Quang Bảo Lân	2018
150070000514	Nghiên cứu xây dựng bản đồ không gian - thời gian mạng lưới xe Bus trực quan hóa các tuyến của mạng và các chuyến của tuyến	Huỳnh Thị Ngọc Cầm	2018
150070000489	Một hướng tiếp cận tính riêng tư trong nhà thông minh sử dụng công nghệ Blockchain	Đặng Thành Long Nhật	2018
150070000481	Nghiên cứu thiết kế mô hình nhận dạng hoạt động trong nhà thông minh nhiều người ở	Nguyễn Đức Lương	2018
150070000476	Ứng dụng N-List trong khai thác mẫu tuần tự phổ biến	Bùi Văn Bằng	2018
150070000475	Giải pháp xây dựng và tái cấu hình IoT Gateway với Rasprerry PI	Hồ Văn Phúng	2018
150070000471	Xử lý và nhận dạng thông tin trên hình ảnh hóa đơn	Đặng Minh Đức	2018
150070000467	Hệ thống hỗ trợ người dùng tìm kiếm và tương tác cơ sở y tế	Nguyễn Tấn Bảo Nam	2018
150070000465	Bảo toàn tính riêng tư khai thác luật kết hợp trên cơ sở dữ liệu được phân hoạch dọc	Nguyễn Hữu Lộc	2018
150070000464	Phân tích quan điểm người dùng về sản phẩm công nghệ qua các bài Review trên Facebook	Lê Duy Đắc Ngân	2018
150070000463	Nghiên cứu phân tích thuộc tính đám đông trong Video giám sát	Võ Tấn Khoa	2018
150070000459	Áp dụng phương pháp lai giữa thuật toán tối ưu bầy đàn và hồi qui véctơ hỗ trợ trong dự đoán giá chứng khoán	Lê Đỗ Minh Nga	2018
150070000454	Tìm lộ trình xe buýt bằng kỹ thuật trực quan hóa áp dụng ở Thành phố Hồ Chí Minh	Nguyễn Ngọc Tấn Phát	2018
150070000407	Hệ thống quản lý tải trọng phương tiện ra vào cảng biển dựa trên kỹ thuật nhận dạng biển số xe động	Lê Hữu Tài	2018
150070000406	Sử dụng công nghệ truyền thông Lora thiết kế hệ thống cảm biến cảnh báo khẩn cấp	Trần Văn Quang	2018
150070000388	Gom cụm văn bản tương đồng theo chủ đề trong kho văn bản lớn trên nền tính toán phân tán	Nguyễn Hồ Duy Trí	2018
150070000386	Phát hiện tập phổ biến gây nhầm lẫn	Huỳnh Thanh Lộc	2018
150070000385	Nghiên cứu ứng dụng kỹ thuật blockchain cho việc xác thực văn bằng chứng chỉ tự động và phân tán	Đặng Lê Bảo Chương	2018
150070000381	Khai phá chủ đề của kho văn bản lớn theo tiếp cận đồ thị trên nền tính toán phân tán	Nguyễn Hồ Duy Tri	2018
150070000361	Nghiên cứu và thực nghiệm giữa cơ sở dữ liệu SQL và NOSQL	Bùi Tá Hậu	2018
150070000343	Phát hiện câu tương đồng trong tiếng Việt	Nguyễn Xuân Toàn	2018
150070000318	Ứng dụng GIS hỗ trợ chiến thuật bắt người phạm tội trên địa bàn Thành phố Hồ Chí Minh	Phạm Thế Hiển	2018
150070000314	Nghiên cứu thuật toán nhận biết hoạt động của người đeo đồng hồ thông minh	Nguyễn Hữu Tâm	2018
150070000313	Xây dựng hệ thống nhận dạng thuộc tính mặt người dựa vào mạng học sâu tích chập	Dương Hữu Phước	2018
150070000307	Phân loại và đánh giá các bài viết trên báo điện tử về tỉnh Long An	Vũ Quang Huy	2018
150070000578	Xây dựng từ điển cộng tác thuật ngữ Anh - Việt lĩnh vực công nghệ thông tin và truyền thông	Huỳnh Sơn Lâm	2017
150070000577	Xây dựng hệ thống camera nhận dạng và bám theo mặt người	Nguyễn Ngọc Hoàng	2017
150070000572	Phân cụm dữ liệu và luật kết hợp ứng dụng trong phân tích dữ liệu công thức dược phẩm	Hà Siu	2017
150070000569	Gom nhóm văn bản dựa trên mẫu hữu ích được đánh trọng phổ biến	Trần Thanh Trâm	2017
150070000564	Mô hình đa kỹ thuật cho bài toán theo vết đối tượng	Lê Quang Thái	2017
150070000563	Trực quan hóa thông tin huỳnh quang của chất lỏng	Nguyễn Hoàng Ngân	2017
150070000562	Ước lượng mật độ đám đông trong video giám sát	Trịnh Nam Việt	2017
150070000561	Nghiên cứu xây dựng mô hình wireless sensor network sử dụng công nghệ Blutooth 4.1	Phạm Quốc Cường	2017
150070000560	Tìm hiểu, nghiên cứu và xây dựng gateway cho mạng cảm biến không dây sử dụng công nghệ Bluetooth low engergy technology 4.1	Lư Văn Thành	2017
150070000559	Chuyển đổi mô hình dữ liệu quan hệ và đối tượng sang NOSQL	Văn Thị Phương Lâm	2017
150070000558	Phân tán cơ sở dữ liệu đồ thị trên NEO4J	Nguyễn Duy Tân	2017
150070000557	Phát triển hệ thống phát hiện chủ đề đang được quan tâm trên mạng xã hội	Hứa Phước Trường	2017
150070000555	Xây dựng hệ hỗ trợ chẩn đoán bệnh đau lưng	Võ Lê Hoàng Khải	2017
150070000554	Phát hiện thuật toán xác định số cụm trong thuật toán gom cụm mờ và cài đặt ứng dụng	Trần Thị Thanh Trúc	2017
150070000553	Phát hiện ảnh quảng cáo trên Website dùng mô hình CNN	Võ Tiến An	2017
150070000549	Xây dựng hệ thống quản lý và truy vấn quy trình nghiệp vụ	Dương Tố Hương	2017
150070000548	Phương pháp phân lớp dựa trên kết hợp trọng yếu	Lê Hoàng Vân	2017
150070000546	Nghiên cứu nhận dạng tiếng nói tiếng việt và ứng dụng trong mobile game	Nguyễn Minh Phát	2017
150070000544	Khai thác dữ liệu mạng xã hội để nâng cao hiệu quả tìm kiếm Web theo hướng người dùng	Nguyễn Thành Luân	2017
150070000543	Dự báo xu hướng chứng khoán dựa vào tin tức tài chính tại sàn giao dịch Tp. Hồ Chí Minh	Huỳnh Đức Huy	2017
150070000542	Khai thác luật kết hợp từ các mẫu hữu ích cao	Mai Hoàng Thắng	2017
150070000541	Hiện thực nút camera không dây thông minh công suất thấp, hiệu năng cao	Nguyễn Ngọc Hoàng	2017
150070000539	Nghiên cứu đánh giá quản trị công nghệ thông tin trong trường đại học	Trần Đức Hy	2017
150070000538	Nghiên cứu bài toán nhận dạng quan hệ diễn ngôn và xây dựng dữ liệu chuẩn cho tiếng Việt	Tạ Thu Thủy	2017
150070000537	Phương pháp suy luận giải quyết vấn đề trên mô hình COKB	Mai Trung Thành	2017
150070000515	Nghiên cứu xây dựng công cụ đo lường và phân tích tương tác người dùng trên Website	Đỗ Thị Hương Lan	2017
150070000501	Gom cụm và tìm kiếm phát hiện thông tin việc làm trên mạng xã hội Facebook	Phan Quang Huy	2017
150070000500	Xây dựng ứng dụng thu thập các bài viết từ các trang báo điện tử chính thống	Lê Phước Vinh	2017
150070000496	Nghiên cứu thuật toán nhận dạng mặt người tích hợp vào giải pháp Smart-dogs	Trần Thị Thanh Hương	2017
150070000491	Hệ hỗ trợ việc tư vấn tuyển sinh tại trường cao đẳng nghề tỉnh Bà Rịa - Vũng Tàu	Trần Lệ Thủy	2017
150070000490	Nghiên cứu và xây dựng phương pháp phát hiện các bài viết có nội dụng phản động	Hoàng Tuấn Long	2017
150070000482	Ứng dụng GIS quản lý hiện trạng các tuyến đường bộ tại tỉnh Long An	Nguyễn Thị Thu Sương	2017
150070000479	Phương pháp tính toán và suy luận ngữ nghĩa để trả lời các câu hỏi về chuỗi sự kiện trong hệ thống hỏi đáp tiếng Việt	Phạm Thế Sơn	2017
150070000477	Phát hiện các nhóm đối tượng trong cơ sở dữ liệu ảnh	Nguyễn Thị Bảo Ngọc	2017
150070000472	Vấn đề cold-start trong hệ thống gợi ý và ứng dụng	Phạm Thị Bích Hạnh	2017
150070000458	Nghiên cứu về chuyển đổi lược đồ cơ sở dữ liệu quan hệ sang cơ sở dữ liệu NOSQL	Phạm Xuân Bình	2017
150070000457	Nghiên cứu và phát triển công cụ phát hiện tấn công thay đổi giao diện Website từ xa	Võ Quang Thiều	2017
150070000456	Nghiên cứu, đề xuất phương pháp đánh giá tính bảo mật của kernel android dựa trên phương pháp phân tích tĩnh	Tô Ứng Vũ	2017
150070000449	Xây dựng Website ứng dụng chương trình tư vấn du lịch	Trần Xuân Thanh Phúc	2017
150070000443	Phát triển một số phương pháp phân loại ảnh với số lượng lớp lớn	Mai Tiến Dũng	2017
150070000418	A Two-level clustering for point of interest mining with proper semantic annotation	Bùi Thanh Hiếu	2017
150070000417	Xây dựng hệ thống hỗ trợ tổ chức thi trắc nghiệm	Ngô Văn Linh	2017
150070000387	Xây dựng hệ hỗ trợ giải toán di truyền lớp 12	Võ Trúc Ly	2017
150070000383	Nghiên cứu giải pháp sinh mã giao diện người dùng từ sơ đồ lớp cho các ứng dụng quản lý	Trần Thị Anh Thi	2017
150070000382	Xây dựng hệ thống phân tích log trên nền tảng elasticsearch	Trần Cảnh Khánh	2017
150070000380	Ứng dụng SVM và chuỗi thời gian dự đoán thời điểm mua bán cổ phiếu cho thị trường chứng khoán Việt Nam	Trần Quốc Bảo	2017
150070000379	Xây dựng hệ khuyến nghị cho các sản phẩm mỹ phẩm dựa trên thông tin mạng xã hội	Trần Ngô Hoàng Thành	2017
150070000377	Tối ưu truy vấn trong cơ sở dữ liệu phân tán	Hồ Phú Cường	2017
150070000376	Nghiên cứu, đánh giá an toàn thông tin mã nguồn hệ điều hành Android tùy biến	Lê Đức Thịnh	2017
150070000375	Xây dựng ứng dụng hiệu chỉnh dữ liệu và dự báo các yếu tố khí tượng	Võ Đoàn Như Khánh	2017
150070000363	Nghiên cứu các trang nhạc trực tuyến, xây dựng giải pháp hỗ trợ tìm kiếm và dự báo số lượng thính giả của bài hát	Nguyễn Thành Quân	2017
150070000362	Định vị phổ mạng vô tuyến nhận thức bằng thuật toán xã hội nhện (social spider algorithm)	Võ Công Minh	2017
150070000360	Giấu tin thuận nghịch trong ảnh stereo với khả năng nhúng cao	Huỳnh Văn Thanh	2017
150070000356	Liên kết từ tự động cho mục đích hỗ trợ học tiếng anh	Dương Thị Phương Mai	2017
150070000351	Kiến trúc mở cho thiết bị định tuyến không dây AD - HOC dựa trên bộ phần mềm định tuyến QUAGGAZEBRA	Trương Văn Phúc	2017
150070000350	Nghiên cứu thực tại tăng cường phục vụ trong giáo dục	Lý Tuấn Anh	2017
150070000349	Xây dựng mô hình lớp học ảo cho phòng học trực tuyến	Huỳnh Phan Diệu Hiền	2017
150070000348	Dự báo mưa trong tương lai gần tại khu vực ruộng muối Ninh Diêm sử dụng mạng cảm biến môi trường	Ngô Huỳnh Ngọc Phú	2017
150070000323	Nghiên cứu đề xuất thuật toán nhận diện đối tượng trong ứng dụng E-Dogs	Nguyễn Thị Mỹ Hạnh	2017
150070000321	Quản lý tài nguyên cho phòng họp trên ứng dụng Mobile	Nguyễn Khánh Hoài Nam	2017
150070000319	Nghiên cứu và xây dựng hệ thống hỗ trợ quản lý dịch vụ du lịch sử dụng công nghệ VPS	Đặng Lê Hoài	2017
150070000317	Kết hợp mô hình Arima và support vector machine (SVM) để dự báo tại công ty dịch vụ trực tuyến cộng đồng Việt	Hồ Công Hoài	2017
150070000315	Nghiên cứu phân tích cú pháp phụ thuộc cho tiếng Việt	Nguyễn Văn Kiệt	2017
150070000312	Mô hình công cụ phân tích ngữ nghĩa theo Abstract meaning representation (AMR)	Nguyễn Đăng Khoa	2017
150070000309	Phát hiện bằng chứng trên thiết bị Android sử dụng cơ sở dữ liệu đồ thị	Đặng Minh Tuấn	2017
150070000574	Khai thác tập mục hữu ích cao trên cơ sở dữ liệu động	Bùi Văn Hùng	2016
150070000570	Xây dựng mô hình phát hiện các xu hướng thông tin nổi lên trên mạng	Trần Ngọc Trí	2016
150070000568	Kỹ thuật mã hóa paillier trong lĩnh vực bỏ phiếu điện tử = paillier cryptosystem in electronic voting	Phù Khắc Anh	2016
150070000565	Xây dựng phương pháp giải quyết vấn đề trên cơ sở tri thức đa dạng COKB	Võ Thành Nhân	2016
150070000556	Phân tích dữ liệu và hỗ trợ ra quyết định trên big data	Đặng Thị Thanh Châu	2016
150070000547	Nghiên cứu máy học và hệ miễn dịch nhân tạo trong phát hiện virus máy tính	Mai Trọng Khang	2016
150070000545	Song song hóa thuật toán tìm đường đi ngắn nhất Floyd với Cuda	Bùi Thị Thu Hiền	2016
150070000540	Áp dụng logic mờ vào việc định hướng nghề nghiệp theo lĩnh vực khoa học tự nhiên cho học sinh THPT	Nguyễn Ngọc Vọng	2016
150070000536	Nghiên cứu cơ chế phát hiện rò rỉ thông tin bằng phương pháp phân tích tĩnh trên ứng dụng Android	Phan Thế Duy	2016
150070000535	Lọc tin theo một chủ đề và truy nguồn trên mạng xã hội	Nguyễn Chí Toàn	2016
150070000534	Khảo sát hiệu suất Grid computing trên nền tảng .Net	Phan Ngọc Minh Quân	2016
150070000531	Nghiên cứu các phương pháp bảo vệ tính riêng tư của người dùng trên mobible	Nguyễn Trường Phúc	2016
150070000522	Towards Energy Efficient Data Dissemination for the Internet of Things	Le Duc Thang	2016
150070000509	Nghiên cứu biểu diễn trực quan dữ liệu hoạt động kinh doanh của doanh nghiệp theo tính chất tuyến tính và tuần hoàn của thời gian	Đoàn Thanh Việt	2016
150070000506	Ứng dụng deep learning cho bài toán phát hiện sự kiện trong dữ liệu video	Đỗ Văn Tiến	2016
150070000504	Hệ thống tìm kiếm thông tin qua mạng	Trần Quốc Cường	2016
150070000503	Xây dựng hệ thống hỗ trợ tìm kiếm tài liệu theo ngữ nghĩa cho thư viện trường CĐ KT KT TP.HCM	Lê Thị Thu Thảo	2016
150070000499	Phương pháp biểu diễn tri thức và vẽ hình tự động cho các bài toán hình học phẳng	Nguyễn Thị Huyền Trang	2016
150070000498	Nghiên cứu giải pháp nhận dạng hoạt động và điều khiển thiết bị trong nhà thông minh	Nguyễn Kim Duy	2016
150070000497	Ứng dụng điện toán đám mây để tìm mẫu phổ biến trong mạng tương tác Protein ung thư	Trương Đăng Thanh	2016
150070000493	Phân tích cảm xúc trong giáo dục đại học qua các thông tin tiếng việt trên Web	Nguyễn Đăng Thành	2016
150070000483	Nghiên cứu cơ chế phát hiện rò rỉ thông tin bằng cách kết hợp phương pháp phân tích tĩnh và động trên Android	Lý Hoàng Tuấn	2016
150070000478	Nghiên cứu và xây dựng phương pháp phát hiện gian lận thẻ sử dụng các kỹ thuật khai phá dữ liệu	Đặng Thị Mỹ Hạnh	2016
150070000473	Xác định tập dữ liệu huấn luyện phù hợp nhằm hiệu chỉnh mô hình Cocomo	Huỳnh Thị Phương Thủy	2016
150070000466	Xây dựng hệ thống bán hàng bằng mô hình cơ sở dữ liệu phân tán	Huỳnh Quốc Tuấn	2016
150070000460	Xây dựng hệ giải một số bài tập điện học trong chương trình Vật lý lớp 9	Phan Trọng Nghĩa	2016
150070000451	Khảo sát xu thế thay đổi chủ đề quan tâm của một cộng đồng trong mạng xã hội theo thời gian	Đỗ Thiện Vũ	2016
150070000450	Xây dựng bản đồ quản lý dịch bệnh gia súc gia cầm trên địa bàn tỉnh Long An	Hồ Nhật Vinh	2016
150070000448	Phát triển một số phương pháp khuyến nghị hỗ trợ tìm kiếm thông tin học thuật dựa trên tiếp cận phân tích mạng xã hội	Huỳnh Ngọc Tín.	2016
150070000416	Lọc nhận xét rác sản phẩm công nghệ bằng tiếng Anh trong thương mại điện tử	Trần Ngọc Huy	2016
150070000411	Nghiên cứu phương pháp tự động xử lý ảnh viễn thám và xây dựng cơ sở dữ liệu, phân tích dữ liệu không gian về hiện tượng đảo nhiệt tại thành phố Hồ Chí Minh	Đặng Nguyễn Thiện Kha	2016
150070000409	Hệ giải các bài toán trên mô hình COKB	Phạm Sử Tiến Trình	2016
150070000408	Xây dựng hệ thống quản lý thiết bị di động nhằm tăng cường bảo mật dữ liệu của doanh nghiệp	Nguyễn Thường Kiệt	2016
150070000398	Xây dựng hệ hỗ trợ chuẩn đoán sớm bệnh viêm tủy răng	Nguyễn Thu Thủy	2016
150070000384	Đề xuất mô hình và thuật toán xác định những người hướng dẫn dư luận trong các cộng đồng ảo chuyên biệt như Facebook groups	Huỳnh Thanh Việt	2016
150070000369	Xây dựng hệ hỗ trợ chẩn đoán và tư vấn chăm sóc sức khỏe bằng phương pháp y học cổ truyền	Lê Kim Nga	2016
150070000367	Lõi IP chỉnh âm tự động theo thể loại âm nhạc trên FPGA	Lê Trường Sa	2016
150070000366	Xây dựng hệ tư vấn cho khách hàng hòa mạng di động và hòa mạng Internet	Nguyễn Huỳnh Thúy Nga	2016
150070000365	Tái nhận dạng nhân vật sử dụng đặc trưng ngữ nghĩa	Nguyễn Hữu Phước	2016
150070000359	Ứng dụng GIS phục vụ công tác quản lý một số đối tượng hạ tầng mạng viễn thông trên địa bàn tỉnh Long An	Nguyễn Thanh Tuấn	2016
150070000358	Nghiên cứu tính hiệu quả của hệ thống tương tác Educo trong dạy học và học các môn phần mềm	Nguyễn Thanh Hương	2016
150070000355	Tích hợp Ontology mở trên cở sở lý thuyết đồng thuận	Trương Hải Bằng	2016
150070000354	Nghiên cứu xử lý tách âm thanh được thu từ hai nguồn phát	Ngô Hoàng Lê Minh	2016
150070000353	Xây dựng hệ thống hỗ trợ tìm kiếm văn bản điện tử theo ngữ nghĩa trong tập đoàn bưu chính viễn thông việt	Nguyễn Minh Luân	2016
150070000352	Xây dựng giải pháp dịch vụ in ấn tự động cho sinh viên một trường Đại học	Vũ Quốc Hưng	2016
150070000347	Ứng dụng Mapreduce trong xử lý dữ liệu từ các hệ thống thông tin phân tán	Nguyễn Huệ Minh	2016
150070000342	Nghiên cứu về nhận dạng tiếng nói tiếng Việt và ứng dụng trong điều khiển máy tính	Phan Hoàng Ân	2016
150070000341	Trực quan hóa dữ liệu dịch bệnh tay chân miệng khảo sát tập dữ liệu tỉnh Bình Dương	Võ Tấn Lực	2016
150070000336	Ứng dụng hỗ trợ ra quyêt định về chi phí của hạng mục khối nhà chính cho dự án xây dựng trường học	Hồ Văn Linh	2016
150070000333	Hiện thực thuật toán FP-GROWTH song song với Hadoop - map reduce và ứng dụng tìm luật kết hợp	Trần Quốc Hùng	2016
150070000326	Khai thác luật ích lợi trên mô hình giao dịch liên ngày	Nguyễn Hải Yến	2016
150070000322	Phát hiện phương tiện giao thông bị che khuất trong ảnh	Đoàn Văn Huyên	2016
150070000311	Song song hóa thuật toán K-Means trên Hadoop Mapreduce	Hoàng Thị Nhung	2016
150070000308	Nghiên cứu các phương pháp phân lớp đối tượng trên ảnh dựa trên Multiple instance learning	Bùi Lê Thuận	2016
150070000576	Phân tích dao động phi tuyến trong hệ chịu kích động ngẫu nhiên và tuần hoàn	Dương Ngọc Hảo	2015
150070000567	Nghiên cứu cơ sở dữ liệu NOSQL và chuyển đổi lược đồ cơ sở dữ liệu quan hệ sang NOSQL	Nguyễn Hữu Lộc	2015
150070000566	Khai thác Top-Rank-K tập phổ biến đóng	Trịnh Đồng Thạch Trúc	2015
150070000525	Nhận dạng khuôn mặt sử dụng mạng Nơron	Lê Phú Quý	2015
150070000523	A study on Fast and Safe WLAN Communication Protocol for Factory Automation Control Systems	Lam Duc Khai	2015
150070000517	Gom cụm dữ liệu Web video dựa trên cách tiếp cận kết hợp đa đặc trưng	Nguyễn Quang Phúc	2015
150070000512	Khám phá cộng đồng trên mạng xã hội	Trần Duy Thanh	2015
150070000511	Ứng dụng phương pháp phân lớp dữ liệu không cân bằng dựa trên tính toán hạt trong việc dự đoán kết quả thi tuyển sinh lớp 10 vào trường THPT chuyên Long An	Trương Thị Tuyết Hoa	2015
150070000510	Xác định ngưỡng đối sánh đặc trưng qua thực nghiệm và ứng dụng kỹ thuật nhận dạng dấu vân tay trên thiết bị di động	Võ Nhật Quang	2015
150070000508	Nghiên cứu kỹ thuật kết hợp lọc cộng tác và các phương pháp suy diễn cho khuyến nghị tài nguyên học tập trong học trực tuyến	Nguyễn Vĩnh Kha	2015
150070000507	Tư vấn việc làm dựa trên phân cụm người dùng	Nguyễn Quốc Dũng	2015
150070000505	Nghiên cứu các phương pháp phát hiện và phân tích hành vi đám đông qua camera giám sát	Nguyễn Phạm Phú Quý	2015
150070000492	Nghiên cứu, thử nghiệm mô hình rút trích thông tin và phân đa lớp văn bản bằng các chiến lược HAH và DDAG cải tiến	Nguyễn Thị Mai	2015
150070000488	Hệ chẩn đoán và điều trị bệnh sốt xuất huyết Dengue	Nguyễn Ngọc Hoàn Kim	2015
150070000487	Xây dựng và triển khai hệ thống phát hiện Malware	Hồ Viết Quang Thạch	2015
150070000486	Tối ưu hóa truy vấn trong hệ quản trị cơ sở dữ liệu hướng đối tượng	Đào Tấn Ngọc	2015
150070000484	Nghiên cứu một số thuật toán trong xử lý dữ liệu và biểu diễn địa hình 3D	Nguyễn Thanh Bình	2015
150070000480	Dự đoán liên kết "Positive" và "Negative" trong mạng xã hội	Nguyễn Thị Anh Thư	2015
150070000474	Các mô hình khuyến nghị bài báo khoa học trong lĩnh vực học thuật	Trần Hưng Nghiệp	2015
150070000462	Giải thuật cải tiến phục vụ tìm kiếm tài liệu học thuật trong thư viện số	Nguyễn Thị Thu Ngân	2015
150070000461	Biểu diễn tri thức hóa học đại cương và xây dựng hệ giải toán tự động trên thiết bị di động	Huỳnh Vĩnh Phát	2015
150070000455	Thiết kế hệ cơ sở tri thức về hình học phẳng hỗ trợ việc hướng dẫn giải toán	Vũ Thị Ái Duyên	2015
150070000415	Nghiên cứu và xây dựng hệ thống giám sát thông số môi trường phục vụ nông nghiệp sử dụng mạng cảm biến không dây	Hồ Tấn Đạt	2015
150070000410	Hệ tư vấn môn học cho sinh viên học theo học chế tín chỉ	Đoàn Chí Trung	2015
150070000378	Nghiên cứu kỹ thuật phát hiện lỗi văn phong để hỗ trợ viết báo cáo khoa học bằng tiếng Anh	Trần Bá Dược	2015
150070000368	Các thuật toán khai phá dữ liệu ứng dụng trong hệ thống phân tán lớn	Nguyễn Thành Phương	2015
150070000346	Nghiên cứu thiết kế hệ thống phân quyền truy cập cơ sở dữ liệu dân cư - khảo sát trường hợp thành phố Phan Thiết tỉnh Bình Thuận	Trần Văn Cường	2015
150070000325	Cảnh báo tốc độ xe	Nguyễn Thị Diễm An	2015
150070000324	Tìm hiểu Nosql - Mongodb và xây dựng ứng dụng minh họa	Trần Thị Yến Nhi	2015
150070000320	Nhận biết hoạt động người dùng điện thoại thông minh	Nguyễn Văn Chung	2015
150070000310	Biểu diễn tri thức và xây dựng hệ giải bài toán thông minh về hình học giải tích hai chiều	Nguyễn Thị Thu Trang	2015
150070000521	Adaptive Fuzzy Control Design for Chaotic Permanent	Nguyen Tat Bao Thien	2014
70000287	Tiếp cận đặc tả ngữ nghĩa dựa trên cấu trúc cú pháp để phân tích các câu hỏi tiếng Việt trong hệ thống truy vấn thông tin dự báo khí tượng thủy văn	Trương Lê Hưng	2014
70000286	Dự báo thu ngân sách nhà nước bằng phương pháp mạng nowrowrron và lý thuyết tập thô	Bùi Tiến Sỹ	2014
70000285	Nghiên cứu phương pháp tóm tăt văn bản Tiếng Việt	Nguyễn Thị Ngọc Tú	2014
70000284	Phương pháp cộng tác thông minh dựa trên sự đồng thuận để xây dựng ontology wordnet Việt	Nguyễn Thị Phương Trang	2014
70000283	Nhận diện thực thể có tên trong các mẫu tin tiếng Việt trên TWITER	Huỳnh Thanh Phụng	2014
70000282	Biểu diễn trực quan dữ liệu di động trên bản đồ địa lý thời gian	Bùi Thị Hà	2014
70000281	Tái nhận dạng nhân vật qua mạng các camera	Nguyễn Hoàng Vũ	2014
70000305	Nghiên cứu xây dựng kho dữ liệu hỗ trợ ra quyết định trong kinh doanh viễn thông.	Nguyễn Thị Thúy Lan	2013
70000293	Ứng dụng Ontology CK - Onto để tìm kiếm tài liệu học tập theo ngữ nghĩa trên HTTT	Nguyễn Thanh Điền	2013
70000292	Nghiên cứu truy vấn ảnh bìa sách sử dụng đặc trưng thị giác	Đặng Văn Em	2013
70000290	Phân tích chủ đề trao đổi trên mạng xã hội	Nguyễn Văn Muôn	2013
70000289	Nghiên cứu và thử nghiệm mạng Nơron lan truyền ngược trong dự báo chỉ số giá tiêu dùng (CPI) cả nước	Nguyễn Văn Sơn	2013
70000277	Nghiên cứu và đề xuất một phương pháp quản lý bộ nhớ đệm video trong đào tạo trực tuyến	Nguyễn Hoàng Nguyên	2013
70000276	Nghiên cứu dự báo biểu điểm cho đề thi trắc nghiệm khách quan bằng hệ luật mờ	Lê Duy Đồng	2013
70000271	Trực quan hóa dữ liệu chuyển động theo không gian - thời gian (Visualization of spatio- temporal data of movement)	Nguyễn Thị Thu Hà	2013
70000268	Nghiên cứu và phát triển các thuật toán trên ma trận thưa dùng SVD và ứng dụng trong tìm kiếm	Nguyễn Thôn Dã	2013
70000267	Xây dựng công cụ trợ giúp quản lý và truy vấn lịch cá nhân bằng tiếng nói	Trần Khải Thiện	2013
70000263	Xây dựng hệ thống hỏi đáp về các chuyến tàu hỏa có hỗ trợ tiếng Việt	Lê Thị Thủy	2013
70000262	Ứng dụng giải thuật di truyền và điện toán lưới để sắp xếp thời khóa biểu tại trường Đại học Nông lâm	Nguyễn Thị Phương Trâm	2013
70000261	Mô hình trực quan hóa dữ liệu thời gian	Nguyễn Ngọc Diễm	2013
70000260	Ứng dụng mạng nơ ron trong bài toán dự báo lưu lượng cước viễn thông	Thái Doãn Nguyên	2013
70000259	Xây dựng một giải pháp liên kết tiếp thị thông minh cho thương mại điện tử	Lê Anh Khoa	2013
70000258	Phương pháp thiết kế hệ hướng dẫn bài toán dựa trên cơ sở tri thức dạng COKB	Nguyễn Hoàng Phong	2013
70000257	Xây dựng mô hình dự báo dựa trên thuật giải gom cụm và cây quyết định.	Lê Thị Chung	2013
70000256	Nghiên cứu và xây dựng hệ thống định vị trong các tòa nhà	Nguyễn Khánh Ngọc	2013
70000255	Lưu trữ và tìm kiếm các nội dung nghe nhìn theo yêu cầu của một dịch vụ xem phim qua mạng sử dụng MPEG 7 và Xquery	Nguyễn Thị Anh	2013
70000254	Xây dựng cơ chế truy vấn dựa trên ngữ nghĩa của các cụm từ tiếng Việt cho hệ thống tìm kiếm việc làm	Phan Thị Thể	2013
70000253	Xây dựng hệ chuyên gia hỗ trợ chuẩn đoán và điều trị các biến chứng trên mạch máu nhỏ của bệnh đái tháo đường	Nguyễn Thị Trúc Ly	2013
70000252	Phân tích tầm ảnh hưởng của đối tượng theo chủ đề trong lĩnh vực Công nghệ thông tin	Phan Hồ Viết Trường	2013
150070000329	Mô hình dữ liệu UDM thời gian	Phạm Văn Đăng	2012
70000306	Giải pháp lightweight - IDS và triển khai trên Access Point (Lightweight - IDS Solution for Access Point)	Mai Vân Phương Vũ	2012
70000304	Nghiên cứu một số vấn đề bảo mật trong thanh toán cho thương mại di động.	Lê Trọng Ngọc	2012
70000299	Xây dựng hệ thống dự đoán liên kết (Link prediction) áp dụng cho việc dự đoán trao đổi email (Email exchange)	Chu Thị Mai	2012
70000297	Bước đầu xây dựng đặc tả theo MPEG7 phục vụ tìm kiếm trong kho phim của dịch vụ IPTV	Nguyễn Thị Hương	2012
70000295	Kỹ thuật kiếm thử đột biến	Hoàng Thị Thanh Thủy	2012
70000294	Nghiên cứu và thử nghiệm mạng Nơron lan truyền ngược trong dự báo lũ sông Đà Rằng	Đỗ Hoàng Anh Tuấn	2012
70000288	Xây dựng hệ cơ sở tri thức tiếng anh phục vụ việc kiểm tra kiến thức văn phạm của học viên ở các cấp độ	Nguyễn Nam Thắng	2012
70000275	Ứng dụng đại số gia tử để phân lớp và xây dựng bộ tìm kiếm mờ các trang web theo chuyên ngành.	Hoàng Nguyễn Vĩ Cầm	2012
70000274	Đảm bảo tính nhất quán dữ liệu cho hệ cơ sỡ dữ liệu phân tán các cấp.	Nguyễn Văn Phúc	2012
70000273	Ứng dụng kỹ thuật so khớp thông tin, xây dựng phân hệ" Source Code Management" trong hệ thống Sakai	Đinh Thị Tâm	2012
70000272	Nhận dạng số liên tục thời gian thực	Phạm Ngọc Bách	2012
70000270	Nghiên cứu cải tiến các thuật toán gom cụm mờ và xây dựng ứng dụng khai phá dữ liệu trong cơ sở dữ liệu ERP doanh nghiệp dược phẩm	Đoàn Huấn	2012
70000269	Ứng dụng khai phá luật kết hợp dựa vào lý thuyết tập thô giải quyết bài toán xử lý dữ liệu hỗ trợ công tác đánh giá chất lượng giáo dục tại ĐH Nha trang.	Nguyễn Hùng Quốc	2012
70000266	Xây dựng hệ tư vấn kiến trúc nhà ở tại Việt Nam.	Thân Thị Ngọc Vân	2012
70000265	Nghiên cứu ứng dụng mạng nơ ron xây dựng hệ thống Snort IDS bảo vệ mạng nội bộ Đại học Đà Nẵng.	Lê Vũ	2012
70000264	Nghiên cứu và ứng dụng thuật giải gom cụm trong mạng liên kết các websites	Dương Khai Phong	2012
70000251	Phát triển quy trình và các kỹ thuật giấu tin trong ảnh	Lê Anh Tài	2012
70000249	Nghiên cứu một số kỹ thuật khai phá dữ liệu và áp dụng với cơ sở dữ liệu cục thuế tỉnh Quảng Ninh	Đào Thị Thanh Thủy	2012
70000248	Ứng dụng mạng Nơ ron trong nhận dạng bàn tay	Chu Anh Tuấn	2012
70000247	Nonlinear Recression Apprach for GPS Multhpath Mitigation: from code to carrier-phase measurements	Phan Quốc Huy	2012
150070000445	Tiếp cận đồ thị biểu diễn, khai thác văn bản và ứng dụng	Nguyễn Hoàng Tú Anh	2011
150070000444	Phát triển các mô hình và thuật toán biểu diễn, xử lý, khai thác dữ liệu không gian và ứng dụng giải một số bài toán GIS	Nguyễn Minh Nam	2011
150070000442	Một số mô hình an toàn dữ liệu và an ninh mạng, bước đầu đề xuất lý thuyết cho mạng không dây	Trần Ngọc Bảo	2011
70000250	Sử dụng phân loại đối tượng theo liên kết để dự đoán chủ đề của các bài báo khoa học.	Trương Hoàng Nhựt	2011
70000241	Ứng dụng một số thuật toán khai thác weblog và chú thích cộng đồng để nâng cao hiệu quả tìm kiếm cục bộ	Huỳnh Lê	2011
70000242	Mô phỏng số các quá trình ngẫu nhiên, trường ngẫu nhiên và ứng dụng	Phạm Thị Lan Anh	2010
70000240	Khai thác dữ liệu phân tán bảo toàn tính riêng tư	Cao Tùng Anh	2010
70000239	Phát hiện mặt người bằng ADABOOST kết hợp mạng Nơron.	Trần Phúc Trị	2010
70000238	Nghiên cứu Ontology – Semantic web và ứng dụng	Đỗ Áng	2010
70000237	Phát hiện, phân loại và theo dõi đối tượng chuyển động trong hệ thống giám sát thông minh	Đặng Minh Tuấn	2010
70000236	Nghiên cứu luật kết hợp và áp dụng thử nghiệm ứng dụng vào khai phá cơ sở dữ liệu đăng ký tuyển sinh của các trường Đại học, Cao đẳng trên địa bàn thành phố Hải Phòng	Phạm Thị Thịnh	2010
70000235	Mạng cảm biến không dây, thủ tục xâm nhập môi trường và một số thực nghiệm	Hoàng Nhơn	2010
70000234	Nghiên cứu xây dựng mạng cảm nhận không dây có khả năng tự cấu hình lại	Nguyễn Thành Nhất	2010
70000233	Chương trình thu nhận, xử lý, cảnh báo sự cố trên nút mạng cảm nhận không dây(WSN) hiển thị bằng màn hình tinh thể lỏng (LCD)	Bùi Đình Hòa	2010
70000232	Ứng dụng mạng Nơron trong phân lớp các ảnh vân tay	Nguyễn Văn Hà	2010
70000231	Đánh giá phân cụm các độ đo lợi ích dựa trên ma trận giá trị tương tác.	Huỳnh Hoàng Vân	2010
70000230	Xây dựng hệ thống hỗ trợ và giải đáp thông tin giáo vụ cho sinh viên, học sinh trong một trường Đại học	Nguyễn Lạc An Thư	2010
70000229	Nghiên cứu các phương pháp lọc thư rác và xây dựng thử nghiệm hệ thống lọc thư trên Linux.	Nguyễn Huy Khang	2010
70000228	Ứng dụng giải thuật APRIORI, mạng Nơ ron và thuật giải di truyền để khám phá và dự báo thông tin trong cơ sở dữ liệu điểm sinh viên	Nguyễn Minh Đế	2010
150070000441	Biến đổi đa phân giải có hướng ứng dụng trong phân tích vi ảnh	Ngô Quốc Việt	2009
70000280	Nghiên cứu thuật toán xếp lịch và ứng dụng vào việc xếp lịch cho khoa Tin học trường Cao đẳng Kỹ thuật Cao Thắng	Trần Thị Ngọc Châu	2009
70000279	Xây dựng kho dữ liệu kinh tế xã hội phục vụ điều hành cấp tỉnh	Nguyễn Gia Đăng	2009
70000278	Khám phá tài nguyên tính toán lưới sử dụng mô hình Peer - to - Peer	Phạm Hồng Hoà	2009
70000246	Công cụ trợ giúp xây dựng kho ngữ liệu song ngữ Pháp-Việt từ Internet	Lâm Hồ Hải	2009
70000243	Phương pháp phân cụm dữ liệu trong quản lý chuổi cung ứng	Hà Thị Hoa	2009
70000227	Nghiên cứu giải pháp kỹ thuật đảm bảo gắn bó dữ liệu trong cơ sở dữ liệu phân tán	Lê Văn Thống	2009
70000226	Khai thác luật kết hợp có trọng số trong các kho dữ liệu phân tán	Lê Tự Thanh	2009
70000225	Xây dựng hệ chương trình phục vụ đào tạo trực tuyến qua mạng	Nguyễn Như Sơn	2009
70000224	Nghiên cứu các toán tử đột biến ứng dụng cho C#	Trần Văn Quy	2009
70000223	Chữ ký số và các vấn đề bảo mật thông tin	Trần Phước Chinh	2009
70000222	Nghiên cứu hệ thống mua bán chứng khoán phi tập trung (OTC) sử dụng công nghệ đa tác tử	Trần Thanh Tú	2009
70000221	Ứng dụng mô hình khai phá dữ liệu để khám phá các hành vi sử dụng điện thoại của người Việt Nam.	Đỗ Bá Sang	2009
70000220	Ứng dụng cơ sở dữ liệu XMLEXIST tổ chức và khai thác ngân hàng câu hỏi trắc nghiệm bằng máy tính	Mai Thị Trang	2009
70000219	Nghiên cứu một số giải pháp và phần mềm cảnh báo đảm bảo an ninh an toàn chống truy cập trái phép	Ngô Khắc Tính	2009
70000218	Nghiên cứu xây dựng thuật toán nhận dạng ngôn ngữ và ứng dụng trong an ninh, quốc phòng	Nguyễn Quý Thích	2009
70000217	Ứng dụng khai phá dữ liệu hỗ trợ ra quyết định trong lĩnh vực kinh doanh ngân hàng	Vũ Mạnh Sướng	2009
70000216	Ứng dụng logic mờ vào công tác quản lý nhân sự trường Cao đẳng Công nghệ Việt - Hung	Võ Thị Như Quỳnh	2009
70000215	Phương pháp tìm kiếm thông tin đề tài nghiên cứu khoa học các ban Đảng dựa trên Ontology	Lương Đức Quý	2009
70000214	Nghiên cứu đánh giá hiệu suất hoạt động của ứng dụng phân phối nội dung thông tin trong mạng ngang hàng	Nguyễn Thị Ngọc	2009
70000213	Phương pháp phân cụm đối tượng trong cơ sở dữ liệu không gian	Lê Thị Thúy Nga	2009
70000212	Xây dựng chương trình phát hiện các giai điệu trùng lặp bằng kỹ thuật phân đoạn chuỗi dữ liệu tuần tự	Nguyễn Thùy Linh	2009
70000211	Truy vấn dữ liệu đa phương tiện bằng đặc tả nội dung theo chuẩn MPEG O7 ứng dụng vào quản lý thư viện trường Đại học Hải Phòng	Nguyễn Văn Khởi	2009
70000210	Nghiên cứu và tìm hiểu các chuẩn nén ứng dụng trong truyền hình Internet	Nguyễn Trung Hưng	2009
70000209	Nghiên cứu xây dựng mô hình quản trị cơ sở dữ liệu video thử nghiệm cho đài PT-TH Bắc Giang	Hoàng Trọng Hưng	2009
70000208	Hàm băm mật mã và ứng dụng	Nguyễn Văn Hùng	2009
70000207	Trích xuất thông tin Web và hỗ trợ quyết định kinh doanh khách sạn	Tô Hồng Hải	2009
70000206	Nghiên cứu một số giải pháp truy cập từ xa các cơ sở dữ liệu. Áp dụng thử nghiệm xây dựng cơ sở dữ liệu tích hợp về sinh viên của một số trường Đại học, Cao đẳng tại Hải Phòng	Phạm Đức Duyến	2009
70000205	Lý thuyết chắc chắn và ứng dụng nó trong quản lý điểm trường PTTH Tùng Thiện	Ngô Sỹ Diệm	2009
70000204	Xây dựng hệ thống mô phỏng quỹ đạo chuyển động của tàu trên biển dưới tác động của hệ thống lái tự động	Đặng Quốc Bản	2009
70000203	Phân tích, dự đoán và tìm kết quả tối ưu một số bài toán tài chính sử dụng thuật giải di truyền	Lê Xuân Vượng	2009
70000202	Nghiên cứu xây dựng hệ thống truy tìm ảnh dựa trên phản hồi thông tin tương tác với người dùng	Vũ Quang Việt	2009
70000201	Nghiên cứu, phát triển kỹ thuật mô phỏng luyện kim cải tiến. Ứng dụng cho bài toán sắp xếp bán vé xe lửa cho khách hàng	Trần Nhật Tuấn	2009
70000200	Công nghệ nhận dạng và thu thập dữ liệu tự động - Ứng dụng hỗ trợ tư vấn mua sản phẩm trên thiết bị di động	Phan Nguyệt Minh	2009
70000199	Ứng dụng kỹ thuật máy học để phân loại các cuộc tấn công trên mạng.	Đỗ Đình Trang	2009
70000198	Thuật giải di truyền trong bài toán đối sánh ảnh vân tay	Mai Chiếm Tuấn	2009
70000197	Nghiên cứu xây dựng cấu trúc dữ liệu GIS thời gian biểu diễn tình hình dịch tễ gia súc gia cầm, ứng dụng trên địa bàn Tp. Hồ Chí Minh	Bùi Anh Tuấn	2009
70000196	Canh lề văn bản song ngữ Anh - Việt theo vị trí câu và ứng dụng rút trích câu song ngữ tương ứng	Quách Ngọc Đoan Trang	2009
70000195	Mô hình công cụ tìm kiếm bằng truy vấn tiếng Việt ứng dụng cho thư viện trường Đại học	Lý Thiên Trang	2009
70000194	Khai thác mẫu có trọng số phổ biến đóng	Lê Khắc Toản	2009
70000193	Hệ thống rút trích thông tin từ Web dựa vào mô hình quan hệ đối tượng	Nguyễn Lê Tín	2009
70000192	Các phương pháp tấn công mạng, xây dựng và triển khai hệ thống phát hiện xâm nhập trên nền Snort	Phan Vĩnh Thuần	2009
70000191	Hệ thống theo dõi đối tượng	Trương Vũ Nga Thi	2009
70000190	Xây dựng hệ chẩn đoán bệnh dựa trên ANFIS	Nguyễn Văn Thành	2009
70000189	Một mô hình cơ sở đối tượng xác suất và mờ hướng thời gian	Đào Quốc Thắng	2009
70000188	Tìm hiểu công nghệ Biztalk và triển khai vào tích hợp ứng dụng doanh nghiệp	Nguyễn Lê Sơn	2009
70000187	Nghiên cứu xây dựng cơ sở dữ liệu phân tán và ứng dụng vào quản lý đào tạo trên mạng của trường Cao đẳng Kinh tế Kỹ thuật Cần thơ	Nguyễn Minh Quyền	2009
70000186	Xây dựng chương trình khám chữa bệnh ngoại trú. Ứng dụng mạng nơron đưa ra dự báo số lượng bệnh	Nguyễn Vũ Duy Quang	2009
70000185	Semantic Web, Ontology và ứng dụng	Phạm Thị Mỹ Phượng	2009
70000184	Xây dựng kho ngữ liệu Anh - Việt cho hệ dịch máy dựa trên ví dụ	Bùi Minh Phụng	2009
70000183	Hỗ trợ phân loại câu hỏi qua mạng	Phạm Thanh Phong	2009
70000182	Nhận dạng cảm xúc mặt người	Trần Ngọc Phẩm	2009
70000181	Ứng dụng các kỹ thuật trí tuệ nhân tạo cho bài toán tối ưu hóa công thức dược phẩm	Châu Ngọc Nhung	2009
70000180	Nghiên cứu về việc phân tán và truy vấn nhà kho dữ liệu trên môi trường lưới tính toán	Trần Thị Ngọc Mai	2009
70000179	Ứng dụng phương pháp khai phá dữ liệu trong quản lý năng lượng điện	Cao Quang Lộc	2009
70000178	Nghiên cứu và xây dựng bộ lọc thư điện tử Spam dựa trên các giải thuật máy học	Nguyễn Viết Linh	2009
70000177	Hệ hỗ trợ ra quyết định và bài toán tối ưu hóa đa mục tiêu	Hồ Thành Lam	2009
70000176	Ứng dụng các kỹ thuật Neuro Fuzzy và Visualization khảo sát quy luật nhân quả trong công thức dược phẩm	Nguyễn Đăng Khoa	2009
70000175	Khai thác luật kết hợp hữu ích có trọng số	Thái Thị Huyên	2009
70000174	Hệ thống hỗ trợ phân tích dữ liệu trên điện thoại di động	Vũ Thị Thanh Hương	2009
70000173	Phát triển phương pháp khai phá luật kết hợp vào dữ liệu không - thời gian qua GRASS GIS và PostGreSQL	Nguyễn Thị Hồng	2009
70000172	Phát triển mô hình Artmap cho trích chọn đặc trưng ảnh vân tay	Mai Thị Hải	2009
70000171	Xây dựng công cụ tìm kiếm tài liệu học tập bằng các truy vấn ngôn ngữ tự nhiên trên kho học liệu mở tiếng Việt	Lương Quý Tịnh Hà	2009
70000170	Nghiên cứu xây dựng kho dữ liệu hỗ trợ ra quyết định cho thanh toán bảo hiểm y tế	Dương Thị Kim Chi	2009
70000169	Đánh giá độ an toàn bảo mật hệ thống thông tin khách hàng SPHONE	Nguyễn Chánh	2009
70000168	Nghiên cứu phát triển hệ thống Audit Database cải tiến hiệu quả Audit của SQL server	Lâm Hồng Bắc	2009
70000167	Xác định ranh giới từ tiếng Việt dựa trên ngữ liệu song ngữ Anh - Việt	Phạm Tú Anh	2009
70000166	Nghiên cứu xây dựng và phát triển hệ thống Portal.	Nguyễn Xuân Hải	2009
70000165	Chứng chỉ số và ứng dụng trong chính phủ điện tử.	Mai Mạnh Trừng	2009
70000164	Áp dụng mạng nơron xây dựng chương trình nhận dạng để phân loại tàu trên biển dựa trên ảnh số.	Phạm Quang Trung	2009
70000163	Các tính chất mở rộng của khóa và bao đóng trong mô hình cơ sở dữ liệu dạng khối.	Trần Quỳnh Trang	2009
150070000445	Tiếp cận đồ thị biểu diễn, khai thác văn bản và ứng dụng	Nguyễn Hoàng Tú Anh	2011
70000162	Nâng cao hiệu suất truy vấn trên cơ sở dữ liệu phân tán và ứng dụng trong hệ thống quản lý du học trực tuyến.	Phạm Thị Thơm	2009
70000161	Kho dữ liệu cơ sở dữ liệu doanh nghiệp và ứng dụng trong điều tra chọn mẫu.	Nguyễn Đình Nga	2009
70000160	Phát hiện tri thức trong tập dữ liệu lớn.	Nguyễn Đức Lưu	2009
70000159	Ứng dụng lý thuyết tập mờ hỗ trợ chẩn đoán bệnh hô hấp ở trẻ em Việt Nam.	Nguyễn Tiến Lợi	2009
70000158	Phát hiện tấn công trên mạng và Ứng dụng cảnh báo gói tin có virus.	Hà Khánh Lâm	2009
70000157	Vấn đề đồng minh, mâu thuẫn trong hệ thông tin.	Trần Quốc Hưng	2009
70000156	Khai phá dữ liệu bằng luật kết hợp và áp dụng vào bài toán đánh giá, phân loại học sinh.	Đặng Thị Huệ	2009
70000155	Tiếp cận cơ sở tri thức, logic mờ và thử nghiệm ứng dụng trong hệ thống phân loại văn bản.	Phạm Thị Thu Hiếu	2009
70000154	Nghiên cứu một số kỹ thuật tra cứu ảnh và ứng dụng vào bài toán tra cứu ảnh phong cảnh.	Bùi Tất Hiếu	2009
70000153	Nghiên cứu tìm hiểu bài toán phân tích thông tin giấu trong ảnh (Steganalysis).	Lương Thị Hà	2009
70000152	Nghiên cứu hệ chuyên gia và ứng dụng hỗ trợ chẩn đoán và điều trị bệnh trên nền cơ sở dữ liệu Oracle.	Nguyễn Mạnh Cường	2009
70000151	Web ngữ nghĩa cho văn bản và ứng dụng.	Nguyễn Phạm Quốc Hùng	2009
70000150	Nghiên cứu và xây dựng framework cho phép tích hợp các dịch vụ web ngữ nghĩa.	Lâm Quân Vũ	2009
70000149	Khai phá dữ liệu khách hàng Bưu điện tpHCM để hỗ trợ ra quyết định khuyến mãi.	Trương Thị Ngọc Tuyền	2009
70000148	Hệ hỗ trợ ra quyết định và ứng dụng trong phân tích tài chính.	Võ Hoàng Trinh	2009
70000147	Bảo vệ tính riêng tư của dữ liệu bằng item nhiễu.	Lê Nhị Lãm Thúy	2009
70000146	Nghiên cứu và xây dựng hệ thống thông tin phục vụ công tác đảm bảo chất lượng trong trường Đại học.	Nguyễn Kiến Thi	2009
70000145	Nghiên cứu, ứng dụng kho dữ liệu vào bài toán hỗ trợ ra quyết định trong hệ thống đào tạo theo học chế tín chỉ.	Hồ Trung Thành	2009
70000144	Nghiên cứu phương pháp nhận dạng mống mắt dùng vùng nữa mống mắt, biến đổi Haar và hàm phi tuyến.	Võ Thành Nhân	2009
70000143	Nghiên cứu các phương pháp đánh giá độ tin cậy mạng máy tính và xây dựng phần mềm trợ giúp đánh giá.	Nguyễn Phạm Hải Đăng	2009
70000142	Mô hình tìm kiếm thông tin văn bản trên các website song ngữ Anh - Việt và ứng dụng.	Nguyễn Trọng Chỉnh	2009
70000141	Nghiên cứu giải bài toán tự động phân loại vân tay	Đỗ Minh Tuấn	2009
70000140	Xây dựng hệ thống đếm xe bằng công nghệ xử lý video.	Nguyễn Thị Mai Trang	2009
70000139	Nghiên cứu ứng dụng nhận dạng phiếu trả lời trắc nghiệm.	Lê Văn Lai	2009
70000138	Tìm kiếm ảnh tương tự trực tuyến dựa trên phương pháp kết hợp đặc trưng vân ảnh và màu sắc.	Võ Văn Thành	2009
70000137	Hệ thống hỗ trợ dịch vụ thông tin công.	Lý Thành	2009
70000136	Tối ưu hóa phép kết trên luồng dữ liệu có sử dụng ràng buộc.	Võ Thị Hồng Thắm	2009
70000135	Nghiên cứu một số giải pháp và thực hiện giải thuật nhận diện biển báo giao thông.	Trần Bá Minh Sơn	2009
70000134	Sử dụng vector nhận dạng video việc quản lý các tiết mục quảng cáo.	Nguyễn Quốc Huy	2009
70000133	Đảm bảo tính riêng tư trong khai phá dữ liệu - Ứng dụng trong cơ sở dữ liệu khách hàng tại công ty Điện lực TpHCM.	Lê Chí Dũng	2009
70000132	Phân tích sóng âm của tim hỗ trợ chẩn đoán bệnh tim mạch.	Trần Thị Diệu	2009
70000131	Kỹ thuật tổ chức hệ hỏi đáp thông minh theo một ngữ cảnh hạn chế.	Tôn Thất Hòa An	2009
70000301	Nghiên cứu cải tiến thuật toán phân lớp sử dụng cây quyết định đệ quy	Nguyễn Minh Luân	2008
70000300	Tìm kiếm tự động văn bản song ngữ Anh - Việt từ Internet	Ngô Quốc Hưng	2008
70000130	Chuyển đổi CSDL giữa XML và CSDL quan hệ dựa vào lược đồ XML và Automed	Nguyễn Xuân Tiến	2008
70000129	Nghiên cứu ứng dụng Semantic web trong du lịch điện tử.	Phan Thanh Quảng	2008
70000128	Xây dựng ứng dụng web xử lý hồ sơ theo quy trình được định nghĩa bằng workflow tại một đơn vị.	Trần Văn Đại	2008
70000127	Phối hợp các phương pháp giấu tin trong ảnh.	Trần Vương Thành	2008
70000126	Các vấn đề về chất lượng dữ liệu trong quy trình phần mềm cá nhân.	Bùi Văn Sỹ	2008
70000125	Công nghệ mạng không dây và một số giải pháp bảo vệ.	Mạc Văn Quang	2008
70000124	Đánh giá và các giải pháp nâng cao hiệu năng mạng máy tính.	Nguyễn Hồng Phong	2008
70000123	Nghiên cứu về các giải pháp an ninh trong mạng không dây.	Mai Thị Nữ	2008
70000122	Xây dựng HTTT tra cứu điểm thi cho học viên hệ đào tạo từ xa tại TT CNPM trường ĐH Hàng hải VN qua mạng điện thoại di động.	Phạm Thị Thùy Ni	2008
70000121	Giải pháp bảo mật mạng IP phục vụ công tác hội nghị truyền hình trong lực lượng công an nhân dân.	Nguyễn Tất Lợi	2008
70000120	Xây dựng hệ thống quản lý thư viện trực tuyến trường Đại học Lâm nghiệp.	Nguyễn Văn Khoa	2008
70000119	Xây dựng kho dữ liệu và ứng dụng vào bài toán quản lý hoạt động tín dụng ngân hàng.	Nguyễn Quốc Hùng	2008
70000118	Xây dựng hệ thống giám sát tài nguyên mạng tại Công ty VASC.	Nguyễn Đoàn Trọng Hiếu	2008
70000117	Sử dụng công cụ khai phá dữ liệu để cảnh báo nguy cơ mất an ninh trên mạng.	Phạm Văn Hiệp	2008
70000116	Nghiên cứu và xây dựng hệ thống thông tin phục vụ phòng giao dịch một cửa.	Trương Văn Đoàn	2008
70000115	Nghiên cứu bảo mật hệ thống thông tin trường Cao đẳng Công nghệ Vietronics Hải Phòng.	Bùi Duy Cường	2008
70000114	Phần mềm điều khiển và quản lý "Phòng học dùng mạng Lan".	Nguyễn Huy Công	2008
70000113	Ứng dụng phương pháp Markov Model Mediator để truy vấn và chẩn đoán u não trên ảnh chụp MRI và CT với hệ thống PACS.	Huỳnh Tấn Phước	2008
70000112	Xây dựng hệ thống tra cứu thư viện điện tử bằng ngôn ngữ tự nhiên	Đỗ Thị Thanh Tuyền	2008
70000111	Xác định tọa độ vật thể trong không gian	Nguyễn Kim Tuấn	2008
70000110	Công cụ trợ giúp xây dựng kho ngữ liệu song ngữ Anh - Việt từ internet.	Nguyễn Thanh Trường	2008
70000109	Xây dựng thuật toán mới cho bài toán khai thác tập phổ biến và bài toán dãy phổ biến trong nhiều chuỗi.	Nguyễn Thành Trung	2008
70000108	Nghiên cứu cải tiến thuật toán tìm motif trong các trình tự sinh học.	Nguyễn Quang Trình	2008
70000107	Nghiên cứu xây dựng hệ thống phần mềm quản lý nội dung thông tin Website trong lực lượng Công an nhân dân.	Nguyễn Việt Hùng	2008
70000106	Xếp thời khóa biểu bằng giải thuật di truyền lai- Memetic Algorithms.	Nguyễn Thị Huyền Trinh	2008
70000105	Đo lường- Đánh giá trong thi trắc nghiệm khách quan.	Võ Anh Trang	2008
70000104	Nghiên cứu mô hình biễu diễn tri thức, ứng dụng xây dựng hệ giải bài toán điện học.	Hồ Nhật Tiến	2008
70000103	Nghiên cứu dữ liệu mạng lưới và ứng dụng.	Nguyễn Văn Thuận	2008
70000102	Nghiên cứu và xây dựng hệ thống định tuyến cho mạng WLAN trong mô hình mạng Ad hoc.	Phạm Hùng Thu	2008
70000101	Xây dựng nhà kho dữ liệu và công cụ xử lý phân tích trực tuyến giúp hỗ trợ ra quyết định tại công ty Zuellig Pharma Việt Nam Ltd.	Vũ Quốc Thông	2008
70000100	Dự báo thị trường chứng khoán sử dụng mạng nơron kết hợp giải thuật di truyền.	Nguyễn Tiến Thanh	2008
70000099	Ứng dụng hệ suy diễn mờ dựa trên mạng thích nghi để xây dựng hệ thống dự báo khí hậu khu vực nam bộ.	Nguyễn Ngọc Thận	2008
70000098	Xây dựng chương trình kiểm tra lỗi chính tả dựa trên phương pháp ngữ âm.	Nguyễn Ngọc Thái	2008
70000097	Nghiên cứu bảo mật hệ thống thông tin phát hiện và cảnh báo lỗ hổng.	Hoàng Trọng Thạch	2008
70000096	Tìm kiếm tăng cường trên internet- Lưu vết sự thay đổi web document.	Nguyễn Giang Sơn	2008
70000095	Xây dựng mô hình hệ thống thông tin hỗ trợ quá trình ra quyết định xử lý vi phạm hành chính.	Lê Thanh Phương	2008
70000094	Ứng dụng Microsoft Time Series xây dựng hệ thống dự báo thị trường chứng khoán Việt Nam.	Đặng Hồng Phú	2008
70000093	Ứng dụng logic mờ và GIS trong xây dựng hệ thống cảnh báo dịch bệnh	Cao Xuân Phong	2008
70000092	Xây dựng chương trình tư vấn đầu tư tài chính	Nguyễn Thái Nho	2008
70000091	Giải pháp bảo mật cho thẻ thông minh đa năng	Trần Nguyễn Khôi Nguyên	2008
70000090	Các phương pháp tiền xử lý dữ liệu cho khai thác dữ liệu và kho dữ liệu	Nguyễn Thị Kim Nga	2008
70000089	Nhận dạng trực tuyến xe mô tô hai bánh	Nguyễn Thị Hồng Minh	2008
70000088	Khai thác dữ liệu đồ thị (Graph Mining) và ứng dụng vào lĩnh vực sinh tin học	Nguyễn Thị Thùy Linh	2008
70000087	Phương pháp và công cụ soạn giảng trong đào tạo điện tử (E - Learning)	Hồ Thị Kim Liên	2008
70000086	Thiết kế hệ thống đánh giá chất lượng học tập qua mạng	Trần Duy Vũ Ngọc Lan	2008
70000085	Tìm kiếm mẫu phổ biến dựa trên ma trận điểm trong khai phá dữ liệu tăng cường	Nguyễn Quốc Khanh	2008
70000084	Xây dựng phương pháp và kỹ thuật xác định các từ mới trong vốn từ vựng tiếng Việt	Nguyễn Thị Ngọc Hợp	2008
70000083	Dùng kỹ thuật bảng băm tạo dữ liệu cluster trong MYSQL cho Web form Sematic	Lê Thị Ánh Hằng	2008
70000082	Thiết kế hệ thống nhúng uCLinux để xây dựng tổng đài IP-PBX và ứng dụng nhà thông minh	Huỳnh Nhựt Hải	2008
70000081	Xây dựng tập dữ liệu thứ cấp hỗ trợ công tác khai phá dữ liệu trong tập thô	Nguyễn Giới	2008
70000080	Tìm hiểu hệ thống miễn dịch nhân tạo trong Machine Learning để xây dựng một hệ thống đảm bảo an toàn mạng máy tính	Tống Minh Đạt	2008
70000079	Bảo mật SQL Server	Trương Thành Công	2008
70000078	Thuật giải di truyền cho chứng thực biểu tượng nhãn hiệu hàng hóa	Trần Nguyễn Anh Chi	2008
70000077	Nghiên cứu các cấu trúc chỉ mục cho bài toán tìm kiếm tương tự trong không gian metric	Hồ Văn Can	2008
70000076	Bài toán điều khiển tiến độ và phân phối tài nguyên trong quản lý dự án	Nguyễn Thị Thắm	2008
70000075	Bảo đảm tính toàn vẹn dữ liệu bằng các dịch vụ xác thực	Lê Văn Dương	2008
70000074	Xác thực chữ ký bằng mô hình Markov ẩn	Tôn Quang Toại	2008
70000073	Ứng dụng phương pháp lập luận suy diễn mờ xây dựng hệ hỗ trợ ra quyết định chẩn đoán bệnh	Văn Thế Thành	2008
70000072	Ẩn thông tin trên dữ liệu đa truyền thông (Multimedia Data Hiding)	Trần Văn Thành	2008
70000071	Hệ thống hỗ trợ phân tích báo cáo tài chính doanh nghiệp	Nguyễn Thị Thanh	2008
70000070	Xây dựng hệ trích chọn nội dung trang web tiếng Việt	Trịnh Quốc Sơn	2008
70000069	An toàn thông tin và các giải pháp nâng cao bảo mật thương mại điện tử	Huỳnh Lê Duy Phúc	2008
70000068	Ứng dụng giải thuật di truyền khám phá tri thức trong quy trình quản lý nghiệp vụ	Tiêu Đông Nhơn	2008
70000067	Xây dựng một mô hình hệ thống Multi-Agent và ứng dụng trong E-Learning	Nguyễn Trần Minh Khuê	2008
70000066	Phép thu gọn lược đồ quan hệ	Lê Ngọc Hưng	2008
70000065	Ứng dụng bản đồ tự tổ chức trong quản lý chất lượng dịch vụ truyền tải mạng điện thoại di động GSM	Lê Đức Hiếu	2008
70000064	Ứng dụng khai phá dữ liệu để tìm luật hỗ trợ ra quyết định trong quản lý tên miền .VN	Trần Đức Hạnh	2008
70000063	Khám phá các mối quan hệ và ảnh hưởng trên Gene	Lê Văn Hạnh	2008
70000062	Phương pháp cập nhật luật lai cho cơ sở luật	Nguyễn Khắc Định	2008
70000061	Xây dựng hệ phục vụ tự động trên tổng đài VoIP ASTERISK	Huỳnh Phú Trung	2008
70000060	Mạng Nơron mờ cho nhận diện ảnh đối tượng: Ứng dụng trong thống kê mật độ lưu thông xe	Nguyễn Đông Tùng	2008
70000059	Phát hiện tấn công bằng phân tích hoạt động mạng ứng dụng bản đồ tự tổ chức (SOM)	Trần Ngọc Thanh	2008
70000058	Nghiên cứu, phát triển phương pháp phát hiện và bám đối tượng xác định	Nguyễn Thiện Minh	2008
70000057	Khai mỏ tập dữ liệu lớn với giải thuật máy học véctơ hỗ trợ	Ngô Đức Lưu	2008
70000056	Nghiên cứu các thuật toán tìm luật phân lớp dựa vào luật kết hợp	Nguyễn Thị Thúy Loan	2008
70000055	Ứng dụng công nghệ tri thức để xây dựng chương trình lựa chọn nguyên liệu chế biến bữa ăn dinh dưỡng hợp sở thích	Lâm Thị Hoà Bình	2008
70000054	Nghiên cứu các thuật toán về mã hóa bất đối xứng và ứng dụng trong các hệ thống trưng cầu ý kiến và bầu cử từ xa	Nguyễn Vũ Huyền Trang	2008
70000053	Xây dựng hệ thống lọc thư rác thông minh và phân loại thư điện tử	Trần Minh Vương	2007
70000052	Ứng dụng khai khoáng dữ liệu trong việc phân loại văn bản	Bùi Trần Quang Vũ	2007
70000051	Nghiên cứu về tài liệu ảo và ứng dụng	Nguyễn Anh Tuấn	2007
70000050	Hệ thống nhận dạng và phân loại văn bản	Huỳnh Tân Trung	2007
70000049	Xây dựng công cụ hỗ trợ kinh doanh tại siêu thị miễn thuế thế kỷ vàng	Phan Mạnh Thường	2007
70000048	Nghiên cứu và phát triển một mô hình tri thức dạng hàm	Đinh Xuân Thọ	2007
70000047	Khai phá dữ liệu khách hàng bưu điện Cần Thơ	Trần Văn Thiện	2007
70000046	Điều khiển tín hiệu đèn giao thông bằng phương pháp luận lý mờ và cơ chế tự học	Lê Ngọc Thạch	2007
70000045	Phân tích tự động đồng sở chỉ trong văn bản tiếng Anh và tiếng Việt	Nguyễn Huỳnh Tri Quốc	2007
70000044	Dự đoán chức năng của protein dựa trên mạng các tương tác protein	Phạm Đằng Phương	2007
70000043	Xây dựng mô hình tính toán độ tương tự ngữ nghĩa văn bản và ướng dụng	Trần Bá Nhiệm	2007
70000042	Nghiên cứu mô hình cơ sở dữ liệu quan hệ mờ	Huỳnh Hữu Nghĩa	2007
70000041	Nghiên cứu về RDF và ứng dụng để thiết kế web ngữ nghĩa điển hình của Trường Đại học Marketing	Lê Đình Ngân	2007
70000040	Sử dụng mô hình Markov ẩn để dự báo chuỗi tài chánh	Phan Chánh Minh	2007
70000039	Sử dụng các kỹ thuật khai phá dữ liệu để tìm các quy luật tương tác protein - protein trong mạng tương tác proteins	Hồ Quang Khải	2007
70000038	Xây dựng và phát triển hệ chuẩn đoán tự động điện tâm đồ (ECG - Electrocardiograph)	Phạm Thị Mai Huyền	2007
70000037	Xây dựng mô hình ứng dụng mạng Bayes để dự đoán tương tác Protein và Prontein từ dữ liệu Gene	Nguyễn Anh Huy	2007
70000036	Xây dựng hệ thống thu thập và phân loại báo điên tử	Nguyễn Thị Phương Hoa	2007
70000035	Trích chọn đặc trưng ảnh mặt người bằng PCA và ICA	Trần Trọng Hiếu	2007
70000034	Nghiên cứu hệ thống tính toán lưới (Grid Computing) và ứng dụng vào giải các bài toán đòi hỏi lượng dữ liệu và tính toán lớn	Huỳnh Nhạc Dương	2007
70000033	Ứng dụng công nghệ phân loại văn bản xây dựng bộ lọc Web	Dương Đình Dũng	2007
70000032	Bảo mật và phân quyền trên môi trường lưới	Nguyễn Minh Cang	2007
70000031	Hệ thống nhận dạng và phân loại văn bản	Trần Thái Bình	2007
70000030	Một mô hình hệ thống Multi - Agents và ontology cho hệ truy vấn cơ sở tri thức COKB	Nguyễn Thị Trâm Anh	2007
70000029	Tìm hiểu một số vấn đề về tối ưu hóa truy vấn trên cơ sở dữ liệu phân tán	Nguyễn Thị Vân Anh	2007
70000028	Tối ưu hóa cây nhị phân n chiều với thông tin chứa ở các lá trên tập khóa vô hạn	Vũ Hùng Cường	2007
70000027	Thuật toán phân rã lớp thông tin có cấu trúc dạng cây nhị phân với thông tin chứa ở đỉnh trong tập khóa hữu hạn	Nguyễn Quang Vinh	2007
70000026	Nghiên cứu hệ quản trị CSDL QSLServer2000. Ứd xây dựng phần mềm quản lý nhân sự và quản lý tài sản qua mạng các trường ĐH	Đỗ Văn Sang	2007
70000025	Các phép toán hình thái và ứng dụng	Trịnh Như Ngọc	2007
70000024	Thủy vân với bản quyền và các thông tin mật trên file ảnh	Vũ Tiến Dũng	2007
70000023	Mật mã và các vấn đề an ninh thông tin	Đỗ Đình Quang	2007
70000022	Ứng dụng kỹ thuật khai thác đồ thị vào lĩnh vực phân lớp văn bản tiếng Việt	Trịnh Minh Tuấn	2007
70000021	Xây dựng hệ thống hỗ trợ tư vấn cho thương mại điện tử	Dương Thanh Tịnh	2007
70000020	Nhận dạng mặt người dùng SVM và mạng Nơron	Nguyễn Thành Thái	2007
70000019	Sử dụng phương pháp CBR(Case Base Reason )xác định chi phí rủi ro trong quy trình ước lượng chi phí phần mềm	Tôn Long Phước	2007
70000018	Hệ thống giới thiệu sản phẩm dựa trên việc khai thác trang Web thương mại	Trần Bình Long	2007
70000017	Gom cụm văn bản bằng mạng SOM dựa trên các cụm danh từ trong văn bản tiếng Việt	Mai Xuân Hùng	2007
70000016	Sáng tác âm nhạc với thuật giải di truyền	Huỳnh Tổ Hạp	2007
70000015	Nghiên cứu ứng dụng kỹ thuật khai mỏ đồ thị (Graph Mining)vào việc nhận dạng đặc tính dựa trên cấu trúc của protein	Phạm Quốc Đàm	2007
70000014	Tìm hiểu, thiết kế và xây dựng chương trình máy tính khai thác (truy vấn) thông tin trên web	Quách Anh Dũng	2007
70000013	Ứng dụng kỹ thuật khai phá song song, khai phá luật kết hợp-hỗ trợ sản xuất kinh doanh tại bưu điện Ninh Thuận	Hoàng Văn Phú Bình	2007
70000012	Nhận dạng ảnh vân tay sử dụng mô hình Markov, mạng Kohonen và thuật toán ghép điểm	Lê Hưng Ban	2007
70000303	Một số thuật toán theo vết nguồn gốc áp dụng trong nhà kho tuyển sinh.	Lê Thị Minh Nguyện	2006
70000245	Ứng dụng các kỹ thuật data mining hỗ trợ cho E-commerce.	Trần Đình Nghĩa	2006
70000244	Khám phá phần tử bị diệt trong cơ sở dữ liệu	Đinh Quyết Thắng	2006
70000011	Bài toán khai phá dữ liệu bằng cây quyết định	Trần Minh Tuyến	2006
70000010	Một số phương pháp khai phá dữ liệu dựa vào luật kết hợp	Lê Thị Bích Phượng	2006
70000009	Nghiên cứu một số phương pháp phát hiện biên và ứng dụng	Nguyễn Mai Anh	2006
70000008	Hệ cơ sở tri thức cho cấu trúc đại số	Tô Vĩnh Sơn	2006
70000007	Hệ thống tư vấn tài nguyên học tập	Bùi Thanh Tuấn	2006
70000006	Sử dụng SOM (Self-Organizing Map) xây dựng mô hình đánh giá tài chính doanh nghiệp	Nguyễn Khắc Thìn	2006
70000005	Thuật giải tiến hóa (EA) với bài toán tìm phương án thi công tối ưu trong xây dựng	Phạm Đức Thành	2006
70000004	Nghiên cứu và giải quyết bài toán tiên đoán cấu trúc 3D của protein	Bùi Thanh Hiếu	2006
70000003	Nghiên cứu xử lý tiếng Nhật và tiếng Việt trên máy tính. Bước đầu xây dựng ứng dụng dịch xuôi Nhật - Việt	Nguyễn Sơn Hoa	2006
70000002	Nghiên cứu hệ quản trị CSDL được khai thác trong thời gian thực ứng dụng trong tra cứu điện thoại qua hệ di động	Giang Minh Đức	2006
70000001	Ứng dụng web ngữ nghĩa vào phân tích thông tin trực tuyến tại Bưu điện Bến Tre	Nguyễn Văn Triều Dâng	2006
70000298	Ứng dụng mô hình Markov và cây quyết định trong một số bài toán dự đoán	Nguyễn Thanh Tùng	2004
150070000485	Nghiên cứu một tiếp cận điều khiển đèn tín hiệu giao thông thông minh tại một giao lộ	Trần Vạn Thúy Diễm	2016
70000302	Ẩn dữ liệu ảnh 3D	Nguyễn Bảo Bình	2006
70000296	Hệ thống quản lý tiền lương trên mạng Wan tại bưu điện tỉnh Sóc Trăng	Nguyễn Trí Nghĩa	
70000291	Nâng cao hiệu suất vấn tin trên CSDL đa phương tiện	Nguyễn Thị Thanh Nga	2012
`.trim();

function guessThesisMajor(title: string): string {
  const t = title.toLowerCase();
  if (/deepfake|trí tuệ nhân tạo|học sâu|deep learning|mạng nơ|cnn|transformer|yolo|bert|ngôn ngữ lớn|llm|thị giác|nhận dạng|nhận diện|phân đoạn|chatbot|xai|tạo sinh/.test(t)) return 'TTNT';
  if (/bảo mật|an ninh|an toàn|mã độc|malware|xâm nhập|ids|lỗ hổng|tấn công|ddos|owasp|lượng tử|mã hóa|giấu tin|thủy vân|chứng thực|phishing|lừa đảo|honeypot/.test(t)) return 'ATTT';
  if (/dữ liệu lớn|big data|khai phá|data mining|dự báo|phân tích dữ liệu|lakehouse|chuỗi thời gian|gom cụm|luật kết hợp|tập phổ biến/.test(t)) return 'KHDL';
  if (/iot|nhúng|esp32|lora|fpga|bluetooth|rfid|mạng cảm biến|sdn|5g|mimo|mạng không dây|camera/.test(t)) return 'MMT';
  if (/cơ sở dữ liệu|nosql|mongodb|kho dữ liệu|erp|hệ thống thông tin|gis|ontology|tri thức|truy vấn/.test(t)) return 'HTTT';
  if (/thương mại điện tử|chứng khoán|bất động sản|tài chính|ngân hàng|marketing|bảo hiểm|doanh thu|khách hàng/.test(t)) return 'TMDT';
  if (/kiểm thử|phần mềm|cocomo|giao diện|web|android|mobile/.test(t)) return 'KTPM';
  if (/đa phương tiện|video|âm thanh|giọng nói|blender|3d|hình ảnh|mpeg/.test(t)) return 'TTDPT';
  return 'KHMT';
}

function isEnglishTitle(title: string): boolean {
  return !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(title);
}

const seenBarcodes = new Set<string>();
const authorIdByName = new Map<string, number>();
let nextAuthorId = 501;
let nextLinkId = 1001;

export const SEED_THESIS_AUTHORS: TacGia[] = [];
export const SEED_THESIS_BOOKS: SachRow[] = [];
export const SEED_THESIS_BOOK_AUTHORS: SachTacGiaRow[] = [];

let idx = 1;
for (const line of RAW_THESES_TSV.split('\n')) {
  const parts = line.split('\t');
  if (parts.length < 3) continue;
  const barcode = parts[0].trim();
  const title = parts[1].trim().replace(/\s+/g, ' ');
  const authorRaw = parts[2].trim().replace(/\.$/, '').replace(/\s+/g, ' ');
  const year = Number(parts[3]?.trim()) || 2012;
  if (!barcode || !title || seenBarcodes.has(barcode)) continue;
  seenBarcodes.add(barcode);

  const maSach = `LV${String(idx++).padStart(3, '0')}`;
  SEED_THESIS_BOOKS.push({
    MaSach: maSach,
    TenSach: title,
    MaTheLoai: 'C',
    NamXuatBan: year,
    NhaXuatBan: 'ĐH CNTT – ĐHQG-HCM',
    NgayNhap: `${Math.min(Math.max(year, 2004), 2026)}-11-12`,
    TriGia: 0,
    MaNganh: guessThesisMajor(title),
    NgonNgu: isEnglishTitle(title) ? 'Tiếng Anh' : 'Tiếng Việt',
    NguonTaiLieu: 'Luận văn UIT',
    NoiBat: false,
    MaKeSach: `KHO-LV-${year}`,
    MoTa: `Barcode: ${barcode} · Luận văn UIT năm ${year} (Đọc tại chỗ).`,
  });

  if (authorRaw) {
    const key = authorRaw.toLowerCase();
    let authorId = authorIdByName.get(key);
    if (!authorId) {
      authorId = nextAuthorId++;
      authorIdByName.set(key, authorId);
      SEED_THESIS_AUTHORS.push({ MaTacGia: authorId, TenTacGia: authorRaw });
    }
    SEED_THESIS_BOOK_AUTHORS.push({
      MaSachTacGia: nextLinkId++,
      MaSach: maSach,
      MaTacGia: authorId,
    });
  }
}
