"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./timeline.module.css";
import Event from "./Event";

let events = [
  { start: 2001.00, end: 2002.00, date: "June 2001", title: "title", description: "description" },
  { start: 2005.00, end: 2010.00, date: "2005 - 2010", title: "Another Event", description: "This is another event description." },
  { start: 2001.00, end: 2003.00, date: "2001 - 2003", title: "Third Event", description: "Details about the third event go here." },
  { start: 1995.00, end: 2007.00, date: "1995 - 2007", title: "Long Event", description: "Information about the fourth event." },
  { start: 1950.00, end: 1951.00, date: "1950 - 1951", title: "Old Event", description: "Description of the old event." }
];

function assignEventIndices(events) {
  // Sort by start time for consistency
  const sorted = [...events].sort((a, b) => a.start - b.start);
  const rows = [];
  sorted.forEach(event => {
    let assigned = false;
    for (let i = 0; i < rows.length; i++) {
      if (event.start >= rows[i]) {
        event.index = i;
        rows[i] = event.end;
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      event.index = rows.length;
      rows.push(event.end);
    }
  });
  return sorted;
}

function Timeline() {
  const eventsWithIndices = useMemo(() => assignEventIndices(events), []);

  // Total timeline range (never changes - based on all events)
  const timelineStart = useMemo(() => eventsWithIndices[0].start, [eventsWithIndices]);
  const timelineEnd = useMemo(() => eventsWithIndices[eventsWithIndices.length - 1].end, [eventsWithIndices]);

  // View range (what's currently visible - changes with zoom)
  const [start, setStart] = useState(1950.00);
  const [end, setEnd] = useState(2030.00);
  const [increment, setIncrement] = useState(5);

  // Initialize view range once
  useEffect(() => {
    setStart(timelineStart);
    setEnd(timelineEnd);
  }, [timelineStart, timelineEnd]);

  // Calculate timeline width based on zoom level
  const totalRange = timelineEnd - timelineStart;
  const viewRange = end - start;
  const timelineWidth = (totalRange / viewRange) * 100; // percentage

  let tickmarks = [];
  for (let year = timelineStart; year <= timelineEnd; year += increment) {
    tickmarks.push(year);
  }

  const zoomIn = () => {
    const currentRange = end - start;
    if (currentRange > 20) { // Prevents over-zooming
      const container = document.querySelector(`.${styles.timelineContainer}`);
      const containerWidth = container.clientWidth;
      const scrollCenter = container.scrollLeft + containerWidth / 2;
      const totalWidth = container.scrollWidth;
      
      // Calculate which year is at the center of the viewport
      const centerRatio = scrollCenter / totalWidth;
      const centerYear = timelineStart + (timelineEnd - timelineStart) * centerRatio;
      
      const newRange = currentRange - 10;
      const newStart = centerYear - newRange / 2;
      const newEnd = centerYear + newRange / 2;
      
      setStart(newStart);
      setEnd(newEnd);
      
      // After state updates, reposition scroll to keep centerYear in the center
      setTimeout(() => {
        const newTotalWidth = container.scrollWidth;
        const newCenterRatio = (centerYear - timelineStart) / (timelineEnd - timelineStart);
        const newScrollCenter = newTotalWidth * newCenterRatio;
        container.scrollLeft = newScrollCenter - containerWidth / 2;
      }, 0);
    }
  };

  const zoomOut = () => {
    const container = document.querySelector(`.${styles.timelineContainer}`);
    const containerWidth = container.clientWidth;
    const scrollCenter = container.scrollLeft + containerWidth / 2;
    const totalWidth = container.scrollWidth;
    
    // Calculate which year is at the center of the viewport
    const centerRatio = scrollCenter / totalWidth;
    const centerYear = timelineStart + (timelineEnd - timelineStart) * centerRatio;
    
    const currentRange = end - start;
    const newRange = currentRange + 10;
    // Constrain to timeline bounds
    const newStart = Math.max(timelineStart, centerYear - newRange / 2);
    const newEnd = Math.min(timelineEnd, centerYear + newRange / 2);
    
    setStart(newStart);
    setEnd(newEnd);
    
    // After state updates, reposition scroll to keep centerYear in the center
    setTimeout(() => {
      const newTotalWidth = container.scrollWidth;
      const newCenterRatio = (centerYear - timelineStart) / (timelineEnd - timelineStart);
      const newScrollCenter = newTotalWidth * newCenterRatio;
      container.scrollLeft = newScrollCenter - containerWidth / 2;
    }, 0);
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.zoomContainer}>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>

      <div className={styles.timelineBar} style={{ width: `${timelineWidth}%` }}>
        {tickmarks.map((year, idx) => (
          <div key={idx} className={styles.tickmark} style={{ left: `${((year - timelineStart) / totalRange) * 100}%` }}>
            <span className={styles.tickmarkMark}></span>
            <span className={styles.tickmarkLabel}>{year}</span>
          </div>
        ))}
      </div>

      <div className={styles.eventsContainer} style={{ width: `${timelineWidth}%` }}>
        {eventsWithIndices.map((event, idx) => (
          <Event
            key={idx}
            start={event.start}
            end={event.end}
            index={event.index}
            date={event.date}
            title={event.title}
            description={event.description}
            timelineStart={timelineStart}
            timelineEnd={timelineEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
