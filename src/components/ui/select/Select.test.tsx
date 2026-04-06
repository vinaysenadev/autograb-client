import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Select } from "./Select";

describe("Select Component", () => {
  it("renders with placeholder if no value is provided", () => {
    render(
      <Select value={null} onChange={() => {}}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="1">Option 1</Select.Item>
        </Select.Content>
      </Select>,
    );
    expect(screen.getByText("Select Option")).toBeInTheDocument();
  });

  it("renders with provided value", () => {
    render(
      <Select value="Option 1" onChange={() => {}}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="Option 1">Option 1</Select.Item>
        </Select.Content>
      </Select>,
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("opens options on click", async () => {
    const user = userEvent.setup();
    render(
      <Select value={null} onChange={() => {}}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="1">Option 1</Select.Item>
        </Select.Content>
      </Select>,
    );
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select value={null} onChange={handleChange}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="1">Option 1</Select.Item>
          <Select.Item value="2">Option 2</Select.Item>
        </Select.Content>
      </Select>,
    );
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    const option = screen.getByText("Option 2");
    await user.click(option);
    expect(handleChange).toHaveBeenCalledWith("2");
  });

  it("shows error text if provided", () => {
    render(
      <Select value={null} onChange={() => {}} error="Error Message">
        <Select.Trigger />
      </Select>,
    );
    expect(screen.getByText("Error Message")).toBeInTheDocument();
  });
});
