import React from 'react'
import { FaRegUser } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { IoSunny } from 'react-icons/io5'


export const Navbar = () => {
  return (
    <>
     <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] border-b-gray-800 ">
        <div className="logo">
          <h3 className='sp-text text-3xl font-bold '>BLAZEE UI</h3>
        </div>
        <div className="icons flex items-center gap-[20px]">
            <div className="icon text-xl cursor-pointer w-[50px] h-[50px] border-[1px] border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#333]"><IoSunny /> </div>
            <div className="icon text-xl cursor-pointer w-[50px] h-[50px] border-[1px] border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#333]"><FaRegUser /> </div>
            <div className="icon text-xl cursor-pointer w-[50px] h-[50px] border-[1px] border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#333]"><IoMdSettings /></div>

            

        </div>
     </div>
    </>
  )
}

export default Navbar