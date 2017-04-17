var news = new Vue({
  el: '#news',
  data: {
  },
  methods: {
  	acessNews: function(id, player, summValues, playerIndex){
  		console.log(id.type, summValues);
  		var response = {};
  		switch(id.type){
  			case 'HEELFACE1':
  				player.matchcard.forEach(function(match){
  					if(game.findWrestler(match.competitors[0]).heelface == 'H' && game.findWrestler(match.competitors[1]).heelface == 'H' || game.findWrestler(match.competitors[0]).heelface == 'F' && game.findWrestler(match.competitors[1]).heelface == 'F') {
  						response.type = 'money';
  						response.money = -10;
  						return response;
  					}
  				});
  				return false;
  				break;
  			case 'HEELFACEME':
	  			if(game.findWrestler(player.matchcard[0].competitors[0]).heelface == 'H' && game.findWrestler(player.matchcard[0].competitors[1]).heelface == 'H' || game.findWrestler(player.matchcard[0].competitors[0]).heelface == 'F' && game.findWrestler(player.matchcard[0].competitors[1]).heelface == 'F') {
					response.type = 'money';
					response.money = -10;
					return response;
  				}
  				return false;
  				break;
  			case 'HEELHEEL':
  				player.matchcard.forEach(function(match){
  					if(game.findWrestler(match.competitors[0]).heelface == 'H' && game.findWrestler(match.competitors[1]).heelface == 'H') {
  						response.type = 'money';
  						response.money = -15;
  						return response;
  					}
  				});
  				return false;
  				break;
  			case 'FACEFACE':
  				player.matchcard.forEach(function(match){
  					if(game.findWrestler(match.competitors[0]).heelface == 'F' && game.findWrestler(match.competitors[1]).heelface == 'F') {
  						response.type = 'money';
  						response.money = -5;
  						return response;
  					}
  				});
  				return false;
  				break;
  			case 'TOOMANYFACE':
  				var heels = 0; var faces = 0;
  				player.roster.forEach(function(wrestler){
  					if(game.findWrestler(wrestler).heelface == 'F'){
  						faces++;
  					}
  					else {
  						heels++;
  					}
  				});
  				console.log(heels, faces);
  				if((faces - heels) > 3){
  					response.type = 'money';
					response.money = -10;
					return response;
  				} 
  				return false;
  				break;
  			case 'TOOMANYHEEL':
  				var heels = 0; var faces = 0;
  				player.roster.forEach(function(wrestler){
  					if(game.findWrestler(wrestler).heelface == 'F'){
  						faces++;
  					}
  					else {
  						heels++;
  					}
  				});
  				if((heels - faces) > 3){
  					response.type = 'money';
					response.money = -10;
					return response;
  				} 
	  			return false;
	  			break;
	  		case 'FREEGIMMICK':
	  			response.type = 'give';
	  			response.give = 'gimmick';
	  			return response;
	  			break;
	  		case 'FREESTORY':
	  			response.type = 'give';
	  			response.give = 'story';
	  			return response;
	  			break;
	  		case 'INJURY1':
	  			response.type = 'injury';
	  			response.wrestler = summValues[playerIndex].matches[0].competitors[1];
	  			response.injuryType = 'small';
	  			return response;
	  			break;
	  		case 'INJURY2':
	  			response.type = 'injury';
	  			response.wrestler = summValues[playerIndex].matches[1].competitors[0];
	  			response.injuryType = 'large';
	  			return response;
	  			break;
	  		case 'UPSTAGED':
	  			if(game.indexOfMax(summValues[playerIndex].matches) !== 0){
	  				response.type = 'money';
					response.money = -5;
					return response;
	  			};
	  			return false;
	  			break;
        case '5STAR':
          var topMatch = game.indexOfMax(summValues[playerIndex].matches);
          response.type = 'starInc';
          response.starInc = summValues[playerIndex].matches[topMatch].competitors;
          return response;
          break;
        case 'POPSTORY':
          break;
        case 'POPGUY':
          break;
        case 'POPLOSER':
          break;
        case 'EXTENDSTORY':
          break;
        case 'TOOMANYGIMMICK':
          break;
        case 'TOOMANYTV':
          break;
        case 'TOOMANYARENA':
          break;
        case 'TOOMANYLEGEND':
          break;
        case 'NOCHAMP':
          break;
        case 'NOBIGSHOW':
          break;
        case 'FREEAGENT':
          break;
        case 'QUITTER':
          break;
        case 'FREETVSPOT':
          break;
        case 'SHOWBONUS':
          break;
        case 'ROSTERTOOSMALL':
          break;
        case 'NOSTARS':
          break;
        case 'NOSTORIES':
          break;
        case 'WCHAMPINTERVIEW':
          break;
        default:
  			return false;
  		}
  	}
  }
});