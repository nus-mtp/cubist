import React from 'react';
import { Link } from 'react-router';
import Immutable from 'immutable';

const CLASS_NAME = 'cb-model-card';

class ModelCard extends React.Component {
  static propTypes = {
    model: React.PropTypes.instanceOf(Immutable.Map)
  };

  render() {
    const { model } = this.props;
    const thumbnailStyle = {
      backgroundImage: `url(${model.getIn(['imageUrls', 0])})`
    };

    return (
      <figure className={ CLASS_NAME }>
        <Link className={ `${CLASS_NAME}-thumbnail` }
          style={ thumbnailStyle }
          to={ `/model/${model.get('_id')}` }>
          <div className={ `${CLASS_NAME}-thumbnail-overlay` }>
          </div>
        </Link>
        <figcaption className={ `${CLASS_NAME}-caption` }>
          <div className={ `${CLASS_NAME}-caption-avatar` }>
            <i className={ `${CLASS_NAME}-caption-avatar-icon fa fa-user` } />
          </div>
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
}

export default ModelCard;
