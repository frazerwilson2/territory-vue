var game = new Vue({
  el: '#game',
  data: {
    // Initialised data
    roster: [],
    // No missions. Once set new ones cant be bought
    //missions: [],
    stories: [],
    gimmicks: [],
    legends: '',
    legendRoster:'',
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
      loser: null,
      ready:false
    },
    popRoster:false,
    popGimmick:false,
    popStory:false,
    currentMatch:false,
    currentPos:false,
    summaryValues:[],
    validate:false,
    titleCards: false,
    showStore:false,
    dS: [
      {'name':'one',height:80,ability:80,type:'strong'},
      {'name':'two',height:10,ability:90,type:'big'}
    ],
    ex: ['height:>10','type:=strong']
  },
  mounted: function() {
  this.loadRoster();
  this.loadStories();
  this.loadGimmicks();
  this.loadLegends();
  //this.createData('x');
  this.loadNews();
  this.loadGame();
  //this.loadMissions();
  this.setMatchcard();
  this.summRes(this.dS, this.ex);
  },
  methods: {
    detailX: function(x, y, z){
      console.log(this.listReqs(x));
      var data = [y,z];
    },
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
       const legendlist = JSON.parse(localStorage.getItem('legends'));
      this.createData(legendlist);
    },
    createData: function(data){
      this.legendRoster = data;
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
      game.validate = false;
      this.game.players[this.turn].matchcard.forEach(function(match){
        // make sure matches are ready
        if(!match.ready){game.validate = true;}
      });
      if(this.validate == true) {return;} 
      else {
        this.turn++;
        if(this.turn == this.game.players.length){this.turn = 'REVIEW'; this.summarize()}
      }
    },
    sumValues: function(val, index){
      let totalGain = 0;
      val.matchcard.forEach(function(match){
        if(match.competitors[0] && match.competitors[1]){
          let matchSum = (game.findWrestler(match.competitors[0]).val + game.findWrestler(match.competitors[0]).inc) + (game.findWrestler(match.competitors[1]).val + game.findWrestler(match.competitors[1]).inc);
          if (match.gimmick){matchSum += 5; game.game.players[index].discards.gimmicks.push(match.gimmick)}
          if(match.gimmickAffect){game.affectGimmick(match)}
          if(match.story){
            const matchStoryDetail = game.findStory(match.story);
            if(matchStoryDetail.current == matchStoryDetail.lengthDur){
              matchSum += 5;
              game.game.players[index].discards.stories.push(match.story);
              game.game.players[index].stories.forEach(function(val,key){
                if(val == match.story){game.game.players[index].stories.splice(key,1)}
              })
            }
            else {
              matchStoryDetail.current++;
            }
          }
          game.summaryValues[index].matches.push(matchSum);
          totalGain += matchSum;
        }
      });
      game.summaryValues[index].total = totalGain;
      val.cash += totalGain;
    },
    incWinners: function(val, index){
      val.matchcard.forEach(function(match){
        if(match.winner == match.competitors[0]){
          game.findWrestler(match.competitors[0]).inc >= 3 ? game.findWrestler(match.competitors[0]).inc = 3 : game.findWrestler(match.competitors[0]).inc++;
          game.findWrestler(match.competitors[1]).inc = 0;
        }
        else {
          game.findWrestler(match.competitors[1]).inc >= 3 ? game.findWrestler(match.competitors[1]).inc = 3 : game.findWrestler(match.competitors[1]).inc++;
          game.findWrestler(match.competitors[0]).inc = 0;
        }
      });
    },
    affectGimmick: function(matchdet){
      var gimmickdetail = this.findGimmick(matchdet.gimmick);
      switch(gimmickdetail.type){
       case 'HEELFACE':
        console.log('switch the gimmick affect heelface');
        game.roster.forEach(function(val, key){
          if(val.Id == matchdet.gimmickAffect){
            console.log(game.roster[key].Name + game.roster[key].heelface + ' turns!');
            game.roster[key].heelface === 'H' ? game.roster[key].heelface = 'F' : game.roster[key].heelface = 'H';
          }
        });
        break;
       case 'TITLECHANGE':
        game.roster.forEach(function(val, key){
          if(val.Id == matchdet.competitors[0] || val.Id == matchdet.competitors[1]){
            game.roster[key].isChamp = false;
          }
          if(val.Id == matchdet.gimmickAffect){
            game.roster[key].isChamp = true;
            alert(game.roster[key].Name + ' is new champ!');
          }
        });
        break;
      }
    },
    summarize: function(){
        game.summaryValues = [];
        this.game.players.forEach(function(value, index) {
        game.summaryValues.push({'matches':[],'bonus':[], 'total':0});
        game.sumValues(value, index);
        game.incWinners(value, index);
       });
        game.awardTopDraw();
    },
    indexOfMax: function(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
    },
    awardTopDraw: function(){
      let drawTotals = [];
      game.summaryValues.forEach(val=>drawTotals.push(val.total));
      var i = this.indexOfMax(drawTotals);
      this.game.players[i].tokens++;
    },
    nextRound: function(){
      this.setMatchcard();
      this.game.round++;
      this.turn = 0;
      this.saveData();
    },
    saveData: function(){
      //localStorage.setItem('gimmicks', JSON.stringify(this.gimmicks));
      //localStorage.setItem('news', JSON.stringify(this.news));
      localStorage.setItem('stories', JSON.stringify(this.stories));
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
    findGimmick: function(id){
      var result = null;
      this.gimmicks.forEach(gimmick => {
        if(gimmick.Id == id){
          result = gimmick;
        }
      });
      if(!result){return}
      return result;
    },
    findStory: function(id){
      var result = null;
      this.stories.forEach(story => {
        if(story.Id == id){
          result = story;
        }
      });
      if(!result){return}
      return result;
    },
    openRoster: function (matchno, card) {
      //game.roster[0].isChamp = true;
      this.currentMatch = matchno;
      this.currentPos = card;
      const poproster = document.querySelector('.poproster');
      poproster.style.top = `${event.pageY + 10}px`;
      poproster.style.left = `${event.pageX + 10}px`;
      //console.log(event);
      this.popRoster = true;
    },
    openGimmick: function(matchno){
      this.currentMatch = matchno;
      const selectedMatch = this.game.players[this.turn].matchcard[this.currentMatch];
      if(this.findWrestler(selectedMatch.competitors[0]).isChamp || this.findWrestler(selectedMatch.competitors[1]).isChamp) {this.titleCards = true;}
      else {this.titleCards = false;}
      const popgimmick = document.querySelector('.popgimmick');
      popgimmick.style.top = `${event.pageY + 10}px`;
      popgimmick.style.left = `${event.pageX + 10}px`;
      this.popGimmick = true;
    },
    openStory:function(matchno){
      this.currentMatch = matchno;
      const selectedMatch = this.game.players[this.turn].matchcard[this.currentMatch];
      const popstory = document.querySelector('.popstory');
      popstory.style.top = `${event.pageY + 10}px`;
      popstory.style.left = `${event.pageX + 10}px`;
      this.popStory = true;
    },
    closePop: function(){
      this.popRoster = false;
      this.popGimmick = false;
      this.popStory = false;
    },
    addToCard: function(wrestler, id){
      this.game.players[this.turn].matchcard[this.currentMatch].competitors[this.currentPos] = id;
      this.game.players[this.turn].temproster.splice(wrestler, 1);      
      this.closePop();
      this.game.players[this.turn].matchcard[this.currentMatch].ready = this.validateMatch(this.game.players[this.turn].matchcard[this.currentMatch]);
      game.$forceUpdate();
    },
    addGimmickCard:function(gimmick, index){
      this.game.players[this.turn].matchcard[this.currentMatch].gimmick = gimmick;
      this.game.players[this.turn].gimmicks.splice(index, 1);
      this.closePop();
      if(this.findGimmick(gimmick).affect == 'true'){this.game.players[this.turn].matchcard[this.currentMatch].gimmickAffect = this.game.players[this.turn].matchcard[this.currentMatch].competitors[0]}
      if(this.findGimmick(gimmick).type == 'TITLECHANGE') {
        if(this.findWrestler(this.game.players[this.turn].matchcard[this.currentMatch].competitors[0]).isChamp == true) {
          this.game.players[this.turn].matchcard[this.currentMatch].gimmickAffect = this.game.players[this.turn].matchcard[this.currentMatch].competitors[1];
          this.game.players[this.turn].matchcard[this.currentMatch].winner = this.game.players[this.turn].matchcard[this.currentMatch].competitors[1];
        } else {
          this.game.players[this.turn].matchcard[this.currentMatch].gimmickAffect = this.game.players[this.turn].matchcard[this.currentMatch].competitors[0];
          this.game.players[this.turn].matchcard[this.currentMatch].winner = this.game.players[this.turn].matchcard[this.currentMatch].competitors[0];
        }
      }  
    },
    addStoryCard: function(story, index){
      this.game.players[this.turn].matchcard[this.currentMatch].story = story;
      const storyDetail = this.findStory(story);
      storyDetail.active = true;
      storyDetail.competitors = this.game.players[this.turn].matchcard[this.currentMatch].competitors;
      this.closePop();
    },
    removeMatch: function(player, match){
      this.game.players[this.turn].matchcard.splice(match, 1);
      game.$forceUpdate();
    },
    validateMatch: function(match){
      let ready = false;
      if(match.competitors.length > 1){ready = true};
      match.winner ? ready = true : ready = false;
      //console.log(match, ready);
      return ready;
    },
    setWinner: function(match, winner, matchno){
      //console.log(match, winner);
      this.currentMatch = matchno;
      match.winner = winner;
      game.game.players[this.turn].matchcard[this.currentMatch].ready = this.validateMatch(match);
      game.$forceUpdate();
    },
    // store
    openStore:function(show){
      this.showStore = show;//
    },
    purchaseRoster:function(wrestler, cost){
      if(game.game.players[this.turn].cash <= cost){return}
      game.game.players[this.turn].roster.push(wrestler);
      game.game.players[this.turn].cash -= cost;
      game.game.roster.forEach(function(val, index){
        if(wrestler == val){game.game.roster.splice(index, 1);}
      });
    },
    purchaseLegend:function(legend, cost){
      if(game.game.players[this.turn].cash <= cost){return}
      game.game.players[this.turn].legends.push(legend);
      game.game.players[this.turn].cash -= cost;
      game.legendRoster.forEach(function(val, index){
        if(legend == val){game.legendRoster.splice(index, 1);}
      });
    },
    purchaseGimmick:function(){
      if(game.game.players[this.turn].cash <= 5){return}
      game.game.players[this.turn].cash -= 5;
      game.game.players[this.turn].gimmicks.push(game.game.gimmicks[0]);
      game.game.gimmicks.splice(0, 1);
    },
    purchaseStory:function(){
      if(game.game.players[this.turn].cash <= 5){return}
      game.game.players[this.turn].cash -= 5;
      game.game.players[this.turn].stories.push(game.game.stories[0]);
      game.game.stories.splice(0, 1);
    },
    getTv:function(){
      if(game.game.players[this.turn].cash <= 20){return}
      game.game.players[this.turn].cash -= 20;
      game.game.players[this.turn].tv++;
      game.game.tv--;
    },
    getArena:function(){
      if(game.game.players[this.turn].cash <= 50){return}
      game.game.players[this.turn].cash -= 50;
      game.game.players[this.turn].arena++;
      game.game.arena--;
    },
    checkNum: function(thing){
      if(thing){var result = thing.length}
      if(result) {return false}
      else {return true}
    },
    rC: function(input, check){
      var comp = check.split(':');
      var pars = parseInt(comp[1].substring(1));
      var result;
      if(comp[1][0] == '>') {
        result = input[comp[0]] >= pars
      }
      else if(comp[1][0] == '<'){
        result = input[comp[0]] <= pars;
      }
      else {
        result = input[comp[0]] == comp[1].substring(1);
      }
      return result;
    },
    summRes: function(data, check){
      if(this.rC(data[0], check[0]) && this.rC(data[1], check[1]) || this.rC(data[1], check[0]) && this.rC(data[0], check[1])){        
        return true;
      } else {
        return false;
      }
    },
    myStory: function(story, competitors){
      // story is active and does not contain these two guys => true
      let storyDetail = this.findStory(story);
      if(storyDetail.active){
        if(storyDetail.competitors[0] == competitors[0] || storyDetail.competitors[0] == competitors[1]){
          if(storyDetail.competitors[1] == competitors[0] || storyDetail.competitors[1] == competitors[1]){
            return false;
          }
          else {return true;}
        }
        else {return true;}
      }
      else {
        return false;
      }
    },
    listReqs: function(input){
      var msg = this.textReq(input[0]);
      msg += ', ';
      msg += this.textReq(input[1]);
      return msg;
    },
    textReq: function(r){
      var split = r.split(':');
      var msg = 'guy with ';
      msg += split[0];
      if(split[1][0] == '>'){msg += ' more than ' + split[1].substring(1)}
      if(split[1][0] == '<'){msg += ' less than ' + split[1].substring(1)}
      if(split[1][0] == '='){msg += ': ' + split[1].substring(1)}
      return msg;
    }
  }
});

