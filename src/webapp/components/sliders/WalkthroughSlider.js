import React from 'react';
import classnames from 'classnames';
import Slider from 'react-slick';
import Immutable from 'immutable';

class WalkthroughSlider extends React.Component {
  static propTypes = {
    snapshots: React.PropTypes.instanceOf(Immutable.Map),
    walkthroughs: React.PropTypes.instanceOf(Immutable.List),
    onWalkthroughAdd: React.PropTypes.func,
    onWalkthroughSelect: React.PropTypes.func,
    isEditor: React.PropTypes.bool
  };

  static defaultProps = {
    walkthroughs: new Immutable.List(),
    isEditor: false
  };

  state = {
    selectedIndex: undefined
  };

  _onAddButtonClick = () => {
    const { onWalkthroughAdd } = this.props;
    return onWalkthroughAdd && onWalkthroughAdd();
  };

  _onWalkthroughSelect = (index) => {
    const { onWalkthroughSelect } = this.props;
    this.setState({ selectedIndex: index });
    return onWalkthroughSelect && onWalkthroughSelect(index);
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
    const { walkthroughs } = this.props;

    return (
      <div>
        <Slider { ...slideSettings }>
          { walkthroughs.map(this._renderWalkthrough.bind(this)) }
          { this._renderAddButton() }
        </Slider>
      </div>
    );
  }

  _renderAddButton() {
    const { isEditor } = this.props;

    if (!isEditor) {
      // Cannot return "undefined" due to the requirements from `react-slick`
      return [];
    }

    return (
      <div className="cb-slide-add">
        <button className="cb-slide-add-button btn btn-transparent btn-block"
          onClick={ this._onAddButtonClick }>
          +
        </button>
      </div>
    );
  }

  _renderWalkthrough(walkthrough, index) {
    const { snapshots } = this.props;
    const { selectedIndex } = this.state;
    const walkthroughStyle = {
      backgroundImage: `url("${snapshots.get(walkthrough.get('key'))}")`
    };
    const slideClasses = [
      'cb-slide',
      { 'is-selected': index === selectedIndex }
    ];

    return (
      <div className={ classnames(slideClasses) }
        style={ walkthroughStyle }
        key={ index }
        onClick={ () => this._onWalkthroughSelect(index) }>
      </div>
    );
  }
}

export default WalkthroughSlider;
