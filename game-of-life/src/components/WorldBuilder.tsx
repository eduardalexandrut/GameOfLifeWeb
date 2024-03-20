import { useContext, useRef } from "react"
import { Context, View } from "../App"
import { useWorldContext } from "./WorldContext"
import { World } from "../classes/World"
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"

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
            <Container>
                <Row>
                    <h1>New world</h1>
                </Row>
                <Row>
                    <Col></Col>
                    <Col sm={6}>
                        <div id="builder-form">
                            <input ref={nameRef} type="text" name="name" placeholder="world name"/>
                            <input ref={widthRef} type="number" name="width" placeholder="width"/>
                            <input ref={heightRef} type="number" name="height" placeholder="height"/>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col sm={6}>
                    <div id="builder-btn-container">
                        <Col sm={5}>
                            <button onClick={()=>handleCreate()}>Create</button>
                        </Col>
                        <Col sm={5}>
                            <button>Discard</button>
                        </Col>
                    </div>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
            
        </div>
    )
}
export default WorldBuilder;