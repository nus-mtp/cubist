import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import PureComponent from 'react-pure-render/component';

import { Logger } from 'common';
import { UserActions } from 'webapp/actions';

const DEBUG_ENV = 'app-container';
const CLASS_NAME = 'cb-ctn-app';
const TOP_LIMIT = 25;

class AppContainer extends PureComponent {
  static fetchData({ dispatch }) {
    Logger.info('Fetch data', DEBUG_ENV);
    return dispatch(UserActions.me());
  }

  static propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object,
    user: React.PropTypes.instanceOf(Immutable.Map)
  };

  state = {
    isAtTop: true,
    isMenuOpened: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this._onScrollThrottle);
    this._onScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScrollThrottle);
  }

  _onScrollThrottle = _.throttle(this._onScroll.bind(this), 50);

  _onScroll() {
    const { location } = this.props;
    if (location.pathname !== '/') {
      return;
    }

    const { isAtTop } = this.state;
    const offsetY = window.pageYOffset;
    if (offsetY <= TOP_LIMIT && !isAtTop) {
      this.setState({ isAtTop: true });
    } else if (offsetY > TOP_LIMIT && isAtTop) {
      this.setState({ isAtTop: false });
    }
  }

  _onMenuToggle = () => {
    this.setState({
      isMenuOpened: !this.state.isMenuOpened
    });
  };

  render() {
    return (
      <div className={ CLASS_NAME }>
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
    const { location, user } = this.props;
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
            {
              user
              ? this._renderUserHeader()
              : this._renderPublicHeader()
            }
          </div>
        </div>
      </nav>
    );
  }

  _renderPublicHeader() {
    const { location } = this.props;
    const { isAtTop } = this.state;
    const isHomePage = location.pathname === '/';

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
      <div className="navbar-right">
        <Link to="/register" className={ classnames(signUpClasses) }>
          SIGN UP
        </Link>
        <Link to="/login" className={ `${CLASS_NAME}-navbar-login btn btn-success navbar-btn` }>
          LOG IN
        </Link>
      </div>
    );
  }

  _renderUserHeader() {
    const { location, user } = this.props;
    const { isAtTop } = this.state;
    const isHomePage = location.pathname === '/';

    const userClasses = [
      'btn',
      'navbar-btn',
      `${CLASS_NAME}-navbar-user`,
      {
        'btn-transparent': !(isHomePage && isAtTop),
        'btn-transparent-alt': isHomePage & isAtTop
      }
    ];

    return (
      <div className="navbar-right">
        <button className={ `${CLASS_NAME}-navbar-upload btn btn-success navbar-btn` }>
          UPLOAD
        </button>
        <button className={ classnames(userClasses) }>
          { user.get('name') }
        </button>
      </div>
    );
  }
}

export default connect(state => {
  const currentUserId = state.UserStore.get('currentUserId');
  const users = state.UserStore.get('users');

  return {
    user: users.get(currentUserId)
  };
})(AppContainer);
