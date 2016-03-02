import React from 'react';
import { Link } from 'react-router';
import Immutable from 'immutable';
import classnames from 'classnames';

import { UrlHelper, GravatarHelper } from 'webapp/helpers';

const CLASS_NAME = 'cb-model-card';

class ModelCard extends React.Component {
  static propTypes = {
    model: React.PropTypes.instanceOf(Immutable.Map)
  };

  state = {
    thumbnailIndex: 0
  };

  componentWillUnmount() {
    this.clearThumbnailRotateTimer();
  }

  _onMouseOver = () => {
    this.clearThumbnailRotateTimer();
    this.setThumbnailRotateTimer();
  };

  _onMouseOut = () => {
    this.clearThumbnailRotateTimer();
    this.setState({
      thumbnailIndex: 0
    });
  };

  render() {
    const { model } = this.props;

    return (
      <figure className={ CLASS_NAME }>
        <Link
          className={ `${CLASS_NAME}-thumbnail` }
          to={ `/model/${model.get('_id')}` }
          onMouseOver={ this._onMouseOver }
          onMouseOut={ this._onMouseOut }>
          {
            model.get('imageUrls', new Immutable.List()).map(this._renderThumbnailBackground.bind(this))
          }
          <div className={ `${CLASS_NAME}-thumbnail-overlay` } />
        </Link>
        <figcaption className={ `${CLASS_NAME}-caption` }>
          <img className={ `${CLASS_NAME}-caption-avatar` }
            src={ GravatarHelper.getGravatarUrl(model.getIn(['uploader', 'email'])) } />
          <div className={ `${CLASS_NAME}-caption-info` }>
            <div className={ `${CLASS_NAME}-caption-info-title` }>
              { model.get('title') }
            </div>
            <div className={ `${CLASS_NAME}-caption-info-uploader` }>
              { `By ${model.getIn(['uploader', 'name'])}` }
            </div>
          </div>
        </figcaption>
      </figure>
    );
  }

  _renderThumbnailBackground(image, index) {
    const thumbnailStyle = {
      backgroundImage: `url("${UrlHelper.getSnapshotUrl(image)}")`
    };
    const thumbnailClasses = [
      `${CLASS_NAME}-thumbnail-background`,
      {
        'is-active': index === this.state.thumbnailIndex
      }
    ];

    return (
      <div
        className={ classnames(thumbnailClasses) }
        style={ thumbnailStyle }
        key={ index } />
    );
  }

  setThumbnailRotateTimer() {
    const { model } = this.props;
    this.interval = setInterval(() => {
      const numSnapshots = model.get('imageUrls', new Immutable.List()).size;
      if (numSnapshots !== 0) {
        this.setState({
          thumbnailIndex: (this.state.thumbnailIndex + 1) % numSnapshots
        });
      }
    }, 2500);
  }

  clearThumbnailRotateTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
}

export default ModelCard;
