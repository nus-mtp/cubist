import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';
import Immutable from 'immutable';
import { ModelCard } from '../model';
import { BrowseActions } from 'webapp/actions';
import { Constants } from 'common';
import { pushState } from 'redux-router';
import qs from 'qs';

const CLASS_NAME = 'cb-ctn-browse';
const SEARCH_FIELD = 'search-field';
const TITLE_CHECKBOX = 'title-checkbox';
const TAG_CHECKBOX = 'tag-checkbox';
const USER_CHECKBOX = 'user-checkbox';
const RESULT_CATEGORY = 'category-dropmenu';
const PAGE = 'page';
const RESULT_SORT = 'sort-dropmenu';

const ALL_CATEGORIES_FILTER = 'all';

class BrowseContainer extends PureComponent {

  static fetchData({ dispatch, query }) {
    return dispatch(BrowseActions.browse(query));
  }

  static propTypes = {
    resultsModels: React.PropTypes.instanceOf(Immutable.List),
    hasNextPage: React.PropTypes.bool,
    location: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    const query = qs.parse(props.location.search.substring(1));
    let pageNum = parseInt(query.page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      pageNum = 1;
    }
    this.state = {
      formData: {
        [SEARCH_FIELD]: query.searchString,
        [TITLE_CHECKBOX]: query.searchTitle !== '0',
        [TAG_CHECKBOX]: query.searchTag !== '0',
        [USER_CHECKBOX]: query.searchUser !== '0',
        [PAGE]: pageNum,
        [RESULT_CATEGORY]: query.category || ALL_CATEGORIES_FILTER,
        [RESULT_SORT]: query.sort || '0'
      }
    };
  }

  render() {
    return (
      <div className={ CLASS_NAME }>
        <div className={ `${CLASS_NAME}-header cb-text-center` }>
          <h3>{ this._getPageTitle() }</h3>
          { this._renderExtendedSearchForm() }
        </div>
        <br /><br />
        <div className={ `${CLASS_NAME}-filter-row cb-text-center` }>
          { this._renderPrevButton() }
          { this._renderFilterAndSortDropdown() }
          { this._renderNextButton() }
        </div>
        <br /><br /><br /><br />
        { this._renderResultsModels() }
      </div>
    );
  }

  _getPageTitle() {
    const { location } = this.props;
    const query = qs.parse(location.search.substring(1));
    if (query.searchString) {
      return 'Search Results';
    }

    if (query.category) {
      for (let i = 0; i < Constants.MODEL_CATEGORIES.length; i++) {
        if (Constants.MODEL_CATEGORIES[i].toLowerCase() === query.category.toLowerCase()) {
          return 'Category: ' + query.category.charAt(0).toUpperCase() + query.category.slice(1);
        }
      }
    }
    return 'Search All of Cubist!';
  }

  _renderExtendedSearchForm() {
    return (
      <form className="form" onSubmit={ this._onSearchFormSubmit }>
        <div className="form-inline">
          <input id={ SEARCH_FIELD }
            type="text"
            className="form-control"
            defaultValue={ this.state.formData[SEARCH_FIELD] }
            placeholder="Search"
            onChange={ (e) => this._onSearchFieldChange(SEARCH_FIELD, e.target.value) }/>
            <button className={ `${CLASS_NAME}-search btn` } type="submit">
                <i className="fa fa-search" />
            </button>
        </div>
        <div className="form-inline centered-60-div">
          <label className="label-25">Search by:</label>
          <label className="label-15">
            <input id={ TITLE_CHECKBOX }
              type="checkbox"
              defaultChecked={ this.state.formData[TITLE_CHECKBOX] }
              onClick={ () => this._onCheckboxClick(TITLE_CHECKBOX) }/>
                Title
          </label>
          <label className="label-15">
            <input id={ TAG_CHECKBOX }
              type="checkbox"
              defaultChecked={ this.state.formData[TAG_CHECKBOX] }
              onClick={ () => this._onCheckboxClick(TAG_CHECKBOX) }/>
                Tag
          </label>
          <label className="label-15">
            <input id={ USER_CHECKBOX }
              type="checkbox"
              defaultChecked={ this.state.formData[USER_CHECKBOX] }
              onClick={ () => this._onCheckboxClick(USER_CHECKBOX) }/>
                User
          </label>
        </div>
      </form>
    );
  }

  _onPageButtonClick(isForward) {
    if (!isForward) { // Backwards
      this.state.formData[PAGE] -= 1;
      if (this.state.formData[PAGE] < 1) {
        this.state.formData[PAGE] = 1;
      }
    } else {
      this.state.formData[PAGE] += 1;
    }
    const { dispatch } = this.props;
    dispatch(pushState(null,
      '/browse?' + this.reuseSearchQuery(PAGE, this.state.formData[PAGE])));
  }

  _onCheckboxClick = (fieldId) => {
    const formData = _.cloneDeep(this.state.formData);
    formData[fieldId] = !formData[fieldId];
    this.setState({ formData });
  };

