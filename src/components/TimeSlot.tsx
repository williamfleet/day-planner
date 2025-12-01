import React from 'react';

interface TimeSlotProps {
  startTime: string;
  endTime: string;
  task: string;
  onTaskChange: (newTast: string) => void;
  isCurrent: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ startTime, endTime, task, onTaskChange, isCurrent }) => {
  return (
    <div
      className={`flex border-b border-gray-200 transition-all duration-300 ${
        isCurrent ? 'bg-yellow-200 scale-105 shadow-lg' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-1/4 text-right pr-8 py-4 border-r border-gray-200">
        <p className="font-bold text-lg text-gray-700">{startTime}</p>
        <p className="text-sm text-gray-500">{endTime}</p>
      </div>
      <div className="w-3/4 p-4">
        <textarea
          className="w-full h-full resize-none border-none focus:outline-none bg-transparent text-lg text-gray-800 placeholder-gray-400"
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
          placeholder="What are you working on?"
        />
      </div>
    </div>
  );
};

export default TimeSlot;
