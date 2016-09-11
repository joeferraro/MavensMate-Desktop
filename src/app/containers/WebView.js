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
    this._didStartLoading = this._didStartLoading.bind(this);
    this._didStopLoading = this._didStopLoading.bind(this);
    this._didFinishLoad = this._didFinishLoad.bind(this);
    this._loadingTimeout;
  }

  componentDidMount() {
    console.log('component mounted!!!');
    var element = ReactDOM.findDOMNode(this);
    element.setAttribute('nodeintegration', '');
    element.setAttribute('id', this.props.view.id);
  }

  componentDidUpdate() {
    var element = ReactDOM.findDOMNode(this);
    element.setAttribute('nodeintegration', '');
  }

  _isHidden(v) {
    return v.show ? '' : 'hide';
  }

  _didStartLoading() {
    console.log('webview start loading');
    if (this.props.view.show) {
      if (this._loadingTimeout) { clearTimeout(this._loadingTimeout); }
      this._loadingTimeout =
        setTimeout(() => this.props.dispatch(actions.showLoading()), 1000);
    }
  }

  _didStopLoading() {
    console.log('webview stop loading');
    if (this.props.view.show) {
      if (this._loadingTimeout) { clearTimeout(this._loadingTimeout); }
      this.props.dispatch(actions.hideLoading());
    }
  }

  _didFinishLoad() {
    console.log('webview finish load');
  }

  _onIpcMessage(evt) {
    const params = evt.args[0];
    console.log('new ipc message -->', evt, params);
    if (evt.channel === 'on-load') {
      this.props.dispatch(actions.updateView({
        id: this.props.view.id,
        pid: params.pid,
        title: params.title,
        projectName: params.projectName,
        sldsIconClassName: params.sldsIconClassName,
        sldsIconName: params.sldsIconName,
        sldsSprite: params.sldsSprite
      }));
    } else if (evt.channel === 'operation:running') {
      this.props.dispatch(actions.updateView({
        id: this.props.view.id,
        status: 'operation:running'
      }));
    } else if (evt.channel === 'operation:stopped') {
      this.props.dispatch(actions.updateView({
        id: this.props.view.id,
        status: 'operation:stopped'
      }));
    }
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
        didStartLoading={this._didStartLoading}
        didStopLoading={this._didStopLoading}
        newWindow={this._onNewWindow}
        ipcMessage={this._onIpcMessage}
        nodeintegration={true}
        key={view.id} src={view.url}/>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(WebView);
