import React from 'react';
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { WrappedApp, App } from '../App';

describe('NotFound', () => {
  it('Renders not found page', () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/sdsd']}>
        <App />
      </MemoryRouter>
    );

    // Act

    // Expect
    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Not Found');
  });
});
