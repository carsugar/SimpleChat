import React from 'react';
import moment from 'moment';
const socket = io();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEstablished: false,
      username: '',
      message: { text: '' },
      messageList: []
    };

    this.onUsernameInput = this.onUsernameInput.bind(this);
    this.enterChatroom = this.enterChatroom.bind(this);
    this.onMessageInput = this.onMessageInput.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.renderMessageList = this.renderMessageList.bind(this);
  }

  componentDidMount() {
    socket.on('message', message => {
			this.setState({ messageList: [...this.state.messageList, message] });
		});
  }

  componentDidUpdate() {
    var messageDiv = document.getElementById("messages");
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }

  onUsernameInput(event) {
    this.setState({ username: event.target.value });
  }

  enterChatroom(event) {
    event.preventDefault();
    this.setState({ userEstablished: true });
  }

  onMessageInput(event) {
    this.setState({ message: {
      user: this.state.username,
      text: event.target.value,
      time: new Date()
    } });
  }

  sendMessage(event) {
    event.preventDefault();
    if (this.state.message.text.length) {
      socket.emit('message', this.state.message);
      this.setState({ message: { text: '' } });
    }
  }

  renderMessageList() {
    return this.state.messageList.map((message, idx) => {
      if (message.user === this.state.username) {
        return (
  				<li key={idx}>
            <div className="message-bubble my-message">
              <div className="message-user">{message.user}</div>
              <div className="message-time">{moment(message.time).format('LT')}</div>
              <div className="message-text">{message.text}</div>
            </div>
  				</li>
  			);
      }
			return (
				<li key={idx}>
          <div className="message-bubble">
            <div className="message-user">{message.user}</div>
            <div className="message-time">{moment(message.time).format('LT')}</div>
            <div className="message-text">{message.text}</div>
          </div>
				</li>
			);
		});
  }

  render() {
    if (!this.state.userEstablished) {
      return (
        <div>
          <div id="header">
            <h1 id="header-simple">Simple</h1><h1 id="header-chat">Chat</h1>
          </div>
          <ul id="messages">
          </ul>
          <form onSubmit={this.enterChatroom}>
            <input autoComplete="off"
                   placeholder="Choose a username"
                   value={this.state.username}
                   onChange={this.onUsernameInput} />
            <button className="button">Go Chat</button>
          </form>
        </div>
      );
    }

    return (
      <div>
        <div id="header">
          <h1 id="header-simple">Simple</h1><h1 id="header-chat">Chat</h1>
        </div>
        <ul id="messages">
          {this.renderMessageList()}
        </ul>
        <form onSubmit={this.sendMessage}>
          <input autoComplete="off"
            placeholder="Type a message..."
            value={this.state.message.text}
            onChange={this.onMessageInput} />
          <button className="button">Send</button>
        </form>
      </div>
    );
  }
};

export default App;
