import React, { Component, Fragment } from 'react';
import { Container, Images } from './styles';
import PropTypes from 'prop-types';
import api from './../../services/api';

const intlMonetary = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2
});

class Property extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired
  }

  state = {
    property: null,
    loading: false
  }

  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      this.setState({ loading: true });

      const { data } = await api.get(`/properties/${id}`);
      this.setState({ property: data });
    } catch (err) {
      console.log(err)
    } finally {
      this.setState({ loading: false })
    }
  }

  renderProperty() {
    const { property } = this.state;

    if (!property) {
      return 'Property not found';
    }

    return (
      <Fragment>
        <h1>{property.title}</h1>
        <hr />
        <p>{property.address}</p>

        <Images>
          {property.images.map(image => <img src={image.url} alt={image.path} key={image.id} />)}
        </Images>

        <span>{intlMonetary.format(property.price)}</span>
      </Fragment>
    )
  }
  
  render() {
    const { loading } = this.state;
    return (
      <Container>
        {loading ? <p>Loading...</p> : this.renderProperty()}
      </Container>
    )
  }
}

export default Property;