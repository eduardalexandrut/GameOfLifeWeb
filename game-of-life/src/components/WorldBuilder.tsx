import { useContext, useRef } from "react"
import { Context, View } from "../App"
import { useWorldContext } from "./WorldContext"
import { World } from "../classes/World"


type propType = {
    view: View,
    setView: React.Dispatch<React.SetStateAction<View>>,
}


const WorldBuilder = (props:propType) => {
    const widthRef = useRef<HTMLInputElement>(null);
    const heightRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [world, setWorld] = useContext(Context);

    const handleCreate = () => {
        if (widthRef.current && heightRef.current && nameRef.current) {
            const columns = parseInt(widthRef.current.value);
            const rows = parseInt(heightRef.current.value);
            const name = nameRef.current.value;
            setWorld(new World(columns, rows, name));
            props.setView(View.Player);
        }
    }
    
    return (
        <div id = 'world-builder'>
            <h1>Create a new world</h1>
            <form action="" method="">
                <input ref={nameRef} type="text" name="name" placeholder="world name"/>
                <input ref={widthRef} type="number" name="width" placeholder="width"/>
                <input ref={heightRef} type="number" name="height" placeholder="height"/>
                <button onClick={()=>handleCreate()}>Create</button>
                <button>Discard</button>
            </form>
        </div>
    )
}
export default WorldBuilder;