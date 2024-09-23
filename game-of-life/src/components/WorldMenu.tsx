import React from 'react'
import { View } from '../App'
import { Button } from './ui/Button'
type propType = {
    view: View,
    setView: React.Dispatch<React.SetStateAction<View>>
}
export default function WorldMenu(props:propType) {
  return (
    <div>
        <div id = 'menu-title'>
            <p>Conway's</p>
            <p>Game Of Life</p>
        </div>
        <div id='menu'>
            <button onClick={()=>props.setView(View.Builder)} className='text-red'>New World</button>
            <button onClick = {()=>props.setView(View.List)}>My Worlds</button>
            <button>Game of Life</button>
        </div>

    </div>
  )
}
