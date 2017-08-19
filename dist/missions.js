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
    acessPlayerMission: function acessPlayerMission(type, player) {
      // type: type of mission to resolve
      // player: index of player
      //      console.log('analysing ' + type);

      switch (type) {
        case 'MOSTITLESWTICH':
          //this.evalMost('legend', true);
          var result = player == this.evalArray('titlechange');
          console.log(result);
          return result;
          // Do whatever checks if value met true
          break;
        case 2:
          // Do whatever checks if value met true
          break;
        default:
          return false;
      }
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
    },
    countTotal: function countTotal(a, match) {
      return a.filter(function (value) {
        return value === match;
      }).length;
    },
    indexOfMaxValue: function indexOfMaxValue(a) {
      return a.reduce(function (iMax, x, i, arr) {
        return x > arr[iMax] ? i : iMax;
      }, 0);
    }
  }
});