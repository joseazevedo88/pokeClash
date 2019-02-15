import React, { Component } from 'react';
import axios from 'axios';
import { Button, Row, Col } from 'reactstrap';

export class Poke extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      sprite: '',
      attacks: []
    };
  }

  componentDidMount() {
    this.getPokemon();
  }

  capitalizeString = str =>
    str
      .charAt(0)
      .toUpperCase()
      .concat(str.slice(1));

  replaceDashWithSpace = str => str.replace(/-/g, ' ');

  cleanString = str => this.capitalizeString(this.replaceDashWithSpace(str));

  getPokemon = () => {
    //gets a first gen pokemon, first gen master race
    const pokemonNumber = Math.ceil(Math.random() * 150);
    let attacksArray = [];
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
      .then(res => {
        console.log(res); //delete afterwards
        this.getAttackNumbers(res.data.moves.length).forEach(number => {
          attacksArray.push(res.data.moves[number]);
        });
        this.setState({
          name: this.capitalizeString(res.data.name),
          sprite: res.data.sprites.front_default,
          attacks: attacksArray
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

  render() {
    return (
      <div>
        <p style={{ fontFamily: 'Oswald', fontSize: '3rem' }}>
          {this.state.name}
        </p>
        <img
          className="img-fluid"
          src={this.state.sprite}
          style={{ minHeight: '20rem' }}
          alt=""
        />
        <div style={attackStyle}>
          {this.state.attacks.map((attack, index) => (
            <Button className="btn" style={buttonStyle(index)}>
              {this.cleanString(attack.move.name)}
            </Button>
          ))}
        </div>
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
