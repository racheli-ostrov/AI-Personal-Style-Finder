import React, { useState } from 'react';
import { styleAPI } from '../services/api';
import './StyleProfile.css';

/* =========================
   Main Component
========================= */
const StyleProfile = ({ wardrobeItems }) => {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('dominantStyle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateProfile = async () => {
    if (wardrobeItems.length < 3) {
      setError('Please add at least 3 items to your wardrobe to generate a style profile.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;

      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const result = await styleAPI.generateProfile(wardrobeItems, userId);

      if (result?.success && result?.data?.profile) {
        setProfile(result.data.profile);
        setActiveSection('dominantStyle');
      }
    } catch (err) {
      console.error('Profile generation error:', err);
      setError(err?.response?.data?.error?.message || 'Failed to generate style profile');
    } finally {
      setLoading(false);
    }
  };

  if (!wardrobeItems || wardrobeItems.length === 0) {
    return null;
  }

  return (
    <div className="style-profile">
      <div className="profile-header">
        <h2>Your Style Profile</h2>
        <button
          className="generate-btn"
          onClick={generateProfile}
          disabled={loading || wardrobeItems.length < 3}
        >
          {loading ? (
            <>
              <span className="spinner-small" />
              Analyzing...
            </>
          ) : (
            <>✨ Generate My Style Profile</>
          )}
        </button>
      </div>

      {error && (
        <div className="profile-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {profile && (
        <div className="profile-navbar-section">
          <div className="profile-navbar">
            {sections.map((section) => (
              <button
                key={section.key}
                className={`profile-navbar-btn${activeSection === section.key ? ' active' : ''}`}
                onClick={() => setActiveSection(section.key)}
              >
                {section.label}
              </button>
            ))}
          </div>
          <div className="profile-navbar-content">
            {activeSection === 'dominantStyle' && (
              <div className="profile-section">
                <h3>🎨 Dominant Style</h3>
                <p className="style-badge">{profile.dominantStyle}</p>
              </div>
            )}
            {activeSection === 'colorPalette' && (
              <div className="profile-section">
                <h3>🌈 Your Color Palette</h3>
                <div className="color-list">
                  {profile.colorPalette?.map((color, idx) => (
                    <span
                      key={idx}
                      className="color-item color-circle"
                      style={{ background: color, border: '2px solid #e0e0e0' }}
                      title={color}
                    >
                      <span className="color-tooltip">{color}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {activeSection === 'stylePersonality' && (
              <div className="profile-section">
                <h3>💫 Style Personality</h3>
                <p className="persona-text">{profile.stylePersonality}</p>
              </div>
            )}
            {activeSection === 'recommendations' && profile.recommendations?.length > 0 && (
              <div className="profile-section recommendations">
                <h3>📊 Recommendations</h3>
                <ul>
                  {profile.recommendations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {activeSection === 'missingPieces' && profile.missingPieces?.length > 0 && (
              <div className="profile-section missing-pieces">
                <h3>🧩 Missing Pieces</h3>
                <ul>
                  {profile.missingPieces.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {activeSection === 'shoppingKeywords' && (
              <div className="profile-section">
                <h3>🛍️ Shopping Keywords</h3>
                <div className="keywords-list">
                  {Array.isArray(profile.shoppingKeywords) && profile.shoppingKeywords.length > 0 ? (
                    profile.shoppingKeywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-tag">{keyword}</span>
                    ))
                  ) : (
                    <span style={{ opacity: 0.7 }}>No keywords found, be more specific😉.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


// Navbar sections config
const sections = [
  { key: 'dominantStyle', label: '🎨 Dominant Style' },
  { key: 'colorPalette', label: '🌈 Color Palette' },
  { key: 'stylePersonality', label: '💫 Style Personality' },
  { key: 'recommendations', label: '📊 Recommendations' },
  { key: 'missingPieces', label: '🧩 Missing Pieces' },
  { key: 'shoppingKeywords', label: '🛍️ Shopping Keywords' },
];

export default StyleProfile;