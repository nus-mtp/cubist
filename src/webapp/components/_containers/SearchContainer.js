import React from 'react';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import Immutable from 'immutable';
import { ModelCard } from '../model';
import { SearchActions } from 'webapp/actions';
import qs from 'qs';

const CLASS_NAME = 'cb-ctn-search';

class SearchContainer extends PureComponent {

  static fetchData({ dispatch, query }) {
    return dispatch(SearchActions.search(query.searchString));
  }

  static propTypes = {
    resultsModels: React.PropTypes.instanceOf(Immutable.List),
    location: React.PropTypes.object
  };

  render() {
    const searchString = qs.parse(location.search.substring(1)).searchString;
    return (
      <div className={ CLASS_NAME }>
        <div className={ `${CLASS_NAME}-header cb-text-center` }>
          <h3>SEARCH RESULTS</h3>
          <h4>{ 'Searching for "' + searchString + '"' }</h4>
          <br /><br />
        </div>
        { this._renderResultsModels() }
      </div>
    );
  }

  _renderResultsModels() {
    const { resultsModels } = this.props;
    if (resultsModels.size === 0) {
      return (
        <div className={ `${CLASS_NAME}-results cb-text-center` }>
          No results found
        </div>
      );
    }

    return resultsModels.map((model, i) => (
      <div className={ `${CLASS_NAME}-results col-md-4 col-sm-6 col-xs-12` } key={ i }>
        <ModelCard model={ model } />
      </div>
    ));
  }
}

export default connect(state => {
  return {
    resultsModels: state.SearchStore.get('resultsModels'),
    searchString: state.SearchStore.get('searchString')
  };
})(SearchContainer);
