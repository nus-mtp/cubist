import React from 'react';
import classnames from 'classnames';
import PureComponent from 'react-pure-render/component';
import Waypoint from 'react-waypoint';

const CLASS_NAME = 'cb-ctn-app';

class AppContainer extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object
  };

  state = {
    isAtTop: true,
    isMenuOpened: false
  };

  _onTopPageEnter = () => {
    if (!this.state.isAtTop) {
      this.setState({
        isAtTop: true
      });
    }
  };

  _onTopPageLeave = () => {
    if (this.state.isAtTop) {
      this.setState({
        isAtTop: false
      });
    }
  };

  _onMenuToggle = () => {
    this.setState({
      isMenuOpened: !this.state.isMenuOpened
    });
  };

  render() {
    const { location } = this.props;
    const isHomePage = location.pathname === '/';

    return (
      <div className={ CLASS_NAME }>
        {
          isHomePage &&
          <Waypoint threshold={ 0.2 }
            onEnter={ this._onTopPageEnter }
            onLeave={ this._onTopPageLeave } />
        }
        { this._renderHeader() }
        { this._renderBody() }
      </div>
    );
  }

  _renderBody() {
    const { children, location } = this.props;
    const isHomePage = location.pathname === '/';
    const contentClasses = [
      'container-fluid',
      `${CLASS_NAME}-content`,
      {
        [`${CLASS_NAME}-content-home`]: isHomePage
      }
    ];

    return (
      <div className={ classnames(contentClasses) }>
        { children }
      </div>
    );
  }

  _renderHeader() {
    const { location } = this.props;
    const { isAtTop } = this.state;
    const isHomePage = location.pathname === '/';
    const navClasses = [
      'navbar',
      'navbar-fixed-top',
      `${CLASS_NAME}-navbar`,
      {
        [`${CLASS_NAME}-navbar-home`]: isHomePage,
        [`${CLASS_NAME}-navbar-home-top`]: isHomePage && isAtTop
      }
    ];
    const navBrandClasses = [
      'navbar-brand',
      `${CLASS_NAME}-navbar-brand`,
      {
        [`${CLASS_NAME}-navbar-brand-home`]: isHomePage && isAtTop,
        [`${CLASS_NAME}-navbar-brand-home-top`]: isHomePage && isAtTop
      }
    ];
    const collapseClasses = [
      'collapse',
      'navbar-collapse',
      {
        in: this.state.isMenuOpened
      }
    ];

    const signUpClasses = [
      'btn',
      'navbar-btn',
      `${CLASS_NAME}-navbar-register`,
      {
        'btn-transparent': !(isHomePage && isAtTop),
        'btn-transparent-alt': isHomePage & isAtTop
      }
    ];

    return (
      <nav className={ classnames(navClasses) }>
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" onClick={ this._onMenuToggle }>
              MENU
            </button>
            <a href="/" className={ classnames(navBrandClasses) }>
              Cubist
            </a>
          </div>
          <div className={ classnames(collapseClasses) }>
            <div className="navbar-right">
              <button className={ classnames(signUpClasses) }>
                SIGN UP
              </button>
              <button className={ `${CLASS_NAME}-navbar-login btn btn-success navbar-btn` }>
                LOG IN
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default AppContainer;
