import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';
import WorldBuilder from './components/WorldBuilder';

function App() {
  const[create, setCreate] = useState<boolean>(true);
  const[width, setWidth] = useState<number>(0);
  const[height, setHeight] = useState<number>(0);
  return (
    <div className="App">
      {create ? 
       <WorldBuilder setWidth={setWidth} width={width} setHeight={setHeight} height={height} create={create} setCreate={setCreate}/>
       : 
        <Canvas width={width} height={height} />
      }
    </div>
  );
}

export default App;
