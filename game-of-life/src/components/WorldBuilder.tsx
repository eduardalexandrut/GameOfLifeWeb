import { useContext, useRef, useState } from "react"
import { Context, View } from "../App"
import { useSetWorldContext, useWorldContext, WorldContext } from "./WorldContext"
import { World } from "../classes/World"
import React from "react";
import {v4 as uuidv4} from 'uuid';
import {Button} from './ui/Button';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"



type propType = {
    view: View,
    setView: React.Dispatch<React.SetStateAction<View>>,
}


const WorldBuilder = (props:propType) => {
    const widthRef = useRef<HTMLInputElement>(null);
    const heightRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const world = useWorldContext();
    const updateWorld = useSetWorldContext();
   const [width, setWidth] = useState(10);
   const [height, setHeight] = useState(10);

    const handleCreate = () => {
        if (widthRef.current && heightRef.current && nameRef.current) {
            const columns = parseInt(widthRef.current.value);
            const rows = parseInt(heightRef.current.value);
            const name = nameRef.current.value.length > 0 ? nameRef.current.value: "Unamed World";
            const id = uuidv4()
            const newWorld = new World(id,columns, rows, name, null);
            //world = newWorld
            updateWorld(newWorld);
            props.setView(View.Player);
        }
    }

    const handleWidthChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setWidth(Number(e.target.value))
    }

    const handleHeightChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setHeight(Number(e.target.value))
    }
    
    return (
        
        <React.Fragment>
        <div className="mt-5 mb-5">
            <h1>New world</h1>
        </div>
        <Button variant="destructive">Click</Button>
        <div className="form-container">
            <div className="form-column">
                <form id="builder-form" className="d-flex flex-column gap-5">
                    <div className="form-group">
                        <input
                            className="input"
                            ref={nameRef}
                            type="text"
                            name="name"
                            placeholder="World name"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Width: {width}</label>
                        <input
                            type="range"
                            ref={widthRef}
                            min={10}
                            max={150}
                            value={width}
                            onChange={e => handleWidthChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Height: {height}</label>
                        <input
                            type="range"
                            ref={heightRef}
                            min={10}
                            max={150}
                            value={height}
                            onChange={e => handleHeightChange(e)}
                        />
                    </div>
                </form>
                {/* Uncomment if needed
                <label>Initial Seed:</label>
                <label>
                    <input type="checkbox" name="default" />
                    Default
                </label>
                <label>
                    <input type="checkbox" name="random" />
                    Random
                </label>
                <label>% of alive cells:</label>
                <input type="range" min={0} max={100} />
                */}
            </div>
        </div>
        <div className="button-container">
            <button onClick={() => handleCreate()}>Create</button>
            <button onClick={e => props.setView(View.Menu)}>Discard</button>
        </div>
    </React.Fragment>
    
            
   
    )
}
export default WorldBuilder;