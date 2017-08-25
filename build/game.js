var game = new Vue({
  el: '#game',
  data: {
    // Initialised data
    roster: [],
    // No missions. Once set new ones cant be bought
    //missions: [],
    stories: [],
    gimmicks: [],
    legends: [],
    legendRoster:[],
    news:[],
    game:[],
    missions: [],
    // In game values
    turn: 'WCHAMP', // 'WCHAMP', 'REVIEW'
    round: null,
    totalRounds: 12,
    matchcard: [],
    match: {
      story: null,
      gimmick: null,
      gimmickAffect:null,
      competitors:[],
      winner: null,
      loser: null,
      ready:false
    },
    popRoster:false,
    popGimmick:false,
    popStory:false,
    currentMatch:false,
    currentPos:false,
    summaryValues:[],
    validate:[],
    titleCards: false,
    showStore:false,
    showWModal: false,
    setChampNow: false,
    showChampRoster: false,
    wChampQ: false,
    voteCard: [],
    voteRejectedMsg: false,
    voteApprovedMsg: false,
    confirmNewWChamp: false,
    newsTitle: false,
    newsDetail: false,
    tempIndex: null,
    switchWChampMsg: false,
    prospectWChamp: null,
    prospectWChampHolder: null,
    // menu
    expandedRoster: false,
    expandedGimmick: false,
    expandedStory: false,
    endTotals: []
  },
  mounted: function() {
  this.loadRoster();
  this.loadStories();
  this.loadGimmicks();
  this.loadLegends();
  //this.createData('x');
  this.loadNews();
  this.loadGame();
  this.loadMissions();
  this.setMatchcard();
  this.wChampVote(this.game.players[0]);
  this.checkForChamp(this.game.players[0]);
  if(this.game.round == 'END'){
    this.goToEndGame();
  }
  },
  methods: {
    detailX: function(x, y, z){
      console.log(this.listReqs(x));
      var data = [y,z];
    },
    // Lets get started
    loadRoster:function(){
      this.$set(this,'roster', JSON.parse(localStorage.getItem('roster')));
    },
    loadStories:function(){
      this.$set(this,'stories', JSON.parse(localStorage.getItem('stories')));
    },
    loadGimmicks:function(){
      this.$set(this,'gimmicks', JSON.parse(localStorage.getItem('gimmicks')));
    },
    loadLegends:function(){
      this.$set(this,'legendRoster', JSON.parse(localStorage.getItem('legends')));
      //this.createData(this.legendRoster);
    },
    loadNews:function(){
      this.$set(this,'news', JSON.parse(localStorage.getItem('news')));
    },
    loadMissions:function(){
      this.$set(this,'missions', JSON.parse(localStorage.getItem('missions')));
    },
    loadGame:function(){
      this.$set(this,'game', JSON.parse(localStorage.getItem('gameData')));
    },
    // IN GAME
    nextTurn: function(){
      game.validate = [];
      this.game.players[this.turn].matchcard.forEach(function(match, index){
        // make sure matches are ready
        if(!match.ready){game.validate.push('Match ' + (index + 1) + ' not completed, check they have competitors and winner set');}
      });
      if(this.validate.length) {return;}
      else {
        this.turn++;
        if(this.turn == this.game.players.length){this.turn = 'REVIEW'; this.summarize()}
        else {this.checkForChamp(this.game.players[this.turn]); this.checkNews(this.game.players[this.turn])}
      }
    },
    wChampVote: function(player){
      if(!player.hasWChamp){
        if(this.game.champLoan == null){
          this.showWModal = true;
          this.wChampQ = true;
        }
      }
    },
    wChampVoteNo: function(){
        this.showWModal = false;
        this.wChampQ = false;
        this.voteRejectedMsg = false;
        this.voteApprovedMsg = false;
        this.voteCard = [];
    },
    wChampVoteYes: function(index){
      this.voteCard = [];
      this.game.players.forEach(function(){
        game.voteCard.push({vote:null});
      });
      this.tempIndex = index;
      game.voteCard[index].vote = true;
      this.voteRejectedMsg = false;
    },
    voteThis: function(vote, index){
      game.voteCard[index].vote = vote;
      let voteCount = 0;
      let sum = game.voteCard.reduce(function(acc, val) {
        voteCount += (val.vote !== null ? 1 : 0); 
        return acc + (val.vote == true ? 1 : 0);
      }, 0);
      if(voteCount >= this.game.players.length){
        switch(this.game.players.length){
          case 2:
            sum > 1 ? this.voteApproved() : this.voteRejected();
            break;
          case 3:
            sum >= 2 ? this.voteApproved() : this.voteRejected();
            break;
          case 4:
            sum >= 3 ? this.voteApproved() : this.voteRejected();
            break;
        }
      }
    },
    voteApproved: function(){
      console.log('vote approved');
      this.voteApprovedMsg = true;
      this.game.champLoan = this.tempIndex;
      this.game.players[this.tempIndex].cash -= 10;
      this.loanWChampTravels();
    },
    loanWChampTravels: function(changeover){
      this.game.players[this.tempIndex].temproster.push(this.game.wChamp);
      this.game.players.forEach(function(val, key){
        if(val.hasWChamp){
          if(!changeover){
            val.cash += 10;
            alert('you got paid');
          }
           // remove champ from owners temproster
           val.temproster.forEach(function(wrest, index){
              if(wrest == game.game.wChamp){
                val.temproster.splice(index, 1);
              }
           }); 
        }
      });
    },
    voteRejected: function(){
      this.voteRejectedMsg = true;
    },
    checkForChamp: function(player){
      this.setChampNow = false;
      if(!player.champSet){
        this.setChampNow = true;
      }
    },
    closeValidations: function(){
      this.setChampNow = false;
      this.validate = [];
    },
    checkNews: function(player){
      if(player.news){
        this.newsTitle = player.news.title;
        this.newsDetail = player.news.detail;
          if(player.news.enact){
            console.log('enact the gift/punishment');
            switch(player.news.enact.type){
              case 'money':
                console.log('they had ' + this.game.players[this.turn].cash);
                this.game.players[this.turn].cash += player.news.enact.money;
                console.log('they have ' + this.game.players[this.turn].cash);
                break;
              case 'give':
                console.log('give');
                if(player.news.enact.give == 'gimmick'){
                  if(this.game.gimmicks.length){
                    player.gimmicks.push(this.game.gimmicks[0]);
                    this.game.gimmicks.splice(0,1);
                  }
                }
                if(player.news.enact.give == 'story'){
                  if(this.game.stories.length){
                    player.stories.push(this.game.stories[0]);
                    this.game.stories.splice(0,1);
                  }
                }
                if(player.news.enact.give == 'tv'){
                  if(this.game.tv){
                    player.discards.tv++;
                    game.game.tv--;
                    var match = Object.assign({}, this.match);
                    player.matchcard.push(JSON.parse(JSON.stringify(match)));
                  }
                }
                break;
              case 'injury':
                console.log('injury');
                if(player.news.enact.injuryType == 'small'){
                  player.temproster.forEach(function(w, index){
                    if(w == player.news.enact.wrestler){
                      player.temproster.splice(index, 1);
                      console.log(game.findWrestler(w).Name + ' is poorly');
                    }
                  });
                }
                if(player.news.enact.injuryType == 'large'){
                  player.roster.forEach(function(w, index){
                    if(w == player.news.enact.wrestler){
                      player.roster.splice(index, 1);
                      console.log(game.findWrestler(w).Name + ' is out for the year');
                    }
                  });
                }
                break;
              case 'starInc':
                console.log('starInc');
                player.news.enact.starInc.forEach(function(w){
                  game.findWrestler(w).inc++;
                  if(game.findWrestler(w).inc > 3) { game.findWrestler(w).inc = 3};
                  console.log(game.findWrestler(w).Name + ' gets a push');
                });
                break;
              case 'storypop':
                console.log('storypop');
                if(player.news.enact.storypopType == 'extend'){
                  game.findStory(player.news.enact.storypop).current = 1;
                  console.log(game.findStory(player.news.enact.storypop).Name + ' has been extended!');
                }
                if(player.news.enact.storypopType == 'payoff'){
                  game.findStory(player.news.enact.storypop).payoff += 10;
                  console.log(game.findStory(player.news.enact.storypop).Name + ' heating up!');
                }
                break;
              case 'freeagent':
                console.log('freeagent');
                if(game.game.roster.length){
                  var choice = Math.round(Math.random() * game.game.roster.length);
                  player.roster.push(game.game.roster[choice]);
                  alert('Free agent ' + game.findWrestler(game.game.roster[choice]).Name + ' signed to your roster!');
                  game.game.roster.splice(choice, 1);
                }
                break;
              case 'quitter':
                console.log('quitter');
                var choice = Math.round(Math.random() * player.roster.length);
                var quitter = player.roster[choice];
                player.roster.splice(choice, 1);
                player.cash += game.findWrestler(quitter).val;
                game.roster.push(quitter);
                console.log(game.findWrestler(quitter).Name + ' has quit, you have been refunded ' + game.findWrestler(quitter).val);
                break;
            }
          }
          else {
            console.log('doesnt affect this time');
          }
      }
    },
    removeNews: function(turn){
      this.game.players[turn].news = false;
      this.newsTitle = false;
      this.newsDetail = false;
    },
    switchWChamp: function(index){
      this.tempIndex = index;
      this.switchWChampMsg = true;
    },
    isWChampAble: function(w){
      let prospect = this.findWrestler(w);
      if(prospect.type !== 'singles'){return false}
      if((prospect.val + prospect.inc) < 8){return false}
      return true;
    },
    setWChampMatch: function(w, i, index){
      this.game.players[index].tokens -= 3;
      this.game.players[index].discards.tokens += 3;
      this.addToCard(i, w, true, 0);
      this.loanWChampTravels(true);
      this.addToCard(this.game.players[index].temproster.length, this.game.wChamp, true, 1);
      this.prospectWChamp = w;
      this.prospectWChampHolder = index;
      this.confirmNewWChamp = true;
    },
    showChampRosterFunc: function(){
      this.showChampRoster = true;
    },
    makeChamp: function(wrest){
      this.game.players[this.turn].champSet = wrest;
      this.game.players[this.turn].roster.forEach(function(guy){
        game.findWrestler(guy).isChamp = false;
      });
      this.findWrestler(wrest).isChamp = true;
      this.setChampNow = false;
      this.showChampRoster = false;
    },
    sumValues: function(val, index){
      let totalGain = 0;
      val.matchcard.forEach(function(match){
        if(match.competitors[0] && match.competitors[1]){
          let matchSum = game.findWrestler(match.competitors[0]).val + game.findWrestler(match.competitors[1]).val;
          matchSum += game.findWrestler(match.competitors[0]).inc;
          matchSum += game.findWrestler(match.competitors[1]).inc;
          game.findWrestler(match.competitors[0]).isChamp ? matchSum += 1 : matchSum += 0;
          game.findWrestler(match.competitors[1]).isChamp ? matchSum += 1 : matchSum += 0;
          // rather than give 5, give the standard of 3, then check a new gimmick attr of 'bonus', if present call a func with gimmick
          // id and 2 competitor ids (spread operator?) and check for the gimmick bonus requirements? return int for bonus points
          if(match.gimmick){matchSum += 5; game.game.players[index].discards.gimmicks.push(match.gimmick)}
          if(match.gimmickAffect){game.affectGimmick(match)}
          if(match.story){
            const matchStoryDetail = game.findStory(match.story);
            if(matchStoryDetail.current == matchStoryDetail.lengthDur){
              matchSum += matchStoryDetail.payoff;
              game.game.players[index].discards.stories.push(match.story);
              game.game.players[index].stories.forEach(function(val,key){
                if(val == match.story){game.game.players[index].stories.splice(key,1)}
              })
            }
            else {
              matchStoryDetail.current++;
            }
          }
          game.summaryValues[index].matches.push(matchSum);
          totalGain += matchSum;
        }
      });
      // check for arena
      if(val.arena){
        game.summaryValues[index].bonus = totalGain;
        val.arena = false;
      }
      game.summaryValues[index].total = totalGain + game.summaryValues[index].bonus;
      val.cash += totalGain;
    },
    incWinners: function(val, index){
      val.matchcard.forEach(function(match){
        if(match.winner == match.competitors[0]){
          game.findWrestler(match.competitors[0]).inc >= 3 ? game.findWrestler(match.competitors[0]).inc = 3 : game.findWrestler(match.competitors[0]).inc++;
          game.findWrestler(match.competitors[1]).inc = 0;
        }
        else {
          game.findWrestler(match.competitors[1]).inc >= 3 ? game.findWrestler(match.competitors[1]).inc = 3 : game.findWrestler(match.competitors[1]).inc++;
          game.findWrestler(match.competitors[0]).inc = 0;
        }
      });
    },
    affectGimmick: function(matchdet){
      var gimmickdetail = this.findGimmick(matchdet.gimmick);
      switch(gimmickdetail.type){
       case 'HEELFACE':
        console.log('switch the gimmick affect heelface');
        game.roster.forEach(function(val, key){
          if(val.Id == matchdet.gimmickAffect){
            console.log(game.roster[key].Name + game.roster[key].heelface + ' turns!');
            game.roster[key].heelface === 'H' ? game.roster[key].heelface = 'F' : game.roster[key].heelface = 'H';
          }
        });
        break;
       case 'TITLECHANGE':
        game.roster.forEach(function(val, key){
          if(val.Id == matchdet.competitors[0] || val.Id == matchdet.competitors[1]){
            game.roster[key].isChamp = false;
          }
          if(val.Id == matchdet.gimmickAffect){
            game.roster[key].isChamp = true;
            alert(game.roster[key].Name + ' is new champ!');
          }
        });
        break;
      }
    },
    checkArena: function(value, index){

    },
    summarize: function(){
        game.summaryValues = [];
        this.game.players.forEach(function(value, index) {
        game.summaryValues.push({'matches':[],'bonus':0, 'total':0});
        game.sumValues(value, index);
        game.incWinners(value, index);
        game.checkArena(value, index);
       });
        if(this.prospectWChamp){
          this.game.players.forEach(function(value, index) {
            value.hasWChamp = false;
          });
          this.findWrestler(this.game.wChamp).isWChamp = false;
          this.game.wChamp = this.prospectWChamp;
          this.findWrestler(this.game.wChamp).isWChamp = true;
          this.game.players[this.prospectWChampHolder].hasWChamp = true;
          this.prospectWChamp = null;
          this.prospectWChampHolder = null;
          alert('New world champ');
        }
        game.awardTopDraw();
        this.game.players.forEach(function(value, index) {
            game.enactNewsItem(index);
        });
    },
    indexOfMax: function(arr) {
      if (arr.length === 0) {
          return -1;
      }
      var max = arr[0];
      var maxIndex = 0;
      for (var i = 1; i < arr.length; i++) {
          if (arr[i] > max) {
              maxIndex = i;
              max = arr[i];
          }
      }
      return maxIndex;
    },
    awardTopDraw: function(){
      let drawTotals = [];
      game.summaryValues.forEach(val=>drawTotals.push(val.total));
      var i = this.indexOfMax(drawTotals);
      this.game.players[i].tokens++;
      if(this.game.champLoan != null){
        if(i == this.game.champLoan){
          alert('champ on top show, everyone wins!!');
          this.game.players.forEach(function(val, key){
            val.cash += 10;
          });
          game.summaryValues.forEach(function(val, key){
            val.bonus += 10;
            val.total += 10;
          });
        } 
      }
      else {
        this.game.players.forEach(function(val, key){
            if(val.hasWChamp){
              if(i == key){
                alert('champ on top show, everyone wins!!');
                game.game.players.forEach(function(val, key){
                  val.cash += 10;
                });
                game.summaryValues.forEach(function(val, key){
                  val.bonus += 10;
                  val.total += 10;
                });
              }
            }
        });
      }
      this.game.champLoan = null;
    },
    enactNewsItem: function(index){
      console.log('enact news for player ' + index + ' with news item ' + this.game.news[0]);
      let newsResult = news.acessNews(this.news[this.game.news[0] - 1], this.game.players[index], this.summaryValues, index);
      this.news[this.game.news[0] - 1].enact = newsResult;
      console.log(this.news[this.game.news[0] - 1]);
      // add to players news then remove from pile
      this.game.players[index].news = this.news[this.game.news[0] - 1];
      this.game.news.splice(0,1);
    },
    nextRound: function(){
      this.setMatchcard();
      if(this.game.round >= this.totalRounds){
        this.goToEndGame();
      }
      else {
        this.game.round++;
        this.turn = 'WCHAMP';
      }
      this.saveData();
    },
    goToRegularRounds: function(){
      //debugger;
      this.turn = 0;
      this.checkForChamp(this.game.players[this.turn]);
      this.checkNews(this.game.players[this.turn]);
    },
    goToEndGame: function(){
      this.game.round = "END";
      var thisgame = this;
      missions.init(thisgame.game);
      let endTotalsArr = [];
      let gameGoalWinner = missions.accessGameMission(thisgame.findMission(thisgame.game.goal).theme);
      console.log('game mission winner - ', gameGoalWinner !== null ? gameGoalWinner : 'no clear winner');
      this.game.players.forEach(function(player, i){
        thisgame.endTotals.push({baseCash:0,missionSuccess:false,gameGoalWinner:false,totalCash:0,winner:false});
        thisgame.endTotals[i].baseCash += player.cash;
        thisgame.endTotals[i].totalCash += player.cash;
        // bonus for passing your goal
        var playerGoal = thisgame.findMission(player.goal).theme;
        let rosterValTotal = [];
        if(playerGoal === "3ABOVE9"){
          player.roster.forEach(wrtlr=>{rosterValTotal.push(thisgame.findWrestler(wrtlr).val + thisgame.findWrestler(wrtlr).inc)});
          console.log('rosterone');
        }
        console.log('player ' + i + ' mission success -- ' + missions.acessPlayerMission(playerGoal, i, rosterValTotal));
        if(missions.acessPlayerMission(playerGoal, i, rosterValTotal)){
          thisgame.endTotals[i].missionSuccess = true;
          thisgame.endTotals[i].totalCash += 50;
        }
        // bonus for overral game winner
        if(gameGoalWinner == i){
          thisgame.endTotals[i].gameGoalWinner = true;
          thisgame.endTotals[i].totalCash += 50;
        }
        endTotalsArr.push(thisgame.endTotals[i].totalCash);
      }); //foreach loop
      const theDeFactoWinner = missions.indexOfMaxValue(endTotalsArr);
      thisgame.endTotals[theDeFactoWinner].winner = true;
    },
    saveData: function(){
      //localStorage.setItem('gimmicks', JSON.stringify(this.gimmicks));
      //localStorage.setItem('news', JSON.stringify(this.news));
      localStorage.setItem('stories', JSON.stringify(this.stories));
      localStorage.setItem('roster', JSON.stringify(this.roster));
      localStorage.setItem('gameData', JSON.stringify(this.game));
      console.log('data saved');
    },
    setMatchcard: function(){
      var match = Object.assign({}, this.match);
      this.game.players.forEach(function (value) {
        value.matchcard = [];
        // 3 match default
        value.matchcard.push(JSON.parse(JSON.stringify(match)));
        value.matchcard.push(JSON.parse(JSON.stringify(match)));
        value.matchcard.push(JSON.parse(JSON.stringify(match)));
        value.temproster = Array.from(value.roster);
      });
    },
    findWrestler: function(id){
      var result = null;
      let isLegend = false;
      if(id % 1 != 0){isLegend = true}
        if(isLegend){         
          this.legendRoster.forEach(wrestler => {
            if(wrestler.Id == id){
              result = wrestler;
            }
          });
        }
        else {
          this.roster.forEach(wrestler => {
            if(wrestler.Id == id){
              //console.log(wrestler)
              result = wrestler;
            }
          });
        }
      if(!result){return}
      return result;
    },
    findGimmick: function(id){
      var result = null;
      this.gimmicks.forEach(gimmick => {
        if(gimmick.Id == id){
          result = gimmick;
        }
      });
      if(!result){return}
      return result;
    },
    findStory: function(id){
      var result = null;
      this.stories.forEach(story => {
        if(story.Id == id){
          result = story;
        }
      });
      if(!result){return}
      return result;
    },
    findMission: function(id){
      var result = null;
      this.missions.forEach(mission => {
        if(mission.Id == id){
          result = mission;
        }
      });
      if(!result){return}
      return result;
    },
    openRoster: function (matchno, card) {
      //game.roster[0].isChamp = true;
      this.currentMatch = matchno;
      this.currentPos = card;
      const poproster = document.querySelector('.poproster');
      poproster.style.top = `${event.pageY + 10}px`;
      poproster.style.left = `${event.pageX + 10}px`;
      //console.log(event);
      this.popRoster = true;
    },
    openGimmick: function(matchno){
      this.currentMatch = matchno;
      const selectedMatch = this.game.players[this.turn].matchcard[this.currentMatch];
      if(this.findWrestler(selectedMatch.competitors[0]).isChamp || this.findWrestler(selectedMatch.competitors[1]).isChamp) {this.titleCards = true;}
      else {this.titleCards = false;}
      const popgimmick = document.querySelector('.popgimmick');
      popgimmick.style.top = `${event.pageY + 10}px`;
      popgimmick.style.left = `${event.pageX + 10}px`;
      this.popGimmick = true;
    },
    openStory:function(matchno){
      this.currentMatch = matchno;
      const selectedMatch = this.game.players[this.turn].matchcard[this.currentMatch];
      const popstory = document.querySelector('.popstory');
      popstory.style.top = `${event.pageY + 10}px`;
      popstory.style.left = `${event.pageX + 10}px`;
      this.popStory = true;
    },
    closePop: function(){
      this.popRoster = false;
      this.popGimmick = false;
      this.popStory = false;
    },
    addToCard: function(wrestler, id, first, firstIndex){
      if(first){
        this.game.players[this.tempIndex].matchcard[0].competitors[firstIndex] = id;
        this.game.players[this.tempIndex].temproster.splice(wrestler, 1);  
      }
      else {
        this.game.players[this.turn].matchcard[this.currentMatch].competitors[this.currentPos] = id;        
        this.game.players[this.turn].temproster.splice(wrestler, 1);      
      }
      this.closePop();
      if(first){
        this.game.players[this.tempIndex].matchcard[0].ready = this.validateMatch(this.game.players[this.tempIndex].matchcard[0], 'switch');        
      }
      else {
        this.game.players[this.turn].matchcard[this.currentMatch].ready = this.validateMatch(this.game.players[this.turn].matchcard[this.currentMatch]);
      }
      game.$forceUpdate();
    },
    addGimmickCard:function(gimmick, index){
      this.game.players[this.turn].matchcard[this.currentMatch].gimmick = gimmick;
      this.game.players[this.turn].gimmicks.splice(index, 1);
      this.closePop();
      if(this.findGimmick(gimmick).affect == 'true'){this.game.players[this.turn].matchcard[this.currentMatch].gimmickAffect = this.game.players[this.turn].matchcard[this.currentMatch].competitors[0]}
      if(this.findGimmick(gimmick).type == 'TITLECHANGE') {
        if(this.findWrestler(this.game.players[this.turn].matchcard[this.currentMatch].competitors[0]).isChamp == true) {
          this.game.players[this.turn].matchcard[this.currentMatch].gimmickAffect = this.game.players[this.turn].matchcard[this.currentMatch].competitors[1];
          this.game.players[this.turn].matchcard[this.currentMatch].winner = this.game.players[this.turn].matchcard[this.currentMatch].competitors[1];
        } else {
          this.game.players[this.turn].matchcard[this.currentMatch].gimmickAffect = this.game.players[this.turn].matchcard[this.currentMatch].competitors[0];
          this.game.players[this.turn].matchcard[this.currentMatch].winner = this.game.players[this.turn].matchcard[this.currentMatch].competitors[0];
        }
      }  
    },
    addStoryCard: function(story, index){
      this.game.players[this.turn].matchcard[this.currentMatch].story = story;
      const storyDetail = this.findStory(story);
      storyDetail.active = true;
      storyDetail.competitors = this.game.players[this.turn].matchcard[this.currentMatch].competitors;
      this.closePop();
    },
    removeMatch: function(player, match){
      this.game.players[this.turn].matchcard.splice(match, 1);
      game.$forceUpdate();
    },
    validateMatch: function(match, titleswitch){
      if(match.competitors.length >1){
        match.competitors.forEach(function(val, key){
          if(game.findWrestler(val).isWChamp){
            match.winner = match.competitors[key];
          }
        });
        if(titleswitch == 'switch'){
          match.winner = match.competitors[0];
        }
      }
      let ready = false;
      match.competitors[0] && match.competitors[1] && match.winner ? ready = true : ready = false;
      return ready;
    },
    setWinner: function(match, winner, matchno){
      //console.log(match, winner);
      this.currentMatch = matchno;
      match.winner = winner;
      game.game.players[this.turn].matchcard[this.currentMatch].ready = this.validateMatch(match);
      game.$forceUpdate();
    },
    // store
    openStore:function(show){
      this.showStore = show;
    },
    purchaseRoster:function(wrestler, cost){
      if(game.game.players[this.turn].cash < cost){alert('you dont be gettin that');return}
      game.game.players[this.turn].roster.push(wrestler);
      game.game.players[this.turn].cash -= cost;
      game.game.roster.forEach(function(val, index){
        if(wrestler == val){game.game.roster.splice(index, 1);}
      });
    },
    purchaseLegend:function(legend, index){
      var cost = this.findWrestler(legend).val;
      if(game.game.players[this.turn].cash < cost){return}
      game.game.players[this.turn].legends.push(legend);
      game.game.players[this.turn].temproster.push(legend);
      game.game.players[this.turn].cash -= cost;
      game.game.players[this.turn].discards.legend++;
      game.game.legends.forEach(function(val, index){
        if(legend == val){game.game.legends.splice(index, 1);}
      });
    },
    purchaseGimmick:function(){
      if(game.game.players[this.turn].cash <= 5){return}
      game.game.players[this.turn].cash -= 5;
      game.game.players[this.turn].gimmicks.push(game.game.gimmicks[0]);
      game.game.gimmicks.splice(0, 1);
    },
    purchaseStory:function(){
      if(game.game.players[this.turn].cash <= 5){return}
      game.game.players[this.turn].cash -= 5;
      game.game.players[this.turn].stories.push(game.game.stories[0]);
      game.game.stories.splice(0, 1);
    },
    getTv:function(){
      if(game.game.players[this.turn].cash <= 20){return}
      game.game.players[this.turn].cash -= 20;
      game.game.players[this.turn].discards.tv++;
      game.game.tv--;
      var match = Object.assign({}, this.match);
      game.game.players[this.turn].matchcard.push(JSON.parse(JSON.stringify(match)));
    },
    getArena:function(){
      if(game.game.players[this.turn].cash <= 50){return}
      game.game.players[this.turn].cash -= 50;
      game.game.players[this.turn].discards.arena++;
      game.game.arena--;
      game.game.players[this.turn].arena = true;
    },
    checkNum: function(thing){
      if(thing){var result = thing.length}
      if(result) {return false}
      else {return true}
    },
    rC: function(input, check){
      var comp = check.split(':');
      var pars = parseInt(comp[1].substring(1));
      var result;
      if(comp[1][0] == '>') {
        result = input[comp[0]] >= pars
      }
      else if(comp[1][0] == '<'){
        result = input[comp[0]] <= pars;
      }
      else {
        result = input[comp[0]] == comp[1].substring(1);
      }
      return result;
    },
    summRes: function(data, check){
      if(this.rC(data[0], check[0]) && this.rC(data[1], check[1]) || this.rC(data[1], check[0]) && this.rC(data[0], check[1])){        
        return true;
      } else {
        return false;
      }
    },
    myStory: function(story, competitors){
      // story is active and does not contain these two guys => true
      let storyDetail = this.findStory(story);
      if(storyDetail.active){
        if(storyDetail.competitors[0] == competitors[0] || storyDetail.competitors[0] == competitors[1]){
          if(storyDetail.competitors[1] == competitors[0] || storyDetail.competitors[1] == competitors[1]){
            return false;
          }
          else {return true;}
        }
        else {return true;}
      }
      else {
        return false;
      }
    },
    listReqs: function(input){
      var msg = this.textReq(input[0]);
      msg += ', ';
      msg += this.textReq(input[1]);
      return msg;
    },
    textReq: function(r){
      var split = r.split(':');
      var msg = 'guy with ';
      msg += split[0];
      if(split[1][0] == '>'){msg += ' more than ' + split[1].substring(1)}
      if(split[1][0] == '<'){msg += ' less than ' + split[1].substring(1)}
      if(split[1][0] == '='){msg += ': ' + split[1].substring(1)}
      return msg;
    },
    // Menu
    expandRoster: function(show){
      this.expandedGimmick = false;
      this.expandedStory = false;
      this.expandedRoster = !this.expandedRoster;
    },
    expandGimmick: function(show){
      this.expandedRoster = false;
      this.expandedStory = false; 
      this.expandedGimmick = !this.expandedGimmick;
    },
    expandStory: function(show){
      this.expandedRoster = false;
      this.expandedGimmick = false;
      this.expandedStory = !this.expandedStory;
    },
    imgPath: function (path) {
      return path.replace(/ /g,'');
    }
  }
});

