import { render, screen, fireEvent } from "@testing-library/react";
import Form from "../components/Form";

describe("Form", () => {
  test("מציג שדות טקסט", () => {
    render(<Form />);
    expect(screen.getByLabelText("שם"));
    expect(screen.getByLabelText("אימייל"));
  });

  test("שליחת טופס שולחת נתונים", () => {
    const handleSubmit = jest.fn();
    render(<Form onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByLabelText("שם"), { target: { value: "דני" } });
    fireEvent.change(screen.getByLabelText("אימייל"), { target: { value: "dani@example.com" } });
    fireEvent.click(screen.getByText("שלח"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
