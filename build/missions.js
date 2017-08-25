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
      return Math.max( ...evalBlock );
    },
    evalArray: function (type, arr) {
      if(type == 'titlechange'){
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(this.countTotal(player.discards.gimmicks, 1));
        });
        return this.indexOfMaxValue(evalBlock);
      }
      if (type == 'leaststory') {
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(player.discards.stories.length);
        });
        return this.indexOfLeastValue(evalBlock);
      }
      if (type == 'mostgimmick' || type == 'leastgimmick') {
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(player.discards.gimmicks.length);
        });
        if(type == 'mostgimmick'){
          return this.indexOfMaxValue(evalBlock);
        }
        else {
          return this.indexOfLeastValue(evalBlock);
        }
      }
      if(type == 'mostarena'){
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(player.discards.arena);
        });
        return this.indexOfMaxValue(evalBlock);
      }
      if(type == 'mostlegend'){
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(player.discards.legend);
        });
        return this.indexOfMaxValue(evalBlock);
      }
      if(type == 'mosttokens'){
        const evalBlock = [];
        this.gameinstance.players.forEach(player => {
          evalBlock.push(player.discards.tokens);
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
    },
    evalTitleSwitchCount: function(p){
      let notitleswitches = true;
      this.gameinstance.players[p].discards.gimmicks.forEach(g =>{
        if(g == 1){notitleswitches = false}
      });
      return notitleswitches;
    }
  }
});