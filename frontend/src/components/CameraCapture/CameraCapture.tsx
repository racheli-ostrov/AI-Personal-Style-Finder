
import React, { useRef, useState, useEffect } from 'react';
import './CameraCapture.css';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const [captured, setCaptured] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // ===============================
  // Lifecycle - Start/Stop camera
  // ===============================
  useEffect(() => {
    let videoElement: HTMLVideoElement | null = null;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Camera is not supported in this browser.');
        onClose();
        return;
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (!mountedRef.current) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        videoElement = videoRef.current;

        if (videoElement) {
          videoElement.srcObject = mediaStream;
          videoElement.onloadedmetadata = () => {
            if (mountedRef.current) {
              setIsReady(true);
            }
          };
        }
      } catch (err: any) {
        if (!mountedRef.current) return;

        let message = 'Could not access camera.';
        if (err?.name === 'NotAllowedError') {
          message = 'Camera permission was denied.';
        } else if (err?.name === 'NotFoundError') {
          message = 'No camera device found.';
        }

        alert(message);
        onClose();
      }
    };

    startCamera();

    return () => {
      mountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ===============================
  // Capture photo
  // ===============================
  const capturePhoto = () => {
    if (!videoRef.current || !isReady) {
      alert('Camera is not ready yet.');
      return;
    }

    const video = videoRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Camera is not ready yet.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL('image/jpeg', 0.9));
  };

  // ===============================
  // Use captured photo
  // ===============================
  const handleUsePhoto = async () => {
    if (!captured) return;

    const blob = await fetch(captured).then(r => r.blob());
    const file = new File([blob], 'camera-capture.jpg', {
      type: 'image/jpeg'
    });

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    onCapture(file);
    onClose();
  };

  // ===============================
  // Retake
  // ===============================
  const handleRetake = () => {
    setCaptured(null);
  };

  // ===============================
  // Close
  // ===============================
  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  // ===============================
  // Render
  // ===============================
  return (
    <div className="camera-modal">
      <div className="camera-container">
        <div className="camera-header">
          <h3>📷 Take a Photo</h3>
          <button className="close-button" onClick={handleClose}>✕</button>
        </div>

        <div className="camera-viewport">
          {!captured ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
          ) : (
            <img
              src={captured}
              alt="Captured"
              className="camera-preview"
            />
          )}
        </div>

        <div className="camera-controls">
          {!captured ? (
            <>
              <button className="cancel-button" onClick={handleClose}>
                Cancel
              </button>
              <button className="capture-button" onClick={capturePhoto}>
                📸 Capture
              </button>
            </>
          ) : (
            <>
              <button className="retake-button" onClick={handleRetake}>
                🔄 Retake
              </button>
              <button className="use-button" onClick={handleUsePhoto}>
                ✓ Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;