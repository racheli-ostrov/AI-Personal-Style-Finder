import React, { useState } from 'react';
import { WardrobeItem } from '../types';
import './DailyOutfitSuggestion.css';

interface DailyOutfitSuggestionProps {
  wardrobeItems: WardrobeItem[];
}

interface OutfitSuggestion {
  items: WardrobeItem[];
  reason: string;
  weather: string;
  temperature: string;
}

const DailyOutfitSuggestion: React.FC<DailyOutfitSuggestionProps> = ({ wardrobeItems }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getWeatherAndSuggestOutfit = async () => {
    if (wardrobeItems.length < 2) {
      setError('You need at least 2 items in your wardrobe to get outfit suggestions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let latitude = 32.0853; // Default: Tel Aviv
      let longitude = 34.7818;

      // Try to get user's location
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Location timeout')), 5000);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeout);
              resolve(pos);
            },
            (err) => {
              clearTimeout(timeout);
              reject(err);
            }
          );
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (locError) {
        console.log('Using default location (Tel Aviv)');
      }

      // Get weather data from WeatherAPI.com
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      
      console.log('Weather API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
      
      if (!apiKey) {
        throw new Error('Weather API key not configured. Please add REACT_APP_WEATHER_API_KEY to your .env file');
      }
      
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`
      );
      
      console.log('Weather API response status:', weatherResponse.status);
      
      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text();
        console.error('Weather API error:', errorText);
        throw new Error(`Failed to fetch weather data: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      console.log('Weather data:', weatherData);
      console.log('Temperature:', current.temp_c);
      console.log('Weather code:', current.condition.code);
      console.log('Available items:', wardrobeItems);

      // Analyze wardrobe and suggest outfit based on weather
      const outfitSuggestion = analyzeWardrobeForWeather(
        wardrobeItems,
        current.temp_c,
        current.condition.code
      );

      console.log('Outfit suggestion:', outfitSuggestion);

      setSuggestion(outfitSuggestion);
    } catch (err: any) {
      console.error('Error getting outfit suggestion:', err);
      setError('Failed to get weather data. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeWardrobeForWeather = (
    items: WardrobeItem[],
    temperature: number,
    weatherCode: number
  ): OutfitSuggestion => {
    // WeatherAPI.com weather condition codes
    const getWeatherDescription = (code: number): string => {
      if (code === 1000) return 'Clear sky';
      if (code === 1003 || code === 1006) return 'Partly cloudy';
      if (code === 1009) return 'Overcast';
      if (code >= 1063 && code <= 1201) return 'Rainy';
      if (code >= 1210 && code <= 1282) return 'Snowy';
      if (code >= 1273 && code <= 1282) return 'Stormy';
      return 'Variable weather';
    };

    const weatherDesc = getWeatherDescription(weatherCode);
    const tempC = Math.round(temperature);

    console.log('Analyzing wardrobe...');
    console.log('Items received:', items.length);
    console.log('Temperature:', tempC);

    // Categorize items by type
    const getItemType = (item: WardrobeItem): string => {
      const type = (item.analysis.clothing_type || item.analysis.itemType || '').toLowerCase();
      console.log('Item type:', type, 'Style:', item.analysis.style);
      return type;
    };

    // Separate items into categories
    const dresses = items.filter(item => {
      const type = getItemType(item);
      return type.includes('dress') || type.includes('שמלה');
    });

    const tops = items.filter(item => {
      const type = getItemType(item);
      return type.includes('shirt') || type.includes('blouse') || type.includes('חולצה') || 
             type.includes('t-shirt') || type.includes('top') || type.includes('sweater') ||
             type.includes('hoodie');
    });

    const bottoms = items.filter(item => {
      const type = getItemType(item);
      const isBottom = type.includes('pants') || type.includes('jeans') || type.includes('מכנסיים') ||
             type.includes('shorts') || type.includes('skirt') || type.includes('חצאית') ||
             type.includes('trousers') || type.includes('leggings');
      if (isBottom) {
        console.log('Found bottom item:', type);
      }
      return isBottom;
    });

    const outerwear = items.filter(item => {
      const type = getItemType(item);
      return type.includes('jacket') || type.includes('coat') || type.includes('ז\'קט') ||
             type.includes('cardigan') || type.includes('blazer');
    });

    const shoes = items.filter(item => {
      const type = getItemType(item);
      return type.includes('shoe') || type.includes('boot') || type.includes('נעל');
    });

    console.log('Categories - Dresses:', dresses.length, 'Tops:', tops.length, 'Bottoms:', bottoms.length);

    const selectedItems: WardrobeItem[] = [];
    let reason = '';
    const missingItems: string[] = [];

    // Strategy 1: Try to find a complete dress outfit
    if (dresses.length > 0) {
      selectedItems.push(dresses[0]);
      if (tempC < 15 && outerwear.length > 0) {
        selectedItems.push(outerwear[0]);
      }
      if (shoes.length > 0) {
        selectedItems.push(shoes[0]);
      }
      reason = `Perfect outfit for ${tempC}°C! This dress makes a complete look.`;
    }
    // Strategy 2: Try to pair a top with bottoms
    else if (tops.length > 0 || bottoms.length > 0) {
      // Check what we have and what's missing
      if (tops.length > 0) {
        selectedItems.push(tops[0]);
      } else {
        missingItems.push('a top (shirt/blouse)');
      }
      
      if (bottoms.length > 0) {
        selectedItems.push(bottoms[0]);
      } else {
        missingItems.push('bottoms (pants/skirt)');
      }
      
      if (tempC < 15 && outerwear.length > 0) {
        selectedItems.push(outerwear[0]);
      }
      if (shoes.length > 0) {
        selectedItems.push(shoes[0]);
      }
      
      if (missingItems.length > 0) {
        reason = `For ${tempC}°C, you could wear this! 💡 Consider adding: ${missingItems.join(' and ')}.`;
      } else {
        reason = `Great combination for ${tempC}°C! This top pairs well with these bottoms.`;
      }
    }
    // Strategy 3: Need complete outfit
    else {
      // We don't have tops, bottoms, or dresses
      missingItems.push('a dress OR (a shirt and skirt/pants)');
      
      // Add whatever items we have
      if (outerwear.length > 0) selectedItems.push(outerwear[0]);
      if (shoes.length > 0) selectedItems.push(shoes[0]);
      
      // If still nothing, just take first items
      if (selectedItems.length === 0 && items.length > 0) {
        selectedItems.push(items[0]);
        if (items.length > 1) selectedItems.push(items[1]);
      }
      
      reason = `For ${tempC}°C weather. 💡 To complete your wardrobe, consider adding: ${missingItems.join(', ')}.`;
    }

    // Add weather-specific advice
    if (weatherCode >= 1063 && weatherCode <= 1201) {
      reason += ' Don\'t forget an umbrella!';
    } else if (tempC < 10) {
      reason += ' Layer up to stay warm!';
    } else if (tempC > 25) {
      reason += ' Stay cool and hydrated!';
    }

    console.log('Selected items:', selectedItems.length, selectedItems.map(i => getItemType(i)));

    return {
      items: selectedItems,
      reason,
      weather: weatherDesc,
      temperature: `${tempC}°C`
    };
  };

  return (
    <div className="daily-outfit-suggestion">
      <div className="suggestion-header">
        <h3>👔 Daily Outfit Suggestion</h3>
        <p>Get personalized outfit recommendations based on today's weather</p>
      </div>

      <button 
        className="suggest-button"
        onClick={getWeatherAndSuggestOutfit}
        disabled={loading || wardrobeItems.length < 2}
      >
        {loading ? (
          <>
            <span className="spinner-small"></span>
            Getting suggestion...
          </>
        ) : (
          <>
            🌤️ What should I wear today?
          </>
        )}
      </button>

      {error && (
        <div className="suggestion-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {suggestion && (
        <div className="suggestion-result">
          <div className="weather-info">
            <h4>Today's Weather</h4>
            <p className="weather-details">
              <span className="temperature">{suggestion.temperature}</span>
              <span className="weather-desc">{suggestion.weather}</span>
            </p>
          </div>

          <div className="suggestion-reason">
            <p>{suggestion.reason}</p>
          </div>

          <div className="suggested-items">
            <h4>Recommended Outfit:</h4>
            <div className="outfit-grid">
              {suggestion.items.map((item, index) => (
                <div key={item.id} className="outfit-item">
                  <div className="item-badge">Item {index + 1}</div>
                  {(item.imageData || item.imageUrl) && (
                    <img 
                      src={item.imageData || item.imageUrl} 
                      alt={item.analysis.clothing_type || item.analysis.itemType} 
                    />
                  )}
                  <div className="item-info">
                    <span className="item-type">{item.analysis.clothing_type || item.analysis.itemType}</span>
                    <span className="item-style">{item.analysis.style}</span>
                    <div className="item-colors">
                      {item.analysis.colors?.slice(0, 3).map((color, i) => (
                        <span key={i} className="color-tag">{color}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyOutfitSuggestion;
