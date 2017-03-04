var game = new Vue({
  el: '#game',
  data: {
    // Initialised data
    roster: [],
    // No missions. Once set new ones cant be bought
    //missions: [],
    stories: [],
    gimmicks: [],
    legends: [],
    news:[],
    game:[],
    // In game values
    turn: 0,
    matchcard: [],
    match: {
      story: null,
      gimmick: null,
      gimmickAffect:null,
      competitors:[],
      winner: null,
      loser: null
    },
    popRoster:false,
    currentMatch:false,
    currentPos:false
  },
  mounted: function() {
  this.loadRoster();
  this.loadStories();
  this.loadGimmicks();
  this.loadLegends();
  this.loadNews();
  this.loadGame();
  //this.loadMissions();
  this.setMatchcard();
  },
  methods: {
    // Lets get started
    loadRoster:function(){
      this.$set(this,'roster', JSON.parse(localStorage.getItem('roster')));
    },
    loadStories:function(){
      this.$set(this,'stories', JSON.parse(localStorage.getItem('stories')));
    },
    loadGimmicks:function(){
      this.$set(this,'gimmicks', JSON.parse(localStorage.getItem('gimmicks')));
    },
    loadLegends:function(){
      this.$set(this,'legends', JSON.parse(localStorage.getItem('legends')));
    },
    loadNews:function(){
      this.$set(this,'news', JSON.parse(localStorage.getItem('news')));
    },
    // loadMissions:function(){
    //   this.$set(this,'missions', JSON.parse(localStorage.getItem('missions')));
    //   console.log(this.missions);
    // },
    loadGame:function(){
      this.$set(this,'game', JSON.parse(localStorage.getItem('gameData')));
    },
    // IN GAME
    nextTurn: function(){
      this.turn++;
      if(this.turn == this.game.players.length){this.turn = 'REVIEW'; this.summarize()}
    },
    sumValues: function(val){
      let totalGain = 0;
      val.matchcard.forEach(function(match){
        console.log(match);
        if(match.competitors[0] && match.competitors[1]){
          let matchSum = (game.findWrestler(match.competitors[0]).val + game.findWrestler(match.competitors[0]).inc) + (game.findWrestler(match.competitors[1]).val + game.findWrestler(match.competitors[1]).inc);
          console.log(matchSum);
          totalGain += matchSum;
        }
      });
      val.cash += totalGain;
    },
    summarize: function(){
      console.clear();
       this.game.players.forEach(function(value) {
        game.sumValues(value);
       });
    },
    nextRound: function(){
     this.game.round++;
     this.turn = 0;
     this.saveData();
    },
    saveData: function(){
      localStorage.setItem('gimmicks', JSON.stringify(this.roster));
      localStorage.setItem('news', JSON.stringify(this.roster));
      localStorage.setItem('roster', JSON.stringify(this.roster));
      localStorage.setItem('gameData', JSON.stringify(this.game));
      console.log('data saved');
    },
    setMatchcard: function(){
      var match = Object.assign({}, this.match);
      this.game.players.forEach(function (value) {
        value.matchcard = [];
        // 3 match default
        value.matchcard.push(JSON.parse(JSON.stringify(match)));
        value.matchcard.push(JSON.parse(JSON.stringify(match)));
        value.matchcard.push(JSON.parse(JSON.stringify(match)));
        value.temproster = Array.from(value.roster);
      });
    },
    findWrestler: function(id){
      var result = null;
      this.roster.forEach(wrestler => {
        if(wrestler.Id == id){
          //console.log(wrestler)
          result = wrestler;
        }
      });
      if(!result){return}
      return result;
    },
    openRoster: function (matchno, card) {
      console.log('match ' + matchno + ', card ' + card);
      this.currentMatch = matchno;
      this.currentPos = card;
      const poproster = document.querySelector('.poproster');
      poproster.style.top = `${event.pageY + 10}px`;
      poproster.style.left = `${event.pageX + 10}px`;
      //console.log(event);
      this.popRoster = true;
    },
    closePop: function(){
      this.popRoster = false;
      console.log('close');
    },
    addToCard: function(wrestler, id){
      console.log(this.currentMatch, this.currentPos, wrestler, id);
      this.game.players[this.turn].matchcard[this.currentMatch].competitors[this.currentPos] = id;
      this.game.players[this.turn].temproster.splice(wrestler, 1);
      game.$forceUpdate();
      this.closePop();
    }
  }
});

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