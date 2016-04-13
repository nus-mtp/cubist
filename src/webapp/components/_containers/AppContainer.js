import React from 'react';
import _ from 'lodash';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" onClick={ this._onMenuToggle }>
              MENU
            </button>
            <Link to="/" className={ classnames(navBrandClasses) }>
              Cubist
            </Link>
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
        </div>
      </nav>
    );
  }

  _renderPublicHeader() {
    const signUpClasses = [
      'btn',
      'navbar-btn',
      `${CLASS_NAME}-navbar-register`
    ];

    return (
      <ul className="nav navbar-nav navbar-right">
        <Link to="/register" className={ classnames(signUpClasses) }>
          SIGN UP
        </Link>
        <Link to="/login" className={ `${CLASS_NAME}-navbar-login btn btn-success navbar-btn` }>
          LOG IN
        </Link>
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
            <LinkContainer to="/admin">
              <MenuItem eventKey="1">
                Admin Panel
              </MenuItem>
            </LinkContainer>
          }
          <LinkContainer to={ `/u/${user.get('name')}` }>
            <MenuItem eventKey="2">
              Manage Profile
            </MenuItem>
          </LinkContainer>
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
        <Link to="/upload" className={ `${CLASS_NAME}-navbar-upload btn btn-success navbar-btn` }>
          UPLOAD
        </Link>
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
      <div className="col-sm-4 pull-left">
        <form className="navbar-form" onSubmit={ this._onSearchFormSubmit }>
          <div className="input-group">
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
