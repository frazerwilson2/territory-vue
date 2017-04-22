var news = new Vue({
  el: '#news',
  data: {
  },
  methods: {
  	acessNews: function(id, player, summValues, playerIndex){
  		console.log(id.type, player, summValues);
  		var response = {};
  		switch(id.type){
  			case 'HEELFACE1':
  				player.matchcard.forEach(function(match){
            var w1 = game.findWrestler(match.competitors[0]).heelface;
            var w2 = game.findWrestler(match.competitors[1]).heelface;
  					if(w1 == w2) {
  						response.type = 'money';
  						response.money = -10;
  						return response;
  					}
  				});
          console.log('here');
          if(response.type){return response;}
  				return false;
  				break;
  			case 'HEELFACEME':
	  			if(game.findWrestler(player.matchcard[0].competitors[0]).heelface == 'H' && game.findWrestler(player.matchcard[0].competitors[1]).heelface == 'H' || game.findWrestler(player.matchcard[0].competitors[0]).heelface == 'F' && game.findWrestler(player.matchcard[0].competitors[1]).heelface == 'F') {
  					response.type = 'money';
  					response.money = -10;
  					return response;
  				}
          if(response.type){return response;}
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
          if(response.type){return response;}
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
          if(response.type){return response;}
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
          if(response.type){return response;} 
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
          if(response.type){return response;}
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
	  			response.wrestler = player.matchcard[0].competitors[1];
	  			response.injuryType = 'small';
	  			return response;
	  			break;
	  		case 'INJURY2':
	  			response.type = 'injury';
	  			response.wrestler = player.matchcard[1].competitors[0];
	  			response.injuryType = 'large';
	  			return response;
	  			break;
	  		case 'UPSTAGED':
	  			if(game.indexOfMax(summValues[playerIndex].matches) !== 0){
	  				response.type = 'money';
  					response.money = -5;
  					return response;
	  			};
          if(response.type){return response;}
	  			return false;
	  			break;
        case '5STAR':
          var topMatch = game.indexOfMax(summValues[playerIndex].matches);
          response.type = 'starInc';
          response.starInc = player.matchcard[topMatch].competitors;
          return response;
          break;
        case 'POPSTORY':
            player.matchcard.forEach(function(match){
              if(match.story){
                game.findStory(match.story).payoff += 10;
                response.type = 'storypop'; 
                console.log(response);          
              }
            });
            if(response.type){return response;}
            return false;
          break;
        case 'POPGUY':
          response.type = 'starInc';
          response.starInc = [];
          response.starInc.push(player.matchcard[0].winner);
          return response;
          break;
        case 'POPLOSER':
          response.type = 'starInc';
          response.starInc = [];
          var lowestMatch = player.matchcard.length - 1;
          player.matchcard[lowestMatch].competitors.forEach(function(w){
            if(w !== player.matchcard[lowestMatch].winner){
              response.starInc.push(w);
            }
          });
          return response;
          break;
        case 'EXTENDSTORY':
          player.matchcard.forEach(function(match){
              if(match.story){
                response.type = 'storypop';
                response.storypop = match.story; 
                return response;           
              }
            });
            if(response.type){return response;}
            return false;
          break;
        case 'TOOMANYGIMMICK':
          if(player.discards.gimmicks.length > 6){
            response.type = 'money';
            response.money = -10;
            return response;
          }
          if(response.type){return response;}
          return false;
          break;
        case 'TOOMANYTV':
          if(player.discards.tv.length > 3){
            response.type = 'money';
            response.money = -10;
            return response;
          }
          if(response.type){return response;}
          return false;
          break;
        case 'TOOMANYARENA':
          if(player.discards.arena.length > 2){
            response.type = 'money';
            response.money = -10;
            return response;
          }
          if(response.type){return response;}
          return false;
          break;
        case 'TOOMANYLEGEND':
          if(player.discards.legend.length > 2){
            response.type = 'money';
            response.money = -10;
            return response;
          }
          if(response.type){return response;}
          return false;
          break;
        case 'NOCHAMP':
          if(!player.champSet){
            response.type = 'money';
            response.money = -10;
            return response;
          }
          if(response.type){return response;}
          return false;
          break;
        case 'NOBIGSHOW':
        console.log('tokens: ' + !player.tokens && !player.discards.tokens);
          if(!player.tokens && !player.discards.tokens){
              response.type = 'money';
              response.money = -10;
              return response;
            }
            if(response.type){return response;}
            return false;
          break;
        case 'FREEAGENT':
            response.type = 'freeagent';
            return response;
          break;
        case 'QUITTER':
            response.type = 'quitter';
            return response;
          break;
        case 'FREETVSPOT':
          response.type = 'give';
          response.give = 'tv';
          return response;
          break;
        case 'SHOWBONUS':
          response.type = 'money';
          response.money = 10;
          return response;
          break;
        case 'ROSTERTOOSMALL':
          if(player.roster.length <= 6){
            response.type = 'money';
            response.money = -10;
            return response;           
          }
          if(response.type){return response;}
          return false;
          break;
        case 'NOSTARS':
          var starCount = 0;
          player.roster.forEach(function(w){
            if((game.findWrestler(w).val + game.findWrestler(w).inc) > 8){
              starCount++;
            }
          });
          if(!starCount){
            response.type = 'money';
            response.money = -10;
            return response; 
          }
          if(response.type){return response;}
          return false;
          break;
        case 'NOSTORIES':
          var storyCount = 0;
          player.matchcard.forEach(function(match){
            if(match.story){
              storyCount++;
              return response;           
            }
          });
          if(!storyCount){
            response.type = 'money';
            response.money = -10;
            return response; 
          }
          if(response.type){return response;}
          return false;
          break;
        case 'WCHAMPINTERVIEW':
          if(player.hasWChamp){
            response.type = 'money';
            response.money = 10;
            return response;
          }
          if(response.type){return response;}
          return false;
          break;
        default:
  			return false;
  		}
  	}
  }
});