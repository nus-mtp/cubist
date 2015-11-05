import React from 'react';
import {connect} from 'react-redux';
import {JSONLoader} from 'three';

import {ModelViewer} from '../model';

const CLASS_NAME = 'cb-ctn-model';

class ModelContainer extends React.Component {
  static propTypes = {

  }

  state = {
    geometry: undefined,
    materials: undefined
  }

  // This is only for testing
  // Currently we are loading the model JSON data from the rendering server instead of storage service
  componentDidMount() {
    const loader = new JSONLoader();
    loader.load('/modelAssets/android.js', (geometry, materials) => {
      this.setState({
        geometry,
        materials
      });
    });
  }

  render() {
    const {geometry, materials} = this.state;

    return (
      <div className={CLASS_NAME}>
        <h2 className={`${CLASS_NAME}-title`}>
          Model Name
        </h2>
        <div className="row">
          <div className="col-md-8">
            <ModelViewer modelData={{geometry, materials}} />
          </div>
          <div className="col-md-4">
            <div className={`${CLASS_NAME}-info-bar`}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => {
  return {

  };
})(ModelContainer);
