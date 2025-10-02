import React from 'react';

function Lessons() {
  const lessons = [
    { title: "Success Tip 1", content: "Set goals and work hard every day. Example: Want a new bike? Save a little each week." },
    { title: "Success Tip 2", content: "Learn from failures—they're lessons! Example: If you fall off your bike, try again smarter." },
    { title: "Success Tip 3", content: "Be persistent. Example: Like building a tower—if it falls, rebuild stronger." },
    { title: "Success Tip 4", content: "Help others to succeed. Example: Share tips with friends to grow together." },
  ];

  return (
    <div>
      <h2>Lessons on Success and Financial Literacy</h2>
      <ul>
        {lessons.map((lesson, index) => (
          <li key={index}>
            <h3>{lesson.title}</h3>
            <p>{lesson.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lessons;