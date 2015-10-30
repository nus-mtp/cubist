import React from 'react';
import {connect} from 'react-redux';

import {ModelViewer} from '../model';

const CLASS_NAME = 'cb-ctn-model';

class ModelContainer extends React.Component {
  static propTypes = {

  }

  render() {
    return (
      <div className={CLASS_NAME}>
        <h2 className={`${CLASS_NAME}-title`}>
          Model Name
        </h2>
        <div className="row">
          <div className="col-md-8">
            <ModelViewer />
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
