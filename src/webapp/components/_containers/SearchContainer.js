import React from 'react';
import PureComponent from 'react-pure-render/component';

const CLASS_NAME = 'cb-ctn-error';

class SearchContainer extends PureComponent {
  render() {
    return (
      <div className={ CLASS_NAME }>
        <h1>SearchResults</h1>
      </div>
    );
  }
}

export default SearchContainer;
