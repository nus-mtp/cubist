import React from 'react';

/**
 * The outermost component of the system
 */
class HtmlDocument extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired,
    markup: React.PropTypes.string.isRequired,
    store: React.PropTypes.string.isRequired,
    script: React.PropTypes.arrayOf(React.PropTypes.string),
    css: React.PropTypes.arrayOf(React.PropTypes.string)
  };

  static defaultProps = {
    title: 'Cubist',
    script: [],
    css: []
  };

  render() {
    const { title, markup, store, script, css } = this.props;
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
          <title>{ title }</title>
          {
            css.map((href, k) => <link key={ k } rel="stylesheet" type="text/css" href={ href } />)
          }
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={ { __html: markup } } />
          <script dangerouslySetInnerHTML={ { __html: `window.__data=${store};` } }/>
          {
            script.map((src, k) => <script key={ k } src={ src } />)
          }
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
