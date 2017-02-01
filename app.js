var app = new Vue({
  el: '#app',
  data: {
    rawRoster: [],
    events: '',
    // Base game setup
    game: {
      players:[],
      goal: 0,
      news: [],
      roster:[],
      stories: [],
      gimmicks:[],
      tv:4,
      arena:4,
      legends:[]
    },
    player: {
      name: '',
      cash:50,
      roster:[],
      stories:[],
      gimmicks:[],
      goal:0,
      tokens: 0
    },
    currentPlayer:0
  },
  mounted: function() {
  this.getRoster();
  },
  methods: {
    nextPlayer: function(){
      this.currentPlayer + 1 == this.game.players.length ? this.currentPlayer = 0 : this.currentPlayer++;
    },
    fetchEvents: function(){
      fetch('/data.json')
      .then(blob => blob.json())
      .then(data => this.$set(this,'todos', data));
    },
    newPlayer: function(){
      this.game.players.push(this.player);
    },
    getRoster:function(){
      fetch('/roster.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawRoster', data); localStorage.setItem('roster', JSON.stringify(data))});
    },
    pickRoster: function(){
      this.game.roster = this.rawRoster.map(w => w.Id);
    }
  },
  components: {
    'wrestler': {
      props: ['data'],
      template: '<div class="box">\
      <h2>{{data.Name}}</h2>\
      ({{data.Val}}) <a v-on:click="increment()">Purchase</a>\
      </div>',
      methods: {
        increment: function () {
          console.log(this.data.Name)
          app.$emit('nextPlayer', 'switch to' + this.data.Id);
        }
      }
    }
  }
});

app.$on('nextPlayer', function (msg) {
  this.nextPlayer();
})

/*
//
SETUP
- Json files for each data list get
- Store to localstorage if not found (browser based game)
- Intro page for setting up game. set num players (with names), 
divide up roster purchase, share cards and missions. When game setup go
to main game page.

MAIN
- If no storage token revert to setup
- do not copy data and keep records, use lookup functions to find data
from storage and use ids in references.
- 4 phase
  - purchases/plans (vote for hosting wchamp, buy extra cards)
  - build card (make matches, add gimmicks)
  - present and accumulate (tally costs, award highest draw)
  - news card draw and action (each player served one action)
  x 12 rounds (1 year)
Following final round tally all $ and award winner
//
*/