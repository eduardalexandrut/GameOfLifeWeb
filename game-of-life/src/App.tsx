import React, { createContext, useState, useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';
import WorldBuilder from './components/WorldBuilder';
import WorldPlayer from './components/WorldPlayer';
import { WorldProvider } from './components/WorldContext';
import { World } from './classes/World';
import WorldList from './components/WorldList';
import WorldMenu from './components/WorldMenu';


export enum View {
  Menu,
  Builder,
  Player,
  List
}

const viewComponents = {
  [View.Menu]:WorldMenu,
  [View.Builder]:WorldBuilder,
  [View.Player]:WorldPlayer,
  [View.List]:WorldList
}

const DEF_ALIVE_CELL_COLOR = "#D9D9D9";
const DEF_DEAD_CELL_COLOR = "#011930"

export const Context = createContext(null);

function App() {
  const [view, setView] = useState<View>(View.Menu);
  const [aliveColor, setAliveColor] = useState<string>(DEF_ALIVE_CELL_COLOR);
  const [deadColor, setDeadColor] = useState<string>(DEF_DEAD_CELL_COLOR);

  // Rendering based on the value of `view` using switch statement
 let content;
  switch (view) {
    case View.Menu:
      content = <WorldMenu view={view} setView={setView}/>;
      break;

    case View.Builder:
      content = (
        <WorldBuilder
          view={view}
          setView={setView}
          aliveColor={aliveColor}
          setAliveColor = {setAliveColor}
          deadColor={deadColor}
          setDeadColor = {setDeadColor}
        />
      );
      break;

    case View.Player:
      content = (
        <WorldPlayer
          view={view}
          setView={setView}
          deadColor = {aliveColor}
          aliveColor = {deadColor}
        />
        )
        break;
    
    case View.List: content = (<WorldList view={view} setView={setView}/>)
      break;

    default:
      content = null;
  }


  return (
    <WorldProvider>
      <div className="App">
        {content}
      </div>
    </WorldProvider>
  );
}

export default App;
