import React from 'react';
import Slider from 'react-slick';
import Immutable from 'immutable';
import Dropzone from 'react-dropzone';

class SnapshotSlider extends React.Component {
  static propTypes = {
    snapshots: React.PropTypes.instanceOf(Immutable.List)
  };

  static defaultProps = {
    snapshots: new Immutable.List()
  };

  render() {
    const slideSettings = {
      className: 'cb-snapshot-slider',
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1
    };

    return (
      <Slider { ...slideSettings }>
        <div className="cb-snapshot-slide-add">
          <Dropzone className="cb-snapshot-slide-add-button btn btn-transparent btn-block">
            +
          </Dropzone>
        </div>
      </Slider>
    );
  }
}

export default SnapshotSlider;
