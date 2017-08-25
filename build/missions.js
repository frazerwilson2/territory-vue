var missions = new Vue({
  el: '#missions',
  data: {
    gameinstance: null
  },
  methods: {
    init: function(x){
      this.gameinstance = x;
    },
  	acessPlayerMission: function(type, player, roster){
// type: type of mission to resolve
// player: index of player
//      console.log('analysing ' + type);

  		switch(type){
  			case 'MOSTITLESWTICH':
          return player == this.evalArray('titlechange');
          break;
        case '3ABOVE9':
          return this.evalRoster(roster,3,9);
          break;
        case 'LEASTSTORY':
          return player == this.evalArray('leaststory');
          break;
        case 'MOSTGIMMICK':
          return player == this.evalArray('mostgimmick');
          break;
        default: return false;
    	}
    },
    accessGameMission: function(type){
      let winner;
      switch(type){
        case 'MOSTTOKENS':
          let winnersBlock = [];
          let mostTokensUsed = this.evalMost('tokens', true);
          this.gameinstance.players.forEach(function(player, i) {
            if(player.discards.tokens == mostTokensUsed){
              winnersBlock.push(i);
            }
          });
          // only return if 1 result in array // otherwise nobody wins!!
          winner = winnersBlock.length === 1 ? winnersBlock[0] : null;
      }
      return winner;
    },
    evalMost: function (req, tokens) {
      const evalBlock = [];
      this.gameinstance.players.forEach(player => {
        evalBlock.push(tokens ? player['discards'][req] : player[req]);
      });
      console.log('top result: ' + Math.max( ...evalBlock ));
      return Math.max( ...evalBlock );
    },
    evalArray: function (type, arr) {
      if(type == 'titlechange'){
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(this.countTotal(player.discards.gimmicks, 1));
        });
        console.log('player ' + (this.indexOfMaxValue(evalBlock) + 1) + ' has most title switch gimmicks');
        return this.indexOfMaxValue(evalBlock);
      }
      if (type == 'leaststory') {
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(player.discards.stories.length);
        });
        return this.indexOfLeastValue(evalBlock);
      }
      if (type == 'mostgimmick') {
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(player.discards.gimmicks.length);
        });
        return this.indexOfMaxValue(evalBlock);
      }
    },
    countTotal: function(a, match){
      // count number of matches (match) in array (a)
      return a.filter(function(value){
          return value === match;
      }).length;
    },
    indexOfMaxValue: function(a){
      return a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    },
    indexOfLeastValue: function(a){
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
    evalRoster: function(a,num,val){
      let filterd = a.filter(w => w >= val);
      return filterd.length >= num;
    }
  }
});