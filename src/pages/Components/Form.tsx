import React from "react"

const Form = ({children}: React.PropsWithChildren) => {
  return (
    <div className="flex justify-center content-center h-full" >
        <div className="w-1/2 h-3/6 border border-slate-500 mt-24  flex shadow-lg shadow-slate-800 bg-discordDark justify-center content-center">
            {children}
        </div>
    </div>
  )
}

export default Form