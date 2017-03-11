'use strict';

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
    legendRoster: '',
    news: [],
    game: [],
    // In game values
    turn: 0,
    matchcard: [],
    match: {
      story: null,
      gimmick: null,
      gimmickAffect: null,
      competitors: [],
      winner: null,
      loser: null,
      ready: false
    },
    popRoster: false,
    popGimmick: false,
    currentMatch: false,
    currentPos: false,
    summaryValues: [],
    validate: false,
    titleCards: false,
    showStore: false
  },
  mounted: function mounted() {
    this.loadRoster();
    this.loadStories();
    this.loadGimmicks();
    this.loadLegends();
    //this.createData('x');
    this.loadNews();
    this.loadGame();
    //this.loadMissions();
    this.setMatchcard();
  },
  methods: {
    // Lets get started
    loadRoster: function loadRoster() {
      this.$set(this, 'roster', JSON.parse(localStorage.getItem('roster')));
    },
    loadStories: function loadStories() {
      this.$set(this, 'stories', JSON.parse(localStorage.getItem('stories')));
    },
    loadGimmicks: function loadGimmicks() {
      this.$set(this, 'gimmicks', JSON.parse(localStorage.getItem('gimmicks')));
    },
    loadLegends: function loadLegends() {
      var legendlist = JSON.parse(localStorage.getItem('legends'));
      // legendlist.forEach(leg => {this.legends.push(leg.Id)});
      this.legends = [1, 2, 3];
      // console.log(this.data);
      this.createData(legendlist);
    },
    createData: function createData(data) {
      this.legendRoster = data;
    },
    loadNews: function loadNews() {
      this.$set(this, 'news', JSON.parse(localStorage.getItem('news')));
    },
    // loadMissions:function(){
    //   this.$set(this,'missions', JSON.parse(localStorage.getItem('missions')));
    //   console.log(this.missions);
    // },
    loadGame: function loadGame() {
      this.$set(this, 'game', JSON.parse(localStorage.getItem('gameData')));
    },
    // IN GAME
    nextTurn: function nextTurn() {
      game.validate = false;
      console.clear();
      this.game.players[this.turn].matchcard.forEach(function (match) {
        // make sure matches are ready
        console.log(match.ready);
        if (!match.ready) {
          game.validate = true;
        }
      });
      console.log(this.validate);
      if (this.validate == true) {
        return;
      } else {
        this.turn++;
        if (this.turn == this.game.players.length) {
          this.turn = 'REVIEW';this.summarize();
        }
      }
    },
    sumValues: function sumValues(val, index) {
      var totalGain = 0;
      val.matchcard.forEach(function (match) {
        if (match.competitors[0] && match.competitors[1]) {
          var matchSum = game.findWrestler(match.competitors[0]).val + game.findWrestler(match.competitors[0]).inc + (game.findWrestler(match.competitors[1]).val + game.findWrestler(match.competitors[1]).inc);
          game.summaryValues[index].matches.push(matchSum);
          totalGain += matchSum;
        }
      });
      game.summaryValues[index].total = totalGain;
      val.cash += totalGain;
    },
    incWinners: function incWinners(val, index) {
      val.matchcard.forEach(function (match) {
        if (match.winner == match.competitors[0]) {
          game.findWrestler(match.competitors[0]).inc >= 3 ? game.findWrestler(match.competitors[0]).inc = 3 : game.findWrestler(match.competitors[0]).inc++;
          game.findWrestler(match.competitors[1]).inc = 0;
          console.log(game.findWrestler(match.competitors[0]).Name + ' wins + 1');
        } else {
          game.findWrestler(match.competitors[1]).inc >= 3 ? game.findWrestler(match.competitors[1]).inc = 3 : game.findWrestler(match.competitors[1]).inc++;
          game.findWrestler(match.competitors[0]).inc = 0;
          console.log(game.findWrestler(match.competitors[1]).Name + ' wins + 1');
        }
      });
    },
    summarize: function summarize() {
      game.summaryValues = [];
      this.game.players.forEach(function (value, index) {
        game.summaryValues.push({ 'matches': [], 'bonus': [], 'total': 0 });
        game.sumValues(value, index);
        game.incWinners(value, index);
      });
      game.awardTopDraw();
    },
    indexOfMax: function indexOfMax(arr) {
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
    awardTopDraw: function awardTopDraw() {
      var drawTotals = [];
      game.summaryValues.forEach(function (val) {
        return drawTotals.push(val.total);
      });
      console.log(drawTotals);
      var i = this.indexOfMax(drawTotals);
      console.log('highest - ' + i);
      this.game.players[i].tokens++;
    },
    nextRound: function nextRound() {
      this.setMatchcard();
      this.game.round++;
      this.turn = 0;
      this.saveData();
    },
    saveData: function saveData() {
      localStorage.setItem('gimmicks', JSON.stringify(this.roster));
      localStorage.setItem('news', JSON.stringify(this.roster));
      localStorage.setItem('roster', JSON.stringify(this.roster));
      localStorage.setItem('gameData', JSON.stringify(this.game));
      console.log('data saved');
    },
    setMatchcard: function setMatchcard() {
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
    findWrestler: function findWrestler(id) {
      var result = null;
      this.roster.forEach(function (wrestler) {
        if (wrestler.Id == id) {
          //console.log(wrestler)
          result = wrestler;
        }
      });
      if (!result) {
        return;
      }
      return result;
    },
    findGimmick: function findGimmick(id) {
      var result = null;
      this.gimmicks.forEach(function (gimmick) {
        if (gimmick.Id == id) {
          result = gimmick;
        }
      });
      if (!result) {
        return;
      }
      return result;
    },
    findStory: function findStory(id) {
      var result = null;
      this.stories.forEach(function (story) {
        if (story.Id == id) {
          result = story;
        }
      });
      if (!result) {
        return;
      }
      return result;
    },
    openRoster: function openRoster(matchno, card) {
      this.currentMatch = matchno;
      this.currentPos = card;
      var poproster = document.querySelector('.poproster');
      poproster.style.top = event.pageY + 10 + 'px';
      poproster.style.left = event.pageX + 10 + 'px';
      //console.log(event);
      this.popRoster = true;
    },
    openGimmick: function openGimmick(matchno) {
      this.currentMatch = matchno;
      var selectedMatch = this.game.players[this.turn].matchcard[this.currentMatch];
      if (this.findWrestler(selectedMatch.competitors[0]).isChamp || this.findWrestler(selectedMatch.competitors[1]).isChamp) {
        this.titleCards = true;
      } else {
        this.titleCards = false;
      }
      var popgimmick = document.querySelector('.popgimmick');
      popgimmick.style.top = event.pageY + 10 + 'px';
      popgimmick.style.left = event.pageX + 10 + 'px';
      this.popGimmick = true;
    }, //
    closePop: function closePop() {
      this.popRoster = false;
    },
    addToCard: function addToCard(wrestler, id) {
      this.game.players[this.turn].matchcard[this.currentMatch].competitors[this.currentPos] = id;
      this.game.players[this.turn].temproster.splice(wrestler, 1);
      game.$forceUpdate();
      this.closePop();
      this.game.players[this.turn].matchcard[this.currentMatch].ready = this.validateMatch(this.game.players[this.turn].matchcard[this.currentMatch]);
    },
    removeMatch: function removeMatch(player, match) {
      //
      player.matchcard.splice(match, 1);
    },
    validateMatch: function validateMatch(match) {
      var ready = false;
      if (match.competitors.length > 1) {
        ready = true;
      };
      match.winner ? ready = true : ready = false;
      //console.log(match, ready);
      return ready;
    },
    setWinner: function setWinner(match, winner, matchno) {
      //console.log(match, winner);
      this.currentMatch = matchno;
      match.winner = winner;
      game.game.players[this.turn].matchcard[this.currentMatch].ready = this.validateMatch(match);
      console.log(match);
      game.$forceUpdate();
    },
    // store
    openStore: function openStore(show) {
      this.showStore = show; //
    },
    purchaseRoster: function purchaseRoster(wrestler, cost) {
      if (game.game.players[this.turn].cash <= cost) {
        return;
      }
      game.game.players[this.turn].roster.push(wrestler);
      game.game.players[this.turn].cash -= cost;
      game.game.roster.forEach(function (val, index) {
        if (wrestler == val) {
          game.game.roster.splice(index, 1);
        }
      });
    },
    purchaseLegend: function purchaseLegend(legend, cost) {
      if (game.game.players[this.turn].cash <= cost) {
        return;
      }
      game.game.players[this.turn].legends.push(legend);
      game.game.players[this.turn].cash -= cost;
      game.legendRoster.forEach(function (val, index) {
        if (legend == val) {
          game.legendRoster.splice(index, 1);
        }
      });
    },
    purchaseGimmick: function purchaseGimmick() {
      if (game.game.players[this.turn].cash <= 5) {
        return;
      }
      game.game.players[this.turn].cash -= 5;
      game.game.players[this.turn].gimmicks.push(game.game.gimmicks[0]);
      game.game.gimmicks.splice(0, 1);
    },
    purchaseStory: function purchaseStory() {
      if (game.game.players[this.turn].cash <= 5) {
        return;
      }
      game.game.players[this.turn].cash -= 5;
      game.game.players[this.turn].stories.push(game.game.stories[0]);
      game.game.stories.splice(0, 1);
    },
    getTv: function getTv() {
      if (game.game.players[this.turn].cash <= 20) {
        return;
      }
      game.game.players[this.turn].cash -= 20;
      game.game.players[this.turn].tv++;
      game.game.tv--;
    },
    getArena: function getArena() {
      if (game.game.players[this.turn].cash <= 50) {
        return;
      }
      game.game.players[this.turn].cash -= 50;
      game.game.players[this.turn].arena++;
      game.game.arena--;
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
- add to match (remove from users set)
- remove (return to users set)
- count value in match rating
- add card to players discard gimmick pile
- enact actions (change title, heel/face turns)

// STORIES

// NEWS

// STORE
*- buy gimmick
*- buy roster
*- buy story
*- buy legend
*- buy tv time (extra match)
*- buy stadium (double value)

// WCHAMP (awards based on scores, vote for hire, use tokens to switch)

// MISSIONS

// END GAME (end after 12, tally totals(with missions) and announce winner)

// WRAP UP
- remove from card (re-add to temproster)
- if no data of any kind reload from storage (if no storage note error then return to index)


*/