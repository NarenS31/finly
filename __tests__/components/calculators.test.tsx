import { fireEvent, render, screen } from '@testing-library/react';
import { CompoundInterestCalc } from '@/components/interactive/compound-interest-calc';
import { BudgetAllocatorCalc } from '@/components/interactive/budget-allocator-calc';
import { SavingsGoalCalc } from '@/components/interactive/savings-goal-calc';
import { DebtPayoffCalc } from '@/components/interactive/debt-payoff-calc';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Legend: () => null,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
}));

jest.mock('@/lib/store/currency-store', () => ({
  useCurrencyStore: (selector: (state: { currency: { symbol: string; exampleIncome: number } }) => unknown) =>
    selector({ currency: { symbol: '$', exampleIncome: 2000 } }),
}));

describe('CompoundInterestCalc', () => {
  test('renders sliders and updates the final amount when years change', () => {
    render(<CompoundInterestCalc />);

    const years = screen.getByLabelText(/years/i);
    const before = screen.getByText(/final amount:/i).textContent;

    fireEvent.change(years, { target: { value: '30' } });

    expect(screen.getByLabelText(/principal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/annual rate/i)).toBeInTheDocument();
    expect(screen.getByText(/final amount:/i).textContent).not.toBe(before);
  });
});

describe('BudgetAllocatorCalc', () => {
  test('renders budget controls and shows a warning when savings is too low', () => {
    render(<BudgetAllocatorCalc />);

    const savings = screen.getByLabelText(/savings/i);
    const emergency = screen.getByLabelText(/emergency fund/i);

    fireEvent.change(savings, { target: { value: '0' } });
    fireEvent.change(emergency, { target: { value: '0' } });

    expect(screen.getByText(/budget allocator/i)).toBeInTheDocument();
    expect(screen.getByText(/under 10%/i)).toBeInTheDocument();
  });
});

describe('SavingsGoalCalc', () => {
  test('renders goal inputs and updates the timeline when monthly saving changes', () => {
    render(<SavingsGoalCalc />);

    const monthly = screen.getByLabelText(/monthly saving/i);
    const before = screen.getByText(/months to goal:/i).textContent;

    fireEvent.change(monthly, { target: { value: '250' } });

    expect(screen.getByLabelText(/goal amount/i)).toBeInTheDocument();
    expect(screen.getByText(/months to goal:/i).textContent).not.toBe(before);
  });
});

describe('DebtPayoffCalc', () => {
  test('renders debt inputs and changes payoff output when extra payment increases', () => {
    render(<DebtPayoffCalc />);

    const extra = screen.getByLabelText(/extra payment/i);
    const before = screen.getAllByText(/est. interest:/i)[1].textContent;

    fireEvent.change(extra, { target: { value: '120' } });

    expect(screen.getByLabelText(/balance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apr/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minimum payment/i)).toBeInTheDocument();
    expect(screen.getAllByText(/est. interest:/i)[1].textContent).not.toBe(before);
  });
});
