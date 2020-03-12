import React, { Component } from 'react';
import { Transport } from "tone";
import Canvas from './Canvas'
import Sequencer from './Sequencer'
import './App.css';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';





class App extends Component {
  constructor(props) {
    super(props)
    this.state = ({})
    this.changeLoop = this.changeLoop.bind(this)
  }

  startTransport() {
    Transport.start()

    Transport.on("loop" , t => console.log("loop: " , t, Transport.seconds))
    Transport.on("start", t => console.log("start:", t, Transport.seconds))
    Transport.on("stop" , t => console.log("stop: " , t, Transport.seconds))
  }

  getMainLoop() {
    let url = `http://140.109.21.190:5000/get_main_loop`
    fetch(url, { method: 'GET' }) .then((response) => {
        if (!response.ok) throw new Error(response.statusText)
        return response.json()
      }).then((result) => {
        console.log(result.main)
        this.setState({'main': result.main})
        console.log('==================')
        console.log(result.main, this.state.main)
        let mashup_url = `http://140.109.21.190:5000/get_mashup_result?url=${result.main}`
        console.log('mashup_url: ' + mashup_url)
        // fetch(mashup_url, { method: 'GET' }).then((response) => {
        //   if (!response.ok) throw new Error(response.statusText)
        //   return response.json()
        // }).then((result) => {
        //   this.setState({ 'rank': result.rank })
        //   return result.rank
        // })
        return result.main
      })
  }

  stopTransport() {
    Transport.stop()
  }

  changeLoop() {
    this.getMainLoop()
    Transport.stop()
  }

  componentDidMount(){
      this.getMainLoop()
  }

  componentDidUpdate() {
    console.log('DidUpdate')
    console.log(this.state.main)
  }






  render() {
    
    return (
      <div className="App"> 
        <Canvas className='mainloop' x={0} y={0} w={830} h={100} on_color={'#F4F1EE'} off_color={'#FFF130'} index={this.state.main} />
        {/* <Grid container spacing={0}>
          <Grid item xs={12}>
            <Canvas x={0} y={0} w={830} h={100} on_color={'#F4F1EE'} off_color={'#FFF130'} index={this.state.main}/>
          </Grid>
          <Grid item xs={3}>
            <Canvas x={0} y={0} w={100} h={100} on_color={'#F4F1EE'} off_color={'#FFF130'} 
            index={this.state['rank'] != undefined ? this.state.rank[0] : 0}/>
          </Grid>
          <Grid item xs={3}>
            <Canvas x={62} y={0} w={100} h={100} on_color={'#F4F1EE'} off_color={'#FFF130'}
            index={this.state['rank'] != undefined ? this.state.rank[1] : 0}/>
          </Grid>     
          <Grid item xs={3}>
            <Canvas x={62} y={0} w={100} h={100} on_color={'#F4F1EE'} off_color={'#FFF130'}
            index={this.state['rank'] != undefined ? this.state.rank[2] : 0}/>
          </Grid> 
          <Grid item xs={3}>
            <Canvas x={62} y={0} w={100} h={100} on_color={'#F4F1EE'} off_color={'#FFF130'}
            index={this.state['rank'] != undefined ? this.state.rank[3] : 0}/>
          </Grid>      
        </ Grid>
        <Button color="primary" onClick={this.startTransport}>
          Start
        </Button>
        <Button color="secondary" onClick={this.stopTransport}>
          Stop
        </Button>
        <Button onClick={this.changeLoop}>
          Change
        </Button> */}
          {/* <Sequencer /> */}
      </div>
    )
  }
}

export default App;