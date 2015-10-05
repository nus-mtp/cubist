import React from 'react';

const CLASS_NAME = 'cb-home';

class Home extends React.Component {

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

export default Home;
