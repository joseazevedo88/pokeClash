import React, { Component } from 'react';
import { AppNavbar } from './components/AppNavbar';
import { Poke } from './components/Poke';
import './App.css';
import { cleanString } from './Strings';
import axios from 'axios';

class App extends Component {
  state = {
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

  updateState = (attack, attackPower, attackingPokemon, pokeHpAfterAttack) => {
    if (attackingPokemon === 1) {
      this.setState({
        battleHistory: [
          ...this.state.battleHistory,
          `${cleanString(attack.move.name)} caused ${attackPower} dmg`
        ],
        poke2: {
          hp: pokeHpAfterAttack,
          attacks: [...this.state.poke2.attacks]
        }
      });
    } else {
      this.setState({
        battleHistory: [
          ...this.state.battleHistory,
          `${cleanString(attack.move.name)} caused ${attackPower} dmg`
        ],
        poke1: {
          hp: pokeHpAfterAttack
        }
      });
    }
  };

  dealDamage = async (attack, attackingPokemon) => {
    //get move info
    const atk = await axios.get(attack.move.url);
    //we'll divide atk power by 5 because base is very high and idk how the algo for pokemon
    //fights goes so that's that
    const attackPower = atk.data.power / 5;
    let pokeHpAfterAttack = 0;
    if (attackingPokemon === 1)
      pokeHpAfterAttack = this.state.poke2.hp - attackPower;
    else pokeHpAfterAttack = this.state.poke1.hp - attackPower;

    this.updateState(attack, attackPower, attackingPokemon, pokeHpAfterAttack);
  };

  attackUsed = async attack => {
    //poke1 will attack
    this.dealDamage(attack, 1);

    //select attack from poke2's array
    const randomNumber = Math.floor(Math.random() * 4);
    const poke2Attack = this.state.poke2.attacks[randomNumber];
    //poke2 will fight back
    this.dealDamage(poke2Attack, 2);
  };

  getPokeProps = (stats, pokemon2Attacks, hp, isCPU) => {
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
            // isCPU="false"
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
              <p key={index} style={{ marginTop: '1rem' }}>
                {turn}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
