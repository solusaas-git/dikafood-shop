import React, { useState, useEffect } from 'react';
import LucideIcon from '../icons/LucideIcon';

/**
 * Real-time Background Elements Component
 * Shows time, location, weather, and rotating olive oil tips
 * Positioned as overlay elements that don't interfere with page flow
 */
const RealTimeElements = React.memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationInfo, setLocationInfo] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Olive oil tips and benefits in French
  const oliveOilHints = [
    {
      icon: 'leaf',
      text: "L'huile d'olive extra vierge contient plus de 30 composés phénoliques aux propriétés antioxydantes."
    },
    {
      icon: 'heart',
      text: "Consommer 2 cuillères à soupe d'huile d'olive par jour réduit le risque de maladies cardiovasculaires."
    },
    {
      icon: 'star',
      text: "L'huile d'olive marocaine est reconnue mondialement pour sa qualité exceptionnelle et son goût unique."
    },
    {
      icon: 'sun',
      text: "L'huile d'olive se conserve mieux dans un endroit frais et sombre, à l'abri de la lumière."
    },
    {
      icon: 'droplets',
      text: "L'acidité d'une huile d'olive extra vierge ne doit pas dépasser 0,8% pour garantir sa qualité."
    },
    {
      icon: 'brain',
      text: "Les antioxydants de l'huile d'olive protègent le cerveau et améliorent les fonctions cognitives."
    },
    {
      icon: 'shield',
      text: "L'huile d'olive renforce le système immunitaire grâce à ses propriétés anti-inflammatoires."
    },
    {
      icon: 'sparkles',
      text: "L'huile d'olive extra vierge à froid préserve tous ses bienfaits nutritionnels et son arôme."
    },
    {
      icon: 'zap',
      text: "L'huile d'olive augmente l'absorption des vitamines A, D, E et K par l'organisme."
    },
    {
      icon: 'award',
      text: "Le Maroc produit certaines des meilleures huiles d'olive au monde, notamment dans les régions de Meknès et Fès."
    }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate olive oil hints every 5 seconds
  useEffect(() => {
    const hintTimer = setInterval(() => {
      setCurrentHintIndex((prevIndex) => 
        (prevIndex + 1) % oliveOilHints.length
      );
    }, 5000);
    return () => clearInterval(hintTimer);
  }, [oliveOilHints.length]);

  // Get user location and weather - using fallback data to avoid CORS issues
  useEffect(() => {
    // Set fallback location and weather data
    // In production, you could use a backend API to get this data
    setLocationInfo({
      city: 'Casablanca',
      country: 'Maroc',
      timezone: 'Africa/Casablanca'
    });
    
    // Generate random weather data for demo
    const conditions = ['Ensoleillé', 'Nuageux', 'Partiellement nuageux'];
    const temps = [18, 19, 20, 21, 22, 23, 24, 25, 26];
    
    setWeatherInfo({
      temp: temps[Math.floor(Math.random() * temps.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      icon: '01d'
    });
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Translate weather conditions to French
  const translateWeatherCondition = (condition) => {
    const translations = {
      'Clear': 'Ensoleillé',
      'Clouds': 'Nuageux',
      'Rain': 'Pluvieux',
      'Snow': 'Neigeux',
      'Thunderstorm': 'Orageux',
      'Drizzle': 'Bruine',
      'Mist': 'Brumeux',
      'Fog': 'Brouillard',
      'Haze': 'Voilé',
      'Sunny': 'Ensoleillé'
    };
    return translations[condition] || condition;
  };

  // Translate common country names to French
  const translateCountryName = (country) => {
    const translations = {
      'Morocco': 'Maroc',
      'France': 'France',
      'Spain': 'Espagne',
      'United States': 'États-Unis',
      'United Kingdom': 'Royaume-Uni',
      'Germany': 'Allemagne',
      'Italy': 'Italie',
      'Belgium': 'Belgique',
      'Netherlands': 'Pays-Bas',
      'Canada': 'Canada',
      'Algeria': 'Algérie',
      'Tunisia': 'Tunisie'
    };
    return translations[country] || country;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Right Side Panel - Grid Layout on Mobile, Vertical on Desktop */}
      <div className="absolute top-2 right-2 md:top-8 md:right-8 grid grid-cols-2 md:flex md:flex-col gap-1.5 md:gap-4 max-w-[calc(100vw-16px)] md:max-w-none">
        
        {/* Location */}
        {locationInfo && (
          <div className="text-xs md:text-sm font-medium">
            <div className="flex items-center justify-center gap-1 md:gap-2 bg-white/90 backdrop-blur-md rounded-lg md:rounded-full px-2 md:px-4 py-2 md:py-2 shadow-lg border border-white/20 h-8 md:h-auto w-full">
              <LucideIcon name="map-pin" size="sm" className="text-dark-green-7 flex-shrink-0" />
              <span className="text-dark-green-7 truncate text-[10px] md:text-xs">{locationInfo.city}, {translateCountryName(locationInfo.country)}</span>
            </div>
          </div>
        )}

        {/* Weather */}
        {weatherInfo && (
          <div className="text-xs md:text-sm font-medium">
            <div className="flex items-center justify-center gap-1 md:gap-2 bg-white/90 backdrop-blur-md rounded-lg md:rounded-full px-2 md:px-4 py-2 md:py-2 shadow-lg border border-white/20 h-8 md:h-auto w-full">
              <LucideIcon name="cloud" size="sm" className="text-dark-green-7 flex-shrink-0" />
              <span className="text-dark-green-7 truncate text-[10px] md:text-xs">{weatherInfo.temp}°C • {translateWeatherCondition(weatherInfo.condition)}</span>
            </div>
          </div>
        )}

        {/* Time - Larger Card */}
        <div className="font-medium">
          <div className="bg-white/95 backdrop-blur-md rounded-lg md:rounded-2xl px-2 md:px-5 py-2 md:py-4 shadow-lg border border-white/30 h-8 md:h-auto w-full">
            <div className="flex items-center justify-center gap-1.5 md:gap-3">
              <LucideIcon name="clock" size="sm" className="text-logo-lime flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs md:text-xl font-bold text-dark-green-7 truncate">{formatTime(currentTime)}</div>
                <div className="text-[8px] md:text-xs text-dark-green-6 hidden md:block truncate">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Tag */}
        <div className="text-xs">
          <div className="flex items-center justify-center gap-1 md:gap-2 bg-dark-green-7/90 backdrop-blur-md rounded-lg md:rounded-full px-2 md:px-3 py-2 md:py-2 shadow-lg border border-logo-lime/30 h-8 md:h-auto w-full">
            <LucideIcon name="leaf" size="sm" className="text-logo-lime flex-shrink-0" />
            <span className="text-white text-[8px] md:text-xs truncate">DikaFood • Authenticité Marocaine</span>
          </div>
        </div>

      </div>

      {/* Bottom Center - Dynamic Olive Oil Hints */}
      <div className="absolute bottom-4 md:bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:max-w-2xl">
        <div className="bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-center shadow-xl border border-white/30">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <LucideIcon 
              name={oliveOilHints[currentHintIndex].icon} 
              size="sm" 
              className="text-logo-lime flex-shrink-0 md:hidden" 
            />
            <LucideIcon 
              name={oliveOilHints[currentHintIndex].icon} 
              size="md" 
              className="text-logo-lime flex-shrink-0 hidden md:block" 
            />
            <p className="text-xs md:text-sm font-medium leading-relaxed text-dark-green-7">
              {oliveOilHints[currentHintIndex].text}
            </p>
          </div>
          {/* Progress indicator */}
          <div className="flex justify-center gap-1 mt-2 md:mt-3">
            {oliveOilHints.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 md:w-2 h-1 rounded-full transition-all duration-300 ${
                  index === currentHintIndex 
                    ? 'bg-logo-lime w-4 md:w-6' 
                    : 'bg-dark-green-6/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

RealTimeElements.displayName = 'RealTimeElements';

export default RealTimeElements;
