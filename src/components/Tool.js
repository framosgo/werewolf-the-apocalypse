import React from 'react';

export default class Tool extends React.Component {

  const toolClassName = {
    selector: '',
    pencil: '',
    rubber: ''
  }

  render() {
    return (
      <div className={this.props.toolStyle}>
      </div>
    );
  }
}
