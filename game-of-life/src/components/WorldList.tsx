import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'react-bootstrap'
import { World } from '../classes/World'
import { error } from 'console';

export default function WorldSelector() {

  const [worlds, setWorlds] = useState<Array<World>>([]);

  useEffect(() =>{
    fetch('http://localhost:3000/get-worlds')
    .then((res) => {return res.json()})
    .then(data => {
      console.log(data);
      setWorlds(data);
    })
    .catch((err) => console.log(err))
  }, [])
  return (
    <Container>
      <Row>
        <Col>
          <h1 className='mt-5'>My Worlds</h1>
        </Col>
      </Row>
      <Row  className='p-sm-1'>
        <Col className='col-lg-2'></Col>
        <Col className='col-lg-8 col-12'>
          <Card bg={'dark'} text={'light'}>
              <Row className='d-flex flex-md-row flex-column'>
                <Col className='col-md-5 col-12'></Col>
                <Col className='col-md-7 col-12 text-start'>
                  <CardBody>
                    <CardTitle>My First World</CardTitle>
        
                      <div className='d-flex justify-content-between'>
                        <p>Ciao</p>
                        <p>Ciao</p>
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
    </Container>
  )
}
