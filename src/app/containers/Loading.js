import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import WebView from './WebView';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';

class Loading extends Component {

  render() {
    return (
      <div className={"slds-spinner_container desktop-global-loading "+(this.props.loading?'show':'')}>
        <div className="slds-spinner slds-spinner--medium" aria-hidden={false} role="alert">
          <div className="slds-spinner__dot-a"></div>
          <div className="slds-spinner__dot-b"></div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Loading);
