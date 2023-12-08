import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const SkeletonCards = ({cards}) => {
  const allCards = Array(cards).fill(0)
  return (
    <div className='w-full p-1 md:p-2 lg:p-1  md:[100%] lg:w-[80%] mt-20  overflow-hidden mb-14'>
      {
        allCards.map((i,idx)=>{
          return(
            <div key={idx} className='bg-white m-1 flex flex-col'>
            <div className='p-4 flex justify-start items-center border-b'>
                <Skeleton circle width={50} height={50} />
                <div className='ml-4 w-[20%]'>
                  <Skeleton  />
                </div>
            </div>
            <div className='p-4 h-[350px]'>
              <Skeleton height={300} />
            </div>
          </div>
          )
        })
      }
  
    </div>
    

  )
}

export default SkeletonCards;
