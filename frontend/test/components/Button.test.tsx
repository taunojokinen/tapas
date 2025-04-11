import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../src/components/Button";

describe("Button Component", () => {
  it("renders the button with the correct label", () => {
    // Render the Button component directly without needing act
    render(<Button label="Click Me" onClick={() => {}} />);

    // Assert that the button with the correct label is in the document
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls the onClick handler when clicked", () => {
    // Mock the onClick handler
    const handleClick = jest.fn();

    // Render the Button component with the mock handler
    render(<Button label="Click Me" onClick={handleClick} />);

    // Find the button element
    const button = screen.getByText("Click Me");

    // Simulate a click event
    fireEvent.click(button);

    // Assert that the onClick handler was called once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
