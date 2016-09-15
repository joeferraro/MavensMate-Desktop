import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import InlineSVG from 'svg-inline-react';

var GLYPHS = {
  UTILITY: require("!svg-inline!../styles/lds/assets/icons/utility-sprite/svg/symbols.svg"),
  STANDARD: require("!svg-inline!../styles/lds/assets/icons/standard-sprite/svg/symbols.svg")
}

class ViewManager extends Component {

  constructor(props) {
    super(props);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._addView = this._addView.bind(this);
    this._showView = this._showView.bind(this);
    this._destroyView = this._destroyView.bind(this);
    this._hide = this._hide.bind(this);
    this._boxClasses = this._boxClasses.bind(this);
  }

  componentDidMount() {
    // hack to make svg symbol ids unique bc of webpack difficulty using svg sprites via url + fragment identifier
    var elements = document.querySelectorAll('i > svg > symbol');
    Array.prototype.forEach.call(elements, function(el, i){
      var parentId = el.parentNode.parentNode.getAttribute('id');
      el.setAttribute('id', parentId+'-'+el.id);
    });
    // bind escape key to close view manager
    window.addEventListener('keydown', this._handleKeyDown, false);
  }

  _handleKeyDown(e) {
    if (e.which === 27) {
      this._hide();
    }
  }

  _hide() {
    this.props.dispatch(actions.hideViewManager());
  }

  _modalClasses() {
    var classNames = ['slds-modal', 'slds-modal--large', 'slds-fade-in-open'];
    if (!this.props.viewManager.show) {
      classNames.push('slds-hide');
    }
    return classNames.join(' ');
  }

  _backdropClasses() {
    return this.props.viewManager.show ? 'slds-backdrop slds-backdrop--open' : 'slds-backdrop';
  }

  _projectViews() {
    return this.props.views.reduce(function(obj, v) {
      if (v.pid && !obj[v.pid]) obj[v.pid] = [];
      if (v.pid) obj[v.pid].push(v);
      return obj;
    }, {});
  }

  _otherViews() {
    var arr = [];
    for (var v in this.props.views) {
      if (!this.props.views[v].pid) arr.push(this.props.views[v]);
    }
    return arr;
  }

  _showView(view) {
    const { dispatch } = this.props;
    dispatch(actions.showView(view.id));
    dispatch(actions.hideViewManager());
  }

  _destroyView(view) {
    const { dispatch } = this.props;
    let id = view.id
    dispatch(actions.destroyView(id));
  }

  _addView(pid) {
    console.log('adding view: ', pid);
    const { dispatch } = this.props;
    if (pid) {
      let url = 'http://localhost:56248/app/project/'+pid+'?pid='+pid;
      dispatch(actions.addView(url, pid));
    } else {
      dispatch(actions.addView());
    }
  }

  _boxClasses(view) {
    var classNames = ['view-manager-box', 'slds-box', 'slds-box--small', 'slds-theme--shade', 'slds-text-align--center'];
    if (view.show) {
      classNames.push('active');
    }
    if (view.status === 'operation:stopped') {
      classNames.push('has-information');
    }
    return classNames.join(' ');
  }

  _renderOtherTiles() {
    const { dispatch } = this.props;
    var tiles = [];
    const otherViews = this._otherViews();

    if (otherViews.length > 0) {
      for (let i in otherViews) {
        let view = otherViews[i];
        tiles.push(
          <div key={view.id} className="view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large">

            <a onClick={() => this._showView(view)} className={"view-manager-box slds-box slds-box--small slds-theme--shade slds-text-align--center "+(view.show?'active ':'')} href="javascript:void(0);">

              <div className="uiBlock">
                <div className="view-manager-icon">
                  <span className={"slds-icon_container "+view.sldsIconClassName}>
                    <svg aria-hidden={true} className="slds-icon slds-icon--large">
                      <use xlinkHref={'#'+view.sldsSprite+'-'+view.sldsIconName}></use>
                    </svg>
                    <span className="slds-assistive-text"></span>
                  </span>
                </div>
                <div className="view-manager-body">
                  <div className="slds-section__title slds-truncate">
                    { view.title }
                  </div>
                </div>
              </div>

            </a>
            <a className={"view-manager-tile-close slds-button slds-button--icon "+(otherViews.length === 1 ? 'last-tile': '')} href="javascript:void(0);" onClick={() => this._destroyView(view)}>
              <svg aria-hidden={true} className="slds-button__icon slds-button__icon--large">
                <use xlinkHref="#utility-sprite-close"></use>
              </svg>
              <span className="slds-assistive-text">Settings</span>
            </a>
          </div>
        );
      }
    }

    return tiles;
  }

