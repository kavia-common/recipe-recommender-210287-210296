import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeSearchForm from '../components/Recipes/RecipeSearchForm';
import { AuthProvider } from '../context/AuthContext';

jest.mock('../services/apiClient', () => ({
  apiClient: { post: jest.fn() }
}));
jest.mock('../services/auditClient', () => ({
  auditClient: { emit: jest.fn().mockResolvedValue(undefined) }
}));

const { apiClient } = require('../services/apiClient');
const { auditClient } = require('../services/auditClient');

function renderForm(onResults = jest.fn(), onError = jest.fn()) {
  return render(
    <AuthProvider>
      <RecipeSearchForm onResults={onResults} onError={onError} />
    </AuthProvider>
  );
}

test('validates required ingredients', async () => {
  renderForm();
  fireEvent.click(screen.getByRole('button', { name: /search recipes/i }));
  expect(await screen.findByText(/please enter at least one ingredient/i)).toBeInTheDocument();
});

test('submits valid payload and calls api and audit', async () => {
  apiClient.post.mockResolvedValueOnce({ items: [], page: 0, size: 10, total: 0 });
  const onResults = jest.fn();
  renderForm(onResults);

  fireEvent.change(screen.getByLabelText(/ingredients/i), { target: { value: 'chicken, garlic' } });
  fireEvent.change(screen.getByLabelText(/dietary preference/i), { target: { value: 'vegan' } });
  fireEvent.change(screen.getByLabelText(/cuisine/i), { target: { value: 'indian' } });
  fireEvent.change(screen.getByLabelText(/max time/i), { target: { value: '45' } });

  fireEvent.click(screen.getByRole('button', { name: /search recipes/i }));

  await waitFor(() => expect(apiClient.post).toHaveBeenCalled());
  expect(auditClient.emit).toHaveBeenCalled();
  expect(onResults).toHaveBeenCalled();
});

test('handles api error gracefully', async () => {
  apiClient.post.mockRejectedValueOnce(new Error('Network'));
  const onError = jest.fn();
  renderForm(jest.fn(), onError);

  fireEvent.change(screen.getByLabelText(/ingredients/i), { target: { value: 'rice' } });
  fireEvent.click(screen.getByRole('button', { name: /search recipes/i }));

  await waitFor(() => expect(onError).toHaveBeenCalled());
});
