'use strict';

var missions = new Vue({
  el: '#missions',
  data: {},
  methods: {
    acessPlayerMission: function acessPlayerMission(type, player) {
      console.log(player);
      //      console.log('analysing ' + type);
      switch (type) {
        case 1:
          // Do whatever checks if value met true
          break;
        case 2:
          // Do whatever checks if value met true
          break;
        default:
          return false;
      }
    }
  }
});