import React from 'react';

import { UserActions, ModelActions } from 'webapp/actions';

const CLASS_NAME = 'cb-ctn-profile';

class ProfileContainer extends React.Component {
  static fetchData({ dispatch, params }) {
    const { username } = params;

  }

  static propTypes = {

  };

  render() {
    return (
      <div className={ CLASS_NAME }>

      </div>
    );
  }
}

export default ProfileContainer;
