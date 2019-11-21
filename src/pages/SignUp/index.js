import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/explore-places-logo.svg';
import { Form, Container } from './styles';

class SignUp extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    error: ''
  }

  handleSignUp = e => {
    e.preventDefault();
    alert('Eu vou te registrar');
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSignUp}>
          <img src={Logo} alt="Explore-Places Logo" />

          {this.state.error && <p>{this.state.error}</p>}

          <input type="text" placeholder="Username" onChange={e => this.setState({ username: e.target.value })} />

          <input type="email" placeholder="Email" onChange={e => this.setState({ email: e.target.value })} />

          <input type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })} />

          <button type="submit">SignUp Free</button>

          <hr />

          <Link to="/">SignIn</Link>
        </Form>
      </Container>
    )
  }
}

export default SignUp;