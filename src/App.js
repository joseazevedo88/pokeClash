import React, { Component } from 'react';
import { AppNavbar } from './components/AppNavbar';
import { Poke } from './components/Poke';
import './App.css';
import { cleanString } from './Strings';
import axios from 'axios';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

class App extends Component {
  state = {
    battleHistory: [],
    rotate: false,
    modal: false,
    update: false,
    winner: '',
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

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  update = () => {
    this.setState({
      update: !this.state.update,
      battleHistory: []
    });
  };

  toggleAndUpdate = () => {
    this.setState({
      modal: !this.state.modal,
      update: !this.state.update,
      battleHistory: []
    });
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
          attacks: [...this.state.poke2.attacks],
          stats: [...this.state.poke2.stats]
        }
      });
    } else {
      this.setState({
        battleHistory: [
          ...this.state.battleHistory,
          `${cleanString(attack.move.name)} caused ${attackPower} dmg`
        ],
        poke1: {
          hp: pokeHpAfterAttack,
          stats: [...this.state.poke1.stats]
        }
      });
    }
  };

  dealDamage = async (attack, attackingPokemon) => {
    setTimeout(() => {
      this.setState({ rotate: true });
    }, 100);
    //get move info
    const atk = await axios.get(attack.move.url);
    //we'll divide atk power by 5 because base is very high and idk how the algo for pokemon
    //fights goes so that's that, then multiply by random number between 0.5 and 1.5 so fights have more variety
    const attackPower = Math.floor(
      (atk.data.power / 5) * (Math.random() + 0.5)
    );
    let pokeHpAfterAttack = 0;
    if (attackingPokemon === 1)
      pokeHpAfterAttack = this.state.poke2.hp - attackPower;
    else pokeHpAfterAttack = this.state.poke1.hp - attackPower;

    this.updateState(attack, attackPower, attackingPokemon, pokeHpAfterAttack);
    setTimeout(() => {
      this.setState({ rotate: false });
    }, 1000);
  };

  attackUsed = async attack => {
    console.log(
      this.state.poke1.stats[0].base_stat,
      this.state.poke2.stats[0].base_stat
    );
    if (
      this.state.poke1.stats[0].base_stat > this.state.poke2.stats[0].base_stat
    ) {
      //poke1 will attack
      await this.dealDamage(attack, 1);

      //check if game over
      if (this.state.poke2.hp <= 0) {
        //toggle modal
        this.setState({
          winner: 'poke1'
        });
        this.toggle();
        return;
      }

      //select attack from poke2's array
      const randomNumber = Math.floor(Math.random() * 4);
      const poke2Attack = this.state.poke2.attacks[randomNumber];
      //poke2 will fight back
      await this.dealDamage(poke2Attack, 2);

      if (this.state.poke1.hp <= 0) {
        this.setState({
          winner: 'poke2'
        });
        //toggle modal
        this.toggle();
      }
    } else {
      //select attack from poke2's array
      const randomNumber = Math.floor(Math.random() * 4);
      const poke2Attack = this.state.poke2.attacks[randomNumber];
      //poke2 will fight back
      await this.dealDamage(poke2Attack, 2);

      if (this.state.poke1.hp <= 0) {
        this.setState({
          winner: 'poke2'
        });
        //toggle modal
        this.toggle();
      }

      //poke1 will attack
      await this.dealDamage(attack, 1);

      //check if game over
      if (this.state.poke2.hp <= 0) {
        //toggle modal
        this.setState({
          winner: 'poke1'
        });
        this.toggle();
        return;
      }
    }
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
    const winText = 'Congratulations, you are the ultimate pokemon master!';
    const defeatText = 'Keep training, champ in the making!';
    let text = '';

    if (this.state.winner === 'poke1') {
      text = winText;
    } else text = defeatText;

    return (
      <div className="App">
        <AppNavbar />
        <div
          // className="container"
          style={{
            display: 'flex',
            marginTop: '2rem',
            justifyContent: 'space-evenly',
            fontFamily: 'Oswald'
          }}
        >
          <Poke
            // isCPU="false"
            attackUsed={this.attackUsed}
            getPokeProps={this.getPokeProps}
            hp={this.state.poke1.hp}
            rotate={this.state.rotate}
            update={this.state.update}
          />
          <div
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              fontSize: '3rem'
            }}
          >
            VS
          </div>
          <Poke
            isCPU="true"
            getPokeProps={this.getPokeProps}
            hp={this.state.poke2.hp}
            rotate={this.state.rotate}
            update={this.state.update}
          />
          <div>
            <h1>Battle: </h1>
            {this.state.battleHistory.map((turn, index) => (
              <p
                key={index}
                style={
                  index % 2
                    ? { marginTop: '1rem', color: '#0066ff' }
                    : { marginTop: '1rem', color: '#ff471a' }
                }
              >
                {turn}
              </p>
            ))}
          </div>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            style={{ marginTop: '10rem' }}
            backdrop="static"
          >
            <ModalBody style={{ textAlign: 'center' }}>
              {text}
              <span>
                <img
                  src="http://static.pokemonpets.com/images/monsters-images-300-300/2025-Shiny-Pikachu.png"
                  style={{ marginTop: '2rem' }}
                  alt="pikachu"
                />
              </span>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggleAndUpdate}>
                Play again!
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <Button
          style={{
            marginLeft: '75%',
            backgroundColor: 'rgb(249, 245, 255)',
            border: 'none',
            color: 'black',
            fontFamily: 'Oswald',
            padding: '0.5rem 2rem'
          }}
          onClick={this.update}
        >
          Reroll Pokemon
        </Button>
      </div>
    );
  }
}

export default App;
