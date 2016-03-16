import _ from 'lodash';
import React from 'react';
import Helmet from 'react-helmet';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import PureComponent from 'react-pure-render/component';

import { Logger } from 'common';
import { UserActions, ServerActions } from 'webapp/actions';
import { REQ_POST_USER_LOGIN } from 'webapp/actions/types';

const DEBUG_ENV = 'login-container';
// All authentication containers will have class name under this class
const CLASS_NAME = 'cb-ctn-auth';

const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';

class LoginContainer extends PureComponent {
  static fetchData({ dispatch }) {
    Logger.info('Fetch data', DEBUG_ENV);
    return dispatch(UserActions.me());
  }

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    ownUserId: React.PropTypes.string,
    err: React.PropTypes.instanceOf(Immutable.Map),
    success: React.PropTypes.bool
  };

  state = {
    formData: {
      [EMAIL_FIELD]: undefined,
      [PASSWORD_FIELD]: undefined
    }
  };

  componentWillMount() {
    const { dispatch, ownUserId } = this.props;
    if (ownUserId) {
      if (process.env.BROWSER) {
        dispatch(pushState(null, '/'));
      } else {
        dispatch(ServerActions.redirect('/'));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.success && nextProps.ownUserId) {
      dispatch(pushState(null, '/'));
    }
  }

  _onInputChange = (fieldId, text) => {
    const formData = _.cloneDeep(this.state.formData);
    formData[fieldId] = text;
    this.setState({ formData });
  };

  _onFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const formData = this.state.formData;
    dispatch(UserActions.login(formData));
  };

  render() {
    const { err } = this.props;

    return (
      <div className={ CLASS_NAME }>
        <Helmet title="Cubist 3D Login" />
        <div className={ `${CLASS_NAME}-card panel panel-default` }>
          <div className={ `${CLASS_NAME}-card-heading panel-heading` }>
            User Login
          </div>
          <div className={ `${CLASS_NAME}-card-body panel-body` }>
            <form className={ `${CLASS_NAME}-form` } onSubmit={ this._onFormSubmit }>
              <div className="form-group">
                <label className="control-label" htmlFor={ EMAIL_FIELD }>Email</label>
                <input id={ EMAIL_FIELD }
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={ (e) => this._onInputChange(EMAIL_FIELD, e.target.value) } />
              </div>
              <div className="form-group">
                <label className="control-label" htmlFor={ PASSWORD_FIELD }>Password</label>
                <input id={ PASSWORD_FIELD }
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={ (e) => this._onInputChange(PASSWORD_FIELD, e.target.value) } />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                SIGN IN
              </button>
              {
                err &&
                <div className={ `${CLASS_NAME}-message alert alert-danger` }>
                  { err.get('message') }
                </div>
              }
              <div className={ `${CLASS_NAME}-other-links cb-align-right` }>
                <Link to="/resetPassword">
                  Forget Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    ownUserId: state.UserStore.get('ownUserId'),
    err: state.RequestStore.getIn(['err', REQ_POST_USER_LOGIN]),
    success: state.RequestStore.getIn(['success', REQ_POST_USER_LOGIN])
  };
})(LoginContainer);
