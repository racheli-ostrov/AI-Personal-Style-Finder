import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import WardrobeGallery from './components/WardrobeGallery';
import StyleProfile from './components/StyleProfile';
import { wardrobeAPI } from './services/api';
import './App.css';

function App() {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Load wardrobe on mount
  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    try {
      const result = await wardrobeAPI.getAll();
      if (result.success) {
        setWardrobeItems(result.data);
      }
    } catch (error) {
      console.error('Failed to load wardrobe:', error);
      showNotification('Failed to load wardrobe', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisComplete = () => {
    showNotification('Item added to wardrobe! ✨', 'success');
    loadWardrobe();
  };

  const handleDelete = async (id) => {
    try {
      await wardrobeAPI.deleteItem(id);
      setWardrobeItems(items => items.filter(item => item.id !== id));
      showNotification('Item removed', 'success');
    } catch (error) {
      console.error('Failed to delete item:', error);
      showNotification('Failed to delete item', 'error');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const result = await wardrobeAPI.toggleFavorite(id);
      if (result.success) {
        setWardrobeItems(items =>
          items.map(item =>
            item.id === id ? result.data : item
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      showNotification('Failed to update favorite', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading your wardrobe...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>✨ AI Personal Style Finder</h1>
          <p className="subtitle">Discover your unique style with AI-powered fashion analysis</p>
        </div>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="app-main">
        <div className="container">
          <section className="upload-section">
            <h2 className="section-title">Upload Your Clothing</h2>
            <p className="section-description">
              Take a photo or upload an image of your clothing items. Our AI will analyze the style, colors, and features.
            </p>
            <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
          </section>

          <section className="wardrobe-section">
            <WardrobeGallery
              items={wardrobeItems}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          </section>

          {wardrobeItems.length > 0 && (
            <section className="profile-section">
              <StyleProfile wardrobeItems={wardrobeItems} />
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Google Gemini AI • Final Project 2024</p>
      </footer>
    </div>
  );
}

export default App;
