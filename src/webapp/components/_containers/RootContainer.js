import React from 'react';
import PureComponent from 'react-pure-render/component';

if (process.env.BROWSER) {
  require('webapp/styles/main.scss');
}

const CLASS_NAME = 'cb-ctn-root';

class RootContainer extends PureComponent {
  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    const { children } = this.props;

    return (
      <div className={ CLASS_NAME }>
        { children }
      </div>
    );
  }
}

export default RootContainer;
