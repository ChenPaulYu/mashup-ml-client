import React, { Component } from 'react';
import Waveform from './Waveform'


const colors = ['#F4F1EE', '#FFF130']
const reducer = (accumulator, currentValue) => accumulator + currentValue;

const volumeTransfer = (value, max=-1, min=-40) => {
    const ratio = value / 100;
    const volume = min + (max - min) * ratio
    return volume
}

class Loops extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            'urls': null,
            'mute': false,
            'value': false,
            'players': null,
            'loaded': 0,
            'volume': volumeTransfer(-15),
            'playColumns': [0, 0, 0, 0]
        })

        this.toggleLock    = this.toggleLock.bind(this)
        this.changeLoop    = this.changeLoop.bind(this)
        this.toggleMute    = this.toggleMute.bind(this)
        this.volumeAdjust = this.volumeAdjust.bind(this) 
        this.chooseColumn  = this.chooseColumn.bind(this)
        this.loadCompleted = this.loadCompleted.bind(this)

    }

    volumeAdjust(event) {
        let volume = volumeTransfer(event.target.value)
        this.state.updateVolmes(this.state.index, volume)
        this.setState({ 'volume': volume})
    }

    loadCompleted() {
        if (this.state.loaded >= 4) return
        this.setState({ 'loaded': this.state.loaded + 1 })
    }


    chooseColumn(index) {
        if (this.state.value) return
        let tempState = [0, 0, 0, 0]
        if (index != -1) {
            tempState[index] = 1
        }
        this.state.updateDecision(this.state.index, this.state.urls[index])
        this.setState({ 'playColumns': tempState })
    }

    changeLoop() {
        if (this.state.currentLoadStatue == 1) {
            console.log('can not change, still loading')
            return
        }

        let index = this.state.index
        let urls = this.state.urlsDecision
        console.log('change loop: ', index)
        if (index == 0) {
            this.state.getNextLoop(4)
        }
        else {
            console.log(index - 1, urls)
            this.state.getNextLoop(index - 1, urls[index - 1])
        }

        console.log('change loop')
        this.chooseColumn(-1)
    }

    toggleLock() {
        if (this.state.playColumns.reduce(reducer) == 0) {
            alert('choose one loop')
            return
        }
        let lock_statue_update = !this.state.value ? 1 : 0
        this.state.updateLockStatue(this.state.index, lock_statue_update)
        
    }

    toggleMute() {
        if (this.state.playColumns.reduce(reducer) == 0) {
            alert('choose one loop')
            return
        }
         if (this.state.sequencer) {
            if (this.state.lockStatue[this.state.index]) {
                this.toggleLock()
            }
            this.state.toggleSequencer()
        }       
        this.setState({ 'mute': !this.state.mute })
    }

    componentWillMount() {
        const { server_url} = this.props
        this.setState({ server_url })
        console.log(server_url)
    }

    componentDidMount() {
        const { index, value, urls, updateLockStatue, getNextLoop, updateDecision, toggleSequencer, updateLoadStatue, updateVolmes  } = this.props
            this.setState({ index, value, urls, updateLockStatue, getNextLoop, updateDecision, toggleSequencer, updateLoadStatue, updateVolmes })
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState != this.state) {
            if (this.state.loaded == 4) {
                this.setState({ 'loaded': 0 })
                this.state.updateLoadStatue(this.state.index, 0)
                console.log(this.state.index, ': loadfinish')
            }
        }


        if (prevProps != this.props) {
            const { index, value, urls, lockStatue, sequencer, currentLoadStatue, urlsDecision } = this.props
            if(sequencer != prevProps.sequencer) {
                if(sequencer == 1) {
                    this.state.mute = true
                } 
            }   
            this.setState({ index, value, urls, lockStatue, sequencer, currentLoadStatue, urlsDecision })
        }

    }


    render() {
        return (
            <div className='loops'>
                {this.state.playColumns.map((value, index) => (
                    <Waveform
                        key={index}
                        index={index}
                        value={value}
                        mute={this.state.mute}
                        group_index={this.state.index}
                        url={this.state.urls == null ? null : this.state.urls[index]}
                        colors={colors}
                        volume={this.state.volume}
                        chooseColumn={this.chooseColumn}
                        loadCompleted={this.loadCompleted}
                        currentLoadStatue={this.state.currentLoadStatue}    
                        server_url={this.state.server_url}
                    />
                ))}
                {(!this.state.value && !this.state.currentLoadStatue) ? <button className='main-btn' onClick={this.changeLoop}>Change</button> : <button className='sub-btn'>Later</button>}
                <button className={this.state.value?'sub-btn':'main-btn'} onClick={this.toggleLock}>{this.state.value ? 'unLock' : 'Lock'}</button>
                {(this.state.mute) ? <button className='sub-btn' onClick={this.toggleMute}>unMute</button> : <button className='main-btn' onClick={this.toggleMute}>Mute</button>}
                <input type="range" min='0' max='100' className="volume" onInput={this.volumeAdjust}/>
            </div>
        )
    }
}

export default Loops;