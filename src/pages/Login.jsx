import React from "react"
import { withRouter } from 'react-router-dom';

class Component extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      un:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.sub = this.sub.bind(this);
    this.messageListenner = this.messageListenner.bind(this);
  }

  componentDidMount(){
    if(this.props.loginState){
      this.props.history.push('/home');
    }
    this.props.addMessageListenner(this.messageListenner);
  }

  componentWillUnmount(){
    this.props.removeMessageListenner(this.messageListenner);
  }

  messageListenner(pkg){
    if(pkg.action === 'SUN' && pkg.code === 1){
      alert('login successfully');
      this.props.setLogin(()=>{
        this.props.history.push('/home');
      });
    }
  }

  handleChange(event){
    this.setState({un: event.target.value});
    event.preventDefault();
  }

  sub(event){
    event.preventDefault();
    let un = this.state.un;
    if(un){
      this.props.messageSender({action:'SUN',data:un});
    }else{
      alert('please type the username first');
    }
  }

  render(){
    return (
      <div>
        <input type="text" placeholder="type a username" value={this.state.un} onChange={this.handleChange}/>
        <button onClick={this.sub}>submit</button>
      </div>
    )
  }
}

export default withRouter(Component)