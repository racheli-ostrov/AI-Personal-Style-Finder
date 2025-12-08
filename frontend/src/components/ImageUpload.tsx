import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';
import { styleAPI, wardrobeAPI } from '../services/api';
import CameraCapture from './CameraCapture';
import './ImageUpload.css';

interface ImageUploadProps {
  onAnalysisComplete?: (analysis: any) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onAnalysisComplete }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);

    // Create preview and wait for it to load
    const reader = new FileReader();
    const imageDataPromise = new Promise<string>((resolve) => {
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        resolve(result);
      };
    });
    reader.readAsDataURL(file);

    try {
      // Wait for image to load and get the data
      const imageData = await imageDataPromise;
      
      // Analyze image with Gemini AI - this will automatically add to wardrobe
      const result = await styleAPI.analyzeImage(file);
      
      if (result.success) {
        if (onAnalysisComplete) {
          onAnalysisComplete(result.data.analysis);
        }
        
        // Clear preview after success
        setTimeout(() => {
          setPreview(null);
        }, 2000);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onAnalysisComplete]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const handleCameraCapture = async (file: File) => {
    await onDrop([file]);
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  return (
    <div className="image-upload">
      {showCamera && (
        <CameraCapture onCapture={handleCameraCapture} onClose={closeCamera} />
      )}
      
      <div className="upload-buttons">
        <button className="camera-button" onClick={openCamera} disabled={uploading}>
          📷 Open Camera
        </button>
      </div>
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            {uploading && (
              <div className="upload-overlay">
                <div className="spinner"></div>
                <p>Analyzing with AI...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-prompt">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="upload-text">
              {isDragActive 
                ? 'Drop your image here...' 
                : 'Drag & drop a clothing image, or click to select'}
            </p>
            <p className="upload-hint">Supports: JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
