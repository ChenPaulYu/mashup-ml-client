import React, { useState } from 'react';
import Canvas from './Canvas';

const OFF_COLOR = '#FFF130'
const ON_COLOR  = '#F4F1EE'
const WIDTH = 62
const HEIGHT = 62




const Visualizer = () => {
    const [state, ] = useState({ 
        x: 100,
        y: 100,
        w: WIDTH, 
        h: HEIGHT, 
        on_color : ON_COLOR,
        off_color: OFF_COLOR
    })


    return <>
        <header className="App-header">
            <Canvas {...state}/>
        </header>
    </>
}

export default Visualizer;