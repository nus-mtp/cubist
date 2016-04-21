import React from 'react';
import classnames from 'classnames';
import Slider from 'react-slick';
import Immutable from 'immutable';

class StatisticsSlider extends React.Component {
  static propTypes = {
    snapshots: React.PropTypes.instanceOf(Immutable.Map),
    statistics: React.PropTypes.instanceOf(Immutable.List),
    onStatisticsSelect: React.PropTypes.func,
    isEditor: React.PropTypes.bool
  };

  static defaultProps = {
    statistics: new Immutable.List(),
    isEditor: false
  };

  state = {
    selectedIndex: undefined
  };

  _onStatisticsSelect = (index) => {
    const { onStatisticsSelect } = this.props;
    this.setState({ selectedIndex: index });
    return onStatisticsSelect && onStatisticsSelect(index);
  };

  render() {
    const slideSettings = {
      className: 'cb-slider',
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1
    };
    const { statistics } = this.props;

    return (
      <div>
        <Slider { ...slideSettings }>
          { statistics.map(this._renderStatistics.bind(this)) }
        </Slider>
      </div>
    );
  }

  _renderStatistics(statistics, index) {
    const { snapshots } = this.props;
    const { selectedIndex } = this.state;

    const statisticsStyle = {
      backgroundImage: `url("${snapshots.get(statistics.get('key'))}")`
    };
    const slideClasses = [
      'cb-slide',
      { 'is-selected': index === selectedIndex }
    ];

    return (
      <div className={ classnames(slideClasses) }
        style={ statisticsStyle }
        key={ index }
        onClick={ () => this._onStatisticsSelect(index) }>
      </div>
    );
  }
}

export default StatisticsSlider;
