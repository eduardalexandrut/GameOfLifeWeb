import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';
import WorldBuilder from './components/WorldBuilder';
import WorldPlayer from './components/WorldPlayer';

export enum View {
  Home,
  Builder,
  Player,
  Selector
}

function App() {
  const CELL_WIDTH = 50;
  const CELL_HEIGHT = 50;

  
  const [view, setView] = useState<View>(View.Builder);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  // Rendering based on the value of `view` using switch statement
  let content;
  switch (view) {
    case View.Home:
      content = <h1>Home</h1>;
      break;
    case View.Builder:
      content = (
        <WorldBuilder
          setWidth={setWidth}
          width={width}
          setHeight={setHeight}
          height={height}
          view={view}
          setView={setView}
        />
      );
      break;
    case View.Player:
      content = <h1>Player</h1>
      break;
    case View.Selector:
      content = (
        <WorldPlayer/>
      )
      break;
    default:
      content = null;
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
