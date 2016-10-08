import React, { Component } from 'react';

const werewolvesStages = [
  "url(/img/homid.jpg)",
  "url(/img/glabro.jpg)",
  "url(/img/crinos.jpg)",
  "url(/img/hispo.jpg)",
  "url(/img/lupus.jpg)"
];

export default class Player extends Component{
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      playerImage: werewolvesStages[0]
    }

    // Prebinding all mouse events
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onDoubleClick() {
    const pos = (this.state.counter+1) % werewolvesStages.length;
    this.setState({
      playerImage: werewolvesStages[pos],
      counter: this.state.counter+1
    });
  }

  render() {
    return (
      <div className="display-inline">
        <div onDoubleClick={this.onDoubleClick} className="avatar" style={{'background-image': this.state.playerImage}}></div>
      </div>
    );
  }
}
