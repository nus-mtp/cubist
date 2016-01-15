import React from 'react';

const CLASS_NAME = 'cb-model-card';

class ModelCard extends React.Component {
  static propTypes = {
    model: React.PropTypes.object
  };

  render() {
    const { model } = this.props;
    const thumbnailStyle = {
      backgroundImage: `url(${model.image_url})`
    };

    return (
      <figure className={ CLASS_NAME }>
        <a className={ `${CLASS_NAME}-thumbnail` }
          style={ thumbnailStyle }
          href="/model/1">
          <div className={ `${CLASS_NAME}-thumbnail-overlay` }>
          </div>
        </a>
        <figcaption className={ `${CLASS_NAME}-caption` }>
          <div className={ `${CLASS_NAME}-caption-avatar` }>
            <i className={ `${CLASS_NAME}-caption-avatar-icon fa fa-user` } />
          </div>
          <div className={ `${CLASS_NAME}-caption-info` }>
            <div className={ `${CLASS_NAME}-caption-info-title` }>
              { model.title }
            </div>
            <div className={ `${CLASS_NAME}-caption-info-uploader` }>
              { `By ${model.uploader}` }
            </div>
          </div>
        </figcaption>
      </figure>
    );
  }
}

export default ModelCard;
