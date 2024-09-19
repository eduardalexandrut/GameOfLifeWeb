import { useContext, useRef, useState } from "react"
import { Context, View } from "../App"
import { useSetWorldContext, useWorldContext, WorldContext } from "./WorldContext"
import { World } from "../classes/World"
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import React from "react";
import {v4 as uuidv4} from 'uuid';


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
                <Row className="mt-5 mb-5">
                    <h1>New world</h1>
                </Row>
                <Row>
                    <Col></Col>
                    <Col lg={4} md={6} xs={10}>
                            <Form id="builder-form" className="  d-flex flex-column gap-5">
                                <Form.Group className="w-100 d-flex flex-column align-items-sm-start">
                                    <Form.Control className="input" ref={nameRef} type="text" name="name" placeholder="World name" autoComplete="off" required/>
                                </Form.Group>
                                <Form.Group className="w-100 d-flex flex-column align-items-sm-start">
                                    <Form.Label>Width: {width}</Form.Label>
                                    <Form.Range ref={widthRef} min={10} max={150} value={width} onChange={e =>handleWidthChange(e)}/>
                                </Form.Group>
                                <Form.Group className="w-100 d-flex flex-column align-items-sm-start">
                                    <Form.Label>Height: {height}</Form.Label>
                                    <Form.Range ref={heightRef} min={10} max={150} value={height} onChange={e =>handleHeightChange(e)}/>
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
                    <Col lg={4} md={6} xs={10}>
                    <Container id="builder-btn-container" className="d-flex flex-column justify-content-between flex-md-row gap-4 gap-md-3 mt-5">
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
            </React.Fragment>
            
   
    )
}
export default WorldBuilder;