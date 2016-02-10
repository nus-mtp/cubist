import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import Immutable from 'immutable';
import _ from 'lodash';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import PureComponent from 'react-pure-render/component';

import { Logger } from 'common';
import { UserActions, ServerActions } from 'webapp/actions';
import { REQ_POST_USER_RESET_PASSWORD } from 'webapp/actions/types';

const DEBUG_ENV = 'forget-password-container';
const CLASS_NAME = 'cb-ctn-auth';

const EMAIL_FIELD = 'email';

class ResetPassword extends PureComponent {
  static fetchData({ dispatch }) {
    Logger.info('Fetch data', DEBUG_ENV);
    return dispatch(UserActions.me());
  }

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    currentUserId: React.PropTypes.string,
    err: React.PropTypes.instanceOf(Immutable.Map),
    success: React.PropTypes.bool
  };

  state = {
    formData: {
      [EMAIL_FIELD]: undefined
    }
  };

  componentWillMount() {
    const { dispatch, currentUserId } = this.props;
    if (currentUserId) {
      if (process.env.BROWSER) {
        dispatch(pushState(null, '/'));
      } else {
        dispatch(ServerActions.redirect('/'));
      }
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
    dispatch(UserActions.resetPassword(formData));
  };

  render() {
    const { err, success } = this.props;

    return (
      <div className={ CLASS_NAME }>
        <Helmet title="User Reset Password" />
        <div className={ `${CLASS_NAME}-card panel panel-default` }>
          <div className={ `${CLASS_NAME}-card-heading panel-heading` }>
            Reset Password
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
              <button type="submit" className="btn btn-primary btn-block">
                SEND REQUEST
              </button>
              <div className={ `${CLASS_NAME}-other-links cb-align-right` }>
                <Link to="/">
                  Back To Home
                </Link>
              </div>
              {
                err &&
                <div className={ `${CLASS_NAME}-message alert alert-danger` }>
                  { err.get('message') }
                </div>
              }
              {
                success &&
                <div className={ `${CLASS_NAME}-message alert alert-success` }>
                  Reset password successfully! Please check your email :)
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    currentUserId: state.UserStore.get('currentUserId'),
    err: state.RequestStore.getIn(['err', REQ_POST_USER_RESET_PASSWORD]),
    success: state.RequestStore.getIn(['success', REQ_POST_USER_RESET_PASSWORD])
  };
})(ResetPassword);
