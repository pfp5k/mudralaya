import React from 'react';
import Hero from './Hero';
import WhyJoin from './WhyJoin';
import WhatYouDo from './WhatYouDo';
import Timeline from './Timeline';
import GrowWithoutLimits from './GrowWithoutLimits';
import EmpoweringWomen from './EmpoweringWomen';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <WhyJoin />
      <WhatYouDo />
      <Timeline />
      <GrowWithoutLimits />
      <EmpoweringWomen />
    </div>
  );
};

export default Home;

