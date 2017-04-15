var news = new Vue({
  el: '#news',
  data: {
  },
  methods: {
  	acessNews: function(id, player){
  		console.log(id.type, player);
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
  			default: 
  			return false;
  		}
  	}
  }
});