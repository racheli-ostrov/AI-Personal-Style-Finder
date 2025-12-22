import React, { useState } from 'react';
import { getShoppingRecommendations, ShoppingRecommendation } from '../../services/shopping';
import './ShoppingRecommendations.css';

interface ShoppingRecommendationsProps {
  analysis: any;
  onClose: () => void;
}

const ShoppingRecommendations: React.FC<ShoppingRecommendationsProps> = ({ analysis, onClose }) => {
  const [recommendations, setRecommendations] = useState<ShoppingRecommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


  const loadRecommendations = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getShoppingRecommendations(analysis);
      if (response.success) {
        setRecommendations(response.recommendations);
        setSearchQuery(response.search_query);
      } else {
        setError(response.error || 'Failed to load recommendations');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [analysis]);

  React.useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  return (
    <div className="shopping-modal-overlay" onClick={onClose}>
      <div className="shopping-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shopping-header">
          <h2>🛍️ Shopping Recommendations</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {loading && (
          <div className="shopping-loading">
            <div className="spinner"></div>
            <p>Finding similar items...</p>
          </div>
        )}

        {error && (
          <div className="shopping-error">
            <p>❌ {error}</p>
            <button onClick={loadRecommendations}>Try Again</button>
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <>
            <div className="search-query">
              <p>Searching for: <strong>{searchQuery}</strong></p>
            </div>

            <div className="recommendations-list">
              {recommendations.map((rec, index) => (
                <a
                  key={index}
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recommendation-card"
                >
                  <span className="store-emoji">{rec.emoji}</span>
                  <div className="store-info">
                    <h3>{rec.store}</h3>
                    <p>Search for "{rec.query}"</p>
                  </div>
                  <span className="external-link">→</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingRecommendations;
