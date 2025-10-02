import { useState, useEffect } from 'react';
import { TimeRange } from '../types';
import { formatTime, parseTimeToSeconds, validateTimeRange } from '../utils/timeFormatting';

interface TimeRangeSelectorProps {
  duration: number;
  onChange: (range: TimeRange) => void;
  initialRange?: TimeRange;
}

export const TimeRangeSelector = ({ duration, onChange, initialRange }: TimeRangeSelectorProps) => {
  const [startTime, setStartTime] = useState(initialRange?.start || 0);
  const [endTime, setEndTime] = useState(initialRange?.end || Math.min(duration, 5));
  const [startInput, setStartInput] = useState(formatTime(initialRange?.start || 0));
  const [endInput, setEndInput] = useState(formatTime(initialRange?.end || Math.min(duration, 5)));
  const [warning, setWarning] = useState<string | null>(null);

  // Update state when initialRange prop changes (e.g., on reset)
  useEffect(() => {
    if (initialRange) {
      setStartTime(initialRange.start);
      setEndTime(initialRange.end);
      setStartInput(formatTime(initialRange.start));
      setEndInput(formatTime(initialRange.end));
    }
  }, [initialRange?.start, initialRange?.end]);

  useEffect(() => {
    const validation = validateTimeRange(startTime, endTime, duration);
    setWarning(validation.error || null);

    if (validation.valid) {
      onChange({ start: startTime, end: endTime });
    }
  }, [startTime, endTime, duration, onChange]);

  const handleStartSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setStartTime(value);
    setStartInput(formatTime(value));
  };

  const handleEndSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setEndTime(value);
    setEndInput(formatTime(value));
  };

  const handleStartInputBlur = () => {
    const seconds = parseTimeToSeconds(startInput);
    const clampedValue = Math.max(0, Math.min(seconds, duration - 0.1));
    setStartTime(clampedValue);
    setStartInput(formatTime(clampedValue));
  };

  const handleEndInputBlur = () => {
    const seconds = parseTimeToSeconds(endInput);
    const clampedValue = Math.max(0.1, Math.min(seconds, duration));
    setEndTime(clampedValue);
    setEndInput(formatTime(clampedValue));
  };

  const selectedDuration = endTime - startTime;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Time Range
        </h3>

        <div className="space-y-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <div className="flex gap-3">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={startTime}
                onChange={handleStartSliderChange}
                className="flex-1"
              />
              <input
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                onBlur={handleStartInputBlur}
                className="w-24 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00:00"
              />
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <div className="flex gap-3">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={endTime}
                onChange={handleEndSliderChange}
                className="flex-1"
              />
              <input
                type="text"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                onBlur={handleEndInputBlur}
                className="w-24 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00:00"
              />
            </div>
          </div>
        </div>

        {/* Duration Display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Duration:</span> {formatTime(selectedDuration)}
          </p>
        </div>

        {/* Warning */}
        {warning && (
          <div className={`mt-4 p-3 rounded-lg ${
            warning.startsWith('Warning')
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              warning.startsWith('Warning') ? 'text-yellow-700' : 'text-red-600'
            }`}>
              {warning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
