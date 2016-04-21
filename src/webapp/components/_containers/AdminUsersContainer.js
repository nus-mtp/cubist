import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { UserActions } from 'webapp/actions';

const CLASS_NAME = 'cb-ctn-admin-users';

class AdminUsersContainer extends React.Component {
  static fetchData({ dispatch }) {
    return dispatch(UserActions.getUsers());
  }

  static propTypes = {
    users: React.PropTypes.instanceOf(Immutable.List),
    dispatch: React.PropTypes.func.isRequired
  };

  _onDeleteButtonClick = (user) => {
    const { dispatch } = this.props;
    dispatch(UserActions.deleteUser(user.get('_id')));
  };

  render() {
    return (
      <div className={ CLASS_NAME }>
        { this.renderUsersTable() }
      </div>
    );
  }

  renderUsersTable() {
    const { users } = this.props;

    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(this.renderUserRow.bind(this))
          }
        </tbody>
      </table>
    );
  }

  renderUserRow(user, index) {
    return (
      <tr key={ index }>
        <td>{ user.get('_id') }</td>
        <td>{ user.get('name') }</td>
        <td>{ user.get('email') }</td>
        <td>
          <button className="btn btn-danger btn-sm" onClick={ () => this._onDeleteButtonClick(user) }>
            DELETE?
          </button>
        </td>
      </tr>
    );
  }
}

export default connect(state => {
  const userIds = state.UserStore.get('userIds');
  const users = state.UserStore.get('users');

  return {
    users: userIds.map(id => users.get(id))
  };
})(AdminUsersContainer);
