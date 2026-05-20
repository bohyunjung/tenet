import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders record button', () => {
  const { getByRole } = render(<App />);
  const button = getByRole('button', { name: /start recording/i });
  expect(button).toBeInTheDocument();
});
