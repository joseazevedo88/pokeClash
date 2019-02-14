import React, { Component } from 'react';
import { AppNavbar } from './components/AppNavbar';
import { Poke } from './components/Poke';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <div className="container" style={{ marginTop: '2rem' }}>
          <Poke />
          <div
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              fontFamily: 'Oswald'
            }}
          >
            VS
          </div>
          <Poke />
        </div>
      </div>
    );
  }
}

export default App;
