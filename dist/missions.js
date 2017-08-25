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
      console.log('top result: ' + Math.max.apply(Math, evalBlock));
      return Math.max.apply(Math, evalBlock);
    },
    evalArray: function evalArray(type, arr) {
      var _this = this;

      if (type == 'titlechange') {
        var evalBlock = [];
        this.gameinstance.players.forEach(function (player) {
          evalBlock.push(_this.countTotal(player.discards.gimmicks, 1));
        });
        console.log('player ' + (this.indexOfMaxValue(evalBlock) + 1) + ' has most title switch gimmicks');
        return this.indexOfMaxValue(evalBlock);
      }
      if (type == 'leaststory') {
        var _evalBlock = [];
        this.gameinstance.players.forEach(function (player) {
          _evalBlock.push(player.discards.stories.length);
        });
        return this.indexOfLeastValue(_evalBlock);
      }
      if (type == 'mostgimmick') {
        var _evalBlock2 = [];
        this.gameinstance.players.forEach(function (player) {
          _evalBlock2.push(player.discards.gimmicks.length);
        });
        return this.indexOfMaxValue(_evalBlock2);
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
    }
  }
});