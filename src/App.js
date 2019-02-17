import React, { Component } from 'react';
import { AppNavbar } from './components/AppNavbar';
import { Poke } from './components/Poke';
import './App.css';
import { cleanString } from './Strings';

class App extends Component {
  state = {
    attack: '',
    battleHistory: [],
    poke1: {
      stats: []
    },
    poke2: {
      stats: []
    }
  };

  attackUsed = attack => {
    console.log(attack);
    this.setState({
      attack: attack.move.name,
      battleHistory: [
        ...this.state.battleHistory,
        `${cleanString(attack.move.name)} caused 50dmg`
      ]
    });
  };

  getPokeProps = (stats, isCPU) => {
    console.log('asd', stats);
    if (isCPU) {
      this.setState({
        poke2: {
          stats: stats
        }
      });
    } else
      this.setState({
        poke1: {
          stats: stats
        }
      });
    console.log(this.state.poke1, this.state.poke2);
  };

  render() {
    return (
      <div className="App">
        <AppNavbar />
        <div
          // className="container"
          style={{
            display: 'flex',
            marginTop: '2rem',
            justifyContent: 'space-evenly'
          }}
        >
          <Poke attackUsed={this.attackUsed} getPokeProps={this.getPokeProps} />
          <div
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              fontFamily: 'Oswald'
            }}
          >
            VS
          </div>
          <Poke isCPU="true" getPokeProps={this.getPokeProps} />
          <div style={{ fontFamily: 'Oswald' }}>
            <h1>Battle: </h1>
            {this.state.battleHistory.map((turn, index) => (
              <p key={index}>{turn}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
