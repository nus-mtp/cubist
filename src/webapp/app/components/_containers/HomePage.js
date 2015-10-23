import React from 'react';
import PureComponent from 'react-pure-render/component';

const CLASS_NAME = 'cb-home';

class HomePage extends PureComponent {

  render() {
    return (
      <div className={CLASS_NAME}>
        <h1>Home</h1>
      </div>
    );
  }
}

export default HomePage;