  _onSearchFieldChange = (fieldId, input) => {
    const formData = _.cloneDeep(this.state.formData);
    const trimmedText = input.trim();
    formData[fieldId] = input.length === 0 ? undefined : trimmedText;
    this.setState({ formData });
  };

  _onSearchFormSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.state.formData[PAGE] = 1;
    dispatch(pushState(null, '/browse?' + this.convertStateToQuery()));
  };

  _renderPrevButton() {
    if (this.state.formData[PAGE] > 1) {
      return (
        <div className="pull-left component-div">
          <button className="btn btn-primary"
            onClick={ () => this._onPageButtonClick(false) }>
            { '< PREV' }
          </button>
        </div>
        );
    }
  }

  _renderNextButton() {
    const { hasNextPage } = this.props;
    if (hasNextPage) {
      return (
        <div className="pull-right component-div">
          <button className="btn btn-primary"
            onClick={ () => this._onPageButtonClick(true) }>
            { 'NEXT >' }
          </button>
        </div>
        );
    }
  }

  _renderFilterAndSortDropdown() {
    return (
      <div className="pull-left" id="dropdown-div">
        { 'Category: ' }
        <select onChange={ e => this._onDropdownChange(RESULT_CATEGORY, e.target.value) }
          value={ this.state.formData[RESULT_CATEGORY] }
          className={ `${CLASS_NAME}-filter-menu drop-menu` }
          id={ `model-${RESULT_CATEGORY}` }>
          <option value={ ALL_CATEGORIES_FILTER }>All</option>
            {
              Constants.MODEL_CATEGORIES.map((c, i) => (
                <option key={ i } value={ c.toLowerCase() }>{ c }</option>
              ))
            }
        </select>
        { '  Sort By: ' }
        <select onChange={ e => this._onDropdownChange(RESULT_SORT, e.target.value) }
          value={ this.state.formData[RESULT_SORT] }
          className={ `${CLASS_NAME}-filter-menu drop-menu` }
          id={ `model-${RESULT_SORT}` }>
          <option value="0">Latest Uploads</option>
          <option value="1">Number of Views</option>
          <option value="2">Alphabetically</option>
        </select>
      </div>
    );
  }

  _onDropdownChange(fieldId, value) {
    this.state.formData[fieldId] = value;
    this.state.formData[PAGE] = 1;
    const { dispatch } = this.props;
    dispatch(pushState(null, '/browse?' + this.reuseSearchQuery(fieldId)));
  }

  reuseSearchQuery(fieldToChange) {
    const { location } = this.props;
    const query = qs.parse(location.search.substring(1));

    if (fieldToChange === RESULT_CATEGORY) {
      query.category =
        this.state.formData[RESULT_CATEGORY] !== ALL_CATEGORIES_FILTER ?
        this.state.formData[RESULT_CATEGORY] : undefined;
      query.page = undefined;
    } else if (fieldToChange === RESULT_SORT) {
      query.sort =
        this.state.formData[RESULT_SORT] !== '0' ? this.state.formData[RESULT_SORT] : undefined;
      query.page = undefined;
    } else if (fieldToChange === PAGE) {
      query.page = this.state.formData[PAGE] > 1 ? this.state.formData[PAGE] : undefined;
    }
    return qs.stringify(query);
  }

  convertStateToQuery() {
    const query = {};
    if (this.state.formData[SEARCH_FIELD]) {
      query.searchString = this.state.formData[SEARCH_FIELD];

      if (this.state.formData[TITLE_CHECKBOX] === false) {
        query.searchTitle = 0;
      }

      if (this.state.formData[TAG_CHECKBOX] === false) {
        query.searchTag = 0;
      }

      if (this.state.formData[USER_CHECKBOX] === false) {
        query.searchUser = 0;
      }
    }
    if (this.state.formData[PAGE] > 1) {
      query.page = this.state.formData[PAGE];
    }
    if (this.state.formData[RESULT_CATEGORY] !== ALL_CATEGORIES_FILTER) {
      query.category = this.state.formData[RESULT_CATEGORY];
    }
    if (this.state.formData[RESULT_SORT] !== '0') {
      query.sort = this.state.formData[RESULT_SORT];
    }
    return qs.stringify(query);
  }

  _renderResultsModels() {
    const { resultsModels } = this.props;
    if (resultsModels.size === 0) {
      return (
        <div className={ `${CLASS_NAME}-results component-div` }>
          No results found... try changing your search?
        </div>
      );
    }

    return resultsModels.map((model, i) => (
      <div className={ `${CLASS_NAME}-results col-md-3 col-sm-6 col-xs-12 card-div` } key={ i }>
        <ModelCard model={ model } />
      </div>
    ));
  }
}

export default connect(state => {
  return {
    resultsModels: state.BrowseStore.get('resultsModels'),
    hasNextPage: state.BrowseStore.get('hasNextPage')
  };
})(BrowseContainer);
