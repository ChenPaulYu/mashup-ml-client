import React, { Component } from 'react';
import { Player, Transport, Tone } from "tone";

const ROOT_URL = `http://140.109.21.190:5000/download_filepath`

function getRects(data, w, h) {
    const step = Math.ceil(data.length / w)
    const amp = h / 2
    const rects = []

    for (let i = 0; i < w; i++) {
        let [min, max] = [1, -1]
        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j]
            if (datum < min) min = datum
            if (datum > max) max = datum
        }

        rects.push({
            x: i,
            y: (1 + min) * amp,
            width: 1,
            height: Math.max(1, (max - min) * amp)
        })
    }

    return rects
}

class Waveform extends Component {
    constructor(props) {
        super(props)
        this.state = ({})
        this.canvasClick = this.canvasClick.bind(this)
        this.drawWaveform = this.drawWaveform.bind(this)
        this.connectAudio = this.connectAudio.bind(this)
        this.disconnectAudio = this.disconnectAudio.bind(this)
    }

    drawWaveform(data, w, h, color) {
        let ctx = this.canvas.getContext(`2d`)
        let rects = getRects(data, w, h)

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color
        rects.forEach(r => ctx.fillRect(r.x, r.y, r.width, r.height))

    }

    canvasClick() {
        if (this.state.value == 1) {
            this.state.chooseColumn(-1)
        } else {
            this.state.chooseColumn(this.state.index)
        }
    }

    connectAudio() {
        if (this.state.player) {
            this.state.player.loop = true
            if (Transport.state == 'stopped') {
                this.state.player.sync().start()
                Transport.start()
            } else {
                console.log(Transport.seconds % this.state.player.buffer.duration)
                this.state.player.sync().restart(Transport.seconds % this.state.player.buffer.duration)
                console.log('restart')
            }
            this.state.player.mute = false
        }
    }

    disconnectAudio() {
        if (this.state.player) {
            this.state.player.loop = false
            this.state.player.mute = true
            this.state.player.stop().unsync()
        }
    }

    componentDidMount() {
        const { url, value, index, colors, chooseColumn } = this.props
        this.setState({ url, value, index, colors, chooseColumn })
        if (url != null) {
            var player = new Player(url, () => {
                let data = player.buffer.getChannelData()
                this.drawWaveform(data, this.canvas.width, this.canvas.height, colors[0])
                player.toMaster()
                this.setState({ player, data })
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {


        if (prevProps == this.props) return

        const { index, url, value, colors, mute } = this.props


        if (url != null && !this.state.player) {
            if (prevState.url == url) return
            var player = new Player(`${ROOT_URL}?url=${url}`, () => {
                let data = player.buffer.getChannelData()
                this.drawWaveform(data, this.canvas.width, this.canvas.height, colors[0])
                player.toMaster()
                this.setState({ player, data })
            })
        }

        this.setState({ url, value, index, colors })

        if (this.state.player) {
            if (mute == prevProps.mute) {
                // if (value == prevProps.value) return
                if (value == 1) {
                    this.drawWaveform(this.state.data, this.canvas.width, this.canvas.height, colors[1])
                    this.connectAudio()
                } else if (value == 0) {
                    this.disconnectAudio()
                    this.drawWaveform(this.state.data, this.canvas.width, this.canvas.height, colors[0])
                }   
            } else {
                if (mute == 1) {
                    this.state.player.mute = true
                } else {
                    this.state.player.mute = false
                }  
            }
         
        }
    }



    render() {
        return (
            <div className='waveform'>
                <canvas
                    className='draw'
                    ref={x => this.canvas = x}
                    style={{ border: `1px solid ${this.props.colors[0]}`, backgroundColor: `#0f4c81` }}
                    onClick={this.canvasClick}
                />
            </div>
        )
    }

}

export default Waveform;