/*
//
SETUP
*- Json files for each data list get
*- Store to localstorage if not found (browser based game)
*- Intro page for setting up game. set num players (with names), 
*divide up roster purchase, share cards and missions. When game setup go
to main game page.

MAIN
- If no storage token revert to setup
*- do not copy data and keep records, use lookup functions to find data
from storage and use ids in references.
- 4 phase
  - purchases/plans (vote for hosting wchamp, buy extra cards)
  - build card (make matches, add gimmicks)
  - present and accumulate (tally costs, award highest draw)
  - news card draw and action (each player served one action)
  x 12 rounds (1 year)
Following final round tally all $ and award winner
//


NEXT STEPS
// SETUP
*- summary display values (per match breakdown)
- validate choices (match with 1 wrestler, type mismatch, select winner)
*- winner inc, loser inc reset
*- reset temproster and matchcard for next round
*- award round winner with token

// GIMMICK
*- add to match (remove from users set)
- remove (return to users set)
*- count value in match rating
*- add card to players discard gimmick pile
*- enact actions (change title, heel/face turns)

// STORIES
*- add story to match (if applicable)
*- increment length in summary
*- end if reached payoff, payoff added to match, card added to discard

// TERRITORY CHAMP
*- set on game start
- switch title (no payoff) option
- list on player details
*- +4 on champ in matches

// LEGENDS
*- added to matchcard roster (distinguish type to avoid id clash)
- prevent story or title switch/heelface gimmick
*- check values tracked
*- inc amount used on players record (eqiv of added to discard pile)

// ARENA / TV
*- increment arena when bought (equiv of discard)
*- flag to double in summary
*- add bonus double the total of matches
*- increment tv when bought (equiv of discard)
*- add additional match

// STORE
*- buy gimmick
*- buy roster
*- buy story
*- buy legend
*- buy tv time (extra match)
*- buy stadium (double value)

// WCHAMP (awards based on scores, vote for hire, use tokens to switch)
*- begin with question, then vote (return true/false) (unless has champ)
*- rules for getting champ on loan, goes to matchcard, pay 10 (to owner if owned)
*- rules for award: everyone gets 10 when on highest.
*- rules for switch: use 3 tokens (to discard) then autofix the match/opponent/winner
*- setting for champowner to navigate other functions

    *click yes and open vote panel, with length of users, current user select defaulted yes
    *once vote tally equals all votes, count and return true or false
    *if true, set champloan to player index(turn), (check champloan to stop others getting vote),
    *find hasWChamp and remove wchamp from temproster, add to loaners temproster (where used, if wchamp they win)
    *in summary, check for champloan, if yes check if matches highest earner (if so all get 10)
    *if no champloan, check for champowner, if yes check if matches highest earner (if so all get 10)
    *set champloan to null

// Reimplement champloan/switch
*- new step between summary and first step
*- each user listed, click to open loan vote or perform switch
*- multiple votes can be taken, once 1 vote accepted or switch stage over
*- set current stuff (matchcard and temproster must be done before)

// NEWS
*- draw news card beginning of each player switch
*- enact based on name (each has specific rules)

// MISSIONS

// END GAME (end after 12, tally totals(with missions) and announce winner)

// Bugs
- wchamp when loaned, is added to temproster (already added to card)
*- tokens spent are added as minus
*- switching next chara keeps new champ list open
- injured star kept in temproster
- same for quitter
- champ switch not done correctly
- spent money not added to player discards
- bug on finish too soon
- no reset after switching wchamp on first stage

// WRAP UP
- remove from card (re-add to temproster)
- remove gimmick from matchcard
- if no data of any kind reload from storage (if no storage note error then return to index)
- highlight top rated match on summary (transition screen before summary, then highlights on summary at top)
- notification that gimmick/story added to your packs
- gimmick strengths for wrestler types


*/