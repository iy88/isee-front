import React from "react"
import { withRouter } from 'react-router-dom'
import "../css/joinroom.css"

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rid: '',
      key: ''
    }
    this.jump = this.jump.bind(this);
    this.ridChangeHandle = this.ridChangeHandle.bind(this);
    this.keyChangeHandle = this.keyChangeHandle.bind(this);
    this.sub = this.sub.bind(this);
    this.messageListenner = this.messageListenner.bind(this);
  }

  componentDidMount() {
    if (!this.props.loginState) {
      this.props.history.push('/login');
    }
    this.props.addMessageListenner(this.messageListenner);
  }

  componentWillUnmount() {
    this.props.removeMessageListenner(this.messageListenner);
  }

  messageListenner(pkg) {
    if (pkg.action === 'JR') {
      if (pkg.code === 1) {
        this.props.addRoom(pkg.rid);
        alert(`join chat room:"${pkg.rid}" successfully`);
      }else if(pkg.code === 0.1){
        alert(`join chat room:"${pkg.rid}" failed by wrong key`);
      }else if(pkg.code === 0){
        alert(`join chat room:"${pkg.rid}" failed by non-match rid`);
      }
    }
  }

  jump(where) {
    if (where === 0) {
      this.props.history.push('/home');
    } else {
      this.props.history.push('/createroom');
    }
  }

  ridChangeHandle(event) {
    this.setState({ rid: event.target.value });
    event.preventDefault();
  }

  keyChangeHandle(event) {
    this.setState({ key: event.target.value });
    event.preventDefault();
  }

  sub(event) {
    let rid = this.state.rid;
    let key = this.state.key;
    if (rid && key) {
      this.props.messageSender({ action: 'JR', data: { rid, key } });
    } else {
      alert('please type the rid and key first');
    }
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div id="bar-jr-top"><span>join room</span></div>
        <div id="form">
          <input type="text" placeholder="please input rid" value={this.state.rid} onChange={this.ridChangeHandle} /><br />
          <input type="text" placeholder="please input the key" value={this.state.key} onChange={this.keyChangeHandle} /><br />
          <button onClick={this.sub}>submit</button>
        </div>
        <div id="bar-jr-bottom">
          <button className="nav" onClick={() => { this.jump(0) }}>HO</button>
          <button className="nav" onClick={() => { this.jump(1) }}>CR</button>
          <button className="nav">JR</button>
        </div>
      </div>
    )
  }
}

export default withRouter(Component)