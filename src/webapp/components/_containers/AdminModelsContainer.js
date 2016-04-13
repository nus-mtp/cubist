import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import { ModelActions } from 'webapp/actions';

const CLASS_NAME = 'cb-ctn-admin-models';

class AdminModelsContainer extends React.Component {
  static fetchData({ dispatch }) {
    return dispatch(ModelActions.getModels(null, {
      sort: '-socialData.flags'
    }));
  }

  static propTypes = {
    models: React.PropTypes.instanceOf(Immutable.List),
    dispatch: React.PropTypes.func.isRequired
  };

  _onDeleteButtonClick = (model) => {
    const { dispatch } = this.props;
    dispatch(ModelActions.deleteModel(model.get('_id')));
  };

  render() {
    return (
      <div className={ CLASS_NAME }>
        { this.renderModelsTable() }
      </div>
    );
  }

  renderModelsTable() {
    const { models } = this.props;

    return (
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Model ID</th>
            <th>Model Name</th>
            <th>Model Flags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            models.map(this.renderModelRow.bind(this))
          }
        </tbody>
      </table>
    );
  }

  renderModelRow(model, index) {
    return (
      <tr key={ index }>
        <td>{ model.get('_id') }</td>
        <td>{ model.get('title') }</td>
        <td>{ model.getIn(['socialData', 'flags']).size }</td>
        <td>
          <button className="btn btn-danger btn-sm" onClick={ () => this._onDeleteButtonClick(model) }>
            DELETE?
          </button>
        </td>
      </tr>
    );
  }
}

export default connect(state => {
  const modelIds = state.ModelStore.get('modelIds');
  const models = state.ModelStore.get('models');

  return {
    models: modelIds.map(id => models.get(id))
  };
})(AdminModelsContainer);
