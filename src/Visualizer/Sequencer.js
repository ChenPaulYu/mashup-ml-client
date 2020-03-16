import React, {Component} from 'react';
import { Player, Players, Transport, Sequence } from "tone";
import _ from 'lodash';

const style_off = {
    'border': '1px solid black',
    'width' : '20px',
    'height': '20px',
    'margin': '1px'
}

const progress_on = {
    'border': '1px solid black',
    'width' : '20px',
    'height': '5px',
    'margin': '1px',
    'backgroundColor': '#ED553B',
}
const progress_off = {
    'border': '1px solid black',
    'width' : '20px',
    'height': '5px',
    'margin': '1px'
}

const style_on = {
    'border': '1px solid black',
    'width': '20px',
    'height': '20px',
    'backgroundColor': '#FFF130',
    'margin': '1px'
}

const flex = {
    'display': 'flex',
    'flexDirection': 'row',
    'margin': 'auto',
    'justifyContent': 'center',
    'alignItems': 'center' 
}
 
const activeColumn = {
    'backgroundColor': '#20639B'
}

const defaultPads = [[1],[1],[1], [1],[1],[1],[1],[1]]

class Sequencer extends Component {

    constructor(props) {
        super(props)
        this.state = { pads: defaultPads, tracks: 1, CurrentColumn: 0 }
        this.addTrack = this.addTrack.bind(this)
        this.getRandomTemplate = this.getRandomTemplate.bind(this)
        this.startSequence = this.startSequence.bind(this)
    }

    togglePad(group, pad) {
        this.setState(state => {
            console.log(state)
            const clonedPads = state.pads.slice(0)
            const padState = clonedPads[group][pad]
            console.log(group, pad)
            clonedPads[group][pad] = padState === 1 ? 0 : 1
            return {
                pads: clonedPads
            }
        })
    }

    getRandomTemplate() {
        console.log('randome template')
        fetch(`http://140.109.21.190:5000/get_template/${this.state.tracks}`)
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

        fetch(`http://140.109.21.190:5000/get_template/${tracks}`)
            .then(res => res.json())
            .then(res => this.setState({ pads: res['template'] }))
    }


    startSequence() {
        console.log(this.state.players.get('track1'))
        // this.state.players.get('track1').start()
        let sequence = new Sequence((time, columnIndex) => {
            this.setState({ CurrentColumn: columnIndex })
            const column = this.state.pads[columnIndex];
            const players = this.state.players
            column.forEach((on, row) => {
                console.log(on, row)
                if (on) {
                    console.log(players)
                    players.get(`track${row}`).start(time, 0, `${8 * 2}n`, 0, 1);
                }
            });

        }, _.range(8), `${8}n`).start()

        this.setState({ sequence: sequence })
        Transport.toggle()
    }

    componentDidMount(){

        let players = new Players({
            'track0': `http://140.109.21.190:5000/choose_loop/10`,
            'track1': `http://140.109.21.190:5000/choose_loop/1`,
            'track2': `http://140.109.21.190:5000/choose_loop/2`,
            'track3': `http://140.109.21.190:5000/choose_loop/3`,
        }, {
            volume: -10,
            fadeOut: `2n`
        }).toMaster();

        this.setState({ players: players })

        Transport.bpm.value = 15 


        // fetch('http://140.109.21.190:5000/get_main_loop')
        //     .then(res => res.json())
        //     .then(res => {
        //         let main_loop = res.main
        //         console.log(res.main)
        //         // `http://140.109.21.190:5000/download_filepath?url=${main_loop}`
        //         var player = new Player(sample1, () => {
                    
        //             let data = players.buffer.getChannelData()
        //             this.setState({ player: player })
        //             console.log(data)
        //         }).toMaster()

        //     })


        
        // setInterval(() => {
        //     let next = (this.state.CurrentColumn + 1 ) % 8
        //     this.setState({ CurrentColumn: next})
        // }, 1000);
    }

    componentDidUpdate(){
        Transport.on('stop', () => {
            this.setState({CurrentColumn: 0})
        });
    }


    render() {
        const { pads } = this.state
        return (
            <div className='sequencer'>
                <div style={flex}>
                    {pads.map((group, groupIndex) => (
                        <div key={`pad-${groupIndex}`} className="pads">
                            <div key={`progress-${groupIndex}`}
                                style={(groupIndex == this.state.CurrentColumn) ? progress_on : progress_off}>
                            </div>
                            {group.map((pad, i) => (
                                <div
                                    key={`pad-group-${i}`}
                                    style={(pad == 1) ? style_on : style_off}
                                    onClick={() => { this.togglePad(groupIndex, i) 
                                    }}>
                                </div>
                            ))}
                        </div>
                        ))
                    }
                </div>
                <button onClick={this.startSequence}>Play</button>
                <button onClick={this.addTrack}>Add Track</button>
                <button onClick={this.getRandomTemplate}>Get Template</button>
            </div>
        )
    }
}

export default Sequencer;
