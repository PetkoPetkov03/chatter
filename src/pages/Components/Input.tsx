import React, { Dispatch, SetStateAction } from 'react'
import { User } from '../../types/UserTypes';


type Inputs = {
    inputs: string[],
    types: string[],
    states: Dispatch<SetStateAction<string>>[],
    user: User
}

const Input = ({inputs, types, states, user}: Inputs) => {
  return(
    <div>
        {inputs.map((inputType, i) => {
            if(types[i] === "textarea") {
              return(
                <textarea name="" id="" cols={30} rows={10} onChange={(event) => states[i]?(event.target.value) : null} />
              );
            }
            return(
                <input type={types[i]} name={inputType} onChange={(event) => states[i]?(event.target.value) : null} required/>
            );
        })}
    </div>
  );
}

export default Input