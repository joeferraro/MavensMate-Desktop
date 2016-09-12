import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import WebView from 'react-electron-webview';
import * as actions from '../actions/actions';
import Views from './Views';
import ViewManager from './ViewManager';
import Loading from './Loading';
import UpdateNotifier from './UpdateNotifier';
import ErrorMsg from './Error';

class App extends Component {
  componentDidMount() {
    console.log('APP PROPS: ', this.props);

    const { dispatch } = this.props;
    const electron = window.require('electron');
    const ipc = electron.ipcRenderer;
    const remote = electron.remote;

    ipc.on('new-web-view', function(evt, url) {
      dispatch(actions.addView(url));
    });

    ipc.on('show-view-manager', function(evt) {
      console.log('showing view manager');
      dispatch(actions.showViewManager());
    });

    ipc.on('show-update-notifier', function(evt, releaseName, action) {
      console.log('showing update notifier', releaseName, action);
      dispatch(actions.showUpdateNotifier(releaseName, action));
    });

    ipc.on('toggle-server-developer-tools', function() {
      var webview = document.querySelector('webview:not(.hide)');
      webview.openDevTools();
    });

    ipc.on('toggle-desktop-developer-tools', function() {
      remote.getCurrentWindow().openDevTools();
    });

    ipc.on('main-process-error', function(evt, msg) {
      dispatch(actions.showError(msg));
    });

    // dispatch(actions.showUpdateNotifier('0.0.12', 'quit')); for testing only

    window.addEventListener('keydown', _handleKeyDown, false);

    function _handleKeyDown(e) {
      console.log(e);
      if (e.metaKey && e.altKey && e.which === 73) {
        // cmd + option + k to open electron dev tools
        remote.getCurrentWindow().openDevTools();
        return false;
      } else if (e.metaKey && e.altKey && e.which === 75) {
        // cmd + option + i to open core dev tools
        var webview = document.querySelector('webview:not(.hide)');
        webview.openDevTools();
        return false;
      } else if (e.metaKey && e.which === 78) {
        // cmd + n to open app launcher
        dispatch(actions.showViewManager());
      } else if (e.metaKey && e.which === 82) {
        // ctrl + r to reload page
        // var webview = document.querySelector('webview:not(.hide)');
        // webview.reload();
        // e.preventDefault();
      } else if (e.metaKey && e.which === 219) {
        // ctrl + [ to go back
        var webview = document.querySelector('webview:not(.hide)');
        webview.goBack();
      } else if (e.metaKey && e.which === 221) {
        // ctrl + ] to go forward
        var webview = document.querySelector('webview:not(.hide)');
        webview.goForward();
      }
    }
  }

  onChange(e) {
    this.props.setForm({ name: e.target.value });
  }

  handleClick(e) {
    e.preventDefault();
    const name = this.refs.nameField.value.trim();
    this.props.addName({ name });
  }

  render() {
    const { dispatch } = this.props;
    return (
        <div>
          {
            this.props.mainProcess.error

            ?

            <div>
              <ErrorMsg {...bindActionCreators(actions, dispatch)}/>
            </div>

            :

            <div>
              <Views {...bindActionCreators(actions, dispatch)}/>
              <ViewManager {...bindActionCreators(actions, dispatch)}/>
              <Loading {...bindActionCreators(actions, dispatch)}/>
              <UpdateNotifier {...bindActionCreators(actions, dispatch)}/>
            </div>
          }
        </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(App);
