import React, {Component} from 'react'
import './App.css'

import {RefreshingAuthProvider} from '@twurple/auth'
import {PubSubClient} from '@twurple/pubsub'

const TOKENS_KEY = 'tokens8.json'

const ARGS = window.location.hash.slice(1).split('/')
const CLIENT_ID = ARGS[0]
const CLIENT_SECRET = ARGS[1]

const og = window.localStorage.getItem('og')
if(og !== window.location.hash) {
    const tokenData = {
        "accessToken": ARGS[2],
        "expiresIn": 0,
        "obtainmentTimestamp": 0,
        "refreshToken": ARGS[3]
    }
    window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokenData))
    window.localStorage.setItem('og', window.location.hash)
}


const VIDEO_FILENAMES = {
    'Drying pan': 'dryingpan.mp4',
    'Eeeeeh?': 'eeeeeh.mp4',
    'Emotional damage': 'emotionaldamage.mp4',
    "I'm stupid?": 'imstupid.mp4',
    "Moment of tooth": 'momentoftooth.mp4',
    "If it's not fun, why bother?": 'notfunwhybother.mp4',
    "Skill issue": 'skillissue.mp4',
    "What the hell was that!?": 'whatthehellwasthat.mp4',
    'Nice': 'nice.mp4',
    'Jelly-filled donut': 'jellydonut.mp4',
    'Stop it, get some help': 'stopitgetsomehelp.mp4',
    'Slow clap': 'slowclap.mp4',
    'Your team sucks': 'yourteamsucks.mp4',
    'The memes...': 'thememes.mp4',
    "Now that's a lotta damage": 'nowthatsalottadamage.mp4',
    "El Risitas Laugh": 'spanishlaughingguy.mp4',
    "Wow": 'wow.mp4',
    "Brutal, savage, rekt": 'brutalsavagerekt.mp4',
    "Ice guns we're packing": 'iceguns.mp4',
    'Enjoy your gaming': 'enjoyyourgaming.mp4',
    'Omae wa mou shindeiru': 'omaewamoushindeiru.mp4',
    'Standing here I realize': 'standinghereirealize.mp4',
    'You ****': 'youfool.mp4',
    'No god please no': 'nogodpleaseno.mp4',
    'Pokemon is the enemy': 'pokemonphenomenonistheenemy.mp4',
    'Space communism': 'spacecommunism.mp4',
    'Time to leave them all behind': 'timetoleavethemallbehind.mp4',
    'What! What the ****!': 'whatwhatthefuck.mp4',
    'You lose! Good day sir!': 'youlosegooddaysir.mp4',
    'Rickroll': 'rickroll.mp4',
    "I can't handle the truth": 'icanthandlethetruth.mp4',
    "Banished to the shadow realm": 'shadowrealm.mp4',
    "Let's rev it up": 'letsrevitup.mp4',
    "Anime was a mistake": 'animewasamistake.mp4',
    "Rich Evans Laugh": 'richevanslaugh.mp4',
    "Memes, the DNA of the soul": 'memesdnaofthesoul.mp4',
    "Do it": "doit.mp4",
    "Unlimited power!": "unlimitedpower.mp4",
    "What am I fighting for!?": "whatamifightingfor.mp4",
}

class App extends Component {
    constructor() {
        super()
        this.listener = null
        this.state = {
            'queue': [],
            'iterations': 0,
            'connected': false
        }
        this.msgIds = []
        this.onVideoEnd = this.onVideoEnd.bind(this)
    }
    componentDidMount() {
        this.auth()
    }
    componentWillUnmount() {
        if(this.listener) this.listener.remove()
    }
    async auth() {
        const tokenData = JSON.parse(window.localStorage.getItem(TOKENS_KEY))
        const authProvider = new RefreshingAuthProvider(
            {
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                onRefresh: newTokenData => window.localStorage.setItem(TOKENS_KEY, JSON.stringify(newTokenData))
            },
            tokenData
        )
        const pubSubClient = new PubSubClient()
        const userId = await pubSubClient.registerUserListener(authProvider)
        this.setState({'connected': true})
        this.listener = await pubSubClient.onRedemption(userId, (message) => {
            if(this.msgIds.includes(message.id)) return
            if(!VIDEO_FILENAMES[message.rewardTitle]) return
            this.msgIds.push(message.id)
            const queue = [...this.state.queue]
            queue.push(VIDEO_FILENAMES[message.rewardTitle])
            this.setState({'queue': queue})
        })
    }
    onVideoEnd() {
        const queue = [...this.state.queue]
        queue.shift()
        this.setState({
            'queue': queue,
            'iterations': this.state.iterations + 1
        })
        console.log(queue)
    }
    render() {
        let video = null
        if(this.state.queue.length > 0) {
            const filename = this.state.queue[0]
            video = <video width="320" height="288" autoPlay onEnded={this.onVideoEnd} onError={this.onVideoEnd} key={this.state.iterations}>
                <source src={'/videos/' + filename} type="video/mp4" />
            </video>
        }
        let error = null
        if(this.state.error_msg) {
            error = <div className="error">Error: {this.state.error_msg}</div>
        }
        return (
            <div className="App">
                {error}
                {video}
            </div>
        )
    }
}

export default App
