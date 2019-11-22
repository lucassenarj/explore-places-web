import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Dimensions from 'react-dimensions';
import { Container, ButtonContainer } from './styles';
import MapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import debounce from "lodash/debounce";
import api from "../../services/api";
import { logout } from './../../services/auth';
import Properties from './components/Properties';
import Button from "./components/Button";

const API_TOKEN = 'pk.eyJ1IjoibHVjYXNzZW5hcmoiLCJhIjoiY2szYWZzdWg4MGJ0eTNicWgxa2pibzF5cSJ9.9CYaS2GvgVKB_uC1wQhFOw';

class Map extends Component {
  constructor() {
    super();
    this.updatePropertiesLocalization = debounce(
      this.updatePropertiesLocalization, 500
    )
  }

  static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired
  }

  state = {
    viewport: {
      latitude: 41.1590779,
      longitude: -8.5918641,
      zoom: 17.38,
      bearing: 0,
      pitch: 0
    },
    properties: []
  }

  componentDidMount() {
    this.loadProperties();
  }

  updatePropertiesLocalization() {
    this.loadProperties();
  }

  loadProperties = async () => {
    const { latitude, longitude } = this.state.viewport;

    try {
      const response = await api.get('/properties', {
        params: { latitude, longitude }
      });

      this.setState({ properties: response.data });

    } catch(err) {
      console.log(err)
    }
  }

  handleLogout = e => {
    logout();
    this.props.history.push('/');
  }

  renderActions() {
    return (
      <ButtonContainer>
        <Button color="#222" onClick={this.handleLogout}>
          <i className="fa fa-times" />
        </Button>
      </ButtonContainer>
    )
  }

  render() {
    const { containerWidth: width, containerHeight: height } = this.props;
    const { properties } = this.state;

    return (
      <Fragment>
        <MapGL 
          width={width} 
          height={height} 
          {...this.state.viewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxApiAccessToken={API_TOKEN}
          onViewportChange={viewport => this.setState({ viewport })}
          onViewStateChange={this.updatePropertiesLocalization.bind(this)}
        >
          <Properties properties={properties} />
        </MapGL>
        {this.renderActions()}
      </Fragment>
    );
  }
}

const DimensionedMap = withRouter(Dimensions()(Map));

const App = () => (
  <Container>
    <DimensionedMap />
  </Container>
);

export default App;