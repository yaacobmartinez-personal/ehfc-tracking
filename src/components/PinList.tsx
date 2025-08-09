'use client';

import { UserPin } from '../types/map';

interface PinListProps {
  pins: UserPin[];
  onPinClick: (pin: UserPin) => void;
  isVisible: boolean;
}

export default function PinList({ pins, onPinClick, isVisible }: PinListProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* Desktop version - right side */}
      <div className="hidden md:block fixed top-20 right-4 w-80 max-h-[calc(100vh-6rem)] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Locations ({pins.length})</h3>
        </div>
        
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          {pins.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>No locations added yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pins.map((pin) => (
                <div
                  key={pin.id}
                  onClick={() => onPinClick(pin)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {pin.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
                      </p>
                      {pin.assignees.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-medium">Assignees:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pin.assignees.slice(0, 2).map((assignee, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {assignee}
                              </span>
                            ))}
                            {pin.assignees.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{pin.assignees.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {pin.targetFamilies.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-medium">Target Families:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pin.targetFamilies.slice(0, 2).map((family, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {family}
                              </span>
                            ))}
                            {pin.targetFamilies.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{pin.targetFamilies.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile version - horizontal scrollable list at bottom left */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-20">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {pins.map((pin) => (
            <div
              key={pin.id}
              onClick={() => onPinClick(pin)}
              className="flex-shrink-0 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-blue-100 transition-colors duration-150 w-[38vw]"
            >
              <span className="text-sm font-medium text-blue-900 whitespace-nowrap">
                {pin.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
