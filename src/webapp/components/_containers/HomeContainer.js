import React from 'react';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';
import Trianglify from 'trianglify';
import _ from 'lodash';

import { TrianglifyCanvas } from '../common';
import { ModelCard } from '../model';

const CLASS_NAME = 'cb-ctn-home';
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

class HomeContainer extends PureComponent {
  state = {
    ...Trianglify.defaults,
    width: process.env.BROWSER ? window.innerWidth : DEFAULT_WIDTH,
    height: process.env.BROWSER ? window.innerHeight : DEFAULT_HEIGHT,
    x_colors: 'GnBu',
    cell_size: 40,
    resize_timer: null,
    variance: 0.75,
    seed: Math.random()
  }

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
  }

  _onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: ReactDOM.findDOMNode(this.refs.hero).offsetHeight
    });
  }

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
          <div className={ `${CLASS_NAME}-hero-random` }>
            <div className={ `${CLASS_NAME}-hero-random-4 row` }>
              {
                _.fill(new Array(4), 1).map((el, i) => (
                  <div className={ `${CLASS_NAME}-hero-random-4-item col-xs-3` } key={ i }>
                  </div>
                ))
              }
            </div>
            <div className={ `${CLASS_NAME}-hero-random-6 row` }>
              {
                _.fill(new Array(6), 1).map((el, i) => (
                  <div className={ `${CLASS_NAME}-hero-random-6-item col-xs-2` } key={ i }>
                  </div>
                ))
              }
            </div>
            <div className={ `${CLASS_NAME}-hero-random-4 row` }>
              {
                _.fill(new Array(4), 1).map((el, i) => (
                  <div className={ `${CLASS_NAME}-hero-random-4-item col-xs-3` } key={ i }>
                  </div>
                ))
              }
            </div>
            <div className={ `${CLASS_NAME}-hero-random-6 row` }>
              {
                _.fill(new Array(6), 1).map((el, i) => (
                  <div className={ `${CLASS_NAME}-hero-random-6-item col-xs-2` } key={ i }>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderPopularSection() {
    return (
      <section className={ `${CLASS_NAME}-popular` }>
        <div className={ `${CLASS_NAME}-popular-header` }>
          <h2>TOP POPULAR</h2>
        </div>
        <div className={ `${CLASS_NAME}-popular-content` }>
          <div className="row">
            {
              _.fill(new Array(9), 1).map((el, i) => (
                <div className={ `${CLASS_NAME}-popular-item col-md-4 col-sm-6 col-xs-12` } key={ i }>
                  <ModelCard />
                </div>
              ))
            }
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

  _renderCategorySection() {
    return (
      <section className={ `${CLASS_NAME}-category` }>
        <div className={ `${CLASS_NAME}-category-header` }>
          <h2>CATEGORIES</h2>
        </div>
        <div className={ `${CLASS_NAME}-category-content` }>
          <div className="row">
            {
              _.fill(new Array(8), 1).map((el, i) => (
                <div className={ `${CLASS_NAME}-category-item col-md-3 col-sm-4 col-xs-6` } key={ i }>

                </div>
              ))
            }
          </div>
        </div>
      </section>
    );
  }
}

export default HomeContainer;
