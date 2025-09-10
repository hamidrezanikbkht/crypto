'use client'
import Mycontext from '@/app/contextApi/contextapi';
import React, { useContext } from 'react';

export default function Pop() {
  const { fetchmarket, inpu } = useContext(Mycontext);

  const x = fetchmarket.find(
    (val) => val.name.toLowerCase() === inpu.toLowerCase()
  );

  return (
    <div className='bg-white rounded-xl fixed border top-[20%] -translate-y-[20%] trans w-[32%] z-50 py-5 left-[32%] transform translate-x-[-32%]'>
      {x ? (
        <div className="flex items-center px-4 gap-4">
          <img src={x.image} alt={x.name} className="w-8 h-8 rounded-full" />
          <span>{x.name}</span>

                <span> <span>تومان</span>{Math.round(x.current_price * 88000).toLocaleString()}</span>        </div>
      ) : (
        <span>چیزی پیدا نشد</span>
      )}
    </div>
  );
}
