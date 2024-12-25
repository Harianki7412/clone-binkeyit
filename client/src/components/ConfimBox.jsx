import React from 'react'
import { IoClose } from "react-icons/io5";

const ConfimBox = ({ cancel, confirm, close }) => {
    return (
        <div className='fixed top-0 left-0 bottom-0 right-0 z-50 bg-neutral-800 bg-opacity-70 flex items-center justify-center'>
            <div className='bg-white w-full max-w-md p-4 rounded'>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='font-semibold'>Parmanent Delete</h1>
                    <button className=''><IoClose size={25} onClick={close} /></button>
                </div>
                <p className='my-4 '>Are you sure you want to delete this item?</p>
                <div className='w-fit ml-auto flex items-center gap-3 '>
                    <button onClick={cancel} className='px-4 py-1 border rounded border-red-500 hover:bg-red-500 hover:text-white    text-red-500'>
                        Cancel
                    </button>
                    <button onClick={confirm} className='px-4 py-1 border rounded border-green-600 hover:bg-green-600 hover:text-white    text-green-600'>
                        Confirm
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ConfimBox
