import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Timeline.css';

const Timeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const timelineItems = [
    {
      step: '1',
      heading: 'Apply Online',
      items: ['Quick registration, zero fees.']
    },
    {
      step: '2',
      heading: 'Get Trained',
      items: ['Learn sales, digital tools, and insurance basics.']
    },
    {
      step: '3',
      heading: 'Launch Dashboard',
      items: ['Start managing your leads and clients.']
    },
    {
      step: '4',
      heading: 'Start Earning',
      items: ['Start managing your leads and clients.']
    }
  ];

  useEffect(() => {
    let autoplayInterval;
    
    const advanceTimeline = () => {
      setActiveIndex((prev) => (prev + 1) % timelineItems.length);
    };

    autoplayInterval = setInterval(advanceTimeline, 3000);

    return () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    };
  }, [timelineItems.length]);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="timeline-section">
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">How to <span style={{ color: 'var(--brand)' }}>Join</span></h2>
          <div className="text-muted small mt-3">4 Simple Steps</div>
        </div>
        
        <div className="container-fluid mt-2">
          <div className="timeline-container">
            <div className="timeline-track">
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className={`timeline-item ${activeIndex === index ? 'active' : ''}`}
                  data-index={index}
                  onClick={() => handleItemClick(index)}
                >
                  <div className="timeline-marker">{item.step}</div>
                  <div className="timeline-content">
                    <h5 className="content-heading">{item.heading}</h5>
                    <ul className="content-list">
                      {item.items.map((listItem, idx) => (
                        <li key={idx}>
                          <i className="bi bi-check-circle-fill text-success"></i> {listItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mb-5">
          <p className="h5">Join today and start earning!</p>
          <Link to="/advisor" className="btn btn-primary btn-lg mt-3">
            Become our Advisor
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Timeline;