/*
//
SETUP
*- Json files for each data list get
*- Store to localstorage if not found (browser based game)
*- Intro page for setting up game. set num players (with names), 
*divide up roster purchase, share cards and missions. When game setup go
to main game page.

MAIN
- If no storage token revert to setup
*- do not copy data and keep records, use lookup functions to find data
from storage and use ids in references.
- 4 phase
  - purchases/plans (vote for hosting wchamp, buy extra cards)
  - build card (make matches, add gimmicks)
  - present and accumulate (tally costs, award highest draw)
  - news card draw and action (each player served one action)
  x 12 rounds (1 year)
Following final round tally all $ and award winner
//


NEXT STEPS
// SETUP
*- summary display values (per match breakdown)
- validate choices (match with 1 wrestler, type mismatch, select winner)
*- winner inc, loser inc reset
*- reset temproster and matchcard for next round
*- award round winner with token

// GIMMICK
*- add to match (remove from users set)
- remove (return to users set)
*- count value in match rating
*- add card to players discard gimmick pile
*- enact actions (change title, heel/face turns)

// STORIES
*- add story to match (if applicable)
*- increment length in summary
*- end if reached payoff, payoff added to match, card added to discard

// LEGENDS
- added to matchcard roster (distinguish type to avoid id clash)
- prevent story or title switch/heelface gimmick
- check values tracked
- inc amount used on players record (eqiv of added to discard pile)

// ARENA / TV
- increment arena when bought (equiv of discard)
- flag to double in summary
- add bonus double the total of matches
- increment tv when bought (equiv of discard)
- add additional match

// STORE
*- buy gimmick
*- buy roster
*- buy story
*- buy legend
*- buy tv time (extra match)
*- buy stadium (double value)

// WCHAMP (awards based on scores, vote for hire, use tokens to switch)
- begin with question, then vote (return true/false) (unless has champ)
- rules for getting champ on loan, goes to matchcard, pay 10 (to owner if owned)
- rules for award: everyone gets 10 when on highest.
- rules for switch: use 3 tokens (to discard) then autofix the match/opponent/winner
- setting for champowner to navigate other functions

// NEWS
- draw news card beginning of each player switch
- enact based on name (each has specific rules)

// MISSIONS

// END GAME (end after 12, tally totals(with missions) and announce winner)

// WRAP UP
- remove from card (re-add to temproster)
- remove gimmick from matchcard
- if no data of any kind reload from storage (if no storage note error then return to index)


*/