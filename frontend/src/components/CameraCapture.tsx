import React, { useRef, useState, useCallback } from 'react';
import './CameraCapture.css';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);


  const startCamera = React.useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check your permissions.');
      onClose();
    }
  }, [onClose, videoRef]);

  const stopCamera = React.useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }, [stream]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCaptured(imageData);
      }
    }
  }, [videoRef]);

  const handleUsePhoto = useCallback(() => {
    if (captured) {
      // Convert base64 to File
      fetch(captured)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          stopCamera();
          onCapture(file);
          onClose();
        });
    }
  }, [captured, onCapture, onClose, stopCamera]);

  const handleRetake = useCallback(() => {
    setCaptured(null);
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

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
              className="camera-video"
            />
          ) : (
            <img src={captured} alt="Captured" className="camera-preview" />
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
