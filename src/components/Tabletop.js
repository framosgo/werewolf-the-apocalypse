import React, { Component } from 'react';
import PlayerContent from './PlayerContent';
import Sketchpad from './Sketchpad';

export default class Tabletop extends Component {
  render() {
    // the style is defined here is because we need to use window.innerWidth/Height
    const tabletopStyle = {
      display: 'block',
      position: 'relative',
      width: window.innerWidth - 3,
      height: window.innerHeight - 3
    }

    return (
      <div style = {tabletopStyle}>
        <Sketchpad color="#000" penSize="2" />
        <div className="bottomright">
          <PlayerContent />
        </div>

      </div>
    );
  }
}
