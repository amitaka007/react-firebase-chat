import React from 'react'

const AddUser = () => {
  return (
    <div className='AddUser w-max h-max p-7 rounded-[10px] absolute top-0 bottom-0  left-0 right-0  m-auto bg-[#11192880]'>
        <form className='flex gap-5'>
            <input  type='text' placeholder='username' name='username' className='p-5  rounded-[10px] border-none outline-none' />
            <button className='p-5  rounded-[10px] bg-[#1a73a8] text-white '>search</button>
        </form>
        <div className='user mt-[50px] flex items-center justify-between'>
            <div className='detail'>
                <img src='./avatar.png' alt=''  className='w-[50px] h-[50px] rounded-[50%] object-cover'/>
                <span>John Doe</span>
            </div>
            <button className='p-3  rounded-[10px] bg-[#1a73a8] text-white '>Add User</button> 
        </div>
    </div>
  )
}

export default AddUser