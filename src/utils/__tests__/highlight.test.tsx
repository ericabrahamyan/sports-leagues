import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { render } from '@/test-utils';
import { highlightText } from '@/utils/highlight';

function Render({ text, q }: { text: string; q: string }) {
  return <div data-testid="root">{highlightText(text, q)}</div>;
}

describe('highlightText', () => {
  it('wraps matches in <mark> and escapes regex chars', () => {
    render(<Render text="C++ | C# | C" q="C+" />);
    const root = screen.getByTestId('root');
    expect(root.querySelectorAll('mark').length).toBe(1);
  });

  it('no highlight when searchTerm is empty', () => {
    render(<Render text="Premier League" q="" />);
    expect(screen.getByTestId('root').querySelector('mark')).toBeNull();
  });
});
