import { render } from '@testing-library/react';
import { Finn } from '@/components/mascot/finn';

describe('Finn', () => {
  test('renders an svg mascot', () => {
    const { container } = render(<Finn />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  test('applies the requested size', () => {
    const { container } = render(<Finn size={64} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '64');
    expect(svg).toHaveAttribute('height', '64');
  });

  test('merges a custom class name onto the svg', () => {
    const { container } = render(<Finn className="test-class" />);
    expect(container.querySelector('svg')).toHaveClass('test-class');
  });
});
