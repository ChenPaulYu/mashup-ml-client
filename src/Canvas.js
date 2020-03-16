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

        if (this.state.main_playing == 1) {
            return
        }

        if (this.state.main_playing == 0){
            console.log('canvas clcik: ', this.state.num)
            this.state.playloop(this.state.num)
        }

        let state = this.state
        let duration = state.sound.buffer.duration
        let drawWaveform = this.drawWaveform


        if (state.sound.state == 'stopped') {
            // state.sound.sync().start(0, Transport.seconds % duration)
            state.sound.sync().start()

            state.sound.loop = true

            console.log(Transport.seconds % duration)

            drawWaveform(state.data, state.w, state.h, state.on_color)
        
        } else {
            // let drawWaveform = this.drawWaveform
            // let state = this.state
            // state.sound.loop = false
            // state.sound.stop().unsync()
            
            // drawWaveform(state.data, state.w, state.h, state.off_color)
        }
        
        Transport.start()

    }
        
    drawWaveform(data, w, h, color) {
        let ctx = this.canvas.getContext(`2d`)
        let rects = getRects(data, w, h)

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color
        rects.forEach(r => ctx.fillRect(r.x, r.y, r.width, r.height))

    }


    

    // componentDidMount() {
    //     const { on_color, off_color, index, main_playing, playloop, num } = this.props
    //     const w = this.canvas.width
    //     const h = this.canvas.height

    //     this.setState({'index': index})
        
    //     if (index != 'null') {
    //         return
    //     }

        
    //     var sound = new Player(`${URL}?url=${index}`, () => {
    //         let data = sound.buffer.getChannelData()
    //         this.drawWaveform(data, this.canvas.width, this.canvas.height, on_color)
    //         sound.toMaster()
    //         this.setState({ sound, data, on_color, off_color, w, h, main_playing, playloop, num });
    //     }).sync()      
    // }

    componentDidUpdate(prevProps) {

        const { on_color, off_color, index, main_playing, playloop, num} = this.props

        const w = this.canvas.width
        const h = this.canvas.height


        if (prevProps.index == index && prevProps.main_playing == main_playing) {
            return
        } 



        if (main_playing == 1) {
            let state = this.state
            let duration = state.sound.buffer.duration
            let drawWaveform = this.drawWaveform

            state.sound.sync().start()

            state.sound.loop = true
            state.sound.mute = false

            console.log(Transport.seconds % duration)

            drawWaveform(state.data, state.w, state.h, state.off_color)
        } 
        // else {

        //     if (Object.keys(this.state).length != 0) {
        //         let state = this.state
        //         let drawWaveform = this.drawWaveform
        //         state.sound.loop = false
        //         state.sound.stop().unsync()

        //         drawWaveform(state.data, state.w, state.h, state.off_color)
        //     }
        // }

        if (prevProps.main_playing == 1 && main_playing == 0) {
            let drawWaveform = this.drawWaveform
            let state = this.state
            state.sound.loop = false
            state.sound.mute = true
            state.sound.stop().unsync()
            drawWaveform(state.data, state.w, state.h, state.on_color)
        }

        
        

        if (!this.state.sound || prevProps.index != index) {
            var sound = new Player(`${URL}?url=${index}`, () => {
                let data = sound.buffer.getChannelData()
                this.drawWaveform(data, this.canvas.width, this.canvas.height, on_color)
                sound.toMaster()
                this.setState({ data, sound, data, on_color, off_color, w, h, main_playing, playloop, num });
            }).sync()  
        } 
        

    }

    render() {
        return (
            <canvas 
                className='mainLoop'
                ref={x => this.canvas = x}
                style={{ border: `1px solid ${this.props.on_color}`, backgroundColor: `#0f4c81`}}
                onClick={this.canvasClick}
            />
        )
    }

}

export default Canvas;