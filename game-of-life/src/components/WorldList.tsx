import React, { useEffect, useState } from 'react'
import { World } from '../classes/World'
import { Card, CardContent } from "./ui/card"
import { Button } from './ui/Button';
import { useSetWorldContext, useWorldContext } from './WorldContext';
import { viewComponentPropType } from './WorldBuilder';
import { View } from '../App';
import { Cell } from '../classes/Cell';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


export default function WorldSelector(props:viewComponentPropType) {

  const [worlds, setWorlds] = useState<Array<any>>([]);
  const updateWorld = useSetWorldContext();
  const worldRef = useWorldContext();

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

  //Function to transform a date like "2024-09-21T16:02:14.462Z" into 21 Sept 2024.
  const formatDate = (created:string) => {
    const date = new Date(created);

    const formatedDate = date.toLocaleDateString("en-GB",{
      day:'numeric',
      month: 'long',
      year:'numeric',
    })

    return formatedDate
  }
  //Function to upload a world and switch to WorldPlayer.
  const handleUpload = (world:any) => {
    //Convert the cells strings into cell objects.
    const cells = world.cells.map((row:string[]) =>
       row.map((cellString:string) =>{
        const cell = JSON.parse(cellString);
        return new Cell(cell.posX, cell.posY, cell.isAlive)}
      ))
    const newWorld = new World(world.id, world.columns, world.rows, world.name, world.created, cells, world.lastUpdate, world.generations, world.image);
    updateWorld(newWorld);
    props.setView(View.Player);
  }

  //Function to remove a World from the db.
  const removeWorld = (id) => {
    fetch('http://localhost:5000/delete-world', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res;
    })
    .catch(err => console.error('Fetch error:', err));

    setWorlds((prevWorlds) => prevWorlds.filter((world) => world.id != id))
  }
  return (
    <div className="container bg-blue mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Worlds</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {worlds.map((world) => (
          <Card key={world.id} className="overflow-hidden m-3">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/**World image */}
                <div className="w-full sm:w-1/3">
                  {/*<Image
                    src={world.image}
                    alt={world.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />*/}
                </div>
                {/** World info Section */}
                <div className="w-full sm:w-2/3 p-4">
                  <h2 className="text-2xl font-semibold mb-2">{world.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created on {formatDate(world.created)}
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
                      <p className="text-muted-foreground">{formatDate(world.lastUpdate)}</p>
                      <p className="font-medium">Last Updated</p>
                    </div>
                  </div>

                  {/**Actions section */}
                  <div className='flex flex-wrap justify-around text-sm mt-2 mb-4'>
                    <Button onClick = {() => handleUpload(world)}>Start</Button>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive'>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{world.name}" ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick = {() => removeWorld(world.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
