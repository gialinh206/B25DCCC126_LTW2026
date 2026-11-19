import { GRADES, RANKS } from "./data";

export const getGrade = (score) => {
  const numericScore = Number(score);
  return (
    GRADES.find((item) => numericScore >= item.min) || GRADES[GRADES.length - 1]
  );
};

export const getRank = (gpa) => {
  const found = RANKS.find((item) => gpa >= item.min);
  return found ? found.title : "Yếu";
};

export const calcStats = (courses) => {
  if (!Array.isArray(courses) || courses.length === 0) {
    return {
      count: 0,
      credits: 0,
      points: 0,
      gpa: "0.00",
      rank: "Chưa xếp loại",
    };
  }

  const count = courses.length;
  const credits = courses.reduce((sum, item) => sum + Number(item.credits), 0);
  const points = courses.reduce((sum, item) => {
    const grade = getGrade(item.score);
    return sum + Number(item.credits) * grade.point;
  }, 0);

  const roundedGpa =
    credits > 0 ? Math.round((points / credits) * 100) / 100 : 0;
  const gpa = roundedGpa.toFixed(2);
  const rank = getRank(roundedGpa);

  return {
    count,
    credits,
    points,
    gpa,
    rank,
  };
};

export const calcRequired = (courses, targetStr, remainingStr) => {
  const trimmedTarget = String(targetStr).trim();
  const trimmedRemaining = String(remainingStr).trim();

  const target = Number(trimmedTarget);
  const remainingNum = Number(trimmedRemaining);

  const isTargetValid =
    trimmedTarget !== "" && !Number.isNaN(target) && target >= 0 && target <= 4;

  const isRemainingValid =
    trimmedRemaining !== "" &&
    /^-?\d+$/.test(trimmedRemaining) &&
    Number.isInteger(remainingNum) &&
    remainingNum >= 1;

  if (!isTargetValid || !isRemainingValid) {
    return "Hãy nhập GPA mục tiêu (0-4) và số tín chỉ còn lại (từ 1)";
  }

  const { credits: currentCredits, points: currentPoints } = calcStats(courses);
  const need =
    (target * (currentCredits + remainingNum) - currentPoints) / remainingNum;

  if (need > 4) {
    return "Không thể đạt mục tiêu này";
  }

  if (need <= 0) {
    return "Bạn đã đạt mục tiêu";
  }

  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${remainingNum} tín chỉ còn lại`;
};
