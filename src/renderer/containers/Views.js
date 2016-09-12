import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import WebView from './WebView';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';

class Views extends Component {

  render() {
    const { dispatch } = this.props;
    const views = this.props.views.map((view, index) => {
      return (
        <WebView key={index} {...bindActionCreators(actions, dispatch)} view={view}/>
      );
    });
    return (
      <div id="views">
        { views }
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Views);
