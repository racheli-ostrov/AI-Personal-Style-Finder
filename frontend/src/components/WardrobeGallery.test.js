import React from 'react';
import { render, screen } from '@testing-library/react';
import WardrobeGallery from './WardrobeGallery';

describe('WardrobeGallery Component', () => {
  test('renders empty wardrobe message when no items', () => {
    render(<WardrobeGallery items={[]} onDelete={() => {}} onToggleFavorite={() => {}} />);
    expect(screen.getByText(/Your wardrobe is empty/i)).toBeInTheDocument();
  });

  test('renders wardrobe items when provided', () => {
    const mockItems = [
      {
        id: '1',
        analysis: {
          itemType: 'shirt',
          colors: ['blue', 'white'],
          style: 'casual',
          formality: 'casual'
        },
        favorite: false
      },
      {
        id: '2',
        analysis: {
          itemType: 'pants',
          colors: ['black'],
          style: 'formal',
          formality: 'business casual'
        },
        favorite: true
      }
    ];

    render(<WardrobeGallery items={mockItems} onDelete={() => {}} onToggleFavorite={() => {}} />);
    
    expect(screen.getByText(/My Wardrobe \(2 items\)/i)).toBeInTheDocument();
    expect(screen.getByText('shirt')).toBeInTheDocument();
    expect(screen.getByText('pants')).toBeInTheDocument();
  });

  test('displays item colors correctly', () => {
    const mockItems = [
      {
        id: '1',
        analysis: {
          itemType: 'shirt',
          colors: ['blue', 'white', 'red'],
          style: 'casual',
          formality: 'casual'
        }
      }
    ];

    render(<WardrobeGallery items={mockItems} onDelete={() => {}} onToggleFavorite={() => {}} />);
    
    expect(screen.getByText('blue')).toBeInTheDocument();
    expect(screen.getByText('white')).toBeInTheDocument();
    expect(screen.getByText('red')).toBeInTheDocument();
  });
});
