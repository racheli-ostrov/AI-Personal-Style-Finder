import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CameraCapture from './CameraCapture';

/**
 * MOCK ל-mediaDevices.getUserMedia
 */
const mockGetUserMedia = jest.fn();

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
});

/**
 * מניעת alert ב-jsdom
 */
beforeAll(() => {
  window.alert = jest.fn();
});

describe('CameraCapture – Stable Unit Tests', () => {
  const onCapture = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('רינדור בסיסי של קומפוננטת מצלמה', async () => {
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    });

    render(<CameraCapture onCapture={onCapture} onClose={onClose} />);

expect(await screen.findByText(/take a photo/i)).toBeInTheDocument();
expect(await screen.findByText(/capture/i)).toBeInTheDocument();
expect(await screen.findByText(/cancel/i)).toBeInTheDocument();

  });

  test('לחיצה על Cancel מפעילה onClose', async () => {
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    });

    render(<CameraCapture onCapture={onCapture} onClose={onClose} />);

    fireEvent.click(screen.getByText(/cancel/i));

    expect(onClose).toHaveBeenCalled();
  });

  test('כשל בגישה למצלמה מפעיל onClose', async () => {
    mockGetUserMedia.mockRejectedValue({ name: 'NotAllowedError' });

    render(<CameraCapture onCapture={onCapture} onClose={onClose} />);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
