import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import moment from 'moment';

import { UserActions, ModelActions } from 'webapp/actions';
import { ModelCard } from '../model';
import { GravatarHelper } from 'webapp/helpers';

const CLASS_NAME = 'cb-ctn-profile';

class ProfileContainer extends React.Component {
  static fetchData({ dispatch, params }) {
    const { username } = params;
    return Promise.resolve()
      .then(() => dispatch(UserActions.getUser({ name: username })))
      .then(user => {
        if (user && user._id) {
          return dispatch(ModelActions.getModels({ uploader: user._id }));
        }
      });
  }

  static propTypes = {
    models: React.PropTypes.instanceOf(Immutable.List),
    user: React.PropTypes.instanceOf(Immutable.Map)
  };

  render() {
    return (
      <div className={ CLASS_NAME }>
        { this._renderPersonal() }
        { this._renderPortfolio() }
      </div>
    );
  }

  _renderPersonal() {
    const { user } = this.props;
    const avatarUrl = GravatarHelper.getGravatarUrl(user.get('email'));

    return (
      <div className={ `${CLASS_NAME}-personal` }>
        <h2>PROFILE</h2>
        <hr className="cb-primary-line" />
        <div className={ `${CLASS_NAME}-personal-card panel panel-default` }>
          <div className="panel-body">
            <div className={ `${CLASS_NAME}-personal-card-content row` }>
              <div className="col-xs-12 col-sm-2 col-md-1">
                <img className={ `${CLASS_NAME}-personal-avatar cb-image-round` } src={ avatarUrl } />
              </div>
              <div className="col-xs-12 col-sm-10 col-md-11">
                <h3>{ user.get('name') }</h3>
                <h4>{ `Joined on ${moment(user.get('createdAt')).format('Do MMMM YYYY')}` }</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderPortfolio() {
    return (
      <div className={ `${CLASS_NAME}-portfolio` }>
        <h2>PORTFOLIO</h2>
        <hr className="cb-primary-line" />
        <div className="row">
          { this._renderModels() }
        </div>
      </div>
    );
  }

  _renderModels() {
    const { models } = this.props;
    return models.map((model, i) => (
      <div className={ `${CLASS_NAME}-model-item col-md-4 col-sm-6 col-xs-12` } key={ i }>
        <ModelCard model={ model } isUserDisplayed={ false } />
      </div>
    ));
  }
}

export default connect(state => {
  const modelIds = state.ModelStore.get('modelIds');
  const models = state.ModelStore.get('models');
  const currentUserId = state.UserStore.get('currentUserId', '');
  const users = state.UserStore.get('users');

  return {
    models: modelIds.map(id => models.get(id)),
    uploader: users.get(currentUserId)
  };
})(ProfileContainer);
