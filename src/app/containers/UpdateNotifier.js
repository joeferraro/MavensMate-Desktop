import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import WebView from './WebView';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/actions';

class UpdateNotifier extends Component {

  constructor(props) {
    super(props);
    this._close = this._close.bind(this);
  }

  componentDidMount() {
    console.log('UpdateNotifier PROPS: ', this.props);
  }

  _quitAndInstall() {
    const electron = window.require('electron');
    const ipc = electron.ipcRenderer;
    ipc.send('quit-and-install');
  }

  _openUrl() {
    const electron = window.require('electron');
    electron.shell.openExternal('https://github.com/joeferraro/MavensMate-Desktop/releases');
  }

  _close() {
    this.props.dispatch(actions.hideUpdateNotifier())
  }

  render() {
    return (
      <div className={"slds-notify_container desktop-update-notifier "+(this.props.update.show?'show':'')}>
        <div className="slds-notify slds-notify--alert slds-theme--alert-texture" role="alert">
          <button className="slds-button slds-notify__close slds-button--icon-inverse" onClick={() => this._close()}>
            <svg aria-hidden={true} className="slds-button__icon">
              <use xlinkHref="styles/lds/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span className="slds-assistive-text">Close</span>
          </button>
          <span className="slds-assistive-text">Info</span>
          <h2>
          {
            this.props.update.action === 'quit'

            &&

            <span>
              <a href="javascript:void(0);" onClick={() => this._openUrl()}>Version { this.props.update.releaseName }</a> is ready to install.&nbsp;&nbsp;
              <a id="install" href="#" onClick={() => this._quitAndInstall()}>Restart MavensMate</a> to upgrade.
            </span>

          }

          {
            this.props.update.action === 'download'

            &&

            <span>
              A new version (v{this.props.update.releaseName}) of MavensMate is <a href="javascript:void(0);" onClick={() => this._openUrl()}>ready for download</a>.</span>
          }
          </h2>
        </div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(UpdateNotifier);
