import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageUpload from './ImageUpload';
import { styleAPI } from '../../services/api';

/**
 * MOCK ל-API
 */
jest.mock('../../services/api', () => ({
  styleAPI: {
    analyzeImage: jest.fn(),
  },
}));

/**
 * MOCK ל-react-dropzone
 */
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}));

/**
 * MOCK ל-CameraCapture
 */
jest.mock('../CameraCapture/CameraCapture', () => ({
  __esModule: true,
  default: ({ onCapture, onClose }: any) => (
    <div>
      <button onClick={() => onCapture(new File(['img'], 'photo.jpg'))}>
        Capture
      </button>
      <button onClick={onClose}>Close Camera</button>
    </div>
  ),
}));

/**
 * MOCK ל-FileReader
 */
class MockFileReader {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null =
    null;

  readAsDataURL() {
    if (this.onload) {
      this.onload.call(this as any, {} as any);
    }
  }
}
(global as any).FileReader = MockFileReader;

describe('ImageUpload – Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('רינדור בסיסי של קומפוננטת ImageUpload', () => {
    render(<ImageUpload />);

    expect(screen.getByText(/drag or drop image/i)).toBeInTheDocument();
    expect(screen.getByText(/open camera/i)).toBeInTheDocument();
  });

  test('פתיחת וסגירת מצלמה', () => {
    render(<ImageUpload />);

    fireEvent.click(screen.getByText(/open camera/i));
    expect(screen.getByText('Capture')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Camera'));
    expect(screen.queryByText('Capture')).not.toBeInTheDocument();
  });

  test('בהצלחה – קורא ל-onAnalysisComplete', async () => {
    const onAnalysisComplete = jest.fn();

    (styleAPI.analyzeImage as jest.Mock).mockResolvedValue({
      success: true,
      data: { analysis: { itemType: 'shirt' } },
    });

    render(<ImageUpload onAnalysisComplete={onAnalysisComplete} />);

    fireEvent.click(screen.getByText(/open camera/i));
    fireEvent.click(screen.getByText('Capture'));

    await waitFor(() =>
      expect(onAnalysisComplete).toHaveBeenCalledWith({ itemType: 'shirt' })
    );
  });

  test('כאשר נדרש אימות – מציג שגיאה וקורא ל-onAuthRequired', async () => {
    jest.useFakeTimers(); // ⭐ קריטי בגלל setTimeout בקומפוננטה

    const onAuthRequired = jest.fn();

    (styleAPI.analyzeImage as jest.Mock).mockRejectedValue({
      message: 'AUTH_REQUIRED',
    });

    render(<ImageUpload onAuthRequired={onAuthRequired} />);

    fireEvent.click(screen.getByText(/open camera/i));
    fireEvent.click(screen.getByText('Capture'));

    // השגיאה מוצגת מיידית
    await waitFor(() =>
      expect(
        screen.getByText(/please sign in to upload clothing items/i)
      ).toBeInTheDocument()
    );

    // מריצים את ה-setTimeout
    jest.runAllTimers();

    expect(onAuthRequired).toHaveBeenCalled();
  });

  test('שגיאה כללית מציגה הודעה למשתמש', async () => {
    (styleAPI.analyzeImage as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Upload failed' } },
    });

    render(<ImageUpload />);

    fireEvent.click(screen.getByText(/open camera/i));
    fireEvent.click(screen.getByText('Capture'));

    await waitFor(() =>
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument()
    );
  });
});