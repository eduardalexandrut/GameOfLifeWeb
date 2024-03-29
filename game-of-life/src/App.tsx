import React, { createContext, useState, useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';
import WorldBuilder from './components/WorldBuilder';
import WorldPlayer from './components/WorldPlayer';
import { WorldProvider } from './components/WorldContext';
import { World } from './classes/World';
import WorldSelector from './components/WorldSelector';
import WorldMenu from './components/WorldMenu';
import 'bootstrap/dist/css/bootstrap.min.css';


export enum View {
  Menu,
  Builder,
  Player,
  Selector
}

export const Context = createContext(null);

function App() {
  const [view, setView] = useState<View>(View.Menu);
  const [world, setWorld] = useState<World | null>(null);

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
        />
      );
      break;
    case View.Player:
      content = (
        <WorldPlayer/>
        )
        break;
        case View.Selector:
          content = (
        <WorldSelector/>
      )
      break;
    default:
      content = null;
  }

  return (
    /*<Context.Provider value={[world, setWorld]}>
      <div className="App">
        {content}
      </div>
    </Context.Provider>*/
    <WorldProvider>
      <div className="App">
        {content}
      </div>
    </WorldProvider>
  );
}

export default App;
