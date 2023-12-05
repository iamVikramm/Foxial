import React from 'react';
import '../Styles/App.css'; // Import the CSS file for styling
import LeftSideBar from './LeftSideBar';
import Commercial from './Commercial';
import Navbar from './Navbar';
import SkeletonCards from './SkeletonCards';

function Loading({cards}) {
  return (
    <section className='w-full p-1 '>
      <Navbar />
      <section className='homesection flex w-full'>
        <section className='md:w-[22%]'>
          <LeftSideBar name={"Home"} />
        </section>
        <section className='w-full  md:mt-[80px] flex justify-center  md:w-[150%] md:ml-[200px] lg:ml-0 lg:w-[55%]'>
          <SkeletonCards cards={cards} />
        </section>
        <section className='md:w-[22%]'>
          <Commercial />
        </section>
      </section>
    </section>
  );
}

export default Loading;

