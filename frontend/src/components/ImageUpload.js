import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { styleAPI, wardrobeAPI } from '../services/api';
import './ImageUpload.css';

const ImageUpload = ({ onAnalysisComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      // Analyze image with Gemini AI
      const result = await styleAPI.analyzeImage(file);
      
      if (result.success) {
        // Add to wardrobe
        await wardrobeAPI.addItem(result.data.analysis, reader.result);
        
        if (onAnalysisComplete) {
          onAnalysisComplete(result.data.analysis);
        }
        
        // Clear preview after success
        setTimeout(() => {
          setPreview(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error?.message || 'Failed to analyze image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="image-upload">
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
