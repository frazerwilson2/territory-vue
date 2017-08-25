'use strict';

var missions = new Vue({
  el: '#missions',
  data: {
    gameinstance: null
  },
  methods: {
    init: function init(x) {
      this.gameinstance = x;
    },
    acessPlayerMission: function acessPlayerMission(type, player, roster) {
      // type: type of mission to resolve
      // player: index of player
      //      console.log('analysing ' + type);

      switch (type) {
        case 'MOSTITLESWTICH':
          return player == this.evalArray('titlechange');
          break;
        case '3ABOVE9':
          return this.evalRoster(roster, 3, 9);
          break;
        case 'LEASTSTORY':
          return player == this.evalArray('leaststory');
          break;
        case 'MOSTGIMMICK':
          return player == this.evalArray('mostgimmick');
          break;
        case 'LEASTGIMMICK':
          return player == this.evalArray('leastgimmick');
          break;
        case 'MOSTARENA':
          return player == this.evalArray('mostarena');
          break;
        case 'MOSTTOKENS':
          return player == this.evalArray('mosttokens');
          break;
        case 'MOSTLEG':
          return player == this.evalArray('mostlegend');
          break;
        case 'NOTITLESWITCH':
          return this.evalTitleSwitchCount(player);
        default:
          return false;
      }
    },
    accessGameMission: function accessGameMission(type) {
      var winner = void 0;
      switch (type) {
        case 'MOSTTOKENS':
          var winnersBlock = [];
          var mostTokensUsed = this.evalMost('tokens', true);
          this.gameinstance.players.forEach(function (player, i) {
            if (player.discards.tokens == mostTokensUsed) {
              winnersBlock.push(i);
            }
          });
          // only return if 1 result in array // otherwise nobody wins!!
          winner = winnersBlock.length === 1 ? winnersBlock[0] : null;
      }
      return winner;
    },
    evalMost: function evalMost(req, tokens) {
      var evalBlock = [];
      this.gameinstance.players.forEach(function (player) {
        evalBlock.push(tokens ? player['discards'][req] : player[req]);
      });
      return Math.max.apply(Math, evalBlock);
    },
    evalArray: function evalArray(type, arr) {
      var _this = this;

      if (type == 'titlechange') {
        var evalBlock = [];
        this.gameinstance.players.forEach(function (player) {
          evalBlock.push(_this.countTotal(player.discards.gimmicks, 1));
        });
        return this.indexOfMaxValue(evalBlock);
      }
      if (type == 'leaststory') {
        var _evalBlock = [];
        this.gameinstance.players.forEach(function (player) {
          _evalBlock.push(player.discards.stories.length);
        });
        return this.indexOfLeastValue(_evalBlock);
      }
      if (type == 'mostgimmick' || type == 'leastgimmick') {
        var _evalBlock2 = [];
        this.gameinstance.players.forEach(function (player) {
          _evalBlock2.push(player.discards.gimmicks.length);
        });
        if (type == 'mostgimmick') {
          return this.indexOfMaxValue(_evalBlock2);
        } else {
          return this.indexOfLeastValue(_evalBlock2);
        }
      }
      if (type == 'mostarena') {
        var _evalBlock3 = [];
        this.gameinstance.players.forEach(function (player) {
          _evalBlock3.push(player.discards.arena);
        });
        return this.indexOfMaxValue(_evalBlock3);
      }
      if (type == 'mostlegend') {
        var _evalBlock4 = [];
        this.gameinstance.players.forEach(function (player) {
          _evalBlock4.push(player.discards.legend);
        });
        return this.indexOfMaxValue(_evalBlock4);
      }
      if (type == 'mosttokens') {
        var _evalBlock5 = [];
        this.gameinstance.players.forEach(function (player) {
          _evalBlock5.push(player.discards.tokens);
        });
        return this.indexOfMaxValue(_evalBlock5);
      }
    },
    countTotal: function countTotal(a, match) {
      // count number of matches (match) in array (a)
      return a.filter(function (value) {
        return value === match;
      }).length;
    },
    indexOfMaxValue: function indexOfMaxValue(a) {
      return a.reduce(function (iMax, x, i, arr) {
        return x > arr[iMax] ? i : iMax;
      }, 0);
    },
    indexOfLeastValue: function indexOfLeastValue(a) {
      var index = 0;
      var value = a[0];
      for (var i = 1; i < a.length; i++) {
        if (a[i] < value) {
          value = a[i];
          index = i;
        }
      }
      return index;
    },
    evalRoster: function evalRoster(a, num, val) {
      var filterd = a.filter(function (w) {
        return w >= val;
      });
      return filterd.length >= num;
    },
    evalTitleSwitchCount: function evalTitleSwitchCount(p) {
      var notitleswitches = true;
      this.gameinstance.players[p].discards.gimmicks.forEach(function (g) {
        if (g == 1) {
          notitleswitches = false;
        }
      });
      return notitleswitches;
    }
  }
});