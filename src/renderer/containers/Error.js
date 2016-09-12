import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import WebView from './WebView';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';

class Error extends Component {

  render() {
    return (
      <div>
        <div aria-hidden={false} role="alertdialog" className="slds-modal slds-modal--prompt slds-fade-in-open">
          <div className="slds-modal__container slds-modal--prompt" role="document" id="prompt-message-wrapper" tabindex="0">
            <div className="slds-modal__header slds-theme--error slds-theme--alert-texture">
              <h2 className="slds-text-heading--medium" id="prompt-heading-id">Error</h2>
            </div>
            <div className="slds-modal__content slds-p-around--medium">
              <div>
                <p>{ this.props.mainProcess.msg }</p>
              </div>
            </div>
          </div>
        </div>
        <div className="slds-backdrop slds-backdrop--open"></div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(Error);
