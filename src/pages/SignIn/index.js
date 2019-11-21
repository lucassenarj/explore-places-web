import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Logo from './../../assets/explore-places-logo.svg';
import api from './../../services/api';
import { login } from './../../services/auth';
import { Form, Container } from "./styles";

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    error: ''
  }

  handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password ) {
      this.setState({ error: 'All fields are required' });
      return
    }

    try {
      const response = await api.post('/login', { email, password });
      login(response.data.token);
      this.props.history.push('/app');
    } catch(err) {
      this.setState({ error: 'Email and password not valid.' })
    }
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSignIn}>
          <img src={Logo} alt="Explore Places Logo" />

          {this.state.error && <p>{this.state.error}</p>}

          <input type="email" placeholder="Email" onChange={e => this.setState({ email: e.target.value })} />

          <input type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })} />

          <button type="submit">Sign In</button>
          <hr />
          <Link to="/signup">SignUp Free</Link>
        </Form>
      </Container>
    )
  }
}

export default withRouter(SignIn);
