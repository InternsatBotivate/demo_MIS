import React from 'react';

const HorizontalBarChart = ({ data, labels, colors, maxValue }) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-1 md:space-y-2 lg:space-y-3 h-full justify-center">
        {data.map((value, index) => (
          <div key={index} className="flex items-center space-x-1 md:space-x-2 lg:space-x-3">
            {/* Label */}
            <div className="w-16 md:w-20 lg:w-24 text-xs text-gray-600 truncate">
              {labels[index]}
            </div>
            
            {/* Bar Container */}
            <div className="flex-1 bg-gray-100 rounded-full h-3 md:h-4 lg:h-5 overflow-hidden">
              {/* Bar */}
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(value / maxValue) * 100}%`,
                  backgroundColor: colors[index % colors.length],
                }}
              />
            </div>
            
            {/* Value */}
            <div className="w-6 md:w-8 text-right">
              <span className="text-xs font-semibold text-gray-700">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;