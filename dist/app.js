'use strict';

var app = new Vue({
  el: '#app',
  data: {
    rawRoster: [],
    rawMissions: [],
    rawStories: [],
    rawGimmicks: [],
    rawLegends: [],
    rawNews: [],
    events: '',
    // Base game setup
    game: {
      players: [],
      goal: 0,
      news: [],
      roster: [],
      stories: [],
      gimmicks: [],
      tv: 4,
      arena: 4,
      legends: [],
      round: 1
    },
    currentPlayer: 0,
    loading: false
  },
  mounted: function mounted() {
    this.getRoster();
  },
  methods: {
    newPlayer: function newPlayer() {
      var nextup = {
        name: '',
        cash: 50,
        roster: [],
        stories: [],
        gimmicks: [],
        goal: 0,
        tokens: 0,
        arena: 0,
        tv: 0,
        legends: [],
        ready: false
      };
      this.game.players.push(nextup);
    },
    getRoster: function getRoster() {
      var _this = this;

      fetch('/roster.json').then(function (blob) {
        return blob.json();
      }).then(function (data) {
        _this.$set(_this, 'rawRoster', data);localStorage.setItem('roster', JSON.stringify(data));
      });
    },
    pickRoster: function pickRoster() {
      this.game.roster = this.rawRoster.map(function (w) {
        return w.Id;
      });
    },
    // The setup roster pick
    addToRoster: function addToRoster(data) {
      this.game.players[this.currentPlayer].roster.push(data.id);
      this.game.players[this.currentPlayer].cash -= data.val;
      console.log(data);
      for (var i = 0; i < this.game.roster.length; i++) {
        if (this.game.roster[i] == data.id) {
          this.game.roster.splice(i, 1);
        }
      }
    },
    nextPlayer: function nextPlayer() {
      this.currentPlayer + 1 == this.game.players.length ? this.currentPlayer = 0 : this.currentPlayer++;
      if (this.game.players[this.currentPlayer].ready) {
        this.nextPlayer();
      }
    },
    donePurchase: function donePurchase() {
      this.game.players[this.currentPlayer].ready = true;
      var readyCount = 0;
      for (var i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i].ready) {
          readyCount++;
        }
      }
      if (readyCount == this.game.players.length) {
        this.loading = true;
        this.loadUpData();
      } else {
        this.nextPlayer();
      }
    },
    loadUpData: function loadUpData() {
      this.getMissions();
      this.getStories();
      this.getGimmicks();
      this.getLegends();
      this.getNews();
    },
    saveData: function saveData() {
      localStorage.setItem('gameData', JSON.stringify(this.game));
      console.log(this.game);
    },
    // Get data & assign
    shuffle: function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    },
    getMissions: function getMissions() {
      var _this2 = this;

      fetch('/missions.json').then(function (blob) {
        return blob.json();
      }).then(function (data) {
        _this2.$set(_this2, 'rawMissions', data);localStorage.setItem('missions', JSON.stringify(data));_this2.sortMissions();
      });
    },
    sortMissions: function sortMissions() {
      var playerMissions = this.rawMissions.filter(function (mission) {
        return mission.type == "player";
      });
      this.shuffle(playerMissions);
      for (var i = 0; i < this.game.players.length; i++) {
        this.game.players[i].goal = playerMissions[i].Id;
      }
      var gameMissions = this.rawMissions.filter(function (mission) {
        return mission.type == "game";
      });
      this.shuffle(gameMissions);
      this.game.goal = gameMissions[0].Id;
      this.saveData();
    },
    getStories: function getStories() {
      var _this3 = this;

      fetch('/stories.json').then(function (blob) {
        return blob.json();
      }).then(function (data) {
        _this3.$set(_this3, 'rawStories', data);localStorage.setItem('stories', JSON.stringify(data));_this3.sortStories();
      });
    },
    sortStories: function sortStories() {
      this.shuffle(this.rawStories);
      var pick = 0;
      var eachCards = 3;
      for (var i = 0; i < this.game.players.length; i++) {
        for (var x = 0; x < eachCards; x++) {
          this.game.players[i].stories.push(this.rawStories[pick + x].Id);
        }
        pick += eachCards;
      }
      for (var i = pick; i < this.rawStories.length; i++) {
        this.game.stories.push(this.rawStories[i].Id);
      }
      this.saveData();
    },
    getGimmicks: function getGimmicks() {
      var _this4 = this;

      fetch('/gimmicks.json').then(function (blob) {
        return blob.json();
      }).then(function (data) {
        _this4.$set(_this4, 'rawGimmicks', data);localStorage.setItem('gimmicks', JSON.stringify(data));_this4.sortGimmicks();
      });
    },
    sortGimmicks: function sortGimmicks() {
      for (var i = 0; i < this.rawGimmicks.length; i++) {
        switch (this.rawGimmicks[i].type) {
          case 'TITLECHANGE':
            for (var x = 0; x < this.game.players.length; x++) {
              for (var y = 0; y < 3; y++) {
                this.game.players[x].gimmicks.push(this.rawGimmicks[i].Id);
              }
            }
            for (var y = 0; y < 3; y++) {
              this.game.gimmicks.push(this.rawGimmicks[i].Id);
            }
            break;
          case 'HEELFACE':
            for (var x = 0; x < this.game.players.length; x++) {
              for (var y = 0; y < 3; y++) {
                this.game.players[x].gimmicks.push(this.rawGimmicks[i].Id);
              }
            }
            for (var y = 0; y < 3; y++) {
              this.game.gimmicks.push(this.rawGimmicks[i].Id);
            }
            break;
          default:
            for (var y = 0; y < 10; y++) {
              this.game.gimmicks.push(this.rawGimmicks[i].Id);
            }
        }
      }
      this.shuffle(this.game.gimmicks);
      this.saveData();
    },
    getLegends: function getLegends() {
      var _this5 = this;

      fetch('/legends.json').then(function (blob) {
        return blob.json();
      }).then(function (data) {
        _this5.$set(_this5, 'rawLegends', data);localStorage.setItem('legends', JSON.stringify(data));_this5.shuffle(data);_this5.game.legends = data.map(function (data) {
          return data.Id;
        });
      });
      this.saveData();
    },
    getNews: function getNews() {
      var _this6 = this;

      fetch('/news.json').then(function (blob) {
        return blob.json();
      }).then(function (data) {
        _this6.$set(_this6, 'rawNews', data);localStorage.setItem('news', JSON.stringify(data));_this6.shuffle(data);_this6.game.news = data.map(function (data) {
          return data.Id;
        });
      });
      this.saveData();
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
        purchaseRoster: function purchaseRoster() {
          this.data.assigned = true;
          app.$emit('addToRoster', { id: this.data.Id, val: this.data.val });
          app.$emit('nextPlayer', 'switch to' + this.data.Id);
        }
      }
    }
  }
});

app.$on('nextPlayer', function (x) {
  this.nextPlayer();
});
app.$on('addToRoster', function (data) {
  this.addToRoster(data);
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