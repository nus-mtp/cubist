import React from 'react';
import PureComponent from 'react-pure-render/component';
import {Navbar, NavBrand} from 'react-bootstrap';

const CLASS_NAME = 'cb-public';

class Public extends PureComponent {

  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    const {children} = this.props;

    return (
      <div className={CLASS_NAME}>
        <Navbar>
          <NavBrand>Cubist</NavBrand>
        </Navbar>
        {children}
      </div>
    );
  }
}

export default Public;
