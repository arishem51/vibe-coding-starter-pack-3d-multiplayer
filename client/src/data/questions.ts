export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Chủ nghĩa xã hội khoa học do ai sáng lập?",
    options: ["Adam Smith", "C. Mác & Ph. Ăngghen", "V.I. Lênin", "Hêghen"],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Tuyên ngôn của Đảng Cộng sản được công bố năm nào?",
    options: ["1776", "1830", "1848", "1917"],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "Giai cấp vô sản còn được gọi là giai cấp gì?",
    options: ["Tư sản", "Nông dân", "Công nhân", "Tiểu tư sản"],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "\"Mỗi người làm theo năng lực, hưởng theo nhu cầu\" là nguyên tắc của giai đoạn nào?",
    options: ["Chủ nghĩa tư bản", "Chủ nghĩa xã hội", "Chủ nghĩa cộng sản", "Phong kiến"],
    correctIndex: 2,
  },
  {
    id: 5,
    question: "Nhà nước vô sản theo quan điểm Mác-Lênin là gì?",
    options: [
      "Nhà nước dân chủ tư sản",
      "Nhà nước chuyên chính vô sản",
      "Nhà nước phong kiến",
      "Nhà nước xã hội chủ nghĩa thuần túy",
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: "\"Bộ Tư bản\" (Das Kapital) do ai viết?",
    options: ["Ph. Ăngghen", "V.I. Lênin", "C. Mác", "Hồ Chí Minh"],
    correctIndex: 2,
  },
  {
    id: 7,
    question: "Cách mạng Tháng Mười Nga xảy ra năm nào?",
    options: ["1905", "1917", "1921", "1945"],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "Theo chủ nghĩa Mác, lịch sử xã hội loài người là lịch sử của đấu tranh giữa các:",
    options: ["Quốc gia", "Giai cấp", "Dân tộc", "Tôn giáo"],
    correctIndex: 1,
  },
  {
    id: 9,
    question: "Ai là người phát triển chủ nghĩa Mác thành chủ nghĩa Mác-Lênin?",
    options: ["Trotsky", "Stalin", "V.I. Lênin", "Mao Trạch Đông"],
    correctIndex: 2,
  },
  {
    id: 10,
    question: "Đảng Cộng sản Việt Nam ra đời ngày tháng năm nào?",
    options: ["3/2/1930", "19/8/1945", "2/9/1945", "30/4/1975"],
    correctIndex: 0,
  },
  {
    id: 11,
    question: "Mâu thuẫn cơ bản của xã hội tư bản chủ nghĩa là gì?",
    options: [
      "Mâu thuẫn giữa các quốc gia",
      "Mâu thuẫn giữa tư sản và tiểu tư sản",
      "Mâu thuẫn giữa tính xã hội hóa sản xuất và chế độ chiếm hữu tư nhân",
      "Mâu thuẫn giữa thành thị và nông thôn",
    ],
    correctIndex: 2,
  },
  {
    id: 12,
    question: "Lực lượng sản xuất và quan hệ sản xuất tạo thành gì?",
    options: ["Kiến trúc thượng tầng", "Phương thức sản xuất", "Hình thái kinh tế", "Cơ sở hạ tầng"],
    correctIndex: 1,
  },
  {
    id: 13,
    question: "Hình thái kinh tế - xã hội cộng sản chủ nghĩa có bao nhiêu giai đoạn?",
    options: ["1", "2", "3", "4"],
    correctIndex: 1,
  },
  {
    id: 14,
    question: "Hồ Chí Minh tìm ra con đường cứu nước vào năm nào?",
    options: ["1911", "1920", "1930", "1945"],
    correctIndex: 1,
  },
  {
    id: 15,
    question: "Phương thức sản xuất tư bản chủ nghĩa dựa trên chế độ sở hữu nào?",
    options: [
      "Sở hữu nhà nước",
      "Sở hữu tập thể",
      "Sở hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất",
      "Sở hữu toàn dân",
    ],
    correctIndex: 2,
  },
  {
    id: 16,
    question: "\"Phép biện chứng duy vật\" là phương pháp triết học của:",
    options: ["Kant", "Hêghen", "Chủ nghĩa Mác-Lênin", "Descartes"],
    correctIndex: 2,
  },
  {
    id: 17,
    question: "Chủ nghĩa xã hội khoa học là bộ phận thứ mấy trong chủ nghĩa Mác-Lênin?",
    options: ["Thứ nhất", "Thứ hai", "Thứ ba", "Thứ tư"],
    correctIndex: 2,
  },
  {
    id: 18,
    question: "Nước nào đầu tiên thành công xây dựng nhà nước xã hội chủ nghĩa?",
    options: ["Trung Quốc", "Cuba", "Việt Nam", "Liên Xô"],
    correctIndex: 3,
  },
  {
    id: 19,
    question: "\"Mỗi người làm theo năng lực, hưởng theo lao động\" là nguyên tắc của giai đoạn nào?",
    options: ["Tư bản chủ nghĩa", "Xã hội chủ nghĩa", "Cộng sản chủ nghĩa", "Phong kiến"],
    correctIndex: 1,
  },
  {
    id: 20,
    question: "Sứ mệnh lịch sử của giai cấp công nhân là gì?",
    options: [
      "Bảo vệ chế độ tư bản",
      "Xóa bỏ chế độ tư bản, xây dựng chủ nghĩa xã hội và cộng sản",
      "Cải cách chế độ phong kiến",
      "Phát triển kinh tế thị trường",
    ],
    correctIndex: 1,
  },
];

export function getRandomQuestion(): Question {
  return questions[Math.floor(Math.random() * questions.length)];
}
