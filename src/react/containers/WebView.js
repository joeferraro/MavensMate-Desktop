import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import ElectronWebView from 'react-electron-webview';
import * as actions from '../actions/actions';

class WebView extends Component {

  constructor(props) {
    super(props);
    this._onIpcMessage = this._onIpcMessage.bind(this);
    this._onNewWindow = this._onNewWindow.bind(this);
  }

  componentDidMount() {
    var element = ReactDOM.findDOMNode(this);
    element.setAttribute('nodeintegration', '');
    element.setAttribute('id', this.props.view.id);
  }

  _isHidden(value){
    return value.show ? '' : 'hide';
  }

  _didFinishLoad() {
    console.log('WEB VIEW LOADED!!!!.....');
  }

  _onIpcMessage(evt) {
    const params = evt.args[0];
    console.log('new ipc message -->', evt, params);
    this.props.dispatch(actions.updateView({
      id: this.props.view.id,
      pid: params.pid,
      title: params.title,
      projectName: params.projectName,
      sldsIconClassName: params.sldsIconClassName,
      sldsIconName: params.sldsIconName,
      sldsSprite: params.sldsSprite
    }));
  }

  _onNewWindow(e) {
    console.log('new window opened by webview', e);
    if (e.url.indexOf('localhost') > 0) {
      this.props.dispatch(actions.addView(e.url));
    } else {
      window.require('electron').shell.openExternal(e.url);
    }
  }

  render() {
    const view = this.props.view;
    return (
      <ElectronWebView
        className={this._isHidden(view)}
        didFinishLoad={this._didFinishLoad}
        newWindow={this._onNewWindow}
        ipcMessage={this._onIpcMessage}
        key={view.id} src={view.url}/>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(WebView);
