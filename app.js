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
    test: function(){
      var datax = 'works';
      this.$set(this,'events', datax);
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
      .then(data => this.$set(this,'rawRoster', data));
    },
    pickRoster: function(){
      this.game.roster = this.rawRoster;
    }
  }
});

Vue.component('my-component', {
  template: '<div>A custom component!</div>'
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