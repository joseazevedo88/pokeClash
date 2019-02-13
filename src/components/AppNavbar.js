import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

export class AppNavbar extends Component {
  render() {
    return (
      <div>
        <Navbar style={{ backgroundColor: '#e6e6ff' }} light expand="md">
          <NavbarBrand style={{ marginLeft: '1em', marginRight: '0.2em' }}>
            <i className="far fa-sticky-note" /> PokéClash
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="https://github.com/joseazevedo88">
                José Azevedo
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default AppNavbar;
