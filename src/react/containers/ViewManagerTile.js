import React, { Component } from 'react';
import { connect } from 'react-redux';
import WebView from 'react-electron-webview';
import * as actions from '../actions/actions';

class ViewManagerTile extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const view = this.props.view;
    return (
      {this.props.view ?

      }
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ViewManagerTile);
