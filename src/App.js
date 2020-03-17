import React, { Component } from 'react';
import Sequencer from './Sequencer';
import Loops from './component/Loops'
import { Helmet } from 'react-helmet'

const title = 'ML Mashup'


const reducer = (accumulator, currentValue) => accumulator + currentValue;
const server_url = 'https://musicai.citi.sinica.edu.tw/mashup_ml_server'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      'loadStatue'   : [0, 0, 0, 0], // 0 -> finish, 1 -> loading
      'lockStatue'   : [0, 0, 0, 0],
      'volumes'      : [-15, -15, -15, -15],
      'groupUrls'    : [],
      'urlsDecision' : [],
      'sequencer'    : false,
      'server_url'    : server_url
 
    })

    this.getMainLoop      = this.getMainLoop.bind(this);
    this.updateLockStatue = this.updateLockStatue.bind(this);
    this.updateDecision   = this.updateDecision.bind(this)
    this.getAccompanyLoop = this.getAccompanyLoop.bind(this)
    this.updateLoadStatue = this.updateLoadStatue.bind(this)
    this.toggleSequencer  = this.toggleSequencer.bind(this)
    this.updateVolmes     = this.updateVolmes.bind(this)
  }

  updateVolmes(index, value) {
    console.log(index, value)
    let volumes = this.state.volumes
    volumes[index] = value
    this.setState({ 'volumes': volumes} )
  }


  getMainLoop(number) {
    let url = `${this.state.server_url}/get_main_loop/${number}`
    console.log(url)
    this.updateLoadStatue(0, 1)
    fetch(url, { method: 'GET' }).then((response) => {
      if (!response.ok) {
        this.updateLoadStatue(0, 0)
        throw new Error(response.statusText)
      }
      return response.json()
    }).then((result) => {
      console.log('main loop')
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
    let mashup_url = `${this.state.server_url}/get_mashup_result?url=${url}&num=${100}`

    if (this.state.groupUrls.length == index+1) {
      this.state.groupUrls.push([])
      this.setState({ 'groupUrls': this.state.groupUrls })      
    }


    this.updateLoadStatue(index + 1, 1)

    fetch(mashup_url, { method: 'GET' }).then((response) => {
      if (!response.ok) {
        this.updateLoadStatue(index + 1, 0)
        throw new Error(response.statusText)
      }
        return response.json()
      }).then((result) => {
        console.log('accompany loop')
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
      this.setState({ 'lockStatue': state.lockStatue })
      if (!this.state.sequencer) this.toggleSequencer()
    } else {
      if (value == 1) {
        console.log('update lock ', index)
        this.getAccompanyLoop(index, this.state.urlsDecision[index])
      }
      this.setState({ 'lockStatue': state.lockStatue })
    }
  }

  toggleSequencer() {
    this.setState({'sequencer': !this.state.sequencer})
  }

 



  componentDidMount(){
    console.log(this.state)
    this.getMainLoop(4)
  }

  render() {
    return (
      <div className="App"> 
        <Helmet> <title>{title}</title> </Helmet>
        <h1>Interactive Beat Makers</h1>
        { 
          this.state.groupUrls.map((urls, index) => (
            <Loops
              key={index}
              urls={urls}
              index={index}
              sequencer={this.state.sequencer}
              value={this.state.lockStatue[index]}
              currentLoadStatue={this.state.loadStatue[index]}
              lockStatue={this.state.lockStatue}
              updateLockStatue={this.updateLockStatue}
              urlsDecision={this.state.urlsDecision}
              getNextLoop={(index != 0) ? this.getAccompanyLoop : this.getMainLoop}
              updateDecision={this.updateDecision}
              toggleSequencer={this.toggleSequencer}
              updateLoadStatue={this.updateLoadStatue}
              updateVolmes={this.updateVolmes}
              server_url={this.state.server_url}
            />
          ))
        }

        {this.state.sequencer && <Sequencer server_url={this.state.server_url} volumes={this.state.volumes} urlsDecision={this.state.urlsDecision}/>}

      </div>
    )
  }
}

export default App;