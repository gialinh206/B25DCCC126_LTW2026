import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

test("renders the student management app and filters by student category", () => {
  render(<App />);

  expect(screen.getByText(/QUẢN LÝ ĐIỂM SINH VIÊN/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Giỏi \(≥ 8\.0\)/i }));
  expect(screen.getByText(/Ngô Gia Linh/i)).toBeInTheDocument();
  expect(screen.queryByText(/Nguyễn Thị A/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Trượt \(< 4\.0\)/i }));
  expect(screen.getByText(/Nguyễn Thị A/i)).toBeInTheDocument();
});
