'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '@/components/ui/slider';

const PriceRangeSlider = ({ products }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Find min and max prices from products
  const minProductPrice = Math.min(...products?.map(p => p.Price));
  const maxProductPrice = Math.max(...products?.map(p => p.Price));

  // Initialize state with URL params or product price range
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || minProductPrice,
    Number(searchParams.get('maxPrice')) || maxProductPrice
  ]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Update URL with debounce
  const updateURL = useCallback(
    debounce((minPrice, maxPrice) => {
      const params = new URLSearchParams(searchParams);
      params.set('minPrice', minPrice);
      params.set('maxPrice', maxPrice);
      router.push(`?${params.toString()}`);
    }, 500),
    [router, searchParams]
  );

  // Handle slider change
  const handleSliderChange = (newValues) => {
    setPriceRange(newValues);
    updateURL(newValues[0], newValues[1]);
  };

  return (
    <div className="w-screen max-w-[320px] relative space-y-4 ">
      <div className="flex justify-between text-xs text-gray-500 absolute -top-3 w-full px-2">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
      <Slider
        min={0}
        max={maxProductPrice}
        step={1}
        value={priceRange}
        onValueChange={handleSliderChange}
      />
    </div>
  );
};

export default PriceRangeSlider;