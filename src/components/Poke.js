import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import { capitalizeString, cleanString } from '../Strings';

export class Poke extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      sprite: '',
      attacks: [],
      stats: []
    };
  }

  async componentDidMount() {
    await this.getPokemon();
    //transfer state to parent component
    this.props.getPokeProps(
      this.state.stats,
      this.state.attacks,
      this.state.stats[5].base_stat,
      this.props.isCPU
    );
  }

  componentWillReceiveProps(props) {
    const { update } = this.props;
    if (props.update !== update) {
      this.componentDidMount();
    }
  }

  getPokemon = async () => {
    //gets a first gen pokemon, first gen master race
    const pokemonNumber = Math.ceil(Math.random() * 150);
    let attacksArray = [];

    await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
      .then(res => {
        this.getAttackNumbers(res.data.moves.length).forEach(number => {
          attacksArray.push(res.data.moves[number]);
        });
        this.setState({
          name: capitalizeString(res.data.name),
          sprite: res.data.sprites.front_default,
          attacks: attacksArray,
          stats: res.data.stats
        });
      });
  };

  getAttackNumbers = numberOfAttacks => {
    let attacks = 0;
    let attacksArray = [];
    while (attacks < 4) {
      //gets four random moves from the entire list
      const attackNumber = Math.floor(Math.random() * numberOfAttacks);
      attacksArray = [attackNumber, ...attacksArray];
      attacks++;
    }
    return attacksArray;
  };

  getStyle = () => {
    return {
      minHeight: '20rem',
      transform: this.props.rotate ? 'rotate(180deg)' : 'none',
      transitionDuration: '500ms'
    };
  };

  hpBarFillingStyle = hp => {
    let baseHp = hp;
    if (this.state.stats[5] !== undefined) {
      baseHp = this.state.stats[5].base_stat;
    }
    let percentage = (hp * 100) / baseHp;
    if (percentage <= 10) percentage = 10;
    return {
      position: 'absolute',
      backgroundColor: '#74d365',
      height: '100%',
      width: `${percentage}%`,
      top: '0',
      borderRadius: '1em',
      transitionDuration: '500ms'
    };
  };

  render() {
    return (
      <div>
        <h1 style={{ fontFamily: 'Oswald' }}>{this.state.name}</h1>
        {/* wait for the stats array to be filled so we can display hp value */}
        <div style={hpBarStyle}>
          <p
            style={{
              position: 'relative',
              zIndex: '1',
              marginTop: '0.2rem'
            }}
          >
            {this.props.hp} HP
          </p>
          <div style={this.hpBarFillingStyle(this.props.hp)} />
        </div>

        <img
          className="img-fluid"
          src={this.state.sprite}
          style={this.getStyle()}
          alt=""
        />
        {/* only renders buttons for the first pokemon 
        revise this to implement 1v1 without cpu */}
        {!this.props.isCPU && (
          <div style={attackStyle}>
            {this.state.attacks.map((attack, index) => (
              <Button
                key={index}
                className="btn"
                style={buttonStyle(index)}
                onClick={this.props.attackUsed.bind(this, attack)}
              >
                {cleanString(attack.move.name)}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const attackStyle = {
  justifyContent: 'center',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateAreas: "'button1 button2' 'button3 button4'"
};

const hpBarStyle = {
  marginTop: '3rem',
  position: 'relative',
  width: '100%',
  height: '2rem',
  color: 'white',
  borderRadius: '1rem',
  border: '1px solid rgba(0, 153, 68, 1)'
};

const buttonStyle = id => {
  return {
    gridArea: `button${id + 1}`,
    margin: '5%',
    backgroundColor: 'rgb(230, 230, 255)',
    border: '0',
    color: 'black',
    fontFamily: 'Oswald'
  };
};

export default Poke;
