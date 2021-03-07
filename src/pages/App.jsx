import React, { Suspense } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import '../css/index.css'
import uuid from "../tools/uuid"

const CreateRoom = React.lazy(() => import('./Create-room'));
const JoinRoom = React.lazy(() => import('./Join-room'));
const Home = React.lazy(() => import('./Home'));
const Login = React.lazy(() => import('./Login'));
const Room = React.lazy(() => import('./Room'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ws: null,
      message: {},
      roomList: [],
      messageHandles: [],
      loginState: false
    }
    this.connect = this.connect.bind(this);
    this.messageHandle = this.messageHandle.bind(this);
    this.messageSender = this.messageSender.bind(this);
    this.addMessageListenner = this.addMessageListenner.bind(this);
    this.setLogin = this.setLogin.bind(this);
    this.removeMessageListenner = this.removeMessageListenner.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  componentDidMount() {
    this.connect();
  }

  connect(cb) {
    this.setState({ ws: new WebSocket('ws://iy88.site:1111') }, () => {
      this.state.ws.onopen = () => {
        this.state.ws.onmessage = this.messageHandle;
        cb ? cb() : '';
      };
    });
  }

  messageHandle({ data }) {
    let pkg = JSON.parse(data);
    if(pkg.action === 'PM'){
      this.addMessage(pkg.data.rid, { t: 1, ...pkg.data });
    }
    this.state.messageHandles.forEach(fn => {
      fn(pkg);
    })
  }

  addMessageListenner(fn) {
    this.setState(state => {
      return { messageHandles: [...state.messageHandles, fn] }
    })
  }

  removeMessageListenner(fn) {
    this.setState(state => {
      let handles = state.messageHandles;
      handles.splice(handles.indexOf(fn), 1);
      return { messageHandles: handles };
    })
  }

  messageSender(data) {
    this.state.ws.send(JSON.stringify(data));
  }

  setLogin(cb) {
    this.setState(state => {
      return { loginState: !state.loginState }
    }, cb);
  }

  addRoom(rid) {
    this.setState(state => {
      return { roomList: [...state.roomList, rid] }
    })
  }

  addMessage(rid, msg) {
    let t = JSON.parse(JSON.stringify(this.state.message));
    if (t[rid]) {
      t[rid].push({mid:uuid(),...msg});
    } else {
      t[rid] = [{mid:uuid(),...msg}];
    }
    this.setState({
      message: t
    })
  }

  render() {
    return (
      <Suspense fallback={<div><h1>Loading...</h1></div>}>
        <Router>
          <Switch>
            <Route path="/login" >
              <Login addMessageListenner={this.addMessageListenner} removeMessageListenner={this.removeMessageListenner} messageSender={this.messageSender} setLogin={this.setLogin} loginState={this.state.loginState} />
            </Route>
            <Route path="/home" >
              <Home addMessageListenner={this.addMessageListenner} removeMessageListenner={this.removeMessageListenner} messageSender={this.messageSender} loginState={this.state.loginState} rooms={this.state.roomList} />
            </Route>
            <Route path="/joinroom" >
              <JoinRoom addMessageListenner={this.addMessageListenner} removeMessageListenner={this.removeMessageListenner} messageSender={this.messageSender} loginState={this.state.loginState} addRoom={this.addRoom} />
            </Route>
            <Route path="/createroom" >
              <CreateRoom addMessageListenner={this.addMessageListenner} removeMessageListenner={this.removeMessageListenner} messageSender={this.messageSender} loginState={this.state.loginState} addRoom={this.addRoom} />
            </Route>
            <Route path="/room/:rid" >
              <Room addMessageListenner={this.addMessageListenner} removeMessageListenner={this.removeMessageListenner} messageSender={this.messageSender} loginState={this.state.loginState} rooms={this.state.roomList} message={this.state.message} addMessage={this.addMessage} />
            </Route>
            <Redirect to="/login" />
          </Switch>
        </Router>
      </Suspense>
    )
  }
}

export default App
