import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';
import Trianglify from 'trianglify';

import { TrianglifyCanvas } from '../common';
import { ModelCard } from '../model';
import { requireServerJson } from 'webapp/utils';

const randomModels = process.env.BROWSER
  ? require('webapp/assets/model-random.json')
  : requireServerJson(__dirname, '../../assets/model-random.json');
const topModels = process.env.BROWSER
  ? require('webapp/assets/model-top.json')
  : requireServerJson(__dirname, '../../assets/model-top.json');
const categories = process.env.BROWSER
  ? require('webapp/assets/model-category.json')
  : requireServerJson(__dirname, '../../assets/model-category.json');

const CLASS_NAME = 'cb-ctn-home';
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

class HomeContainer extends PureComponent {
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
      height: ReactDOM.findDOMNode(this.refs.hero).offsetHeight
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
            { this._renderRandomModels() }
          </div>
        </div>
      </div>
    );
  }

  _renderRandomModels() {
    let rowIndex = 0;
    let rowItems = 4;

    return randomModels.map((model, i) => {
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
        backgroundImage: `url(${model.image_url})`
      };

      return (
        <div className={ classnames(itemClasses) } style={ style } key={ i }>
          <div className={ `${CLASS_NAME}-hero-random-item-overlay` }>
          </div>
        </div>
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

export default HomeContainer;
