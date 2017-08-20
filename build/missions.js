var missions = new Vue({
  el: '#missions',
  data: {
    gameinstance: null
  },
  methods: {
    init: function(x){
      this.gameinstance = x;
    },
  	acessPlayerMission: function(type, player){
// type: type of mission to resolve
// player: index of player
//      console.log('analysing ' + type);

  		switch(type){
  			case 'MOSTITLESWTICH':
        //this.evalMost('legend', true);
          return player == this.evalArray('titlechange');
          // Do whatever checks if value met true
          break;
        case 2:
          // Do whatever checks if value met true
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
    },
    countTotal: function(a, match){
      // count number of matches (match) in array (a)
      return a.filter(function(value){
          return value === match;
      }).length;
    },
    indexOfMaxValue: function(a){
      return a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    }
  }
});