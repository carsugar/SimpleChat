import React from 'react';
const socket = io();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messageList: []
    };

    this.onMessageInput = this.onMessageInput.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.renderMessageList = this.renderMessageList.bind(this);
  }

  componentDidMount() {
    socket.on('message', message => {
			this.setState({ messageList: [...this.state.messageList, message] });
		});
  }

  onMessageInput(event) {
    this.setState({ message: event.target.value });
  }

  sendMessage(event) {
    event.preventDefault();
    if (this.state.message.length) {
      socket.emit('message', this.state.message);
      this.setState({ message: '' });
    }
  }

  renderMessageList() {
    return this.state.messageList.map((message, idx) => {
			return (
				<li key={idx}>{message}</li>
			);
		});
  }

  render() {
    return (
      <div>
        <ul id="messages">
          {this.renderMessageList()}
        </ul>
        <form onSubmit={this.sendMessage}>
          <input id="m"
                 autoComplete="off"
                 value={this.state.message}
                 onChange={this.onMessageInput} />
          <button>Send</button>
        </form>
      </div>
    );
  }
};

export default App;
