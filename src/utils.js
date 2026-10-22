import { MILESTONES, PRIZES } from "./data";

export const calcPrize = (correctCount, reason) => {
  if (reason === "quit") {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }
  const passedMilestones = MILESTONES.filter((m) => m <= correctCount);
  if (passedMilestones.length === 0) return 0;
  const highestMilestone = passedMilestones[passedMilestones.length - 1];
  return PRIZES[highestMilestone - 1];
};

export const generateAudiencePoll = (
  correctAnswerIndex,
  hiddenOptions = [],
) => {
  const correctPct = Math.floor(Math.random() * 31) + 40;
  let remaining = 100 - correctPct;
  const availableIndices = [0, 1, 2, 3].filter(
    (idx) => idx !== correctAnswerIndex && !hiddenOptions.includes(idx),
  );
  const percentages = [0, 0, 0, 0];
  percentages[correctAnswerIndex] = correctPct;

  availableIndices.forEach((idx, i) => {
    if (i === availableIndices.length - 1) {
      percentages[idx] = remaining;
    } else {
      const value = Math.floor(Math.random() * (remaining + 1));
      percentages[idx] = value;
      remaining -= value;
    }
  });

  return percentages;
};
