import { useState, useRef, useEffect } from 'react';

const aspectRatios = [
  { value: '', label: 'Free Selection', ratio: null, exampleSize: null },
  // ➤ Square & Common
  { value: '1', label: 'Square (Instagram / Product)', ratio: '1:1', exampleSize: [1080, 1080] },
  { value: '1.5', label: 'Classic Photo (DSLR / Landscape)', ratio: '3:2', exampleSize: [1500, 1000] },
  { value: '1.333', label: 'Standard (Monitor / Gallery)', ratio: '4:3', exampleSize: [1200, 900] },
  { value: '1.25', label: 'Frame Print', ratio: '5:4', exampleSize: [1250, 1000] },
  // ➤ Widescreen / Social Media
  { value: '1.777', label: 'Widescreen (YouTube / Twitter)', ratio: '16:9', exampleSize: [1920, 1080] },
  { value: '1.91', label: 'Social Post (Facebook / Twitter)', ratio: '1.91:1', exampleSize: [1200, 628] },
  { value: '2.63', label: 'Facebook Cover', ratio: '2.63:1', exampleSize: [820, 312] },
  { value: '3', label: 'Wide Web Banner', ratio: '3:1', exampleSize: [1920, 640] },
  { value: '4', label: 'Ultra Wide Banner', ratio: '4:1', exampleSize: [1920, 480] },
  // ➤ Portrait / Mobile
  { value: '0.8', label: 'Instagram Portrait', ratio: '4:5', exampleSize: [1080, 1350] },
  { value: '0.75', label: 'Passport Size (3.5×4.5 cm)', ratio: '3:4', exampleSize: [413, 531] },
  { value: '0.85', label: 'Stamp Size (2.5×3 cm)', ratio: '~0.85', exampleSize: [295, 354] },
  { value: '0.5625', label: 'Mobile Story (Reel / Shorts)', ratio: '9:16', exampleSize: [1080, 1920] },
  { value: '0.4615', label: 'Splash Screen (iPhone X)', ratio: '9:19.5', exampleSize: [1242, 2688] },
  // ➤ Document / Layouts
  { value: '1.414', label: 'A-Series (A4, A3)', ratio: '1.414:1', exampleSize: [2100, 2970] },
  { value: '2.4', label: 'Cinematic (Movie Screen)', ratio: '2.4:1', exampleSize: [2400, 1000] },
  { value: '1.618', label: 'Golden Ratio (Aesthetic)', ratio: '1.618:1', exampleSize: [1618, 1000] },
];

const CustomSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange({ target: { value: optionValue } }); // Mimic native select onChange event
    setIsOpen(false);
  };

  // Format display text with ratio and label
  const getDisplayText = (option) => {
    if (!option.ratio) return `🆓 ${option.label}`;
    return `${option.ratio} – ${option.label}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        🎯 Aspect Ratio
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-w-[250px] appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex justify-between items-center"
        >
          <span className="truncate">
            {getDisplayText(aspectRatios.find((opt) => opt.value === value) || { label: 'Select Aspect Ratio', ratio: null })}
          </span>
          <svg
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-[200px] overflow-y-auto custom-scrollbar shadow-lg">
            {aspectRatios.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  value === option.value ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                {getDisplayText(option)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;