import { render, screen, fireEvent } from "@testing-library/react";
import CameraCapture from "../components/CameraCapture";

describe("CameraCapture", () => {
  test("מציג כפתור צילום", () => {
    render(<CameraCapture />);
    expect(screen.getByText("צלם תמונה")).toBeInTheDocument();
  });

  test("לחיצה מפעילה צילום (mock)", () => {
    render(<CameraCapture />);
    const button = screen.getByText("צלם תמונה");
    fireEvent.click(button);
    // כאן אפשר להוסיף בדיקה לפעולה שנעשית אחרי הלחיצה
  });
});
