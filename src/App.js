import React, {Component} from 'react'
import './App.css'

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
    "I declare bankruptcy!": "ideclarebankruptcy.mp4",
    "What a l***r": "whataloser.mp4",
    "I earned so many badges": "iearnedsomanybadges.mp4",
    "So long, l***rs": "solonglosers.mp4",
    "You can never have too many": "youcanneverhavetoomanypokemon.mp4",
    "No invitation, no party": "noinvitationnoparty.mp4",
    "I'll steal it": "illstealit.mp4",
    "YES! YES!": "yes.mp4",
    "It's only game, why mad?": "itsonlygame.mp4",
    "Why are we still here?": "whyarewestillhere.mp4",
    "They played us like a fiddle": "playeduslikeadamnfiddle.mp4",
}

class App extends Component {
    constructor() {
        super()
        this.ws = null
        this.msgIds = []
        this.state = {
            queue: [],
            iterations: 0,
            connected: false,
        }
        this.onVideoEnd = this.onVideoEnd.bind(this)
    }

    componentDidMount() {
        this.connectWS()
        this.refreshTimer = setInterval(() => window.location.reload(), 3600000)
    }

    componentWillUnmount() {
        if (this.ws) this.ws.close()
        clearInterval(this.refreshTimer)
    }

    connectWS() {
        // Get WebSocket URL from URL parameters or use default
        const urlParams = new URLSearchParams(window.location.search);
        const wsUrl = urlParams.get('ws') || 'ws://localhost:6789';
        
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
            console.log('WebSocket connected to', wsUrl)
            this.setState({connected: true})
        }

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                console.log('Received message:', msg);
                if (msg.type !== 'channel_point_reward_redemption_add') {
                    return;
                }
                const data = msg.extra_parameters;
                if (this.msgIds.includes(data.id)) {
                    return;
                }
                this.msgIds.push(data.id);
                const title = data.reward.title;
                console.log('Title:', title);
                const filename = VIDEO_FILENAMES[title];
                if (!filename) {
                    return;
                }
                this.setState(prev => ({queue: [...prev.queue, filename]}));
            } catch (e) {
                console.error('Failed to parse message', e);
            }
        }

        this.ws.onclose = () => {
            console.log('WebSocket disconnected, reconnecting in 1s...')
            this.setState({connected: false})
            setTimeout(() => this.connectWS(), 1000)
        }

        this.ws.onerror = (err) => console.error('WebSocket error', err)
    }

    onVideoEnd() {
        this.setState(prev => ({queue: prev.queue.slice(1), iterations: prev.iterations + 1}))
    }

    render() {
        const {queue, iterations, error_msg} = this.state
        let video = null
        if (queue.length > 0) {
            const src = '/videos/' + queue[0]
            video = (
                <video width="320" height="288" autoPlay onEnded={this.onVideoEnd} onError={this.onVideoEnd} key={iterations}>
                    <source src={src} type="video/mp4" />
                </video>
            )
        }
        return (
            <div className="App">
                {!this.state.connected && <div>Connecting... nya~</div>}
                {error_msg && <div className="error">Error: {error_msg}</div>}
                {video}
            </div>
        )
    }
}

export default App
