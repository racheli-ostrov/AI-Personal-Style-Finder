import React, { useState, useMemo } from 'react';
import { WardrobeItem } from '../../types';
import ShoppingRecommendations from '../ShoppingRecommendations/ShoppingRecommendations';
import './WardrobeGallery.css';

interface WardrobeGalleryProps {
  items: WardrobeItem[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSelectItem?: (item: WardrobeItem) => void;
}

const WardrobeGallery: React.FC<WardrobeGalleryProps> = ({ 
  items, 
  onDelete, 
  onToggleFavorite, 
  onSelectItem 
}) => {
  const [selectedItemForShopping, setSelectedItemForShopping] = useState<WardrobeItem | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterColor, setFilterColor] = useState<string>('all');
  const [filterOccasion, setFilterOccasion] = useState<string>('all');
  const [filterSeason, setFilterSeason] = useState<string>('all');

  // Debug: Print all items to console to help diagnose filter issues
  console.log('Wardrobe items:', items);
  items.forEach((item, idx) => {
    console.log(`Item #${idx + 1}:`, item.analysis);
  });
  // Extract unique values for filters
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    items.forEach(item => {
      const type = (item.analysis.clothing_type || item.analysis.itemType || '').toLowerCase();
      if (type) types.add(type);
    });
    return Array.from(types).sort();
  }, [items]);

  const uniqueColors = useMemo(() => {
    const colors = new Set<string>();
    items.forEach(item => {
      item.analysis.colors?.forEach(color => colors.add(color.toLowerCase()));
    });
    return Array.from(colors).sort();
  }, [items]);

  // Removed unused variable uniqueOccasions

  // Extract unique seasons
  const uniqueSeasons = useMemo(() => {
    const seasons = new Set<string>();
    items.forEach(item => {
      const season = item.analysis.season?.toLowerCase();
      if (season) seasons.add(season);
    });
    return Array.from(seasons).sort();
  }, [items]);

  // Filter items based on selected filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Favorites filter
      if (showFavoritesOnly && !(item.favorite || item.isFavorite)) {
        return false;
      }

      // Type filter
      if (filterType !== 'all') {
        const itemType = (item.analysis.clothing_type || item.analysis.itemType || '').toLowerCase();
        if (!itemType.includes(filterType.toLowerCase())) {
          return false;
        }
      }

      // Color filter
      if (filterColor !== 'all') {
        const hasColor = item.analysis.colors?.some(c => 
          c.toLowerCase().includes(filterColor.toLowerCase())
        );
        if (!hasColor) {
          return false;
        }
      }

      // Occasion filter
      if (filterOccasion !== 'all') {
        const occasions = item.analysis.occasions?.map(o => o.toLowerCase()) || [];
        if (!occasions.includes(filterOccasion.toLowerCase())) {
          return false;
        }
      }

      // Season filter
      if (filterSeason !== 'all') {
        const season = item.analysis.season?.toLowerCase() || '';
        if (season !== filterSeason.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [items, showFavoritesOnly, filterType, filterColor, filterOccasion, filterSeason]);

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
        <h2>My Wardrobe ({filteredItems.length} items)</h2>
        
        <div className="gallery-filters">
          <button 
            className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            ❤️ Favorites Only
          </button>

          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select 
            value={filterColor} 
            onChange={(e) => setFilterColor(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Colors</option>
            {uniqueColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          <select 
            value={filterSeason} 
            onChange={(e) => setFilterSeason(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Seasons</option>
            {uniqueSeasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>

          {(showFavoritesOnly || filterType !== 'all' || filterColor !== 'all' || filterOccasion !== 'all' || filterSeason !== 'all') && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setShowFavoritesOnly(false);
                setFilterType('all');
                setFilterColor('all');
                setFilterOccasion('all');
                setFilterSeason('all');
              }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="empty-wardrobe">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3>No items match your filters</h3>
          <p>Try adjusting your filter settings</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredItems.map((item) => (
          <div key={item.id} className="wardrobe-item" onClick={() => onSelectItem && onSelectItem(item)}>
            <div className="item-image-container">
              {(item.imageData || item.imageUrl) && (
                <img 
                  src={item.imageData || item.imageUrl} 
                  alt={item.analysis.itemType || item.analysis.clothing_type || 'clothing'} 
                  className="item-image" 
                />
              )}
              
              <button
                className={`favorite-btn ${(item.favorite || item.isFavorite) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
              >
                {(item.favorite || item.isFavorite) ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div className="item-details">
              <h3 className="item-type">{item.analysis.itemType || item.analysis.clothing_type}</h3>
              
              <div className="item-colors">
                {item.analysis.colors?.slice(0, 3).map((color, idx) => (
                  <span key={idx} className="color-badge">{color}</span>
                ))}
              </div>
              
              <div className="item-tags">
                <span className="tag">{item.analysis.style}</span>
                {item.analysis.formality && <span className="tag">{item.analysis.formality}</span>}
                {item.analysis.season && <span className="tag">{item.analysis.season}</span>}
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
              
              <button
                className="shopping-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItemForShopping(item);
                }}
              >
                🛍️ Find Similar
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
      
      {selectedItemForShopping && (
        <ShoppingRecommendations 
          analysis={selectedItemForShopping.analysis}
          onClose={() => setSelectedItemForShopping(null)}
        />
      )}
    </div>
  );
};

export default WardrobeGallery;
