import React from 'react';
import './page-header.scss';
import TranslatedText from '../text/TranslatedText';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="page-header">
      <div className="container">
        <div className="page-header-content">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;