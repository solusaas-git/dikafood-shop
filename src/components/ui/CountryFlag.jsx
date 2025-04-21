import React from 'react';
import PropTypes from 'prop-types';

// Import country flag CSS
import './CountryFlag.scss';

const CountryFlag = ({ country, size = 'medium' }) => {
  // Normalize country name to lowercase and remove accents
  const normalizeCountry = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Map of country names to ISO codes
  const countryToCode = {
    // French countries
    'france': 'fr',
    'belgique': 'be',
    'suisse': 'ch',
    'canada': 'ca',
    'maroc': 'ma',
    'algerie': 'dz',
    'tunisie': 'tn',
    'senegal': 'sn',
    'cote divoire': 'ci',
    'cameroun': 'cm',
    'mali': 'ml',
    'congo': 'cg',
    'republique democratique du congo': 'cd',
    'madagascar': 'mg',
    'haiti': 'ht',
    'niger': 'ne',
    'guinee': 'gn',
    'gabon': 'ga',
    'italie': 'it',
    'espagne': 'es',
    'allemagne': 'de',
    'royaume uni': 'gb',
    'pays bas': 'nl',
    'etats unis': 'us',
    'bresil': 'br',
    'argentine': 'ar',
    'mexique': 'mx',
    'chine': 'cn',
    'japon': 'jp',
    'coree du sud': 'kr',
    'inde': 'in',
    'australie': 'au',
    'nouvelle zelande': 'nz',

    // English countries
    'france': 'fr',
    'belgium': 'be',
    'switzerland': 'ch',
    'canada': 'ca',
    'morocco': 'ma',
    'algeria': 'dz',
    'tunisia': 'tn',
    'senegal': 'sn',
    'ivory coast': 'ci',
    'cameroon': 'cm',
    'mali': 'ml',
    'congo': 'cg',
    'democratic republic of congo': 'cd',
    'madagascar': 'mg',
    'haiti': 'ht',
    'niger': 'ne',
    'guinea': 'gn',
    'gabon': 'ga',
    'italy': 'it',
    'spain': 'es',
    'germany': 'de',
    'united kingdom': 'gb',
    'netherlands': 'nl',
    'united states': 'us',
    'usa': 'us',
    'brazil': 'br',
    'argentina': 'ar',
    'mexico': 'mx',
    'china': 'cn',
    'japan': 'jp',
    'south korea': 'kr',
    'india': 'in',
    'australia': 'au',
    'new zealand': 'nz',
  };

  const normalizedCountry = normalizeCountry(country);
  const countryCode = countryToCode[normalizedCountry] || 'unknown';

  return (
    <span className={`country-flag flag-${size} flag-${countryCode}`} title={country}>
      {countryCode !== 'unknown' ? '' : country}
    </span>
  );
};

CountryFlag.propTypes = {
  country: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default CountryFlag;