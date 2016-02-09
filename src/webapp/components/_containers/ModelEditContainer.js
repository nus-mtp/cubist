import React from 'react';
import { connect } from 'react-redux';

const CLASS_NAME = 'cb-ctn-model-edit';

class ModelEditContainer extends React.Component {
  render() {
    return (
      <div className={ CLASS_NAME }>

      </div>
    );
  }
}

export default connect(state => {
  return {

  };
})(ModelEditContainer);
