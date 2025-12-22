import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import WardrobeGallery from './components/wardrobe/WardrobeGallery';
import StyleProfile from './components/StyleProfile/StyleProfile';
import DailyOutfitSuggestion from './components/DailyOutfitSuggestion';
import Login from './components/Login/Login';
import { wardrobeAPI } from './services/api';
import { WardrobeItem, Notification } from './types';
import './App.css';


function App() {
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // --- Move showNotification and handleAuthRequired above loadWardrobe ---
  const showNotification = React.useCallback((message: string, type: 'info' | 'success' | 'error' = 'info'): void => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleAuthRequired = React.useCallback((): void => {
    showNotification('Please sign in to continue', 'info');
    setShowLogin(true);
  }, [showNotification]);



  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle scroll to shrink header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else if (window.scrollY < 30) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadWardrobe = React.useCallback(async (): Promise<void> => {
    try {
      const result = await wardrobeAPI.getAll();
      if (result.success) {
        setWardrobeItems(result.data);
      }
    } catch (error: any) {
      console.error('Failed to load wardrobe:', error);
      if (error.message === 'AUTH_REQUIRED') {
        handleAuthRequired();
      } else {
        showNotification('Failed to load wardrobe', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthRequired, showNotification]);

  // Load wardrobe when user is available
  useEffect(() => {
    if (user) {
      loadWardrobe();
    } else {
      setLoading(false);
      setWardrobeItems([]);
    }
  }, [user, loadWardrobe]);



  const handleAnalysisComplete = (): void => {
    showNotification('Item added to wardrobe! ✨', 'success');
    loadWardrobe();
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await wardrobeAPI.deleteItem(id);
      setWardrobeItems(items => items.filter(item => item.id !== id));
      showNotification('Item removed', 'success');
    } catch (error: any) {
      console.error('Failed to delete item:', error);
      if (error.message === 'AUTH_REQUIRED') {
        handleAuthRequired();
      } else {
        showNotification('Failed to delete item', 'error');
      }
    }
  };

  const handleToggleFavorite = async (id: string): Promise<void> => {
    try {
      const result = await wardrobeAPI.toggleFavorite(id);
      if (result.success) {
        setWardrobeItems(items =>
          items.map(item =>
            item.id === id ? result.data : item
          )
        );
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      if (error.message === 'AUTH_REQUIRED') {
        handleAuthRequired();
      } else {
        showNotification('Failed to update favorite', 'error');
      }
    }
  };



  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowLogin(false);
    showNotification(`Welcome back, ${userData.name}! 👋`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setWardrobeItems([]);
    showNotification('Logged out successfully', 'info');
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
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <h1><span className="main-title-gray">✨ AI Personal Style Finder</span></h1>
          <p className="subtitle">Discover your unique style with AI-powered fashion analysis</p>
        </div>
        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-profile-row">
               
                <span className="user-name"> {user.name }</span>
                 {user.picture && (
                  <img src={user.picture} alt="profile" className="user-avatar" />
                )}
              </div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn-header" onClick={() => setShowLogin(true)}>
              Sign In
            </button>
          )}
        </div>
      </header>

      {showLogin && (
        <Login onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <div className="notification-progress">
            <div className="notification-progress-bar"></div>
          </div>
        </div>
      )}

      <main className="app-main">
        <div className="container">
          <section className="upload-section">
            <h2 className="section-title">Upload Your Clothing</h2>
            <p className="section-description">
              Take a photo or upload an image of your clothing items. Our AI will analyze the style, colors, and features.
            </p>
            <ImageUpload 
              onAnalysisComplete={handleAnalysisComplete} 
              onAuthRequired={handleAuthRequired}
            />
          </section>

          <section className="wardrobe-section">
            <WardrobeGallery
              items={wardrobeItems}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          </section>

          {wardrobeItems.length >= 2 && (
            <section className="outfit-suggestion-section">
              <DailyOutfitSuggestion wardrobeItems={wardrobeItems} />
            </section>
          )}

          {wardrobeItems.length > 0 && (
            <section className="profile-section">
              <StyleProfile wardrobeItems={wardrobeItems} />
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Google Gemini AI & Python • 2025</p>
      </footer>
    </div>
  );
}

export default App;
