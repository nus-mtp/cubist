import React from 'react';
import _ from 'lodash';
import { pushState } from 'redux-router';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import Dropzone from 'react-dropzone';

import { ModelActions } from 'webapp/actions';
import { REQ_POST_CREATE_MODEL } from 'webapp/actions/types';
import { GravatarHelper } from 'webapp/helpers';

const CLASS_NAME = 'cb-ctn-upload';

const MODEL_TITLE_FIELD = 'title';
const MODEL_DESC_FIELD = 'description';
const MODEL_CATEGORY_FIELD = 'category';
const MODEL_TAGS_FIELD = 'tags';

class UploadContainer extends PureComponent {
  static propTypes = {
    user: React.PropTypes.instanceOf(Immutable.Map),
    model: React.PropTypes.instanceOf(Immutable.Map),
    err: React.PropTypes.instanceOf(Immutable.Map),
    success: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired
  };

  state = {
    files: [],
    modelInfoData: {
      [MODEL_TITLE_FIELD]: '',
      [MODEL_DESC_FIELD]: '',
      [MODEL_CATEGORY_FIELD]: '',
      [MODEL_TAGS_FIELD]: ''
    }
  };

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.success && nextProps.model.get('_id')) {
      dispatch(pushState(null, `/model/${nextProps.model.get('_id')}/edit`));
    }
  }

  _onModelFileDrop = (files) => {
    this.setState({ files });
  };

  _onModelInfoInputChange = (fieldId, value) => {
    const modelInfoData = _.cloneDeep(this.state.modelInfoData);
    modelInfoData[fieldId] = value;
    this.setState({ modelInfoData });
  };

  _onModelCreateFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { files, modelInfoData } = this.state;
    dispatch(ModelActions.createModel(files, modelInfoData));
  };

  render() {
    const { err } = this.props;

    return (
      <div className={ CLASS_NAME }>
        <h2>Create new model</h2>
        <form onSubmit={ this._onModelCreateFormSubmit }>
          <div className="row">
            <div className="col-sm-6 col-md-8">
              { this._renderDropzone() }
            </div>
            <div className="col-sm-6 col-md-4">
              <button type="submit"
                className="btn btn-success btn-block cb-margin-bottom-10px">
                CONFIRM UPLOAD
              </button>
              {
                err &&
                <div className="alert alert-danger cb-margin-bottom-10px">
                  { err.get('message') }
                </div>
              }
              { this._renderUserCard() }
              { this._renderModelInfoCard() }
            </div>
          </div>
        </form>
      </div>
    );
  }

  _renderDropzone() {
    const { files } = this.state;

    return (
      <Dropzone className={ `${CLASS_NAME}-model-dropzone` }
        onDrop={ this._onModelFileDrop }>
        <div>
          Try dropping some files here, or click to select files to upload.
        </div>
        <div>
          { files.length > 0 && <h4>Files List:</h4> }
          { files.length > 0 && this._renderFilesList() }
        </div>
      </Dropzone>
    );
  }

  _renderFilesList() {
    const { files } = this.state;

    return (
      <div>
        <ul>
          {
            files.map((file, i) => (
              <li key={ i }>
                { file.name }
              </li>
            ))
          }
        </ul>
      </div>
    );
  }

  _renderUserCard() {
    const { user } = this.props;
    const avatarUrl = GravatarHelper.getGravatarUrl(user.get('email'));

    return (
      <div className={ `${CLASS_NAME}-user-card panel panel-default` }>
        <div className="panel-body cb-text-center">
          <img className={ `${CLASS_NAME}-user-avatar cb-image-round` } src={ avatarUrl } />
          <hr />
          <h4>{ user.get('name') }</h4>
        </div>
      </div>
    );
  }

  _renderModelInfoCard() {
    const { modelInfoData } = this.state;

    return (
      <div className={ `${CLASS_NAME}-model-info-card panel panel-default` }>
        <div className="panel-body">
          <h3>ABOUT THIS MODEL</h3>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_TITLE_FIELD}` }>
              Model Name *
            </label>
            <input id={ `model-${MODEL_TITLE_FIELD}` }
              type="text"
              className="form-control"
              placeholder="Model Name"
              value={ modelInfoData[MODEL_TITLE_FIELD] }
              onChange={ (e) => this._onModelInfoInputChange(MODEL_TITLE_FIELD, e.target.value) } />
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_DESC_FIELD}` }>
              Model Description
            </label>
            <textarea id={ `model-${MODEL_DESC_FIELD}` }
              rows="8"
              className="form-control"
              value={ modelInfoData[MODEL_DESC_FIELD] }
              onChange={ (e) => this._onModelInfoInputChange(MODEL_DESC_FIELD, e.target.value) } />
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_CATEGORY_FIELD}` }>
              Model Category*
            </label>
            <select onChange={ e => this._onModelInfoInputChange(MODEL_CATEGORY_FIELD, e.target.value) }
              value={ modelInfoData[MODEL_CATEGORY_FIELD] }
              className="form-control"
              id={ `model-${MODEL_CATEGORY_FIELD}` }>
              <option value="">Select One</option>
              <option value="character">Character</option>
              <option value="game">Game</option>
              <option value="animal">Animal</option>
              <option value="scene">Scene</option>
              <option value="vehicle">Vehicle</option>
              <option value="object">Object</option>
              <option value="architecture">Architecture</option>
              <option value="misc">Misc</option>
            </select>
          </div>
          <div className="form-group">
            <label className="control-label" htmlFor={ `model-${MODEL_TAGS_FIELD}` }>
              Model Tags
            </label>
            <textarea id={ `model-${MODEL_TAGS_FIELD}` }
              rows="3"
              className="form-control"
              value={ modelInfoData[MODEL_TAGS_FIELD] }
              onChange={ (e) => this._onModelInfoInputChange(MODEL_TAGS_FIELD, e.target.value) } />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  const modelId = state.ModelStore.get('modelId');
  let model = new Immutable.Map();
  if (modelId) {
    model = state.ModelStore.getIn(['models', modelId]);
  }

  return {
    err: state.RequestStore.getIn(['err', REQ_POST_CREATE_MODEL]),
    success: state.RequestStore.getIn(['success', REQ_POST_CREATE_MODEL]),
    model
  };
})(UploadContainer);
