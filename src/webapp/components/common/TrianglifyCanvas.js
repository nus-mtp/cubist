import React from 'react';
import ReactDOM from 'react-dom';
import Trianglify from 'trianglify';

class TrianglifyCanvas extends React.Component {
  static defaultProps = {
    ...Trianglify.defaults
  };

  componentDidMount() {
    this._renderCanvas();
  }

  shouldComponentUpdate(nextProps) {
    for (const key in nextProps) {
      if (this.props[key] !== nextProps[key]) {
        return true;
      }
    }
    return false;
  }

  componentDidUpdate() {
    this._renderCanvas();
  }

  render() {
    return <canvas />;
  }

  _renderCanvas() {
    const canvas = ReactDOM.findDOMNode(this);
    Trianglify(this.props).canvas(canvas);
  }
}

export default TrianglifyCanvas;
