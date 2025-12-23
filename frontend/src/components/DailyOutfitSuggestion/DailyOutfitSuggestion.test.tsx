import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DailyOutfitSuggestion from './DailyOutfitSuggestion';
import { WardrobeItem } from '../../types';

/**
 * MOCK ל-fetch (Weather API)
 */
global.fetch = jest.fn();

/**
 * MOCK ל-geolocation
 */
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
});

const baseItem = (id: string, type: string): WardrobeItem => ({
  id,
  analysis: {
    clothing_type: type,
    style: 'casual',
    colors: ['blue'],
  },
  imageUrl: 'img.jpg',
});

describe('DailyOutfitSuggestion – Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_WEATHER_API_KEY = 'test-key';
  });

  test('מציג שגיאה אם יש פחות מ-2 פריטים', () => {
    render(
      <DailyOutfitSuggestion wardrobeItems={[baseItem('1', 'shirt')]} />
    );

    // הכפתור אמור להיות disabled
    const btn = screen.getByRole('button', { name: /what should i wear today/i });
    expect(btn).toBeDisabled();
  });

  test('מציג loading בזמן בקשת מזג אוויר', async () => {
    (mockGeolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (_success: any, _error: any) => {}
    );

    (fetch as jest.Mock).mockResolvedValue(
      new Promise(() => {}) // never resolves
    );

    render(
      <DailyOutfitSuggestion
        wardrobeItems={[
          baseItem('1', 'shirt'),
          baseItem('2', 'pants'),
        ]}
      />
    );

    fireEvent.click(
      screen.getByText(/what should i wear today/i)
    );

    expect(
      screen.getByText(/getting suggestion/i)
    ).toBeInTheDocument();
  });

  test('מציג הצעת לבוש בהצלחה', async () => {
    (mockGeolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (success: any) =>
        success({
          coords: { latitude: 32.1, longitude: 34.8 },
        })
    );

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temp_c: 22,
          condition: { code: 1000 },
        },
      }),
    });

    render(
      <DailyOutfitSuggestion
        wardrobeItems={[
          baseItem('1', 'shirt'),
          baseItem('2', 'pants'),
        ]}
      />
    );

    fireEvent.click(
      screen.getByText(/what should i wear today/i)
    );

    // בודק שמופיע טקסט מזג אוויר
    expect(await screen.findByText(/today's weather/i)).toBeInTheDocument();
    // יש כמה מופעים ל-22°C, בודק שיש לפחות אחד שהוא span.temperature
    const tempEls = await screen.findAllByText(/22°C/i);
    expect(tempEls.some(el => el.tagName === 'SPAN' && el.className.includes('temperature'))).toBe(true);
    expect(await screen.findByText(/recommended outfit/i)).toBeInTheDocument();
  });

  test('מציג שגיאה אם fetch נכשל', async () => {
    (mockGeolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (_success: any, error: any) => error()
    );

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'error',
    });

    render(
      <DailyOutfitSuggestion
        wardrobeItems={[
          baseItem('1', 'shirt'),
          baseItem('2', 'pants'),
        ]}
      />
    );

    fireEvent.click(
      screen.getByText(/what should i wear today/i)
    );

    await waitFor(() =>
      expect(
        screen.getByText(/failed to get weather data/i)
      ).toBeInTheDocument()
    );
  });
});