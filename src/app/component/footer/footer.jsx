import React from 'react'
import mycontext from '../contextApi/contextapi'
import { useContext } from 'react'
export default function Footer() {
 const { data, setdata } = useContext(mycontext);
  return (
    <div className='w-full'>

    </div>
  )
}

