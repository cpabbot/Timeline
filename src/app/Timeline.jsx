
import React from "react";
import styles from "./timeline.module.css";
import Event from "./Event";

let events = [
  { start: 2001.00, end: 2002.00, date: "June 2001", title: "title", description: "description" },
  { start: 2005.00, end: 2010.00, date: "2005 - 2010", title: "Another Event", description: "This is another event description." },
  { start: 2001.00, end: 2003.00, date: "2001 - 2003", title: "Third Event", description: "Details about the third event go here." },
  { start: 1995.00, end: 2007.00, date: "1995 - 2007", title: "Long Event", description: "Information about the fourth event." }
];

const eventsWithIndices = assignEventIndices(events);

const start = 1950.00;
const end = 2030.00;
const increment = 5;

let tickmarks = [];
for (let year = start; year <= end; year+=increment) {
  tickmarks.push(year);
}

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
  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineBar}>
        {tickmarks.map((year, idx) => (
          <div key={idx} className={styles.tickmark} style={{ left: `${((year - start) / (end - start)) * 100}%` }}>
            <span className={styles.tickmarkMark}></span>
            <span className={styles.tickmarkLabel}>{year}</span>
          </div>
        ))}
      </div>

      <div className={styles.eventsContainer}>
        {eventsWithIndices.map((event, idx) => (
          <Event
            key={idx}
            start={event.start}
            end={event.end}
            index={event.index}
            date={event.date}
            title={event.title}
            description={event.description}
            timelineStart={start}
            timelineEnd={end}
          />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