  _renderProjectTiles() {
    const { dispatch } = this.props;
    var projectTileElements = [];

    const projectViews = this._projectViews();

    console.log('rendering project tiles ...', projectViews);

    for (let pid in projectViews) {
      let thisProjectViews = projectViews[pid];
      console.log('thisProjectViews', thisProjectViews);
      projectTileElements.push(
        <div className="slds-text-heading--medium slds-m-bottom--medium">{ thisProjectViews[0].projectName }</div>
      );

      var tiles = [];
      for (let view of thisProjectViews) {
        tiles.push(
          <div key={view.id} className={"view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large "+(view.status==='operation:running'?'view-manager-tile-running':'')}>

            <a onClick={() => this._showView(view)} className={this._boxClasses(view)} href="javascript:void(0);">

              <div className="uiBlock">
                <div className="view-manager-icon">
                  <span className={"slds-icon_container "+view.sldsIconClassName}>
                    <svg aria-hidden={true} className="slds-icon slds-icon--large">
                      <use xlinkHref={'#'+view.sldsSprite+'-'+view.sldsIconName}></use>
                    </svg>
                    <span className="slds-assistive-text"></span>
                  </span>
                </div>
                <div className="view-manager-body">
                  <div className="slds-section__title slds-truncate">
                    { view.title }
                  </div>
                </div>
              </div>

            </a>
            <a className="view-manager-tile-close slds-button slds-button--icon" href="javascript:void(0);" onClick={() => this._destroyView(view)}>
              <svg aria-hidden={true} className="slds-button__icon slds-button__icon--large">
                <use xlinkHref="#utility-sprite-close"></use>
              </svg>
              <span className="slds-assistive-text">Destroy View</span>
            </a>

            <div className="slds-spinner--brand slds-spinner slds-spinner--small tile-running-indicator" role="alert">
              <span className="slds-assistive-text">Loading</span>
              <div className="slds-spinner__dot-a"></div>
              <div className="slds-spinner__dot-b"></div>
            </div>
          </div>
        );
      }

      projectTileElements.push(
        <div className="slds-grid slds-wrap slds-grid--pull-padded">

          {/* START NEW VIEW */}
          <div className="view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large">

            <a onClick={() => this._addView(pid)} className="view-manager-box slds-box slds-box--small slds-theme--shade slds-text-align--center" href="javascript:void(0);">

              <div className="uiBlock">
                <div className="view-manager-icon">
                  <span className="slds-button slds-button--icon">
                    <svg aria-hidden={true} className="slds-button__icon slds-icon--large">
                      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#utility-sprite-add"></use>
                    </svg>
                    <span className="slds-assistive-text"></span>
                  </span>
                </div>
                <div className="view-manager-body">
                  <div className="slds-section__title slds-truncate">
                    Add View
                  </div>
                </div>
              </div>

            </a>

          </div>
          {/* END NEW VIEW */}

          { tiles }
        </div>
      )
    }
    return projectTileElements;
  }

  render() {
    return (
      <div>
        <InlineSVG id="standard-sprite" src={GLYPHS.STANDARD} />
        <InlineSVG id="utility-sprite" src={GLYPHS.UTILITY} />
        <div aria-hidden={true} role="dialog" className={this._modalClasses()}>
          <div className="slds-modal__container">
            <div className="slds-modal__header">
              <h2 className="slds-text-heading--medium modal-header-align-left">
                <div className="appLauncherModalHeader slds-grid slds-grid--vertical-align-center slds-text-body--regular">
                  <div>
                    <span className="slds-icon_container" title="description of icon when needed">
                      <svg aria-hidden={true} className="slds-icon slds-icon-text-default">
                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={'#utility-sprite-apps'}></use>
                      </svg>
                      <span className="slds-assistive-text">Description of icon</span>
                    </span>
                  </div>
                  <div className="slds-text-heading--medium slds-col--padded "><h2>View Manager</h2></div>
                </div>
              </h2>
              <button className="slds-button slds-button--icon-inverse slds-modal__close" data-aljs-dismiss="modal" onClick={() => this._hide()}>
                <svg aria-hidden={true} className="slds-button__icon slds-button__icon--large">
                  <use xlinkHref={'#utility-sprite-close'}></use>
                </svg>
                <span className="slds-assistive-text">Close</span>
              </button>
            </div>
            <div className="slds-modal__content slds-p-around--medium">
              <div className="container">
                <div className="app-launcher">
                  {
                    Object.keys(this._projectViews()).length > 0

                    &&

                    this._renderProjectTiles()
                  }

                  <div>

                    <div className="slds-text-heading--medium slds-m-bottom--medium">Other Views</div>

                    <div className="slds-grid slds-wrap slds-grid--pull-padded">

                      {/* START NEW VIEW */}
                      <div className="view-manager-tile slds-col--padded slds-size--1-of-3 slds-medium-size--1-of-3 slds-large-size--1-of-5 slds-p-bottom--large">
                        <a onClick={() => this._addView()} className="view-manager-box slds-box slds-box--small slds-theme--shade slds-text-align--center" href="javascript:void(0);">
                          <div className="uiBlock">
                            <div className="view-manager-icon">
                              <span className="slds-button slds-button--icon">
                                <svg aria-hidden={true} className="slds-button__icon slds-icon--large">
                                  <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#utility-sprite-add"></use>
                                </svg>
                                <span className="slds-assistive-text"></span>
                              </span>
                            </div>
                            <div className="view-manager-body">
                              <div className="slds-section__title slds-truncate">
                                Add View
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      {/* END NEW VIEW */}

                      { this._renderOtherTiles() }
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={this._backdropClasses()}></div>
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(ViewManager);
