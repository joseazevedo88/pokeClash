import React, { Component } from 'react';
import axios from 'axios';

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

  getPokemon = () => {
    //gets a first gen pokemon, first gen master race
    const pokemonNumber = Math.floor(Math.random() * 151);
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then(res =>
      this.setState({
        name: this.capitalizeString(res.data.name),
        sprite: res.data.sprites.front_default
      })
    );
  };

  render() {
    return (
      <div>
        <p style={{ fontFamily: 'Oswald' }}>{this.state.name}</p>
        <img src={this.state.sprite} alt="" />
      </div>
    );
  }
}

export default Poke;
