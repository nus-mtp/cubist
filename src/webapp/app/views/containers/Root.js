import React from 'react';
import Helmet from 'react-helmet';

const CLASS_NAME = 'cb-root';

class Root extends React.Component {

  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    const {children} = this.props;

    return (
      <div className={CLASS_NAME}>
        <Helmet title="Cubist 3D" />
        {children}
      </div>
    );
  }
}

export default Root;
