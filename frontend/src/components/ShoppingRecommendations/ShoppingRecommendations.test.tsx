import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ShoppingRecommendations from './ShoppingRecommendations';
import { getShoppingRecommendations } from '../../services/shopping';

/**
 * MOCK לשירות החיצוני
 */
jest.mock('../../services/shopping', () => ({
  getShoppingRecommendations: jest.fn(),
}));

const mockAnalysis = { itemType: 'shirt', colors: ['blue'] };

const mockResponseSuccess = {
  success: true,
  search_query: 'blue casual shirt',
  recommendations: [
    {
      store: 'Zara',
      query: 'blue casual shirt',
      url: 'https://zara.com',
      emoji: '🛒',
    },
    {
      store: 'H&M',
      query: 'blue casual shirt',
      url: 'https://hm.com',
      emoji: '👕',
    },
  ],
};

describe('ShoppingRecommendations – Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('מציג loading בזמן טעינה', async () => {
    (getShoppingRecommendations as jest.Mock).mockResolvedValue(
      new Promise(() => {}) // promise שלא נפתר → loading
    );

    render(
      <ShoppingRecommendations analysis={mockAnalysis} onClose={jest.fn()} />
    );

    expect(
      screen.getByText(/finding similar items/i)
    ).toBeInTheDocument();
  });

  test('מציג המלצות כאשר הקריאה מצליחה', async () => {
    (getShoppingRecommendations as jest.Mock).mockResolvedValue(
      mockResponseSuccess
    );

    render(
      <ShoppingRecommendations analysis={mockAnalysis} onClose={jest.fn()} />
    );

    await waitFor(() =>
      expect(getShoppingRecommendations).toHaveBeenCalled()
    );

    // בודק טקסט טעינה אמיתי
    expect(screen.getByText(/finding similar items/i)).toBeInTheDocument();

    // בודק המלצה
    expect(await screen.findByText('Zara')).toBeInTheDocument();
    expect(screen.getByText('H&M')).toBeInTheDocument();
  });

  test('מציג הודעת שגיאה כאשר הקריאה נכשלת', async () => {
    (getShoppingRecommendations as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    render(
      <ShoppingRecommendations analysis={mockAnalysis} onClose={jest.fn()} />
    );

    await waitFor(() =>
      expect(
        screen.getByText(/network error/i)
      ).toBeInTheDocument()
    );
  });

  test('לחיצה על כפתור Try Again מפעילה טעינה מחדש', async () => {
    (getShoppingRecommendations as jest.Mock)
      .mockRejectedValueOnce(new Error('Error'))
      .mockResolvedValueOnce(mockResponseSuccess);

    render(
      <ShoppingRecommendations analysis={mockAnalysis} onClose={jest.fn()} />
    );

    await waitFor(() =>
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/try again/i));

    await waitFor(() =>
      expect(screen.getByText('Zara')).toBeInTheDocument()
    );
  });

  test('לחיצה על כפתור close מפעילה onClose', () => {
    const onClose = jest.fn();

    render(
      <ShoppingRecommendations analysis={mockAnalysis} onClose={onClose} />
    );

    fireEvent.click(screen.getByText('✕'));

    expect(onClose).toHaveBeenCalled();
  });
});