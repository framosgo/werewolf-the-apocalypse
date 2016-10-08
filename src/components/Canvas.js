import React, { Component } from 'react';
import PlayerContent from './PlayerContent'

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sketching: false,
      strokes: [],
      undoHistory: []
    }

    // Global variables
    this.canvas = null;
    this.context = null;
    this.lastPosition = null;
    this.currentStroke = {
      color: '#000',
      size: 2,
      lines: []
    }

    // Prebinding all mouse events
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  /*
   * Private API
   */

  _position(event) {
    return {
      x: event.pageX - this.canvas.offsetLeft,
      y: event.pageY - this.canvas.offsetTop,
    };
  }

  _stroke(stroke) {

    stroke.lines.forEach(function(line) {
      this._line(line.start, line.end, stroke.color, stroke.size);
    }, this);
    //console.log("stroke lines");
  }

  _draw(start, end, color, size) {
    //console.log("drawing");
    this._line(start, end, color, size, 'source-over');
  }

  _erase(start, end, color, size) {
    //console.log("erasing");
    this._line(start, end, color, size, 'destination-out');
  }

  _line(start, end, color, size, compositeOperation) {
    //console.log("lining");
    this.context.globalCompositeOperation = compositeOperation;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.strokeStyle = color;
    this.context.lineWidth = size;
    this.context.stroke();
    this.context.closePath();
  }

  /*
   * Public API
   */

   toObject() {
     return {
       width: this.canvas.width,
       height: this.canvas.height,
       strokes: this.state.strokes,
       undoHistory: this.state.undoHistory
     };
   }

   toJSON() {
     return JSON.stringify(this.toObject());
   }

   redo() {
     // last stroke drawn
     let newUndoHistory = this.state.undoHistory;
     let undoneStroke = newUndoHistory.pop();
     // take it back to the stroke list
     let newStrokes = this.state.strokes;
     newStrokes.push(undoneStroke);

     if (newUndoHistory) {
       this.setState({
         strokes: newStrokes
       });
       // Drawing again the last stroke drawn.
       this._stroke(undoneStroke);
     }
   }

   // It needs to be improved, please.
   undo() {
     // clean, remove the last stroke and redraw everything
     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
     let newStrokes = this.state.strokes;
     let lastStroke = newStrokes.pop();
     let newUndoHistory = this.state.undoHistory;
     newUndoHistory.push(lastStroke);
     this.setState({
       strokes: newStrokes,
       undoHistory: newUndoHistory
     });

     this.redraw();
   }

   redraw() {
     let actualStrokes = this.state.strokes;
     actualStrokes.forEach(function(stroke) {
       this._stroke(stroke);
     }, this);
   }

   // It needs to be improved, please. 'Cause it doesn't allow the commmand undo.
   clear() {
     this.setState({
       strokes: [],
       undoHistory: []
     });
     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

  /*
   * Events/Callback
   */

  onMouseDown(event) {
    this.setState({
      sketching: true
    });
    this.lastPosition = this._position(event);
    // TODO later, changing to this.propTypes.color, penSize and lines.
    this.currentStroke = {
      color: '#000',
      size: 2,
      lines: []
    }
  }

  onMouseMove(event) {
    const currentPosition = this._position(event);
    //console.log("Moving, all the people, moving. (8)");
    this._draw(this.lastPosition, currentPosition, this.currentStroke.color, this.currentStroke.size);

    this.currentStroke.lines.push({
      start: this.lastPosition,
      end: currentPosition
    })
    this.lastPosition = currentPosition;
  }

  onMouseUp(event) {
    if (this.state.sketching) {
      let newStrokes = this.state.strokes;
      newStrokes.push(this.currentStroke);

      this.setState({
        sketching: false,
        strokes: newStrokes
      });
    }
    //console.log('onMouseUp!');
  }

  onMouseOut(event) {
    //console.log('onMouseOut!');
    this.onMouseUp(event);
  }

  // When one state has changed
  componentDidUpdate(prevProps, prevState) {
    if (this.state.sketching) {
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mouseout', this.onMouseOut);
    } else {
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('mouseout', this.onMouseOut);
    }
  }

  // Make sure to remove the DOM listener when the component is unmounted
  componentWillUnmount() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('mouseout', this.onMouseOut);
  }

  // The component has already mounted.
  componentDidMount() {
    this.canvas = this.refs.sketchPad;

    if (this.canvas.getContext){
      this.context = this.canvas.getContext('2d');

      // Drawing a gridded canvas
      const sizeGrid = 40;  // 40x40
      const p = 0;         // padding

      const cw = this.canvas.width - p - 1;
      const ch = this.canvas.height - p - 1;

      for (let x = 0; x <= cw; x += sizeGrid) {
        this.context.moveTo(0.5 + x + p, p);
        this.context.lineTo(0.5 + x + p, ch + p);
      }


      for (let x = 0; x <= ch; x += sizeGrid) {
          this.context.moveTo(p, 0.5 + x + p);
          this.context.lineTo(cw, 0.5 + x + p);
      }

      this.context.strokeStyle = "#E2E2E2";
      this.context.stroke();

      const img = new Image();
      img.src = "/img/logo-werewolf-the-apocalypse.png";
      img.onload = () => {
          this.context.save();
          this.context.globalAlpha = 0.2;
          this.context.drawImage(img, this.canvas.width/2 - img.width/2,
                                  this.canvas.height/2 - img.height/2);
          this.context.restore()
      };

    } else {
      // Canvas-unsupported code here
      //console.log('Canvas Unsupported.');
    }

    // To start with, let's listen firstly the mousedown
    this.canvas.addEventListener("mousedown", this.onMouseDown);

  }

  render() {
    const canvasStyle = {
      padding: 0,
      display: 'block',
      position: 'relative',
      width: window.innerWidth,
      height: window.innerHeight,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      border: '1px solid black'
    }

    return (
      <div style = {canvasStyle}>
        <canvas ref = "sketchPad"
                width = {this.props.width}
                height = {this.props.height}>
        </canvas>
        <div className="bottomright">
          <PlayerContent />
        </div>

      </div>
    );
  }
}

// Defining restriction
Canvas.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  color: React.PropTypes.string,
  penSize: React.PropTypes.number,
  strokes: React.PropTypes.array,
  undoHistory: React.PropTypes.array
};

// Default values
Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  color: '#000',
  penSize: 2,
  strokes: [],
  undoHistory: []
};
