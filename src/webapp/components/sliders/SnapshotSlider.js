import React from 'react';
import Slider from 'react-slick';
import Immutable from 'immutable';
import Dropzone from 'react-dropzone';

class SnapshotSlider extends React.Component {
  static propTypes = {
    snapshots: React.PropTypes.instanceOf(Immutable.List),
    onSnapshotsAdd: React.PropTypes.func
  };

  static defaultProps = {
    snapshots: new Immutable.List()
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
    const { snapshots } = this.props;
    const { newSnapshots } = this.state;

    return (
      <div>
        <Slider { ...slideSettings }>
          { snapshots.map(this._renderSnapshot) }
          { newSnapshots.map(this._renderNewSnapshot) }
          <div className="cb-snapshot-slide-add">
            <Dropzone className="cb-snapshot-slide-add-button btn btn-transparent btn-block"
              onDrop={ this._onSnapshotFilesDrop }>
              +
            </Dropzone>
          </div>
        </Slider>
        {
          newSnapshots.length !== 0 &&
          <button onClick={ this._onAddButtonClick } className="btn btn-success">
            ADD NEW SNAPSHOTS
          </button>
        }
      </div>
    );
  }

  _renderSnapshot(snapshot, index) {
    return (
      <div className="cb-snapshot-slide" key={ index }>
        <img className="cb-snapshot-slide-image" src={ `/storage/snapshots/${snapshot}` } />
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

export default SnapshotSlider;
