import React from 'react';
import HeroShowcase from './HeroShowcase';
import './ShowcasePage.scss';

/**
 * Showcase Page - Main page for demonstrating our consolidated component system
 */
export default function ShowcasePage() {
  return (
    <div className="showcase-page">
      <div className="showcase-nav">
        <h2>Consolidated Components Showcase</h2>
        <p>A unified approach to the component system</p>
      </div>

      <main className="showcase-content">
        <HeroShowcase />

        <div className="showcase-info">
          <h3>About This Showcase</h3>
          <p>
            This showcase demonstrates the use of consolidated components
            including Buttons, Cards, Carousels, and Backgrounds. These
            components are designed to reduce duplication while maintaining
            consistent styling and behavior across the application.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li>Centralized design tokens and variables</li>
            <li>Component variants through a consistent class naming system</li>
            <li>Responsive design handled consistently</li>
            <li>Reduced code duplication</li>
            <li>Improved maintainability</li>
          </ul>
        </div>
      </main>
    </div>
  );
}