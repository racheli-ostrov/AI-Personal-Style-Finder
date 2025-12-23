import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

/**
 * MOCK ל-axios
 */
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * MOCK ל-Google Login
 * אנחנו לא מפעילים Google אמיתי – רק בודקים שהפונקציה נקראת
 */
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
}));

describe('Login – Unit Tests', () => {
  const onClose = jest.fn();
  const onLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('רינדור בסיסי של קומפוננטת Login', () => {
    (useGoogleLogin as jest.Mock).mockReturnValue(jest.fn());

    render(<Login onClose={onClose} onLoginSuccess={onLoginSuccess} />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });

  test('לחיצה על כפתור Close מפעילה onClose', () => {
    (useGoogleLogin as jest.Mock).mockReturnValue(jest.fn());

    render(<Login onClose={onClose} onLoginSuccess={onLoginSuccess} />);

    fireEvent.click(screen.getByText('✕'));

    expect(onClose).toHaveBeenCalled();
  });

  test('לחיצה על Google Login מפעילה את googleLogin', () => {
    const googleLoginMock = jest.fn();
    (useGoogleLogin as jest.Mock).mockReturnValue(googleLoginMock);

    render(<Login onClose={onClose} onLoginSuccess={onLoginSuccess} />);

    fireEvent.click(screen.getByText(/continue with google/i));

    expect(googleLoginMock).toHaveBeenCalled();
  });

  test('מציג הודעה ל-WhatsApp Login (Coming Soon)', () => {
    (useGoogleLogin as jest.Mock).mockReturnValue(jest.fn());

    render(<Login onClose={onClose} onLoginSuccess={onLoginSuccess} />);

    fireEvent.click(screen.getByText(/continue with whatsapp/i));

    expect(
      screen.getByText(/whatsapp login coming soon/i)
    ).toBeInTheDocument();
  });

  test('מציג הודעה ל-Instagram Login (Coming Soon)', () => {
    (useGoogleLogin as jest.Mock).mockReturnValue(jest.fn());

    render(<Login onClose={onClose} onLoginSuccess={onLoginSuccess} />);

    fireEvent.click(screen.getByText(/continue with instagram/i));

    expect(
      screen.getByText(/instagram login coming soon/i)
    ).toBeInTheDocument();
  });

  test('בכשל Google Login – מוצגת הודעת שגיאה', async () => {
    const onErrorHandler = jest.fn();

    (useGoogleLogin as jest.Mock).mockImplementation(({ onError }) => {
      onErrorHandler.mockImplementation(onError);
      return jest.fn();
    });

    render(<Login onClose={onClose} onLoginSuccess={onLoginSuccess} />);

    // מדמים כשל
    onErrorHandler();

    await waitFor(() =>
      expect(
        screen.getByText(/login failed/i)
      ).toBeInTheDocument()
    );
  });

  test('בהצלחה – קורא ל-onLoginSuccess עם משתמש', async () => {
    let onSuccessHandler: any;

    (useGoogleLogin as jest.Mock).mockImplementation(({ onSuccess }) => {
      onSuccessHandler = onSuccess;
      return jest.fn();
    });

    mockedAxios.get.mockResolvedValue({
      data: {
        sub: '123',
        name: 'Test User',
        email: 'test@test.com',
        picture: 'img.jpg',
      },
    });

    render(<Login onClose={onClose} onLoginSuccess={onLoginSuccess} />);

    // מדמים הצלחת login מגוגל
    await onSuccessHandler({ access_token: 'fake-token' });

    await waitFor(() =>
      expect(onLoginSuccess).toHaveBeenCalledWith({
        id: '123',
        name: 'Test User',
        email: 'test@test.com',
        picture: 'img.jpg',
        provider: 'google',
      })
    );
  });
});