import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API module
jest.mock('./services/api', () => ({
  wardrobeAPI: {
    getAll: jest.fn(() => Promise.resolve({ success: true, data: [] })),
    deleteItem: jest.fn(() => Promise.resolve({ success: true })),
    toggleFavorite: jest.fn(() => Promise.resolve({ success: true, data: {} })),
  },
  styleAPI: {
    analyzeImage: jest.fn(),
    generateProfile: jest.fn(),
  },
}));

test('renders app header', async () => {
  render(<App />);
  const headerElement = screen.getByText(/AI Personal Style Finder/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders upload section', async () => {
  render(<App />);
  const uploadText = await screen.findByText(/Upload Your Clothing/i);
  expect(uploadText).toBeInTheDocument();
});
