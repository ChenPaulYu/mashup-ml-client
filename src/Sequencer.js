import React, { Component } from 'react';
import {Players, Transport, Sequence } from "tone";
import _ from 'lodash';


const ROOT_URL = `http://140.109.21.190:5000/download_filepath`
const defaultPads = [[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0],[1, 0, 0, 0]]

class Sequencer extends Component {

    constructor(props) {
        super(props)
        this.state = { 'pads': defaultPads, 'tracks': 4, 'CurrentColumn': 0, 'play': false }
        this.addTrack = this.addTrack.bind(this)
        this.getRandomTemplate = this.getRandomTemplate.bind(this)
        this.startSequence = this.startSequence.bind(this)
        this.stopSequence  = this.stopSequence.bind(this)
    }

    togglePad(group, pad) {
        this.setState(state => {
            const clonedPads = state.pads.slice(0)
            const padState = clonedPads[group][pad]
            clonedPads[group][pad] = padState === 1 ? 0 : 1
            return {
                pads: clonedPads
            }
        })
    }

    getRandomTemplate() {
        if (this.state.tracks < 2) return
        console.log(`${this.state.server_url}/get_template/${this.state.tracks}`)
        fetch(`${this.state.server_url}/get_template/${this.state.tracks}`)
            .then(res => res.json())
            .then(res => this.setState({ pads: res['template'] }))
    }


    addTrack() {
        let pads = this.state.pads
        let tracks  = this.state.tracks

        if (tracks >= 9) {
            return 
        }

        const clonedPads = pads.slice(0)
        let tempPads = clonedPads.map(function(obj) {
            obj.push(0)
            return obj
        })
        tracks = tracks + 1
        this.setState({ pads: tempPads, tracks: tracks})
        this.getRandomTemplate()
    }


    startSequence() {
        let sequence = new Sequence((time, columnIndex) => {
            this.setState({ CurrentColumn: columnIndex })
            const column = this.state.pads[columnIndex];
            const players = this.state.players
            column.forEach((on, row) => {
                if (on) {
                    players.get(row).start(time);
                }
            });
            console.log('sequence: ', time)
        }, _.range(8), `${8}n`).start()

        this.setState({ sequence: sequence })
        Transport.start()
        this.setState({'play': true})
    }

    stopSequence() {
        Transport.stop()
        this.setState({ 'play': false })
    }

    componentWillMount() {
        const { server_url } = this.props
        this.setState({ server_url })
    }

    componentDidMount() {
        const { urlsDecision, volumes } = this.props

        
        let tracks  = urlsDecision.length
        this.getRandomTemplate()

        let urls = urlsDecision.map(item => `${this.state.server_url}/download_filepath?url=${item}`);  

        let players = new Players(urls, () => {
            this.setState({ 'players': players })
            this.setState({ 'tracks': tracks })
            this.setState({ 'urls': urls })
        }, { volume: volumes }).toMaster();

        for (let i = 0; i < urls.length; i++) {
            players.get(i).volume.value = volumes[i]
        }

        Transport.bpm.value = 20 

    }


    componentWillUnmount() {
        if(this.state.sequence) {
            this.state.sequence.mute = true
            this.state.sequence.stop().removeAll()
        }
        console.log('will unmount')
    }



    render() {
        const { pads } = this.state
        return (
            <div className='sequencer'>
                <h4 className='text'>Arrange Sequencer to Complete Beat</h4>
                <div className='pads'>
                    {pads.map((group, groupIndex) => (
                        <div key={`pad-${groupIndex}`}>
                            <div key={`progress-${groupIndex}`}
                                className={`progress ${(groupIndex == this.state.CurrentColumn) && ' progress_on'}`}
                            >
                            </div>
                            {group.map((pad, i) => (
                                <div
                                    key={`pad-group-${i}`}
                                    className={`pad ${(pad == 1) && ' pad_on'}`}
                                    onClick={() => {
                                        this.togglePad(groupIndex, i)
                                    }}>
                                </div>
                            ))}
                        </div>))
                    }
                </div>
                
                {!this.state.play
                    ? <button className='main-btn' onClick={this.startSequence}>Start</button> 
                    : <button className='sub-btn' onClick={this.stopSequence}>Stop</button>
                }
                {/* <button className='main-btn' onClick={this.addTrack}>Add Track</button> */}
                <button className='main-btn' onClick={this.getRandomTemplate}>Get Template</button>
            </div>
        )
    }
}

export default Sequencer;
