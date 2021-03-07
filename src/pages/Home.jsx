import React from "react"
import { withRouter } from 'react-router-dom'
import "../css/home.css"

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.jump = this.jump.bind(this);
    this.genRoomLinks = this.genRoomLinks.bind(this);
  }

  componentDidMount() {
    if (!this.props.loginState) {
      this.props.history.push('/login');
    }
  }

  jump(where){
    if(where === 0){
      this.props.history.push('/createroom');
    }else if(where === 1){
      this.props.history.push('/joinroom');
    }else{
      this.props.history.push(`/room/${where}`);
    }
  }

  genRoomLinks(){
    if(this.props.rooms.length !== 0){
      if(this.props.rooms.length === 1){
        return (
          <div id="room-list">
            <button id="room-link-first" key={this.props.rooms[0]} onClick={()=>{this.jump(this.props.rooms[0])}}>{this.props.rooms[0]}</button>
          </div>
        )
      }else{
        return (
          <div id="room-list">
            <button id="room-link-first" key={this.props.rooms[0]} onClick={()=>{this.jump(this.props.rooms[0])}}>{this.props.rooms[0]}</button>
            {this.props.rooms.slice(1).map(rid=>{
              return (
                <button className="room-link" key={rid} onClick={()=>{this.jump(rid)}}>{rid}</button>
              );
            })}
          </div>
        )
      }
    }
  }
  
  render() {
    return (
      <div id="home">
        <div id="bar-home-top">
          <span>home</span>
        </div>
        {this.genRoomLinks()}
        <div id="bar-home-bottom">
          <button className="nav">HO</button>
          <button className="nav" onClick={()=>{this.jump(0)}}>CR</button>
          <button className="nav" onClick={()=>{this.jump(1)}}>JR</button>
        </div>
      </div>
    )
  }
}

export default withRouter(Component)