import React from 'react'
import { View } from '../App'
import { Button } from './ui/Button'
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
        <div id = 'menu-title'>
            <p>Conway's</p>
            <p>Game Of Life</p>
        </div>
        <div id='menu'>
            <button onClick={()=>handleView(View.Builder)} className='text-red'>New World</button>
            <button onClick = {()=>handleView(View.Selector)}>My Worlds</button>
            <button>Upload world</button>
        </div>

    </div>
  )
}
