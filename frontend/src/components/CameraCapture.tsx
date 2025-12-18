// import React, { useRef, useState, useCallback } from 'react';
// import './CameraCapture.css';

// interface CameraCaptureProps {
//   onCapture: (file: File) => void;
//   onClose: () => void;
// }

// const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [captured, setCaptured] = useState<string | null>(null);


//   const startCamera = React.useCallback(async () => {
//     // Always stop previous stream before starting a new one
//     if (stream) {
//       console.log('[CameraCapture] Stopping previous stream');
//       stream.getTracks().forEach(track => track.stop());
//     }
//     // בדיקת תמיכה ב-mediaDevices
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       alert('Camera is not supported in this browser.');
//       onClose();
//       return;
//     }
//     try {
//       // בדיקת הרשאות
//       if (navigator.permissions && navigator.permissions.query) {
//         try {
//           const perm = await navigator.permissions.query({ name: 'camera' as PermissionName });
//           console.log('[CameraCapture] Camera permission state:', perm.state);
//           if (perm.state === 'denied') {
//             alert('Camera permission is denied. Please allow camera access in your browser settings.');
//             onClose();
//             return;
//           }
//         } catch (e) {
//           // לא כל הדפדפנים תומכים
//         }
//       }
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           facingMode: 'user',
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         } 
//       });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//       console.log('[CameraCapture] Camera stream started');
//     } catch (error: any) {
//       console.error('Error accessing camera:', error);
//       let msg = 'Could not access camera. Please check your permissions.';
//       if (error && error.name === 'NotAllowedError') {
//         msg = 'Camera access was denied. Please allow camera access in your browser.';
//       } else if (error && error.name === 'NotFoundError') {
//         msg = 'No camera device found. Please connect a camera.';
//       }
//       alert(msg);
//       onClose();
//     }
//   }, [onClose, videoRef, stream]);

//   const stopCamera = React.useCallback(() => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//   }, [stream]);

//   React.useEffect(() => {
//     startCamera();
//     return () => {
//       stopCamera();
//     };
//   }, [startCamera, stopCamera]);

//   const capturePhoto = useCallback(() => {
//     if (videoRef.current) {
//       const canvas = document.createElement('canvas');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.drawImage(videoRef.current, 0, 0);
//         const imageData = canvas.toDataURL('image/jpeg', 0.9);
//         setCaptured(imageData);
//       }
//     }
//   }, [videoRef]);

//   const handleUsePhoto = useCallback(() => {
//     if (captured) {
//       // Convert base64 to File
//       fetch(captured)
//         .then(res => res.blob())
//         .then(blob => {
//           const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
//           stopCamera();
//           onCapture(file);
//           onClose();
//         });
//     }
//   }, [captured, onCapture, onClose, stopCamera]);

//   const handleRetake = useCallback(() => {
//     setCaptured(null);
//   }, []);

//   const handleClose = useCallback(() => {
//     stopCamera();
//     onClose();
//   }, [stopCamera, onClose]);

//   return (
//     <div className="camera-modal">
//       <div className="camera-container">
//         <div className="camera-header">
//           <h3>📷 Take a Photo</h3>
//           <button className="close-button" onClick={handleClose}>✕</button>
//         </div>
        
//         <div className="camera-viewport">
//           {!captured ? (
//             <video 
//               ref={videoRef} 
//               autoPlay 
//               playsInline 
//               className="camera-video"
//             />
//           ) : (
//             <img src={captured} alt="Captured" className="camera-preview" />
//           )}
//         </div>

//         <div className="camera-controls">
//           {!captured ? (
//             <>
//               <button className="cancel-button" onClick={handleClose}>
//                 Cancel
//               </button>
//               <button className="capture-button" onClick={capturePhoto}>
//                 📸 Capture
//               </button>
//             </>
//           ) : (
//             <>
//               <button className="retake-button" onClick={handleRetake}>
//                 🔄 Retake
//               </button>
//               <button className="use-button" onClick={handleUsePhoto}>
//                 ✓ Use Photo
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CameraCapture;
import React, { useRef, useState, useEffect, useCallback } from 'react';
import './CameraCapture.css';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [captured, setCaptured] = useState<string | null>(null);

  // ===============================
  // Start camera (runs ONCE)
  // ===============================
  const startCamera = useCallback(async () => {
    if (streamRef.current) return; // camera already running

    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Camera is not supported in this browser.');
      onClose();
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        }
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play(); // 🔑 prevents black frames
      }
    } catch (err: any) {
      let message = 'Could not access camera.';
      if (err?.name === 'NotAllowedError') {
        message = 'Camera permission was denied.';
      } else if (err?.name === 'NotFoundError') {
        message = 'No camera device found.';
      }

      alert(message);
      onClose();
    }
  }, [onClose]);

  // ===============================
  // Stop camera
  // ===============================
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // ===============================
  // Lifecycle
  // ===============================
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // ===============================
  // Capture photo
  // ===============================
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // ensure camera is ready
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
  }, []);

  // ===============================
  // Use captured photo
  // ===============================
  const handleUsePhoto = useCallback(async () => {
    if (!captured) return;

    const blob = await fetch(captured).then(r => r.blob());
    const file = new File([blob], 'camera-capture.jpg', {
      type: 'image/jpeg'
    });

    stopCamera();
    onCapture(file);
    onClose();
  }, [captured, onCapture, onClose, stopCamera]);

  // ===============================
  // Retake
  // ===============================
  const handleRetake = useCallback(() => {
    setCaptured(null);
  }, []);

  // ===============================
  // Close
  // ===============================
  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

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
