var app = new Vue({
  el: '#app',
  data: {
    rawRoster: [],
    rawMissions: [],
    rawStories: [],
    rawGimmicks: [],
    rawLegends: [],
    rawNews:[],
    events: '',
    titleScreen: true,
    addPlayers: false,
    pickRosterView: false,
    // Base game setup
    game: {
      players:[],
      goal: 0,
      news: [],
      roster:[],
      stories: [],
      gimmicks:[],
      wChamp:3,
      tv:4,
      arena:4,
      legends:[],
      round: 1,
      champLoan: null
    },
    currentPlayer:0,
    loading: false,
  },
  mounted: function() {
  this.getRoster();
  console.log(this.game);
  },
  methods: {
    newPlayer: function(){
      var nextup = {
        name: '',
        cash:50,
        roster:[],
        stories:[],
        gimmicks:[],
        news: false,
        goal:0,
        tokens: 0,
        arena: false,
        tv: 0,
        legends:[],
        discards:{gimmicks:[],stories:[],tv:0,arena:0,tokens:0,spend:0},
        ready: false,
        champSet: false,
        hasWChamp: false
      };
      this.game.players.push(nextup);
      this.titleScreen = false;
      this.addPlayers = true;
    },
    getRoster:function(){
      fetch('/roster.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawRoster', data); localStorage.setItem('roster', JSON.stringify(data))});
    },
    pickRoster: function(){
      this.game.roster = this.rawRoster.map(w => w.Id);
      this.pickRosterView = true;
      this.addPlayers = false;
    },
    // The setup roster pick
    addToRoster: function(data){
      this.game.players[this.currentPlayer].roster.push(data.id);
      this.game.players[this.currentPlayer].cash -= data.val;
      for(var i=0;i<this.game.roster.length;i++){
        if(this.game.roster[i] == data.id){this.game.roster.splice(i, 1)}
      }
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
        this.loading = true;
        this.loadUpData();
      }
      else {
        this.nextPlayer();  
      }     
    },
    loadUpData: function(){
      this.getLegends();
      this.getMissions();
      this.getStories();
      this.getGimmicks();
      this.getNews();
    },
    saveData: function(){
      console.log(this.game);
        localStorage.setItem('gameData', JSON.stringify(this.game));
        setTimeout(window.location = '/game.html', 5000);
    },
    // Get data & assign
    shuffle: function(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
      }
    },
    getMissions:function() {
      fetch('/missions.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawMissions', data); localStorage.setItem('missions', JSON.stringify(data)); this.sortMissions()})
    },
    sortMissions: function(){
      var playerMissions = this.rawMissions.filter(mission => mission.type == "player");
      this.shuffle(playerMissions);
      for(var i=0;i<this.game.players.length;i++){
        this.game.players[i].goal = playerMissions[i].Id;
      }
      var gameMissions = this.rawMissions.filter(mission => mission.type == "game");
      this.shuffle(gameMissions);
      this.game.goal = gameMissions[0].Id;
      //this.saveData();
    },
    getStories:function() {
      fetch('/stories.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawStories', data); localStorage.setItem('stories', JSON.stringify(data)); this.sortStories()})
    },
    sortStories: function(){
      this.shuffle(this.rawStories);
      var pick = 0;
      var eachCards = 3;
      for(var i=0;i<this.game.players.length;i++){
        for(var x=0;x<eachCards;x++){
          this.game.players[i].stories.push(this.rawStories[pick + x].Id);
        }
        pick += eachCards;
      }
      for(var i=pick;i<this.rawStories.length;i++){
        this.game.stories.push(this.rawStories[i].Id);
      }
      //this.saveData();
    },
    getGimmicks:function() {
      fetch('/gimmicks.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawGimmicks', data); localStorage.setItem('gimmicks', JSON.stringify(data)); this.sortGimmicks()})
    },
    sortGimmicks: function(){
      for(var i=0;i<this.rawGimmicks.length;i++){
        switch(this.rawGimmicks[i].type){
          case 'TITLECHANGE':
            for(var x=0;x<this.game.players.length;x++){
              for(var y=0;y<3;y++){
                this.game.players[x].gimmicks.push(this.rawGimmicks[i].Id);
              }
            }
            for(var y=0;y<3;y++){
              this.game.gimmicks.push(this.rawGimmicks[i].Id);
            }
            break;
          case 'HEELFACE':
            for(var x=0;x<this.game.players.length;x++){
              for(var y=0;y<3;y++){
                this.game.players[x].gimmicks.push(this.rawGimmicks[i].Id);
              }
            }
            for(var y=0;y<3;y++){
              this.game.gimmicks.push(this.rawGimmicks[i].Id);
            }
            break;
          default:
            for(var y=0;y<10;y++){
               this.game.gimmicks.push(this.rawGimmicks[i].Id);
            }
        }
      }
      this.shuffle(this.game.gimmicks);
      //this.saveData();
    },
    getLegends:function() {
      fetch('/legends.json')
      .then(blob => blob.json())
      .then((data) => {
        this.$set(this,'rawLegends', data); 
        localStorage.setItem('legends', JSON.stringify(data)); this.shuffle(data); 
        this.game.legends = data.map(data => data.Id);})
      //this.saveData();
    },
    getNews:function() {
      fetch('/news.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawNews', data); localStorage.setItem('news', JSON.stringify(data)); this.shuffle(data); this.game.news = data.map(data => data.Id);})
      console.log(this.game);
      //this.saveData();
    }
  },
  components: {
    'wrestler': {
      props: ['data', 'cash'],
      template: '<div class="chara_box" v-bind:class="{ assigned: data.assigned || !cash }">\
      <div class="num">{{data.val}}</div>\
      <h2>{{data.Name}}</h2>\
      <img v-bind:src="\'images/\' + imgPath(data.Name) + \'.jpg\'" />\
      <a class="button is-dark" v-on:click="purchaseRoster()" v-if="!data.assigned">Purchase</a>\
      <span v-if="data.type == \'tag\'">TAG</span>\
      <span>{{data.gender}}</span>\
      </div>',
      methods: {
        purchaseRoster: function () {
          this.data.assigned = true;
          app.$emit('addToRoster', {id:this.data.Id, val:this.data.val});
          app.$emit('nextPlayer', 'switch to' + this.data.Id);
        },
        imgPath: function (path) {
          return path.replace(/ /g,'');
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