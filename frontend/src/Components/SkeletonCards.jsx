import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const SkeletonCards = ({cards}) => {
  const allCards = Array(cards).fill(0)
  console.log(allCards)
  return (
    <div className='w-full'>
      {
        allCards.map((i,idx)=>{
          return(
            <div key={idx} className='bg-white flex flex-col'>
            <div className='p-4 flex justify-start items-center'>
                <Skeleton circle width={50} height={50} />
                <div className='ml-4 w-[20%]'>
                  <Skeleton  />
                </div>
            </div>
            <div className='p-4'>
              <Skeleton  count={5} />
            </div>
          </div>
          )
        })
      }
  
    </div>
    

  )
}

export default SkeletonCards;
