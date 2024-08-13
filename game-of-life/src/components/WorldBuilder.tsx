import { useContext, useRef, useState } from "react"
import { Context, View } from "../App"
import { useSetWorldContext, useWorldContext, WorldContext } from "./WorldContext"
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
    const world = useWorldContext();
    const setWorld = useSetWorldContext();
   const [width, setWidth] = useState(2);
   const [height, setHeight] = useState(2);

    const handleCreate = () => {
        if (widthRef.current && heightRef.current && nameRef.current) {
            const columns = parseInt(widthRef.current.value);
            const rows = parseInt(heightRef.current.value);
            const name = nameRef.current.value;
            const newWorld = new World(columns, rows, name);
            //world = newWorld
            setWorld(newWorld);
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
        <div id = 'world-builder'>
            <Container>
                <Row className="mt-5 mb-5">
                    <h1 >New world</h1>
                </Row>
                <Row>
                    <Col></Col>
                    <Col sm={6}>
                            <Form id="builder-form" className="  d-flex flex-column gap-5">
                                <Form.Group className="w-100 d-flex flex-column align-items-sm-start">
                                    <Form.Control className="input" ref={nameRef} type="text" name="name" placeholder="World name" autoComplete="off" required/>
                                </Form.Group>
                                <Form.Group className="w-100 d-flex flex-column align-items-sm-start">
                                    <Form.Label>Width: {width}</Form.Label>
                                    <Form.Range ref={widthRef} min={2} max={50} value={width} onChange={e =>handleWidthChange(e)}/>
                                </Form.Group>
                                <Form.Group className="w-100 d-flex flex-column align-items-sm-start">
                                    <Form.Label>Height: {height}</Form.Label>
                                    <Form.Range ref={heightRef} min={2} max={50} value={height} onChange={e =>handleHeightChange(e)}/>
                                </Form.Group>
                            </Form>
                            {/*
                            <Form.Label>Initial Seed:</Form.Label>
                            <Form.Check name = "default" label = "Default"/>
                            <Form.Check name="Random" label = "Random"/>
                            <Form.Label>% of alive cells:</Form.Label>
                            <Form.Range min={0} max={100}/><*/}
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col sm={6}>
                    <Container id="builder-btn-container" className="d-flex flex-column flex-md-row gap-4 gap-md-3 mt-5">
                        <Col>
                            <button onClick={()=>handleCreate()}>Create</button>
                        </Col>
                        <Col>
                            <button onClick={e=>props.setView(View.Menu)}>Discard</button>
                        </Col>
                    </Container>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
            
        </div>
    )
}
export default WorldBuilder;