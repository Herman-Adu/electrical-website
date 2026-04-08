import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MultiStepFormContainer } from "../../features/service-request/components/organisms/multi-step-form-container";

const mocks = vi.hoisted(() => {
  const mockResetForm = vi.fn();
  const mockGoToStep = vi.fn();
  const clearStorage = vi.fn();

  const useFormStoreMock = Object.assign(
    vi.fn(() => ({
      currentStep: 5,
      goToStep: mockGoToStep,
      resetForm: mockResetForm,
    })),
    {
      persist: {
        clearStorage,
      },
    },
  );

  return {
    mockResetForm,
    mockGoToStep,
    clearStorage,
    useFormStoreMock,
  };
});

vi.mock("../../features/service-request/hooks/use-form-store", () => ({
  useFormStore: mocks.useFormStoreMock,
}));

vi.mock("@/components/molecules/step-indicator", () => ({
  StepIndicator: () => <div data-testid="step-indicator" />,
}));

vi.mock("@/components/animations/power-surge", () => ({
  PowerSurge: () => <div data-testid="power-surge" />,
}));

vi.mock("@/components/molecules/unified-success-message", () => ({
  UnifiedSuccessMessage: ({
    referenceId,
    onStartNew,
  }: {
    referenceId: string;
    onStartNew: () => void;
  }) => (
    <div data-testid="service-success">
      <span>{referenceId}</span>
      <button type="button" onClick={onStartNew}>
        Start New
      </button>
    </div>
  ),
}));

vi.mock("@/lib/scroll-to-section", () => ({
  scrollToElementWithOffset: vi.fn(),
}));

vi.mock(
  "../../features/service-request/components/organisms/personal-info-step",
  () => ({ PersonalInfoStep: () => <div /> }),
);
vi.mock(
  "../../features/service-request/components/organisms/service-details-step",
  () => ({ ServiceDetailsStep: () => <div /> }),
);
vi.mock(
  "../../features/service-request/components/organisms/property-info-step",
  () => ({ PropertyInfoStep: () => <div /> }),
);
vi.mock(
  "../../features/service-request/components/organisms/schedule-step",
  () => ({ ScheduleStep: () => <div /> }),
);

vi.mock(
  "../../features/service-request/components/organisms/review-step",
  () => ({
    ReviewStep: ({
      onSubmitSuccess,
    }: {
      onSubmitSuccess: (requestId: string) => void;
    }) => (
      <button type="button" onClick={() => onSubmitSuccess("SR-TEST-001")}>
        Trigger Submit Success
      </button>
    ),
  }),
);

describe("MultiStepFormContainer success transition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.mockResetForm.mockClear();
    mocks.mockGoToStep.mockClear();
    mocks.clearStorage.mockClear();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders success state deterministically after review submit callback", () => {
    render(<MultiStepFormContainer />);

    mocks.mockResetForm.mockClear();
    mocks.clearStorage.mockClear();

    fireEvent.click(
      screen.getByRole("button", { name: "Trigger Submit Success" }),
    );

    expect(screen.getByTestId("service-success")).toBeInTheDocument();
    expect(screen.getByText("SR-TEST-001")).toBeInTheDocument();
    expect(mocks.mockResetForm).toHaveBeenCalledTimes(1);
    expect(mocks.clearStorage).toHaveBeenCalledTimes(1);
  });

  it("returns to form review state after success timeout", () => {
    render(<MultiStepFormContainer />);

    fireEvent.click(
      screen.getByRole("button", { name: "Trigger Submit Success" }),
    );
    expect(screen.getByTestId("service-success")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByRole("button", { name: "Trigger Submit Success" }),
    ).toBeInTheDocument();
  });
});
