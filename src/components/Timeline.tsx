'use client';

import React, { useState, useEffect } from 'react';
import TimeSlot from './TimeSlot';

const timeSlotStrings = [
  '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
  '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
  '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM'
];

const timeToMinutes = (time: string) => {
  const [timePart, amPm] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (amPm === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (amPm === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + (minutes || 0);
};

const timeSlots = timeSlotStrings.slice(0, -1).map((startTime, index) => ({
  startTime,
  endTime: timeSlotStrings[index + 1],
  startMinutes: timeToMinutes(startTime),
  endMinutes: timeToMinutes(timeSlotStrings[index + 1]),
}));

const Timeline: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : new Array(timeSlots.length).fill('');
    }
    return new Array(timeSlots.length).fill('');
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleTaskChange = (index: number, newTask: string) => {
    const newTasks = [...tasks];
    newTasks[index] = newTask;
    setTasks(newTasks);
  };

  const getCurrentTimeSlotIndex = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return timeSlots.findIndex(slot => currentMinutes >= slot.startMinutes && currentMinutes < slot.endMinutes);
  };

  const currentIndex = getCurrentTimeSlotIndex();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Today's Plan
        </h1>
        <div className="bg-white rounded-lg shadow-lg">
          {timeSlots.map((slot, index) => (
            <TimeSlot
              key={index}
              startTime={slot.startTime}
              endTime={slot.endTime}
              task={tasks[index]}
              onTaskChange={(newTask) => handleTaskChange(index, newTask)}
              isCurrent={index === currentIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
