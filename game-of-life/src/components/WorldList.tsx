import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'react-bootstrap'
import { World } from '../classes/World'
import { error } from 'console';
import data from "../../data/data.json";

export default function WorldSelector() {

  const [worlds, setWorlds] = useState<Array<World>>([]);

  useEffect(() => {
    fetch('http://localhost:5000/get-worlds')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setWorlds(data);
      })
      .catch(err => console.error('Fetch error:', err));
      
  }, []);

  
  return (
    <Container>
      <Row>
        <Col>
          <h1 className='mt-5'>My Worlds</h1>
        </Col>
      </Row>
      {worlds.map((element: World) => (
  <Row key={element.id} className='p-sm-1'>
    <Col className='col-lg-2'></Col>
    <Col className='col-lg-8 col-12'>
      <Card bg={'dark'} text={'light'}>
        <Row className='d-flex flex-md-row flex-column'>
          <Col className='col-md-5 col-12'></Col>
          <Col className='col-md-7 col-12 text-start'>
            <CardBody>
              <CardTitle>{element.name}</CardTitle>
              <div className='d-flex justify-content-between'>
                <p>{element.rows} x {element.columns}</p>
                <p></p>
                <p>Ciao</p>
              </div>
              <CardText>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus totam velit maxime nostrum facere praesentium saepe dolor veritatis consequuntur itaque animi commodi nesciunt vel officiis eaque, excepturi magni! Est, voluptates.
              </CardText>
            </CardBody>
          </Col>
        </Row>
      </Card>
    </Col>
    <Col className='col-lg-2'></Col>
  </Row>
))}
    </Container>
  )
}
