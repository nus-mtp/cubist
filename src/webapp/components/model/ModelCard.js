import React from 'react';
import { Link } from 'react-router';
import Immutable from 'immutable';

import { GravatarHelper } from 'webapp/helpers';

const CLASS_NAME = 'cb-model-card';
const fallBackImage = 'https://d13yacurqjgara.cloudfront.net/users/532989/screenshots/1700135/cube_1x.jpg';

class ModelCard extends React.Component {
  static propTypes = {
    model: React.PropTypes.instanceOf(Immutable.Map)
  };

  render() {
    const { model } = this.props;
    const thumbnailStyle = {
      backgroundImage: `url(${model.getIn(['imageUrls', 0], fallBackImage)})`
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
}

export default ModelCard;
