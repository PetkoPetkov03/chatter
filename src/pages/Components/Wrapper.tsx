import React from 'react'

const Wrapper = ({children}: React.PropsWithChildren) => {
  return (
    <div className='h-full bg-discordLighter text-white'>
        {children}
    </div>
  )
}

export default Wrapper