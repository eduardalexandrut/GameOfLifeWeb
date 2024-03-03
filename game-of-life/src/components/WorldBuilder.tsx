import { useRef } from "react"
import { View } from "../App"


type propType = {
    view: View,
    setView: React.Dispatch<React.SetStateAction<View>>,
    width: number,
    setWidth: React.Dispatch<React.SetStateAction<number>>,
    height: number
    setHeight: React.Dispatch<React.SetStateAction<number>>
}

const WorldBuilder = (props:propType) => {
    const widthRef = useRef<HTMLInputElement>(null);
    const heightRef = useRef<HTMLInputElement>(null);

    const handleCreate = () => {
        if (widthRef.current && heightRef.current) {
            props.setView(View.Player);
            props.setHeight(parseInt(widthRef.current.value));
            props.setWidth(parseInt(heightRef.current.value));
        }
    }
    return (
        <div id = 'world-builder'>
            <h1>Create a new world</h1>
            <form action="" method="">
                <input type="text" name="name" placeholder="world name"/>
                <input ref={widthRef} type="number" name="width" placeholder="width"/>
                <input ref={heightRef} type="number" name="height" placeholder="height"/>
                <button onClick={()=>handleCreate()}>Create</button>
                <button>Discard</button>
            </form>
        </div>
    )
}
export default WorldBuilder;