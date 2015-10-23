import React from 'react';
import {connect} from 'react-redux';

import {ModelCanvas} from '../render';

const CLASS_NAME = 'cb-model';

class ModelPage extends React.Component {
  render() {
    return (
      <div className={CLASS_NAME}>
        <ModelCanvas width={500} height={500} />
      </div>
    );
  }
}

export default connect(() => {
  return {

  };
})(ModelPage);
