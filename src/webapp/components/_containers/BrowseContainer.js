import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import Immutable from 'immutable';
import { ModelCard } from '../model';
import { BrowseActions } from 'webapp/actions';
import { pushState } from 'redux-router';
import qs from 'qs';

const CLASS_NAME = 'cb-ctn-browse';
const SEARCH_FIELD = 'search';

class BrowseContainer extends PureComponent {

  state = {
    formData: {
      [SEARCH_FIELD]: ' '
    }
  };

  static fetchData({ dispatch, query }) {
    return dispatch(BrowseActions.browse(query.searchString));
  }

  static propTypes = {
    resultsModels: React.PropTypes.instanceOf(Immutable.List),
    location: React.PropTypes.object
  };

  render() {
    return (
      <div className={ CLASS_NAME }>
        <div className={ `${CLASS_NAME}-header cb-text-center` }>
          <h3>SEARCH RESULTS</h3>
          { this._renderExtendedSearchForm() }
          <br /><br />
        </div>
        { this._renderResultsModels() }
      </div>
    );
  }

  _renderExtendedSearchForm() {
    const { location } = this.props;
    const searchString = qs.parse(location.search.substring(1)).searchString;
    return (
      <form className="navbar-form" onSubmit={ this._onSearchFormSubmit }>
        <div className="input-group">
          <input id={ SEARCH_FIELD }
            type="text"
            className="form-control"
            placeholder={ searchString || 'Search' }
            onChange={ (e) => this._onInputChange(SEARCH_FIELD, e.target.value) }/>
          <div className="input-group-btn">
            <button className={ `${CLASS_NAME}-navbar-search btn` } type="submit">
              <i className="fa fa-search" />
            </button>
          </div>
        </div>
      </form>
    );
  }

  _onInputChange = (fieldId, text) => {
    const formData = _.cloneDeep(this.state.formData);
    formData[fieldId] = text;
    this.setState({ formData });
  };

  _onSearchFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const queryString = qs.stringify(
      { searchString: this.state.formData[SEARCH_FIELD] });
    dispatch(pushState(null, '/browse?' + queryString));
  };

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
      <div className={ `${CLASS_NAME}-results col-md-3 col-sm-6 col-xs-12` } key={ i }>
        <ModelCard model={ model } />
      </div>
    ));
  }
}

export default connect(state => {
  return {
    resultsModels: state.BrowseStore.get('resultsModels')
  };
})(BrowseContainer);
