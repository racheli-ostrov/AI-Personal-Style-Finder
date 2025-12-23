import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WardrobeGallery from './WardrobeGallery';
import { WardrobeItem } from '../../types';

const items: WardrobeItem[] = [
  {
    id: '1',
    imageUrl: 'img1.jpg',
    favorite: false,
    analysis: {
      itemType: 'shirt',
      colors: ['blue'],
      style: 'casual',
      formality: 'casual',
      occasions: [],
      season: 'summer',
    },
  },
  {
    id: '2',
    imageUrl: 'img2.jpg',
    favorite: true,
    analysis: {
      itemType: 'pants',
      colors: ['black'],
      style: 'formal',
      formality: 'business',
      occasions: [],
      season: 'winter',
    },
  },
];

describe('WardrobeGallery – Integration Test', () => {
  test('filters items by type using the select filter', () => {
    render(
      <WardrobeGallery
        items={items}
        onDelete={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );

    // יש 3 selectים: type, color, season – הראשון הוא type
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'shirt' } });

    // shirt נשאר (בודק h3 בלבד)
    const shirtHeadings = screen.getAllByText(/shirt/i).filter(el => el.tagName === 'H3');
    expect(shirtHeadings.length).toBeGreaterThan(0);

    // pants נעלם (בודק h3 בלבד)
    const pantsHeadings = screen.queryAllByText(/pants/i).filter(el => el.tagName === 'H3');
    expect(pantsHeadings.length).toBe(0);
  });

  test('favorites filter hides non-favorite items', () => {
    render(
      <WardrobeGallery
        items={items}
        onDelete={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText(/favorites only/i));

    // pants מופיע כ-item (בודק h3 בלבד)
    const pantsHeadings = screen.getAllByText(/pants/i).filter(el => el.tagName === 'H3');
    expect(pantsHeadings.length).toBeGreaterThan(0);
    // shirt לא מופיע כ-item (בודק h3 בלבד)
    const shirtHeadings = screen.queryAllByText(/shirt/i).filter(el => el.tagName === 'H3');
    expect(shirtHeadings.length).toBe(0);
  });
});
