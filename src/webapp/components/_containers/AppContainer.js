import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import classnames from 'classnames';
import PureComponent from 'react-pure-render/component';
import { pushState } from 'redux-router';
import qs from 'qs';

import { Logger, Constants } from 'common';
import { GravatarHelper } from 'webapp/helpers';
import { UserActions } from 'webapp/actions';

const DEBUG_ENV = 'app-container';
const CLASS_NAME = 'cb-ctn-app';
const SEARCH_FIELD = 'search';

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
    isMenuOpened: false,
    formData: {
      [SEARCH_FIELD]: ''
    }
  };

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
    const { children, user } = this.props;
    const contentClasses = [
      'container-fluid',
      `${CLASS_NAME}-content`
    ];

    return (
      <div className={ classnames(contentClasses) }>
        { React.cloneElement(children, { user }) }
      </div>
    );
  }

  _renderHeader() {
    const { user } = this.props;
    const navClasses = [
      'navbar',
      'navbar-fixed-top',
      `${CLASS_NAME}-navbar`
    ];
    const navBrandClasses = [
      'navbar-brand',
      `${CLASS_NAME}-navbar-brand`
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
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" onClick={ this._onMenuToggle }>
              MENU
            </button>
            <a href="/" className={ classnames(navBrandClasses) }>
              CUBIST
            </a>
          </div>
          <div className={ classnames(collapseClasses) }>
            {
              user && user.get('_id')
              ? this._renderUserHeader()
              : this._renderPublicHeader()
            }
            {
              this._renderSearchForm()
            }
          </div>
      </nav>
    );
  }

  _renderPublicHeader() {
    const signUpClasses = [
      'btn',
      'btn-sm',
      'btn-primary',
      'navbar-btn',
      `${CLASS_NAME}-navbar-register`
    ];

    return (
      <ul className="nav navbar-nav navbar-right">
        <a href="/register" className={ classnames(signUpClasses) }>
          SIGN UP
        </a>
        <a href="/login" className={ `${CLASS_NAME}-navbar-login btn btn-sm btn-success navbar-btn` }>
          LOG IN
        </a>
      </ul>
    );
  }

  _renderUserHeader() {
    const { user } = this.props;
    const dropDownClasses = [
      `${CLASS_NAME}-navbar-dropdown`
    ];

    return [
      <ul className="nav navbar-nav navbar-right" key={ 1 }>
        <NavDropdown className={ classnames(dropDownClasses) }
          title={ this._renderUserAvatar() } id="registeredDropdown">
          {
            user.get('role') === Constants.ROLE_ADMIN &&
            <MenuItem eventKey="1" href="/admin">
              Admin Panel
            </MenuItem>
          }
          <MenuItem href={ `/u/${user.get('name')}` } eventKey="1">
            Manage Profile
          </MenuItem>
          <MenuItem eventKey="3">
            Settings
          </MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4">
            Log Out
          </MenuItem>
        </NavDropdown>
      </ul>,
      <ul className="nav navbar-nav navbar-right cb-margin-right-10px" key={ 2 }>
        <a href="/upload" className={ `${CLASS_NAME}-navbar-upload btn btn-sm btn-success navbar-btn` }>
          UPLOAD
        </a>
      </ul>
    ];
  }

  _renderUserAvatar() {
    const { user } = this.props;

    return (
      <img className="cb-image-round" src={ GravatarHelper.getGravatarUrl(user.get('email')) } height="25" />
    );
  }

  _renderSearchForm() {
    const { location } = this.props;
    if (location.pathname === '/browse') {
      return undefined;
    }
    return (
      <div className="col-sm-9 pull-left">
        <form className="cb-navbar-form" onSubmit={ this._onSearchFormSubmit }>
          <div className="input-group" style={ { width: '100%' } }>
            <input id={ SEARCH_FIELD }
              type="text"
              className="form-control"
              placeholder="Search"
              value={ this.state.formData[SEARCH_FIELD] }
              onChange={ (e) => this._onInputChange(SEARCH_FIELD, e.target.value) }/>
            <div className="input-group-btn">
              <button className={ `${CLASS_NAME}-navbar-search btn btn-transparent` } type="submit">
                <i className="fa fa-search" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  _onInputChange = (fieldId, text) => {
    const formData = _.cloneDeep(this.state.formData);
    const trimmedText = text.trim();
    formData[fieldId] = trimmedText.length === 0 ? undefined : trimmedText;
    this.setState({ formData });
  };

  _onSearchFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const trimmedString = this.state.formData[SEARCH_FIELD].trim();
    const queryString = qs.stringify(
      { searchString: trimmedString.length !== 0 ? trimmedString : undefined });
    dispatch(pushState(null, '/browse?' + queryString));
  };
}

export default connect(state => {
  const ownUserId = state.UserStore.get('ownUserId');
  const users = state.UserStore.get('users');

  return {
    user: users.get(ownUserId, new Immutable.Map())
  };
})(AppContainer);
