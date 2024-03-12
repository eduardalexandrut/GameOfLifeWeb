import React from 'react'
import { View } from '../App'
type propType = {
    view: View,
    setView: React.Dispatch<React.SetStateAction<View>>
}
export default function WorldMenu(props:propType) {
    const handleView = (view:View) =>{
        if (view == View.Builder) {
            props.setView(View.Builder);
        } else if(view == View.Selector) {
            props.setView(View.Selector);
        }
    }
  return (
    <div>
        <h1>WorldMenu</h1>
        <div>
            <button onClick={()=>handleView(View.Builder)}>New World</button>
            <button onClick = {()=>handleView(View.Selector)}>My Worlds</button>
        </div>

    </div>
  )
}
