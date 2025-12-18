import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../components/Button";

describe("Button", () => {
  test("מציג טקסט נכון", () => {
    render(<Button text="לחץ כאן" onClick={() => {}} />);
    expect(screen.getByText("לחץ כאן")).toBeInTheDocument();
  });

  test("לחיצה מפעילה onClick", () => {
    const handleClick = jest.fn();
    render(<Button text="לחץ כאן" onClick={handleClick} />);
    fireEvent.click(screen.getByText("לחץ כאן"));
    expect(handleClick).toHaveBeenCalled();
  });
});
