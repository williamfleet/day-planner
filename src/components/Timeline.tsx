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

interface Task {
  text: string;
  span: number;
}

const Timeline: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    setIsMounted(true);
    setTasks(timeSlots.map(() => ({ text: '', span: 1 })));

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTaskChange = (index: number, newText: string) => {
    const newTasks = [...tasks];
    newTasks[index].text = newText;
    setTasks(newTasks);
  };

  const handleMerge = (index: number) => {
    const newTasks = [...tasks];
    const currentTask = newTasks[index];
    let nextTaskIndex = index + currentTask.span;
    if (nextTaskIndex < newTasks.length) {
      const nextTask = newTasks[nextTaskIndex];
      if (nextTask.span > 0) {
        currentTask.span += nextTask.span;
        nextTask.span = 0;
        setTasks(newTasks);
      }
    }
  };

  const handleSplit = (index: number) => {
    const newTasks = [...tasks];
    const currentTask = newTasks[index];
    if (currentTask.span > 1) {
      const nextTaskIndex = index + 1;
      const nextTask = newTasks[nextTaskIndex];
      currentTask.span -= 1;
      nextTask.span = 1;
      nextTask.text = '';
      setTasks(newTasks);
    }
  };

  const getCurrentTimeSlotIndex = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return timeSlots.findIndex(slot => currentMinutes >= slot.startMinutes && currentMinutes < slot.endMinutes);
  };

  if (!isMounted) {
    return null;
  }

  const currentIndex = getCurrentTimeSlotIndex();

  let slotContent;
  if (tasks.length === 0) {
    slotContent = <div className="p-8 text-center text-gray-500">Loading...</div>;
  } else {
    const renderedSlots = [];
    for (let i = 0; i < timeSlots.length; i += (tasks[i]?.span || 1)) {
      if (tasks[i] && tasks[i].span > 0) {
        const span = tasks[i].span;
        if (i + span > timeSlots.length) {
          //This is a guard against invalid data from localstorage
          tasks[i].span = 1;
        }
        const endTime = timeSlots[i + tasks[i].span - 1].endTime;
        renderedSlots.push(
          <TimeSlot
            key={i}
            startTime={timeSlots[i].startTime}
            endTime={endTime}
            task={tasks[i].text}
            span={tasks[i].span}
            onTaskChange={(newText) => handleTaskChange(i, newText)}
            onMerge={() => handleMerge(i)}
            onSplit={() => handleSplit(i)}
            isCurrent={i <= currentIndex && currentIndex < i + tasks[i].span}
          />
        );
      }
    }
    slotContent = renderedSlots;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Today's Plan
        </h1>
        <div className="bg-white rounded-lg shadow-lg">
          {slotContent}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
