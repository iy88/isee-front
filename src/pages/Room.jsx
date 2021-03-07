import React from "react"
import { withRouter } from 'react-router-dom'
import "../css/room.css"

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ''
    }
    this.back = this.back.bind(this);
    this.createMsgFlow = this.createMsgFlow.bind(this);
    this.send = this.send.bind(this);
    this.handleMsgChange = this.handleMsgChange.bind(this);
    this.messageListenner = this.messageListenner.bind(this);
  }

  componentDidMount() {
    if (!this.props.loginState) {
      if (!this.props.rooms.indexOf(this.props.match.params.rid)) {
        this.props.history.push('/home');
      } else {
        this.props.history.push('/login');
      }
    } else {
      this.props.addMessageListenner(this.messageListenner);
    }
  }

  componentWillUnmount() {
    this.props.removeMessageListenner(this.messageListenner);
  }

  back() {
    this.props.history.push('/home');
  }

  handleMsgChange(event) {
    this.setState({ msg: event.target.value });
    event.preventDefault();
  }

  send(event) {
    event.preventDefault();
    if (this.state.msg) {
      this.props.messageSender({ action: 'SM', data: { rid: this.props.match.params.rid, msg: this.state.msg } });
      this.setState({ msg: '' });
    }
  }

  messageListenner(pkg) {
    if (pkg.action === 'SM') {
      this.props.addMessage(this.props.match.params.rid, { t: 0, ...pkg.data });
    }
  }

  createMsgFlow() {
    if (this.props.message[this.props.match.params.rid] && this.props.message[this.props.match.params.rid].length > 0) {
      return (
        <div id="msg-flow">
          {
            this.props.message[this.props.match.params.rid].map(msg => {
              if (msg.t === 0) {
                return (
                  <div id="self" key={msg.mid}>
                    <p id="un">{msg.from.un}</p>
                    <p id="msg">{msg.msg}</p>
                  </div>
                )
              } else {
                return (
                  <div id="other" key={msg.mid}>
                    <p id="un">{msg.from.un}</p>
                    <p id="msg">{msg.msg}</p>
                  </div>
                )
              }
            })
          }
        </div>
      )
    } else {
      return (
        <div id="msg-flow"></div>
      )
    }
  }

  render() {
    return (
      <div>
        <div id="bar-room-top">
          <button id="back" onClick={this.back}>←</button>
          <span id='title'>{this.props.match.params.rid}</span>
        </div>
        {this.createMsgFlow()}
        <div id="bar-room-bottom">
          <input type="text" id="msg" value={this.state.msg} onChange={this.handleMsgChange} /><button id="send" onClick={this.send}>send</button>
        </div>
      </div>
    )
  }
}

export default withRouter(Component)