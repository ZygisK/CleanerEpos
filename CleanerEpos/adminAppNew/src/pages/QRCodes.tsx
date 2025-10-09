import React from 'react';
import { Download, Printer } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const QRCodes: React.FC = () => {
  const menuUrl = `${window.location.origin}/menu`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(menuUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'menu-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Code</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handlePrint} variant="secondary">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <div className="space-y-6 p-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Menu</h2>
              <p className="text-gray-600">Scan to view menu and place your order</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <img
                src={qrCodeUrl}
                alt="QR Code for Menu Access"
                className="w-64 h-64 border-4 border-gray-200 rounded-lg"
              />
            </div>

            {/* Instructions */}
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">How to use:</p>
              <div className="space-y-1 text-left">
                <p>1. Scan this QR code with your phone</p>
                <p>2. Select your table number</p>
                <p>3. Browse the menu and add items to cart</p>
                <p>4. Place your order</p>
              </div>
            </div>

            {/* URL Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Menu URL:</p>
              <code className="text-sm text-gray-700 break-all">{menuUrl}</code>
            </div>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:visible,
          .print\\:visible * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

