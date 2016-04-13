import React from 'react';

const CLASS_NAME = 'cb-ctn-admin';

class AdminContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    const { children } = this.props;

    return (
      <div className={ CLASS_NAME }>
        <div className="row">
          <div className="col-sm-6">
            <button className="btn btn-success btn-block cb-margin-top-10px cb-margin-bottom-10px">
              MONITOR MODELS
            </button>
          </div>
        </div>
        { children }
      </div>
    );
  }
}

export default AdminContainer;
