import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { ModalRoute } from "react-router-modal";
import Dimensions from 'react-dimensions';
import { Container, ButtonContainer, PointReference } from './styles';
import MapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import debounce from "lodash/debounce";
import api from "../../services/api";
import { logout } from './../../services/auth';
import Properties from './components/Properties';
import Button from "./components/Button";
import AddProperty from './../AddProperty';

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
    properties: [],
    addActivate: false
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

  handleAddProperty = () => {
    const { match, history } = this.props;
    const { latitude, longitude } = this.state.viewport;

    history.push(`${match.url}/properties/add?latitude=${latitude}&longitude=${longitude}`);
    
    this.setState({ addActivate: false })
  }

  renderButtonAdd() {
    return (
      this.state.addActivate && (
        <PointReference>
          <i className="fa fa-map-marker" />
          <div>
            <button onClick={this.handleAddProperty} className="button">
              Add
            </button>
            <button onClick={() => this.setState({ addActivate: false })} className="cancel">
              Cancel
            </button>
          </div>
        </PointReference>
      )
    )
  }

  renderActions() {
    return (
      <ButtonContainer>
        <Button color="#fc6963" onClick={() => this.setState({ addActivate: true })}>
          <i className="fa fa-plus" />
        </Button>
        <Button color="#222" onClick={this.handleLogout}>
          <i className="fa fa-times" />
        </Button>
      </ButtonContainer>
    )
  }

  render() {
    const { containerWidth: width, containerHeight: height, match } = this.props;
    const { properties, addActivate } = this.state;

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
          {!addActivate && <Properties properties={properties} /> }
        </MapGL>
        {this.renderActions()}
        {this.renderButtonAdd()}
        <ModalRoute path={`${match.url}/properties/add`} parentPath={match.url} component={AddProperty} />
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