import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';

function App() {

  return (
    <div className="App">
      <Canvas width = {500} height = {500}></Canvas>
    </div>
  );
}

export default App;
