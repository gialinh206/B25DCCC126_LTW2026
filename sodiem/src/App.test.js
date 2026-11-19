import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { NoticeProvider } from "./context/NoticeContext";
import { ThemeProvider } from "./context/ThemeContext";
import { store } from "./store";

test("loads and displays courses from the sample data endpoint", async () => {
  const courses = [
    {
      id: 1,
      code: "MH101",
      name: "Giải tích 1",
      credits: 3,
      semester: "Học kỳ 1",
      score: 7.5,
    },
  ];
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(courses),
  });

  render(
    <Provider store={store}>
      <ThemeProvider>
        <NoticeProvider>
          <App />
        </NoticeProvider>
      </ThemeProvider>
    </Provider>,
  );

  expect(await screen.findByText("MH101")).toBeInTheDocument();
  expect(screen.getByText("Số môn: 1")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    "/data/courses.json",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );

  const darkModeButton = screen.getByRole("button", {
    name: "Chuyển sang chế độ tối",
  });
  expect(darkModeButton.querySelector("path")).toBeInTheDocument();
  fireEvent.click(darkModeButton);

  expect(document.querySelector(".app")).toHaveClass("dark");
  const lightModeButton = screen.getByRole("button", {
    name: "Chuyển sang chế độ sáng",
  });
  expect(lightModeButton.querySelector("circle")).toBeInTheDocument();
});
