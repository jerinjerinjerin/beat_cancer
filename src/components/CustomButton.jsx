import React from 'react'

const CustomButton = ({btnTitle, title, handleClick, styles}) => {
  return (
    <button
      className={`rounded-[10px] px-4 font-epilogue text-[16px] font-semibold
        text-white ${styles}`}
        onClick={handleClick}
    >
       {title}
    </button>
  )
}

export default CustomButton