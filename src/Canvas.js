import React, { Component } from 'react';
import { Player, Transport, Tone } from "tone";

const URL = `http://140.109.21.190:5000/download_filepath`

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
        this.canvasClick = this.canvasClick.bind(this)
        this.drawWaveform = this.drawWaveform.bind(this)
    }

    canvasClick() {

        let state = this.state
        let duration = state.sound.buffer.duration
        let drawWaveform = this.drawWaveform


        if (state.sound.state == 'stopped') {
            
            // state.sound.sync().start(0, Transport.seconds % duration)
            state.sound.sync().start()

            state.sound.loop = true

            console.log(Transport.seconds % duration)

            drawWaveform(state.data, state.w, state.h, state.off_color)

        } else {

            let drawWaveform = this.drawWaveform
            let state = this.state
            state.sound.loop = false
            state.sound.stop().unsync()
            
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
        // getAudioData(URL).then(data => this.setState({ data }))
        console.log(this.canvas.width, this.canvas.height)
        // const { w, h, on_color, off_color, index } = this.props
        // console.log(index)
        // this.setState({'index': index})
        // var sound = new Player(`${URL}?${index}`, () => {
        //     let data = sound.buffer.getChannelData()
        //     console.log('load sound')
        //     this.drawWaveform(data, w, h, on_color)
        //     sound.toMaster()
        //     this.setState({ sound, data, on_color, off_color, w, h });
        // }).sync()        
    }

    componentDidUpdate(prevProps, prevState) {

        const { w, h, on_color, off_color, index } = this.props
        if (prevProps.index == index) {
            console.log('un-changed')
            return 
        } 
        console.log('change----')

        if (this.state.sound) {
            this.state.sound.loop = false
            this.state.sound.stop().unsync() 
            this.setState({ 'sound': null })
        }
        
        var sound = new Player(`${URL}?url=${index}`, () => {
            let data = sound.buffer.getChannelData()
            this.drawWaveform(data, this.canvas.width, this.canvas.height, on_color)
            sound.toMaster()
            this.setState({ sound, data, on_color, off_color, w, h });
        }).sync()  
    }

    render() {
        return (
            <canvas width={this.props.w}
                height={this.props.h}
                ref={x => this.canvas = x}
                style={{ border: `1px solid ${this.props.on_color}`, backgroundColor: `#0f4c81`}}
                onClick={this.canvasClick}
            />
        )
    }

}

export default Canvas;