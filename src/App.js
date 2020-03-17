import React, { Component } from 'react';
import Sequencer from './Sequencer';
import Loops from './component/Loops'


const reducer = (accumulator, currentValue) => accumulator + currentValue;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      'loadStatue'   : [0, 0, 0, 0], // 0 -> finish, 1 -> loading
      'lockStatue'   : [0, 0, 0, 0],
      'groupUrls'    : [],
      'urlsDecision' : [],
      'sequencer'    : false

    })

    this.getMainLoop      = this.getMainLoop.bind(this);
    this.updateLockStatue = this.updateLockStatue.bind(this);
    this.updateDecision   = this.updateDecision.bind(this)
    this.getAccompanyLoop = this.getAccompanyLoop.bind(this)
    this.updateLoadStatue = this.updateLoadStatue.bind(this)
  }


  getMainLoop(number) {
    let url = `http://140.109.21.190:5000/get_main_loop/${number}`
    fetch(url, { method: 'GET' }).then((response) => {
      if (!response.ok) throw new Error(response.statusText)
      return response.json()
    }).then((result) => {
      console.log('main loop')
      this.updateLoadStatue(0, 1) // (index, value)
      let groupUrls_update
      if (this.state.groupUrls[0]) {
        groupUrls_update    = [result.main]
      } else {
        groupUrls_update    = this.state.groupUrls
        groupUrls_update[0] = result.main 
      }
      this.setState({'groupUrls': groupUrls_update})
    })
  }

  getAccompanyLoop(index, url) {
    let mashup_url = `http://140.109.21.190:5000/get_mashup_result?url=${url}&num=${100}`
    if (this.state.groupUrls.length == index+1) {
      this.state.groupUrls.push([])
      this.setState({ 'groupUrls': this.state.groupUrls })      
    }



    fetch(mashup_url, { method: 'GET' }).then((response) => {
      if (!response.ok) throw new Error(response.statusText)
        return response.json()
      }).then((result) => {
        console.log('accompany loop')
        this.updateLoadStatue(index + 1, 1)
        let groupUrls_update = this.state.groupUrls
        groupUrls_update[index + 1] = result.rank.slice(0, 4)
        this.setState({ 'groupUrls': groupUrls_update })
        return result.rank
    })
  }


  updateLoadStatue(index, value) {
    let currentLoadStatue = this.state.loadStatue
    currentLoadStatue[index] = value
    this.setState({'loadStatue': currentLoadStatue})
  }
  

  updateDecision(index, decision) {
    if (this.state.urlsDecision.length < index + 1) {
      this.state.urlsDecision.push(decision)
    } else {
      this.state.urlsDecision[index] = decision
    }
    this.setState({'urlsDecision': this.state.urlsDecision})
  }


  updateLockStatue (index, value) {
    let state = this.state
    state.lockStatue[index] = value
    if (state.lockStatue.reduce(reducer) == 4) {
      this.setState({ 'lockStatue': state.lockStatue, 'sequencer': true })
    } else {
      // if (value == 1) {
      //   console.log('update lock ', index)
      //   this.getAccompanyLoop(index, this.state.urlsDecision[index])
      // }
      this.setState({ 'lockStatue': state.lockStatue })
    }
  }

 



  componentDidMount(){
    this.getMainLoop(4)
  }

  render() {
    return (
      <div className="App"> 
        <h1>Interactive Beat Makers</h1>
        { 
          this.state.groupUrls.map((urls, index) => (
            <Loops
              key={index}
              urls={urls}
              index={index}
              value={this.state.lockStatue[index]}
              lockStatue={this.state.lockStatue}
              // urlsDecision={this.state.urlsDecision}
              // updateDecision={this.updateDecision}
              updateLockStatue={this.updateLockStatue}
              // getNextLoop={(index != 0) ? this.getAccompanyLoop : this.getMainLoop}
            />
          ))
        }

        {this.state.sequencer && <Sequencer urlsDecision={this.state.urlsDecision}/>}

      </div>
    )
  }
}

export default App;