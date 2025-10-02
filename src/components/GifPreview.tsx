import { useState, useEffect } from 'react';
import { formatFileSize } from '../utils/fileValidation';

interface GifPreviewProps {
  gifBlob: Blob | null;
  onReset: () => void;
}

export const GifPreview = ({ gifBlob, onReset }: GifPreviewProps) => {
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    if (gifBlob) {
      const url = URL.createObjectURL(gifBlob);
      setGifUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setGifUrl(null);
    }
  }, [gifBlob]);

  if (!gifBlob || !gifUrl) {
    return null;
  }

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = `gif-${Date.now()}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Your GIF is ready!
      </h3>

      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={gifUrl}
          alt="Generated GIF"
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">
          File size: <span className="font-medium">{formatFileSize(gifBlob.size)}</span>
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Download GIF
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Create Another
        </button>
      </div>
    </div>
  );
};
