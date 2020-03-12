import React, { Component} from 'react';
import { Player, Transport } from "tone";

const URL = `http://140.109.21.190:5000/download/delay.wav`

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

function getAudioData(url) {
    const audioContext = new AudioContext()

    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(buffer => new Promise(resolve => {
            audioContext.decodeAudioData(buffer, decodedData => {
                resolve(decodedData.getChannelData(0))
            })
        }))
}

class Canvas extends Component {

    constructor(props) {
        super(props)
        this.state = ({})
        this.canvasClick  = this.canvasClick.bind(this)
        this.drawWaveform = this.drawWaveform.bind(this) 
    }


    canvasClick() {
        if (Transport.state == 'stopped' || Transport.state == 'paused') {

            console.log(Transport.state)

            Transport.start()

            let state    = this.state
            let duration = state.sound.buffer.duration
            let drawWaveform = this.drawWaveform
            drawWaveform(state.data, state.w, state.h, state.off_color)

            Transport.scheduleOnce(function (time) {
                drawWaveform(state.data, state.w, state.h, state.on_color)
                Transport.stop()
            }, duration);
            


        } else {
            Transport.pause()
            let drawWaveform = this.drawWaveform
            let state = this.state
            drawWaveform(state.data, state.w, state.h, state.on_color)
        }
        
    }


    drawWaveform(data, w, h, color) {
        let ctx = this.canvas.getContext(`2d`)
        let rects = getRects(data, w, h)

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color
        rects.forEach(r => ctx.fillRect(r.x, r.y, r.width, r.height))

    }



    componentDidMount() {
        getAudioData(URL).then(data => this.setState({ data }))
        const { w, h, on_color, off_color } = this.props

        var sound = new Player(URL, () => {
            let data = sound.buffer.getChannelData()

            this.drawWaveform(data, w, h, on_color)
            sound.toMaster().sync().start()

            this.setState({ sound, data, on_color, off_color, w, h });
        }).sync()

    }

    render() {
        return (
            <canvas width={this.props.w}
                height={this.props.h}
                ref={x => this.canvas = x}
                style={{ border: `1px solid ${this.props.on_color}`z`}}
                onClick={this.canvasClick}
            />
        )
    }
}

export default Canvas;