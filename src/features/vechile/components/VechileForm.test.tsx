import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import VechileForm from "./VechileForm";
import { useVehicleUpload } from "../hooks/useVehicleUpload";

vi.mock("../hooks/useVehicleUpload", () => ({
  useVehicleUpload: vi.fn(),
}));

vi.mock("../../../assets/logo-with-name.svg", () => ({
  default: "logo.svg",
}));

const mockUploadVehicle = vi.fn();
const mockedHook = vi.mocked(useVehicleUpload);

describe("VechileForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedHook.mockReturnValue({
      uploadVehicle: mockUploadVehicle,
      isLoading: false,
      error: null,
      data: null,
    });
  });

  it("renders form elements", () => {
    render(<VechileForm />);
    expect(screen.getByRole("heading", { level: 2, name: /Vechile Selection/i })).toBeInTheDocument();
    expect(screen.getByText("Quick select")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<VechileForm />);
    const submitBtn = screen.getByRole("button", { name: /Submit/i });

    await user.click(submitBtn);

    expect(await screen.findByText("Please select a make")).toBeInTheDocument();
    expect(screen.getByText("Please select a model")).toBeInTheDocument();
    expect(screen.getByText("Please select a badge")).toBeInTheDocument();
    expect(
      screen.getByText("Please upload a logbook file"),
    ).toBeInTheDocument();
    expect(mockUploadVehicle).not.toHaveBeenCalled();
  });

  it("submits form successfully with all data using quick select", async () => {
    const user = userEvent.setup();
    render(<VechileForm />);

    const quickSelectBtn = screen.getByRole("button", { name: /ford/i });
    await user.click(quickSelectBtn);

    const file = new File(["log text"], "logbook.txt", { type: "text/plain" });

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitBtn = screen.getByRole("button", { name: /Submit/i });
    await user.click(submitBtn);

    expect(mockUploadVehicle).toHaveBeenCalledTimes(1);
    expect(mockUploadVehicle).toHaveBeenCalledWith(
      expect.objectContaining({
        fileContent: "log text",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Vehicle details and logbook uploaded successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("validates file extension", async () => {
    render(<VechileForm />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const invalidFile = new File(["hello"], "logbook.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(
      await screen.findByText("Only .txt files are allowed"),
    ).toBeInTheDocument();
  });

  it("displays loading spinner during submission", () => {
    mockedHook.mockReturnValue({
      uploadVehicle: mockUploadVehicle,
      isLoading: true,
      error: null,
      data: null,
    });

    render(<VechileForm />);
    
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();
  });
});
