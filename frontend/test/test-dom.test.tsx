// frontend/src/test/test-dom.test.ts
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('tarkistaa jest-dom matcherit', () => {
  render(<div>Moikka</div>);
  expect(screen.getByText('Moikka')).toBeInTheDocument();
});
