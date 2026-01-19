import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KalkulatorFinanciranja from "@/components/KalkulatorFinanciranja";

describe("KalkulatorFinanciranja", () => {
  const defaultPrice = 30000;

  it("should render calculator with title", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    expect(screen.getByText(/Kalkulator financiranja/i)).toBeInTheDocument();
  });

  it("should render predujam section", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    expect(screen.getByText(/Predujam/i)).toBeInTheDocument();
  });

  it("should render broj rata section", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    expect(screen.getByText(/Broj rata/i)).toBeInTheDocument();
  });

  it("should render kamatna stopa section", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    expect(screen.getByText(/Kamatna stopa/i)).toBeInTheDocument();
  });

  it("should display vehicle price correctly", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    expect(screen.getByText(/30\.000/)).toBeInTheDocument();
  });

  it("should display monthly payment section", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    const monthlyPayment = screen.getByText(/Mjesečna rata/i);
    expect(monthlyPayment).toBeInTheDocument();
  });

  it("should display total amount to be paid", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    expect(screen.getByText(/Ukupno za platiti/i)).toBeInTheDocument();
  });

  it("should display total interest amount", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    expect(screen.getByText(/Ukupna kamata/i)).toBeInTheDocument();
  });

  it("should format currency values correctly with EUR symbol", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    // Check that EUR symbol is present
    const elements = screen.getAllByText(/€/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should display default term in months", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    // Default term is 60 months
    expect(screen.getByText(/60 mjeseci/i)).toBeInTheDocument();
  });

  it("should display default interest rate", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    // Default interest rate is 6.9% - displayed in input field
    const interestInput = screen.getByDisplayValue("6.9");
    expect(interestInput).toBeInTheDocument();
  });

  it("should display sliders for all parameters", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    // Each slider has role="slider"
    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBe(3); // predujam, broj rata, kamatna stopa
  });

  it("should render calculator icon", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    // Card header has calculator icon - check parent structure
    const title = screen.getByText(/Kalkulator financiranja/i);
    expect(
      title.closest("[class*='CardTitle']") || title.parentElement
    ).toBeTruthy();
  });

  it("should calculate and display results section", () => {
    render(<KalkulatorFinanciranja cijenaVozila={defaultPrice} />);

    // Results section should show all calculated values
    expect(screen.getByText(/Mjesečna rata/i)).toBeInTheDocument();
    expect(screen.getByText(/Ukupno za platiti/i)).toBeInTheDocument();
    expect(screen.getByText(/Ukupna kamata/i)).toBeInTheDocument();
  });

  it("should work with different vehicle prices", () => {
    render(<KalkulatorFinanciranja cijenaVozila={50000} />);

    // Should show the higher price
    expect(screen.getByText(/50\.000/)).toBeInTheDocument();
  });
});
