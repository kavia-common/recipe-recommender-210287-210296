import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RecipeList from '../components/Recipes/RecipeList';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/apiClient', () => ({
  apiClient: { post: jest.fn() }
}));

const { apiClient } = require('../services/apiClient');

const items = Array.from({ length: 12 }).map((_, i) => ({ id: `id-${i+1}`, title: `Recipe ${i+1}`, prepTime: 10 + i }));
const firstPage = { items: items.slice(0, 10), page: 0, size: 10, total: items.length };
const secondPage = { items: items.slice(10), page: 1, size: 10, total: items.length };

function renderList() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <RecipeList query={{ ingredients: 'test', size: 10, sort: 'relevance' }} />
      </MemoryRouter>
    </AuthProvider>
  );
}

test('renders list and paginates', async () => {
  apiClient.post.mockResolvedValueOnce(firstPage);
  renderList();

  await waitFor(() => expect(screen.getByText(/results/i)).toBeInTheDocument());
  expect(screen.getAllByText(/view details/i).length).toBe(10);

  apiClient.post.mockResolvedValueOnce(secondPage);
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  await waitFor(() => expect(screen.getAllByText(/view details/i).length).toBe(2));
});

test('changes sorting', async () => {
  apiClient.post.mockResolvedValue(firstPage);
  renderList();
  await waitFor(() => expect(screen.getByText(/results/i)).toBeInTheDocument());

  fireEvent.change(screen.getByLabelText(/sort by/i), { target: { value: 'title' } });
  // next fetch
  expect(apiClient.post).toHaveBeenCalled();
});
