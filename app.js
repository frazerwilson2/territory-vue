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
    currentPlayer:0
  },
  mounted: function() {
  this.getRoster();
  },
  methods: {
    newPlayer: function(){
      var nextup = {
        name: '',
        cash:50,
        roster:[],
        stories:[],
        gimmicks:[],
        goal:0,
        tokens: 0,
        ready: false
      };
      this.game.players.push(nextup);
    },
    getRoster:function(){
      fetch('/roster.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawRoster', data); localStorage.setItem('roster', JSON.stringify(data))});
    },
    pickRoster: function(){
      this.game.roster = this.rawRoster.map(w => w.Id);
    },
    // The setup roster pick
    addToRoster: function(data){
      this.game.players[this.currentPlayer].roster.push(data.id);
      this.game.players[this.currentPlayer].cash -= data.val;
    },
    nextPlayer: function(){
      this.currentPlayer + 1 == this.game.players.length ? this.currentPlayer = 0 : this.currentPlayer++;
      if(this.game.players[this.currentPlayer].ready){this.nextPlayer()}
    },
    donePurchase: function(){
      this.game.players[this.currentPlayer].ready = true;
      var readyCount = 0;
      for(var i=0;i<this.game.players.length;i++){
        if (this.game.players[i].ready) {readyCount++}
      }
      if(readyCount == this.game.players.length) {
        alert('lets play');
      }
      else {
      this.nextPlayer();  
      }     
    }
  },
  components: {
    'wrestler': {
      props: ['data', 'cash'],
      template: '<div class="box" v-bind:class="{ assigned: data.assigned || !cash }">\
      <h2>{{data.Name}} ({{data.val}})</h2>\
      ({{data.Val}}) <a v-on:click="purchaseRoster()" v-if="!data.assigned">Purchase</a>\
      </div>',
      methods: {
        purchaseRoster: function () {
          this.data.assigned = true;
          app.$emit('addToRoster', {id:this.data.Id, val:this.data.val});
          app.$emit('nextPlayer', 'switch to' + this.data.Id);
        }
      }
    }
  }
});

app.$on('nextPlayer', function (x) {
  this.nextPlayer();
})
app.$on('addToRoster', function (data) {
  this.addToRoster(data);
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