import React from 'react';
import PropTypes from 'prop-types';

class Test extends React.Component {
  static propTypes = {
    foo: PropTypes.number.isRequired,
    bar: PropTypes.string,
  };

  render() {
    return <div>test<br/>{this.props.foo}</div>;
  }
}

export default Test;