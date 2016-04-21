import React from 'react';
import { Link } from 'react-router';

const CLASS_NAME = 'cb-ctn-admin';

class AdminContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  };

  render() {
    const { children } = this.props;

    return (
      <div className={ CLASS_NAME } style={ { padding: '5px 10px' } }>
        <div className="row">
          <div className="col-sm-6">
            <Link to="/admin" className="btn btn-success btn-block cb-margin-top-10px cb-margin-bottom-10px">
              MONITOR MODELS
            </Link>
          </div>
          <div className="col-sm-6">
            <Link to="/admin/user" className="btn btn-success btn-block cb-margin-top-10px cb-margin-bottom-10px">
              MONITOR USERS
            </Link>
          </div>
        </div>
        { children }
      </div>
    );
  }
}

export default AdminContainer;
