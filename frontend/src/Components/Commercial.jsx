import React, { useState,useEffect } from 'react'
import { commercials } from '../Constants';


const Commercial = () => {
    const [randomCommercial,setRandomCommercial] = useState([])

    const getRandomObject = (array) => {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
      };
      useEffect(() => {
        let temp = getRandomObject(commercials);
        setRandomCommercial(temp)
      }, []);

  return (
    <section  className='ml-16 hidden lg:block md:mt-[75px] w-[250px]'>
    <div onClick={() => window.open(randomCommercial.route, '_blank')}  className='rounded-md w-full cursor-pointer border border-1 border-solid border-slate-200 transform hover:scale-105 transition duration-500 '>
      <div className='p-4 w-full pr-4 rounded-md  flex items-center justify-between'>
        <small className='w-[10%] text-[12px] font-semibold'>Sponsored</small>
        <p className='font-bold text-[14px]'>{randomCommercial.name}</p>
      </div>
      <div className='flex justify-center items-center'>
        <img className='max-h-[280px] object-contain' src={randomCommercial.imgURL} />
      </div>
      <div className='rounded-md p-2 w-[250px] overflow-hidden'>
          <p className='text-[12px]'>{randomCommercial.description}</p>
      </div>
    </div>
</section>
  )
}

export default Commercial
