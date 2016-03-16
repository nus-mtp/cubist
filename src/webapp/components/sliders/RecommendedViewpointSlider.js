import React from 'react';
import Slider from 'react-slick';
import Immutable from 'immutable';
import Dropzone from 'react-dropzone';

import { UrlHelper } from 'webapp/helpers';

class RecommendedViewpointSlider extends React.Component {
  static propTypes = {
    snapshots: React.PropTypes.instanceOf(Immutable.List),
    onSnapshotsAdd: React.PropTypes.func,
    isEditor: React.PropTypes.bool
  };

  static defaultProps = {
    snapshots: new Immutable.List(),
    isEditor: false
  };

  state = {
    newSnapshots: []
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshots !== this.props.snapshots) {
      this.setState({
        newSnapshots: []
      });
    }
  }

  _onSnapshotFilesDrop = (files) => {
    const newSnapshots = this.state.newSnapshots.slice(0);
    this.setState({
      newSnapshots: newSnapshots.concat(files)
    });
  };

  _onAddButtonClick = () => {
    const { onSnapshotsAdd } = this.props;
    if (onSnapshotsAdd) {
      onSnapshotsAdd(this.state.newSnapshots);
    }
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
    const { snapshots, isEditor } = this.props;
    const { newSnapshots } = this.state;

    return (
      <div>
        <Slider { ...slideSettings }>
          { snapshots.map(this._renderSnapshot.bind(this)) }
          { newSnapshots.map(this._renderNewSnapshot.bind(this)) }
          { this._renderDropzone() }
        </Slider>
        {
          isEditor && newSnapshots.length !== 0 &&
          <button onClick={ this._onAddButtonClick } className="btn btn-success">
            ADD NEW SNAPSHOTS
          </button>
        }
      </div>
    );
  }

  _renderDropzone() {
    const { isEditor } = this.props;

    if (!isEditor) {
      return [];
    }

    return (
      <div className="cb-snapshot-slide-add">
        <Dropzone className="cb-snapshot-slide-add-button btn btn-transparent btn-block"
          onDrop={ this._onSnapshotFilesDrop }>
          +
        </Dropzone>
      </div>
    );
  }

  _renderSnapshot(snapshot, index) {
    const snapshotStyle = {
      backgroundImage: `url("${UrlHelper.getSnapshotUrl(snapshot)}")`
    };

    return (
      <div className="cb-snapshot-slide" style={ snapshotStyle } key={ index }>
      </div>
    );
  }

  _renderNewSnapshot(snapshot, index) {
    return (
      <div className="cb-snapshot-slide" key={ index }>
        <img className="cb-snapshot-slide-image" src={ snapshot.preview } />
      </div>
    );
  }
}

export default RecommendedViewpointSlider;
