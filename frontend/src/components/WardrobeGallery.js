import React from 'react';
import './WardrobeGallery.css';

const WardrobeGallery = ({ items, onDelete, onToggleFavorite, onSelectItem }) => {
  if (items.length === 0) {
    return (
      <div className="empty-wardrobe">
        <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3>Your wardrobe is empty</h3>
        <p>Start by uploading images of your clothing items</p>
      </div>
    );
  }

  return (
    <div className="wardrobe-gallery">
      <div className="gallery-header">
        <h2>My Wardrobe ({items.length} items)</h2>
      </div>
      
      <div className="gallery-grid">
        {items.map((item) => (
          <div key={item.id} className="wardrobe-item" onClick={() => onSelectItem && onSelectItem(item)}>
            <div className="item-image-container">
              {item.imageData && (
                <img src={item.imageData} alt={item.analysis.itemType} className="item-image" />
              )}
              
              <button
                className={`favorite-btn ${item.favorite ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
              >
                {item.favorite ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div className="item-details">
              <h3 className="item-type">{item.analysis.itemType}</h3>
              
              <div className="item-colors">
                {item.analysis.colors?.slice(0, 3).map((color, idx) => (
                  <span key={idx} className="color-badge">{color}</span>
                ))}
              </div>
              
              <div className="item-tags">
                <span className="tag">{item.analysis.style}</span>
                <span className="tag">{item.analysis.formality}</span>
              </div>
              
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardrobeGallery;
