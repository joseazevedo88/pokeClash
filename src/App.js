import React, { Component } from 'react';
import { AppNavbar } from './components/AppNavbar';
import { Poke } from './components/Poke';
import './App.css';
import { cleanString } from './Strings';
import axios from 'axios';

class App extends Component {
  state = {
    attack: '',
    battleHistory: [],
    poke1: {
      stats: [],
      hp: 0
    },
    poke2: {
      stats: [],
      //gotta bring the attacks array from 2nd pokemon here so we can choose an attack
      attacks: [],
      hp: 0
    }
  };

  //carregar botão, ir buscar info do ataque, tirar hp ao poke 2, escolher um ataque do poke 2, ir buscar info do ataque e tirar hp ao poke1

  attackUsed = attack => {
    console.log(attack);

    axios.get(attack.move.url).then(atk => {
      //we'll divide atk power by 5 because base is very high and idk how the algo for pokemon
      //fights goes so that's that
      const attackPower = atk.data.power / 5;
      console.log(this.state.poke2.hp, attackPower);
      const poke2HpAfterAttack = this.state.poke2.hp - attackPower;
      console.log(poke2HpAfterAttack);
      this.setState({
        poke2: {
          hp: poke2HpAfterAttack
        }
      });
    });

    this.setState({
      attack: attack.move.name,
      battleHistory: [
        ...this.state.battleHistory,
        `${cleanString(attack.move.name)} caused x dmg`
      ]
    });
  };

  getPokeProps = (stats, pokemon2Attacks, hp, isCPU) => {
    console.log('asd', stats);
    if (!isCPU) {
      this.setState({
        poke1: {
          stats: stats,
          hp: hp
        }
      });
    } else
      this.setState({
        poke2: {
          stats: stats,
          attacks: pokemon2Attacks,
          hp: hp
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
          <Poke
            attackUsed={this.attackUsed}
            getPokeProps={this.getPokeProps}
            hp={this.state.poke1.hp}
          />
          <div
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              fontFamily: 'Oswald'
            }}
          >
            VS
          </div>
          <Poke
            isCPU="true"
            getPokeProps={this.getPokeProps}
            hp={this.state.poke2.hp}
          />
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
