import Promise from 'bluebird';
import Immutable from 'immutable';
import classnames from 'classnames';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';
import Trianglify from 'trianglify';

import { TrianglifyCanvas } from '../common';
import { ModelCard } from '../model';
import { ModelActions } from 'webapp/actions';
import { requireServerJson } from 'webapp/utils';

const categories = process.env.BROWSER
  ? require('webapp/assets/model-category.json')
  : requireServerJson(__dirname, '../../assets/model-category.json');

const CLASS_NAME = 'cb-ctn-home';
const fallBackImage = 'https://d13yacurqjgara.cloudfront.net/users/532989/screenshots/1700135/cube_1x.jpg';
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

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

  state = {
    ...Trianglify.defaults,
    width: process.env.BROWSER ? window.innerWidth : DEFAULT_WIDTH,
    height: process.env.BROWSER ? window.innerHeight : DEFAULT_HEIGHT,
    x_colors: 'YlGnBu',
    cell_size: 40,
    resize_timer: null,
    variance: 0.75,
    seed: Math.random()
  };

  componentDidMount() {
    window.addEventListener('resize', this._onDebounceResize);
    window.addEventListener('orientationchange', this._onDebounceResize);
    this.setState({
      // Provide some offset height at initial load
      height: ReactDOM.findDOMNode(this.refs.hero).offsetHeight + 25
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onDebounceResize);
    window.removeEventListener('orientationchange', this._debounceResize);
  }

  _onDebounceResize = () => {
    clearTimeout(this.state.resize_timer);
    this.setState({ resize_timer: setTimeout(this._onResize, 100) });
  };

  _onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: ReactDOM.findDOMNode(this.refs.hero).offsetHeight
    });
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
    const { width, height, seed, cell_size, variance, x_colors } = this.state;
    const trianglifyProps = {
      variance,
      x_colors,
      cell_size,
      seed,
      width: width + 10,
      height: height + 10
    };

    return (
      <div className={ `${CLASS_NAME}-hero` } ref="hero">
        <TrianglifyCanvas { ...trianglifyProps } />
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
          'col-xs-3'
        ];
      } else {
        itemClasses = [
          `${CLASS_NAME}-hero-random-item`,
          `${CLASS_NAME}-hero-random-6-item`,
          'col-xs-2'
        ];
      }
      const style = {
        backgroundImage: `url(${model.getIn(['imageUrls', 0], fallBackImage)})`
      };

      return (
        <Link to={ `/model/${model.get('_id')}` }
          className={ classnames(itemClasses) }
          style={ style }
          key={ i }>
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
        backgroundImage: `url(${category.image_url})`
      };

      return (
        <div className={ `${CLASS_NAME}-category-item col-md-3 col-sm-4 col-xs-6` }
          style={ style }
          key={ i }>
          <div className={ `${CLASS_NAME}-category-item-overlay` }>
            <div className={ `${CLASS_NAME}-category-item-title` }>
              { category.category }
            </div>
          </div>
        </div>
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
