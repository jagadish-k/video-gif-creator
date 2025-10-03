import { FileUploader } from '../components/FileUploader';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              GIF Maker
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-2">
              Convert your videos to GIFs instantly
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              100% browser-based • No uploads • Completely private
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-12">
            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center sm:mb-4 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base sm:mb-2">Fast & Easy</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Convert videos to GIFs in seconds with just a few clicks
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center sm:mb-4 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base sm:mb-2">100% Private</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    All processing happens in your browser. No server uploads.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center sm:mb-4 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base sm:mb-2">Customizable</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Choose time range, quality, frame rate, and dimensions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <FileUploader />

          {/* Instructions */}
          <div className="mt-8 sm:mt-12 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Upload Video</h4>
                  <p className="text-sm text-gray-600">
                    Drag & drop or select your video file
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Select Range</h4>
                  <p className="text-sm text-gray-600">
                    Choose the part you want to convert
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Customize</h4>
                  <p className="text-sm text-gray-600">
                    Adjust settings like FPS and quality
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Download</h4>
                  <p className="text-sm text-gray-600">
                    Generate and download your GIF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
