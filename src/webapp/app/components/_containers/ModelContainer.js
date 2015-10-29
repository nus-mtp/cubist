import React from 'react';
import {connect} from 'react-redux';

import {ModelCanvas} from '../render';

const CLASS_NAME = 'cb-ctn-model';

class ModelContainer extends React.Component {
  render() {
    return (
      <div className={CLASS_NAME}>
        <h2 className={`${CLASS_NAME}-title`}>
          Model Name
        </h2>
        <div className="row">
          <div className="col-md-8">
            <ModelCanvas />
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
