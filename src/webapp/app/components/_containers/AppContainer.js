import React from 'react';
import classnames from 'classnames';
import PureComponent from 'react-pure-render/component';
import Waypoint from 'react-waypoint';

const CLASS_NAME = 'cb-ctn-app';

class AppContainer extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object
  }

  state = {
    isAtTop: true
  }

  _onTopPageEnter = () => {
    if (!this.state.isAtTop) {
      this.setState({
        isAtTop: true
      });
    }
  }

  _onTopPageLeave = () => {
    if (this.state.isAtTop) {
      this.setState({
        isAtTop: false
      });
    }
  }

  render() {
    const {location} = this.props;
    const isHomePage = location.pathname === '/';

    return (
      <div className={CLASS_NAME}>
        {
          isHomePage &&
          <Waypoint threshold={0.2}
            onEnter={this._onTopPageEnter}
            onLeave={this._onTopPageLeave} />
        }
        {this._renderHeader()}
        {this._renderBody()}
      </div>
    );
  }

  _renderBody() {
    const {children, location} = this.props;
    const isHomePage = location.pathname === '/';
    const contentClasses = [
      'container-fluid',
      `${CLASS_NAME}-content`,
      {
        [`${CLASS_NAME}-content-home`]: isHomePage
      }
    ];

    return (
      <div className={classnames(contentClasses)}>
        {children}
      </div>
    );
  }

  _renderHeader() {
    const {location} = this.props;
    const {isAtTop} = this.state;
    const isHomePage = location.pathname === '/';
    const navClasses = [
      'navbar',
      'navbar-default',
      'navbar-fixed-top',
      `${CLASS_NAME}-navbar`,
      {
        [`${CLASS_NAME}-navbar-home`]: isHomePage,
        [`${CLASS_NAME}-navbar-home-top`]: isHomePage && isAtTop
      }
    ];

    return (
      <nav className={classnames(navClasses)}>
        <div className="container">
          <div className="navbar-header">
            <a href="/" className="navbar-brand">
              Cubist
            </a>
          </div>
          <div className="navbar-right">
            <button className={`${CLASS_NAME}-navbar-register btn btn-transparent navbar-btn`}>
              SIGN UP
            </button>
            <button className={`${CLASS_NAME}-navbar-login btn btn-success navbar-btn`} >
              LOG IN
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

export default AppContainer;
