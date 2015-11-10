import React from 'react';

const CLASS_NAME = 'cb-model-card';

class ModelCard extends React.Component {
  static propTypes = {

  }

  render() {
    return (
      <figure className={CLASS_NAME}>
        <div className={`${CLASS_NAME}-thumbnail`}>

        </div>
        <figcaption className={`${CLASS_NAME}-caption`}>

        </figcaption>
      </figure>
    );
  }
}

export default ModelCard;
