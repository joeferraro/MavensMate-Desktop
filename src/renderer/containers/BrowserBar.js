import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import WebView from './WebView';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';

class BrowserBar extends Component {

  back() {
    var webview = document.querySelector('webview:not(.hide)');
    webview.goBack();
  }

  forward() {
    var webview = document.querySelector('webview:not(.hide)');
    webview.goForward();
  }

  reload() {
    var webview = document.querySelector('webview:not(.hide)');
    webview.reload();
  }

  render() {
    return (
      <div className={"browser-bar slds-notify_container "+(!this.props.show?'slds-hide':'')}>
        <div className="slds-notify slds-notify--alert slds-theme--info" role="alert">
          <button className="slds-button slds-notify__close slds-button--icon-inverse" onClick={this.reload}>
            <svg aria-hidden="true" className="slds-button__icon">
              <use xlinkHref="#utility-sprite-refresh"></use>
            </svg>
            <span className="slds-assistive-text">Reload</span>
          </button>
          <button className="slds-button slds-notify__close slds-button--icon-inverse" onClick={this.forward}>
            <svg aria-hidden="true" className="slds-button__icon">
              <use xlinkHref="#utility-sprite-forward"></use>
            </svg>
            <span className="slds-assistive-text">Forward</span>
          </button>
          <button className="slds-button slds-notify__close slds-button--icon-inverse" onClick={this.back}>
            <svg aria-hidden="true" className="slds-button__icon">
              <use xlinkHref="#utility-sprite-back"></use>
            </svg>
            <span className="slds-assistive-text">Back</span>
          </button>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(BrowserBar);
