import React, { Component } from 'react';
import { SortablePane, Pane } from 'react-sortable-pane';
import werewolves from '../data/werewolves';
import Player from './Player';
import LabelName from './LabelName';

const paneStyle = {
  textAlign:"center",
  padding:"0px",
  height:"150px",
  borderRadius: "150px",
  backgroundColor: "#fff"
};

const isResizable = {
  x: false,
  y: false,
  xy: false
};

export default class PlayerContent extends Component{
  render() {
    const players = werewolves.map((werewolf) => {
      return (
        <Pane width={150} height={150} style={paneStyle} isResizable={isResizable}>
          <Player />
          <LabelName name={werewolf.name}/>
        </Pane>
      );
    });

    return (
      <SortablePane
          direction="horizontal"
          margin={0}
          onResize={(id, dir, size, rect) => null}
          onOrderChange={(panes) => null}
      >
        {players}
      </SortablePane>
    );
  }
}
