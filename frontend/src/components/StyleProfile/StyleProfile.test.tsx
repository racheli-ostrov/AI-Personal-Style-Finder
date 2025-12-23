import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StyleProfile from './StyleProfile';
import { styleAPI } from '../../services/api';

/**
 * 🔹 MOCK ל-API
 * מחליף את הקריאה האמיתית לשרת
 */
jest.mock('../../services/api', () => ({
  styleAPI: {
    generateProfile: jest.fn(),
  },
}));

const mockWardrobeItems = [
  { id: '1', analysis: {} },
  { id: '2', analysis: {} },
  { id: '3', analysis: {} },
];

const mockProfile = {
  dominantStyle: 'Casual',
  colorPalette: ['blue', 'white'],
  stylePersonality: 'Relaxed',
  recommendations: ['Add a blazer'],
  missingPieces: ['Black jeans'],
  shoppingKeywords: ['casual shirt'],
};

describe('StyleProfile – Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('user', JSON.stringify({ id: 'user-1' }));
  });

  test('לא מציג כלום כשאין פריטים בארון', () => {
    const { container } = render(<StyleProfile wardrobeItems={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('מציג שגיאה כשיש פחות מ-3 פריטים', () => {
    render(<StyleProfile wardrobeItems={[{ id: '1' }]} />);
    fireEvent.click(screen.getByText(/generate my style profile/i));
    // בודק שהכפתור לא פעיל (disabled)
    expect(screen.getByRole('button', { name: /generate my style profile/i })).toBeDisabled();
  });

  test('קורא ל-API ומציג פרופיל כשיש הצלחה', async () => {
    (styleAPI.generateProfile as jest.Mock).mockResolvedValue({
      success: true,
      data: { profile: mockProfile },
    });

    render(<StyleProfile wardrobeItems={mockWardrobeItems} />);

    fireEvent.click(screen.getByText(/generate my style profile/i));

    await waitFor(() => expect(styleAPI.generateProfile).toHaveBeenCalled());

    // ממתין שהטקסט יופיע (async)
    const domStyles = await screen.findAllByText(/dominant style/i);
    expect(domStyles.some(el => el.tagName === 'H3')).toBe(true);
    expect(await screen.findByText(/casual/i)).toBeInTheDocument();
  });

  test('מעבר בין טאבים עובד', async () => {
    (styleAPI.generateProfile as jest.Mock).mockResolvedValue({
      success: true,
      data: { profile: mockProfile },
    });

    render(<StyleProfile wardrobeItems={mockWardrobeItems} />);

    fireEvent.click(screen.getByText(/generate my style profile/i));

    const domStyles = await screen.findAllByText(/dominant style/i);
    expect(domStyles.some(el => el.tagName === 'H3')).toBe(true);

    fireEvent.click(screen.getByText(/color palette/i));
    expect(await screen.findByText(/your color palette/i)).toBeInTheDocument();
  });

  test('מציג שגיאה אם ה-API נכשל', async () => {
    (styleAPI.generateProfile as jest.Mock).mockRejectedValue(
      new Error('API error')
    );

    render(<StyleProfile wardrobeItems={mockWardrobeItems} />);

    fireEvent.click(screen.getByText(/generate my style profile/i));

    await waitFor(() =>
      expect(
        screen.getByText(/failed to generate style profile/i)
      ).toBeInTheDocument()
    );
  });
});