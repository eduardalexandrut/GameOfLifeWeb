import React, { useEffect, useState } from 'react'
import { World } from '../classes/World'
import { Card, CardContent } from "./ui/card"
import { Button } from './ui/Button';

export default function WorldSelector() {

  const [worlds, setWorlds] = useState<Array<any>>([]);

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
    /*<Container>
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
    </Container>*/
    <div className="container bg-blue mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Game of Life Worlds</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {worlds.map((world) => (
          <Card key={world.id} className="overflow-hidden m-3">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/3">
                  {/*<Image
                    src={world.image}
                    alt={world.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />*/}
                </div>
                <div className="w-full sm:w-2/3 p-4">
                  <h2 className="text-2xl font-semibold mb-2">{world.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created on {"22 Feb 2023"/*world.dateCreated*/}
                  </p>
                  <div className="flex flex-wrap justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        {world.columns} x {world.rows}
                      </p>
                      <p className="font-medium">Dimensions</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{world.generations}</p>
                      <p className="font-medium">Generations</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{"31 March 2024"/*world.lastUpdated*/}</p>
                      <p className="font-medium">Last Updated</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Save</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
