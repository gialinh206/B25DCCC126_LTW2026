export const SEMESTERS = ["Học kỳ 1", "Học kỳ 2", "Học kỳ 3"];
export const CREDIT_OPTIONS = [1, 2, 3, 4];

export const GRADES = [
  { min: 9.0, letter: "A+", point: 4.0 },
  { min: 8.5, letter: "A", point: 3.7 },
  { min: 8.0, letter: "B+", point: 3.5 },
  { min: 7.0, letter: "B", point: 3.0 },
  { min: 6.5, letter: "C+", point: 2.5 },
  { min: 5.5, letter: "C", point: 2.0 },
  { min: 5.0, letter: "D+", point: 1.5 },
  { min: 4.0, letter: "D", point: 1.0 },
  { min: 0, letter: "F", point: 0 },
];

export const RANKS = [
  { min: 3.6, title: "Xuất sắc" },
  { min: 3.2, title: "Giỏi" },
  { min: 2.5, title: "Khá" },
  { min: 2.0, title: "Trung bình" },
  { min: 0, title: "Yếu" },
];

export const formatPoint = (p) => p.toFixed(1);
