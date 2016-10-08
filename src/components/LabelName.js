import React, { Component } from 'react';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default class LabelName extends Component{
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editText: null,
      text: null
    }

    // Prebinding all events
    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
		this.setState({
      editing: true
    });
  }

  onBlur(event){
    this.handleSubmit(event);
  }

  onChange(event){
    this.setState({
      editText: event.target.value
    });
  }

  handleSubmit(event) {
    let val = this.state.editText;
			if (val != '') {
				this.setState({
          editing: false,
          editText: val,
          text: val
        });
			} else {
        this.setState({
          editing: false,
          editText: "New Player",
          text: "New Player"
        });
      }
  }

  onKeyDown(event) {
    if (event.which === ESCAPE_KEY) {
				this.setState({
          editText: this.state.text,
          editing: false
        });
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit(event);
			}
  }

  componentWillMount() {
    this.setState({
      editText: this.props.name,
      text: this.props.name
    });
  }

  render() {
    return (
      <div>
				<label htmlFor={this.props.name}  className={this.state.editing ? 'hidden' : 'view'} onClick={this.onClick}>
					{this.state.editText}
				</label>
				<input
					ref="editField"
          id={this.props.name}
					className={this.state.editing ? 'edit' : 'hidden'}
					value={this.state.editText}
					onBlur={this.onBlur}
          onChange={this.onChange}
					onKeyDown={this.onKeyDown}
          placeholder="New Player"
				/>
      </div>
    );
  }
}

// Defining restriction
LabelName.propTypes = {
  name: React.PropTypes.string
}

// Default values
LabelName.defaultProps = {
  name: 'New Player'
}
