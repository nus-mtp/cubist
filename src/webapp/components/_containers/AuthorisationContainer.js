import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import PureComponent from 'react-pure-render/component';

import { ServerActions } from 'webapp/actions';

const CLASS_NAME = 'cb-ctn-authorisation';

class AuthorisationContainer extends PureComponent {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    ownUserId: React.PropTypes.string,
    user: React.PropTypes.instanceOf(Immutable.Map)
  };

  componentWillMount() {
    const { dispatch, user } = this.props;
    if (!user) {
      if (process.env.BROWSER) {
        dispatch(pushState(null, '/'));
      } else {
        dispatch(ServerActions.redirect('/'));
      }
    }
  }

  render() {
    const { children, user } = this.props;

    return (
      <div className={ `${CLASS_NAME} cb-height-full` }>
        { React.cloneElement(children, { user }) }
      </div>
    );
  }
}

export default connect()(AuthorisationContainer);
