import React from 'react';
import { withNavigation } from '../hoc/withNavigation';

class SomeClassComponent extends React.Component {
  handleClick = () => {
    this.props.navigate('/some-path');
  };
  
  render() {
    return (
      <button onClick={this.handleClick}>Navigate</button>
    );
  }
}

export default withNavigation(SomeClassComponent);