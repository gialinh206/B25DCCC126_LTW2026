import React from "react";
import { PRIZES, MILESTONES, formatMoney } from "../data";

const MoneyLadder = ({ currentIndex }) => (
  <div className="money-ladder">
    <h4>Thang tiền</h4>
    <ul>
      {[...PRIZES]
        .map((prize, idx) => {
          const step = idx + 1;
          const isCurrent = idx === currentIndex;
          const isMilestone = MILESTONES.includes(step);

          return (
            <li
              key={step}
              className={
                isCurrent ? "money-item current" : isMilestone ? "money-item milestone" : "money-item"
              }
            >
              <span className="money-step">Câu {step}</span>
              <span>{formatMoney(prize)}</span>
            </li>
          );
        })
        .reverse()}
    </ul>
  </div>
);

export default MoneyLadder;
