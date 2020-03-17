(this["webpackJsonpmashup-ml-client"]=this["webpackJsonpmashup-ml-client"]||[]).push([[0],{11:function(t,e,a){t.exports=a(20)},18:function(t,e,a){},20:function(t,e,a){"use strict";a.r(e);var s=a(0),o=a.n(s),n=a(9),u=a.n(n),l=a(3),r=a(4),i=a(6),c=a(5),h=a(1),d=a(7),p=a(2),m=a(10),v=a.n(m),g=[[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],f=function(t){function e(t){var a;return Object(l.a)(this,e),(a=Object(i.a)(this,Object(c.a)(e).call(this,t))).state={pads:g,tracks:4,CurrentColumn:0,play:!1},a.addTrack=a.addTrack.bind(Object(h.a)(a)),a.getRandomTemplate=a.getRandomTemplate.bind(Object(h.a)(a)),a.startSequence=a.startSequence.bind(Object(h.a)(a)),a.stopSequence=a.stopSequence.bind(Object(h.a)(a)),a}return Object(d.a)(e,t),Object(r.a)(e,[{key:"togglePad",value:function(t,e){this.setState((function(a){var s=a.pads.slice(0),o=s[t][e];return s[t][e]=1===o?0:1,{pads:s}}))}},{key:"getRandomTemplate",value:function(){var t=this;this.state.tracks<2||fetch("".concat(this.state.server_url,"/get_template/").concat(this.state.tracks)).then((function(t){return t.json()})).then((function(e){return t.setState({pads:e.template})}))}},{key:"addTrack",value:function(){var t=this.state.pads,e=this.state.tracks;if(!(e>=9)){var a=t.slice(0).map((function(t){return t.push(0),t}));e+=1,this.setState({pads:a,tracks:e}),this.getRandomTemplate()}}},{key:"startSequence",value:function(){var t=this,e=new p.Sequence((function(e,a){t.setState({CurrentColumn:a});var s=t.state.pads[a],o=t.state.players;s.forEach((function(t,a){t&&o.get(a).start(e)})),console.log("sequence: ",e)}),v.a.range(8),"".concat(8,"n")).start();this.setState({sequence:e}),p.Transport.start(),this.setState({play:!0})}},{key:"stopSequence",value:function(){p.Transport.stop(),this.setState({play:!1})}},{key:"componentDidMount",value:function(){var t=this,e=this.props,a=e.urlsDecision,s=e.volumes,o=e.server_url;this.setState({server_url:o});var n=a.length;this.getRandomTemplate();for(var u=a.map((function(e){return"".concat(t.state.server_url,"/download_filepath?url=").concat(e)})),l=new p.Players(u,(function(){t.setState({players:l}),t.setState({tracks:n}),t.setState({urls:u})}),{volume:s}).toMaster(),r=0;r<u.length;r++)l.get(r).volume.value=s[r];p.Transport.bpm.value=20}},{key:"componentWillUnmount",value:function(){this.state.sequence&&(this.state.sequence.mute=!0,this.state.sequence.stop().removeAll()),console.log("will unmount")}},{key:"render",value:function(){var t=this,e=this.state.pads;return o.a.createElement("div",{className:"sequencer"},o.a.createElement("div",{className:"pads"},e.map((function(e,a){return o.a.createElement("div",{key:"pad-".concat(a)},o.a.createElement("div",{key:"progress-".concat(a),className:"progress ".concat(a==t.state.CurrentColumn&&" progress_on")}),e.map((function(e,s){return o.a.createElement("div",{key:"pad-group-".concat(s),className:"pad ".concat(1==e&&" pad_on"),onClick:function(){t.togglePad(a,s)}})})))}))),this.state.play?o.a.createElement("button",{className:"sub-btn",onClick:this.stopSequence},"Stop"):o.a.createElement("button",{className:"main-btn",onClick:this.startSequence},"Start"),o.a.createElement("button",{className:"main-btn",onClick:this.getRandomTemplate},"Get Template"))}}]),e}(s.Component);var k=function(t){function e(t){var a;return Object(l.a)(this,e),(a=Object(i.a)(this,Object(c.a)(e).call(this,t))).state={},a.canvasClick=a.canvasClick.bind(Object(h.a)(a)),a.drawWaveform=a.drawWaveform.bind(Object(h.a)(a)),a.connectAudio=a.connectAudio.bind(Object(h.a)(a)),a.disconnectAudio=a.disconnectAudio.bind(Object(h.a)(a)),a}return Object(d.a)(e,t),Object(r.a)(e,[{key:"drawWaveform",value:function(t,e,a,s){var o=this.canvas.getContext("2d"),n=function(t,e,a){for(var s=Math.ceil(t.length/e),o=a/2,n=[],u=0;u<e;u++){for(var l=1,r=-1,i=0;i<s;i++){var c=t[u*s+i];c<l&&(l=c),c>r&&(r=c)}n.push({x:u,y:(1+l)*o,width:1,height:Math.max(1,(r-l)*o)})}return n}(t,e,a);o.clearRect(0,0,e,a),o.fillStyle=s,n.forEach((function(t){return o.fillRect(t.x,t.y,t.width,t.height)}))}},{key:"canvasClick",value:function(){1==this.state.value?this.state.chooseColumn(-1):this.state.chooseColumn(this.state.index)}},{key:"connectAudio",value:function(){console.log("volume: ",this.state.player.volume.value),this.state.player&&(this.state.player.loop=!0,"stopped"==p.Transport.state?(this.state.player.sync().start(),p.Transport.start()):(console.log(p.Transport.seconds%this.state.player.buffer.duration),this.state.player.sync().restart().seek(p.Transport.seconds%this.state.player.buffer.duration),console.log("restart")),this.state.player.mute=!1)}},{key:"disconnectAudio",value:function(){this.state.player&&(this.state.player.loop=!1,this.state.player.mute=!0,this.state.player.stop().unsync())}},{key:"componentWillMount",value:function(){var t=this.props.server_url;this.setState({server_url:t}),console.log(t)}},{key:"componentDidMount",value:function(){var t=this,e=this.props,a=e.url,s=e.value,o=e.index,n=e.colors,u=e.chooseColumn,l=e.loadCompleted;if(this.setState({url:a,value:s,index:o,colors:n,chooseColumn:u,loadCompleted:l}),null!=a)var r=new p.Player(a,(function(){var e=r.buffer.getChannelData();t.drawWaveform(e,t.canvas.width,t.canvas.height,n[0]),r.toMaster(),t.setState({player:r,data:e})}))}},{key:"componentDidUpdate",value:function(t,e){var a=this;if(t!=this.props){var s=this.props,o=s.index,n=s.url,u=s.value,l=s.colors,r=s.mute,i=s.currentLoadStatue,c=s.volume;if(c!=t.volume&&this.state.player&&(this.state.player.volume.value=c),null!=n&&(!this.state.player||1==i)){if(e.url==n)return;var h=new p.Player("".concat(this.state.server_url,"/download_filepath?url=").concat(n),(function(){var t=h.buffer.getChannelData();a.drawWaveform(t,a.canvas.width,a.canvas.height,l[0]),h.toMaster(),h.volume.value=-15,a.state.loadCompleted(),a.setState({player:h,data:t})}))}if(this.setState({url:n,value:u,index:o,colors:l}),this.state.player)if(r==t.mute){if(u==t.value)return;1==u?(this.drawWaveform(this.state.data,this.canvas.width,this.canvas.height,l[1]),this.connectAudio()):0==u&&(this.disconnectAudio(),this.drawWaveform(this.state.data,this.canvas.width,this.canvas.height,l[0]))}else this.state.player.mute=1==r}}},{key:"render",value:function(){var t=this;return o.a.createElement("div",{className:"waveform"},o.a.createElement("canvas",{className:"draw",ref:function(e){return t.canvas=e},style:{border:"1px solid ".concat(this.props.colors[0]),backgroundColor:"#0f4c81"},onClick:this.canvasClick}))}}]),e}(s.Component),S=["#F4F1EE","#FFF130"],b=function(t,e){return t+e},y=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:-40,s=t/100,o=a+(e-a)*s;return o},L=function(t){function e(t){var a;return Object(l.a)(this,e),(a=Object(i.a)(this,Object(c.a)(e).call(this,t))).state={urls:null,mute:!1,value:!1,players:null,loaded:0,volume:y(-15),playColumns:[0,0,0,0]},a.toggleLock=a.toggleLock.bind(Object(h.a)(a)),a.changeLoop=a.changeLoop.bind(Object(h.a)(a)),a.toggleMute=a.toggleMute.bind(Object(h.a)(a)),a.volumeAdjust=a.volumeAdjust.bind(Object(h.a)(a)),a.chooseColumn=a.chooseColumn.bind(Object(h.a)(a)),a.loadCompleted=a.loadCompleted.bind(Object(h.a)(a)),a}return Object(d.a)(e,t),Object(r.a)(e,[{key:"volumeAdjust",value:function(t){var e=y(t.target.value);this.state.updateVolmes(this.state.index,e),this.setState({volume:e})}},{key:"loadCompleted",value:function(){this.state.loaded>=4||this.setState({loaded:this.state.loaded+1})}},{key:"chooseColumn",value:function(t){if(!this.state.value){var e=[0,0,0,0];-1!=t&&(e[t]=1),this.state.updateDecision(this.state.index,this.state.urls[t]),this.setState({playColumns:e})}}},{key:"changeLoop",value:function(){if(1!=this.state.currentLoadStatue){var t=this.state.index,e=this.state.urlsDecision;console.log("change loop: ",t),0==t?this.state.getNextLoop(4):(console.log(t-1,e),this.state.getNextLoop(t-1,e[t-1])),console.log("change loop"),this.chooseColumn(-1)}else console.log("can not change, still loading")}},{key:"toggleLock",value:function(){if(0!=this.state.playColumns.reduce(b)){var t=this.state.value?0:1;this.state.updateLockStatue(this.state.index,t)}else alert("choose one loop")}},{key:"toggleMute",value:function(){0!=this.state.playColumns.reduce(b)?(this.state.sequencer&&(this.state.lockStatue[this.state.index]&&this.toggleLock(),this.state.toggleSequencer()),this.setState({mute:!this.state.mute})):alert("choose one loop")}},{key:"componentWillMount",value:function(){var t=this.props.server_url;this.setState({server_url:t}),console.log(t)}},{key:"componentDidMount",value:function(){var t=this.props,e=t.index,a=t.value,s=t.urls,o=t.updateLockStatue,n=t.getNextLoop,u=t.updateDecision,l=t.toggleSequencer,r=t.updateLoadStatue,i=t.updateVolmes;this.setState({index:e,value:a,urls:s,updateLockStatue:o,getNextLoop:n,updateDecision:u,toggleSequencer:l,updateLoadStatue:r,updateVolmes:i})}},{key:"componentDidUpdate",value:function(t,e){if(e!=this.state&&4==this.state.loaded&&(this.setState({loaded:0}),this.state.updateLoadStatue(this.state.index,0),console.log(this.state.index,": loadfinish")),t!=this.props){var a=this.props,s=a.index,o=a.value,n=a.urls,u=a.lockStatue,l=a.sequencer,r=a.currentLoadStatue,i=a.urlsDecision;l!=t.sequencer&&1==l&&(this.state.mute=!0),this.setState({index:s,value:o,urls:n,lockStatue:u,sequencer:l,currentLoadStatue:r,urlsDecision:i})}}},{key:"render",value:function(){var t=this;return o.a.createElement("div",{className:"loops"},this.state.playColumns.map((function(e,a){return o.a.createElement(k,{key:a,index:a,value:e,mute:t.state.mute,group_index:t.state.index,url:null==t.state.urls?null:t.state.urls[a],colors:S,volume:t.state.volume,chooseColumn:t.chooseColumn,loadCompleted:t.loadCompleted,currentLoadStatue:t.state.currentLoadStatue,server_url:t.state.server_url})})),this.state.value||this.state.currentLoadStatue?o.a.createElement("button",{className:"sub-btn"},"Later"):o.a.createElement("button",{className:"main-btn",onClick:this.changeLoop},"Change"),o.a.createElement("button",{className:this.state.value?"sub-btn":"main-btn",onClick:this.toggleLock},this.state.value?"unLock":"Lock"),this.state.mute?o.a.createElement("button",{className:"sub-btn",onClick:this.toggleMute},"unMute"):o.a.createElement("button",{className:"main-btn",onClick:this.toggleMute},"Mute"),o.a.createElement("input",{type:"range",min:"0",max:"100",className:"volume",onInput:this.volumeAdjust}))}}]),e}(s.Component),C=function(t,e){return t+e},j=function(t){function e(t){var a;return Object(l.a)(this,e),(a=Object(i.a)(this,Object(c.a)(e).call(this,t))).state={loadStatue:[0,0,0,0],lockStatue:[0,0,0,0],volumes:[-15,-15,-15,-15],groupUrls:[],urlsDecision:[],sequencer:!1,server_url:"https://musicai.citi.sinica.edu.tw/mashup_ml_server"},a.getMainLoop=a.getMainLoop.bind(Object(h.a)(a)),a.updateLockStatue=a.updateLockStatue.bind(Object(h.a)(a)),a.updateDecision=a.updateDecision.bind(Object(h.a)(a)),a.getAccompanyLoop=a.getAccompanyLoop.bind(Object(h.a)(a)),a.updateLoadStatue=a.updateLoadStatue.bind(Object(h.a)(a)),a.toggleSequencer=a.toggleSequencer.bind(Object(h.a)(a)),a.updateVolmes=a.updateVolmes.bind(Object(h.a)(a)),a}return Object(d.a)(e,t),Object(r.a)(e,[{key:"updateVolmes",value:function(t,e){console.log(t,e);var a=this.state.volumes;a[t]=e,this.setState({volumes:a})}},{key:"getMainLoop",value:function(t){var e=this,a="".concat(this.state.server_url,"/get_main_loop/").concat(t);console.log(a),this.updateLoadStatue(0,1),fetch(a,{method:"GET"}).then((function(t){if(!t.ok)throw e.updateLoadStatue(0,0),new Error(t.statusText);return t.json()})).then((function(t){var a;console.log("main loop"),e.state.groupUrls[0]?a=[t.main]:(a=e.state.groupUrls)[0]=t.main,e.setState({groupUrls:a})}))}},{key:"getAccompanyLoop",value:function(t,e){var a=this,s="".concat(this.state.server_url,"/get_mashup_result?url=").concat(e,"&num=",100);this.state.groupUrls.length==t+1&&(this.state.groupUrls.push([]),this.setState({groupUrls:this.state.groupUrls})),this.updateLoadStatue(t+1,1),fetch(s,{method:"GET"}).then((function(e){if(!e.ok)throw a.updateLoadStatue(t+1,0),new Error(e.statusText);return e.json()})).then((function(e){console.log("accompany loop");var s=a.state.groupUrls;return s[t+1]=e.rank.slice(0,4),a.setState({groupUrls:s}),e.rank}))}},{key:"updateLoadStatue",value:function(t,e){var a=this.state.loadStatue;a[t]=e,this.setState({loadStatue:a})}},{key:"updateDecision",value:function(t,e){this.state.urlsDecision.length<t+1?this.state.urlsDecision.push(e):this.state.urlsDecision[t]=e,this.setState({urlsDecision:this.state.urlsDecision})}},{key:"updateLockStatue",value:function(t,e){var a=this.state;a.lockStatue[t]=e,4==a.lockStatue.reduce(C)?(this.setState({lockStatue:a.lockStatue}),this.state.sequencer||this.toggleSequencer()):(1==e&&(console.log("update lock ",t),this.getAccompanyLoop(t,this.state.urlsDecision[t])),this.setState({lockStatue:a.lockStatue}))}},{key:"toggleSequencer",value:function(){this.setState({sequencer:!this.state.sequencer})}},{key:"componentDidMount",value:function(){console.log(this.state),this.getMainLoop(4)}},{key:"render",value:function(){var t=this;return o.a.createElement("div",{className:"App"},o.a.createElement("h1",null,"Interactive Beat Makers"),this.state.groupUrls.map((function(e,a){return o.a.createElement(L,{key:a,urls:e,index:a,sequencer:t.state.sequencer,value:t.state.lockStatue[a],currentLoadStatue:t.state.loadStatue[a],lockStatue:t.state.lockStatue,updateLockStatue:t.updateLockStatue,urlsDecision:t.state.urlsDecision,getNextLoop:0!=a?t.getAccompanyLoop:t.getMainLoop,updateDecision:t.updateDecision,toggleSequencer:t.toggleSequencer,updateLoadStatue:t.updateLoadStatue,updateVolmes:t.updateVolmes,server_url:t.state.server_url})})),this.state.sequencer&&o.a.createElement(f,{server_url:this.state.server_url,volumes:this.state.volumes,urlsDecision:this.state.urlsDecision}))}}]),e}(s.Component);a(18),a(19);u.a.render(o.a.createElement(j,null),document.getElementById("root"))}},[[11,1,2]]]);
//# sourceMappingURL=main.caed5eb5.chunk.js.map