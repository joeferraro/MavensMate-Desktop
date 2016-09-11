
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from './App';
import * as actions from '../actions/actions';

class AppContainer extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <App {...bindActionCreators(actions, dispatch)} />
    );
  }
}

function select(state) {
  return {
    state: state
  };
}

export default connect(select)(AppContainer);
