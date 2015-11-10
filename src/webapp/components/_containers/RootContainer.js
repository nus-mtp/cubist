import React from 'react';

if (process.env.BROWSER) {
  require('webapp/styles/main.scss');
}

const CLASS_NAME = 'cb-ctn-root';

class RootContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    const {children} = this.props;

    return (
      <div className={CLASS_NAME}>
        {children}
      </div>
    );
  }
}

export default RootContainer;
