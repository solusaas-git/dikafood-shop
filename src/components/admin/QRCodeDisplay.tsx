'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import LucideIcon from '../ui/icons/LucideIcon';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 128, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current || !value) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',  // Black dots
            light: '#FFFFFF'  // White background
          },
          errorCorrectionLevel: 'M'
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('QR Code generation error:', err);
        setError('Failed to generate QR code');
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [value, size]);


  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
           style={{ width: size, height: size }}>
        <div className="text-center text-gray-500">
          <LucideIcon name="warning" size="lg" className="mx-auto mb-2" />
          <p className="text-xs">QR Error</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
        {isLoading && (
          <div className="flex items-center justify-center bg-gray-50 rounded" 
               style={{ width: size, height: size }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-lime"></div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className={`${isLoading ? 'hidden' : 'block'} rounded`}
          style={{ width: size, height: size }}
        />
        
      </div>
    </div>
  );
};

export default QRCodeDisplay;
