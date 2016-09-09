import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import WebView from 'react-electron-webview';
import * as actions from '../actions/actions';
import Views from './Views';
import ViewManager from './ViewManager';

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

    window.addEventListener('keydown', _handleKeyDown, false);

    function _handleKeyDown(e) {
      console.log(e);
      if (e.metaKey && e.altKey && e.which === 75) {
        var webview = document.querySelector('webview:not(.hide)');
        webview.openDevTools();
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
        <Views {...bindActionCreators(actions, dispatch)}/>
        <ViewManager {...bindActionCreators(actions, dispatch)}/>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(App);
