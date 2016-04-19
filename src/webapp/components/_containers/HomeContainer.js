import Promise from 'bluebird';
import Immutable from 'immutable';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PureComponent from 'react-pure-render/component';

import { ModelCard } from '../model';
import { ModelActions } from 'webapp/actions';
import { UrlHelper } from 'webapp/helpers';
import { requireServerJson } from 'webapp/utils';

const categories = process.env.BROWSER
  ? require('webapp/assets/model-category.json')
  : requireServerJson(__dirname, '../../assets/model-category.json');

const CLASS_NAME = 'cb-ctn-home';

class HomeContainer extends PureComponent {
  static fetchData({ dispatch }) {
    return Promise.all([
      dispatch(ModelActions.getTopModels()),
      dispatch(ModelActions.getLatestModels())
    ]);
  }

  static propTypes = {
    latestModels: React.PropTypes.instanceOf(Immutable.List),
    topModels: React.PropTypes.instanceOf(Immutable.List)
  };

  render() {
    return (
      <div className={ CLASS_NAME }>
        { this._renderHeroSection() }
        { this._renderPopularSection() }
        { this._renderCategorySection() }
      </div>
    );
  }

  _renderHeroSection() {
    return (
      <div className={ `${CLASS_NAME}-hero` } ref="hero">
        <div className={ `${CLASS_NAME}-hero-content` }>
          <h1 className={ `${CLASS_NAME}-hero-title` }>CUBIST</h1>
          <p className={ `${CLASS_NAME}-hero-subtitle` }>
            Your open-source 3D web gallery
          </p>
          <div className={ `${CLASS_NAME}-hero-random row` }>
            { this._renderLatestModels() }
          </div>
        </div>
      </div>
    );
  }

  _renderLatestModels() {
    const { latestModels } = this.props;
    let rowIndex = 0;
    let rowItems = 4;

    return latestModels.map((model, i) => {
      if (rowIndex === rowItems) {
        rowIndex = 0;
        rowItems = rowItems === 4 ? 6 : 4;
      }
      rowIndex++;
      let itemClasses;
      if (rowItems === 4) {
        itemClasses = [
          `${CLASS_NAME}-hero-random-item`,
          `${CLASS_NAME}-hero-random-4-item`,
          'col-xs-12',
          'col-sm-3'
        ];
      } else {
        itemClasses = [
          `${CLASS_NAME}-hero-random-item`,
          `${CLASS_NAME}-hero-random-6-item`,
          'col-xs-12',
          'col-sm-2'
        ];
      }

      const style = {
        backgroundImage: `url("${UrlHelper.getSnapshotUrl(model.getIn(['imageUrls', 0]))}")`
      };

      return (
        <Link to={ `/model/${model.get('_id')}` }
          className={ classnames(itemClasses) }
          key={ i }>
          <div className={ `${CLASS_NAME}-hero-random-item-background` } style={ style } />
          <div className={ `${CLASS_NAME}-hero-random-item-overlay` }>
          </div>
        </Link>
      );
    });
  }

  _renderPopularSection() {
    return (
      <section className={ `${CLASS_NAME}-popular` }>
        <div className={ `${CLASS_NAME}-popular-header` }>
          <h2>TOP POPULAR</h2>
        </div>
        <div className={ `${CLASS_NAME}-popular-content` }>
          <div className="row">
            { this._renderPopularModels() }
          </div>
        </div>
        <div className={ `${CLASS_NAME}-popular-footer` }>
          <button className="btn btn-success">
            SEE MORE
          </button>
        </div>
      </section>
    );
  }

  _renderPopularModels() {
    const { topModels } = this.props;
    return topModels.map((model, i) => (
      <div className={ `${CLASS_NAME}-popular-item col-md-4 col-sm-6 col-xs-12` } key={ i }>
        <ModelCard model={ model } />
      </div>
    ));
  }

  _renderCategorySection() {
    return (
      <section className={ `${CLASS_NAME}-category` }>
        <div className={ `${CLASS_NAME}-category-header` }>
          <h2>CATEGORIES</h2>
        </div>
        <div className={ `${CLASS_NAME}-category-content` }>
          <div className="row">
            { this._renderCategories() }
          </div>
        </div>
      </section>
    );
  }

  _renderCategories() {
    return categories.map((category, i) => {
      const style = {
        backgroundImage: `url("${category.image_url}")`
      };

      return (
        <Link to={ `/browse?category=${category.db_name}` }
          className={ `${CLASS_NAME}-category-item col-md-3 col-sm-4 col-xs-6 scrollup` }
          key={ i }>
          <div className={ `${CLASS_NAME}-category-item-background` } style={ style } />
          <div className={ `${CLASS_NAME}-category-item-overlay` }>
            <div className={ `${CLASS_NAME}-category-item-title` }>
              { category.title }
            </div>
          </div>
        </Link>
      );
    });
  }
}

export default connect(state => {
  const latestModelIds = state.ModelStore.get('latestModelIds');
  const topModelIds = state.ModelStore.get('topModelIds');
  const models = state.ModelStore.get('models');

  return {
    latestModels: latestModelIds.map(id => models.get(id)),
    topModels: topModelIds.map(id => models.get(id))
  };
})(HomeContainer);
