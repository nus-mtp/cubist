import React from 'react';
import PureComponent from 'react-pure-render/component';

const CLASS_NAME = 'cb-ctn-error';

class ErrorContainer extends PureComponent {
  render() {
    return (
      <div className={ CLASS_NAME }>
        Error
      </div>
    );
  }
}

export default ErrorContainer;
