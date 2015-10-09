import React from 'react';
import {Navbar} from 'react-bootstrap';

const CLASS_NAME = 'cb-public';

class Public extends React.Component {

  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    const {children} = this.props;

    return (
      <div className={CLASS_NAME}>
        <Navbar brand="Cubist 3D" />
        {children}
      </div>
    );
  }
}

export default Public;
