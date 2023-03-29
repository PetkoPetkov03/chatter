import React from 'react'

interface BasicButtonInterface {
    disable: boolean
}

const BasicButton = ({disable}: BasicButtonInterface) => {
  return (
    <input disabled={disable} className="border border-discordPurple bg-discordPurple text-white hover:bg-discordLightPurple hover:cursor-pointer" type="submit" value="Sign In" />
  )
}

export default BasicButton