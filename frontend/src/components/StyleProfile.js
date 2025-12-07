import React, { useState } from 'react';
import { styleAPI } from '../services/api';
import './StyleProfile.css';

const StyleProfile = ({ wardrobeItems }) => {
  const [profile, setProfile] = useState(null);
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
      const items = wardrobeItems.map(item => item.analysis);
      const result = await styleAPI.generateProfile(items);
      
      if (result.success) {
        setProfile(result.data);
      }
    } catch (err) {
      console.error('Profile generation error:', err);
      setError(err.response?.data?.error?.message || 'Failed to generate style profile');
    } finally {
      setLoading(false);
    }
  };

  if (wardrobeItems.length === 0) {
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
              <span className="spinner-small"></span>
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
        <div className="profile-content">
          <div className="profile-section">
            <h3>🎨 Dominant Style</h3>
            <p className="style-badge">{profile.dominantStyle}</p>
          </div>

          <div className="profile-section">
            <h3>🌈 Your Color Palette</h3>
            <div className="color-list">
              {profile.colorPalette?.map((color, idx) => (
                <span key={idx} className="color-item">{color}</span>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h3>👔 Preferred Formality</h3>
            <p className="formality-badge">{profile.preferredFormality}</p>
          </div>

          <div className="profile-section">
            <h3>💫 Style Persona</h3>
            <p className="persona-text">{profile.stylePersona}</p>
          </div>

          {profile.recommendations && (
            <div className="profile-section recommendations">
              <h3>📊 Recommendations</h3>
              
              {profile.recommendations.strengths?.length > 0 && (
                <div className="rec-subsection">
                  <h4>✅ Strengths</h4>
                  <ul>
                    {profile.recommendations.strengths.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.recommendations.gaps?.length > 0 && (
                <div className="rec-subsection">
                  <h4>🔍 Gaps to Fill</h4>
                  <ul>
                    {profile.recommendations.gaps.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.recommendations.suggestions?.length > 0 && (
                <div className="rec-subsection">
                  <h4>💡 Suggestions</h4>
                  <ul>
                    {profile.recommendations.suggestions.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {profile.shoppingKeywords?.length > 0 && (
            <div className="profile-section">
              <h3>🛍️ Shopping Keywords</h3>
              <div className="keywords-list">
                {profile.shoppingKeywords.map((keyword, idx) => (
                  <span key={idx} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StyleProfile;
