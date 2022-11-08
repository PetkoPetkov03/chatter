import React from 'react'

const Search = ({children}: React.PropsWithChildren) => {
  return (
    <div className="container">
        <h1>Search for Friends:</h1>
        {children}
    </div>
  )
}

export default Search