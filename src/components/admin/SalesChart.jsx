'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/i18n';

const SalesChart = () => {
  const { t } = useTranslation();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        
        // Import the API service
        const { api } = await import('../../services/api.js');
        
        // Use the API service which handles authentication headers correctly
        const response = await api.request(`/admin/dashboard/sales?period=${selectedPeriod}`);
        
        if (response.success) {
          setSalesData(response.data.sales);
        } else {
          setError(response.message || t('admin.error.loadingSales'));
        }
      } catch (err) {
        setError(t('admin.error.loadingSales'));
        console.error('Sales data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedPeriod]);

  const maxSales = salesData.length > 0 ? Math.max(...salesData.map(d => d.sales)) : 1;

  const formatDayLabel = (dayLabel) => {
    if (!dayLabel) return '';
    
    // Handle "Week X" patterns
    if (dayLabel.match(/^Week\s+\d+$/i)) {
      const weekNumber = dayLabel.replace(/Week\s+/i, '');
      return `Semaine ${weekNumber}`;
    }
    
    // Handle "Day X" patterns  
    if (dayLabel.match(/^Day\s+\d+$/i)) {
      const dayNumber = dayLabel.replace(/Day\s+/i, '');
      return `Jour ${dayNumber}`;
    }
    
    // Handle "Month X" patterns
    if (dayLabel.match(/^Month\s+\d+$/i)) {
      const monthNumber = dayLabel.replace(/Month\s+/i, '');
      return `Mois ${monthNumber}`;
    }
    
    // Convert common English day/month abbreviations to French
    const englishToFrench = {
      'Mon': 'Lun',
      'Tue': 'Mar', 
      'Wed': 'Mer',
      'Thu': 'Jeu',
      'Fri': 'Ven',
      'Sat': 'Sam',
      'Sun': 'Dim',
      'Jan': 'janv.',
      'Feb': 'févr.',
      'Mar': 'mars',
      'Apr': 'avr.',
      'May': 'mai',
      'Jun': 'juin',
      'Jul': 'juil.',
      'Aug': 'août',
      'Sep': 'sept.',
      'Oct': 'oct.',
      'Nov': 'nov.',
      'Dec': 'déc.',
      'Week': 'Semaine',
      'Day': 'Jour',
      'Month': 'Mois'
    };
    
    // First, try to replace any English abbreviations
    let formattedLabel = dayLabel;
    Object.keys(englishToFrench).forEach(eng => {
      formattedLabel = formattedLabel.replace(new RegExp(`\\b${eng}\\b`, 'gi'), englishToFrench[eng]);
    });
    
    // If it's a date string that can be parsed, format it properly in French
    try {
      const date = new Date(dayLabel);
      if (!isNaN(date.getTime()) && (dayLabel.includes('-') || dayLabel.includes('/'))) {
        // For different period types, format accordingly
        if (selectedPeriod === '7days') {
          return date.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric'
          });
        } else if (selectedPeriod === '30days') {
          return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
          });
        } else if (selectedPeriod === '3months') {
          return date.toLocaleDateString('fr-FR', {
            month: 'short',
            year: '2-digit'
          });
        }
      }
    } catch (e) {
      // If date parsing fails, continue with string replacement
    }
    
    // Return the label with English->French replacements
    return formattedLabel;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
              <div className="w-8 h-4 bg-gray-200 rounded mr-3"></div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                <div className="bg-gray-200 h-full rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">📊</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('admin.sales.overview')}</h3>
        <select 
          className="text-sm border border-gray-300 rounded-md px-3 py-1"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="7days">{t('admin.sales.last7days')}</option>
          <option value="30days">{t('admin.sales.last30days')}</option>
          <option value="3months">{t('admin.sales.last3months')}</option>
        </select>
      </div>

      {salesData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-3">📊</div>
          <p className="text-gray-500">{t('admin.sales.noData')}</p>
        </div>
      ) : (
        <>
          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {salesData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-12 text-sm text-gray-600 text-right mr-3">
                  {formatDayLabel(item.day)}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div 
                    className="bg-logo-lime h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${maxSales > 0 ? (item.sales / maxSales) * 100 : 0}%` }}
                  >
                    {item.sales > 0 && (
                      <span className="text-xs font-medium text-dark-green-7">
                        {item.sales.toLocaleString()} MAD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-600">{t('admin.sales.totalSales')}</span>
                <span className="font-semibold text-gray-900 ml-2">
                  {salesData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()} MAD
                </span>
              </div>
              <div>
                <span className="text-gray-600">{t('admin.sales.average')}</span>
                <span className="font-semibold text-gray-900 ml-2">
                  {Math.round(salesData.reduce((sum, item) => sum + item.sales, 0) / salesData.length).toLocaleString()} MAD
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesChart;
