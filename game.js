var app = new Vue({
  el: '#game',
  data: {
    rawRoster: [],
    rawMissions: [],
    rawStories: [],
    rawGimmicks: [],
    rawLegends: [],
    rawNews:[]
  },
  mounted: function() {
  this.getRoster();
  },
  methods: {
    getRoster:function(){
      fetch('/roster.json')
      .then(blob => blob.json())
      .then((data) => {this.$set(this,'rawRoster', data); localStorage.setItem('roster', JSON.stringify(data))});
    }
  },
  components: {
    'wrestler': {
      props: ['data', 'cash'],
      template: '<div class="box" v-bind:class="{ assigned: data.assigned || !cash }">\
      <h2>{{data.Name}} ({{data.val}})</h2>\
      ({{data.Val}}) <a v-on:click="purchaseRoster()" v-if="!data.assigned">Purchase</a>\
      </div>',
      methods: {
        purchaseRoster: function () {
          this.data.assigned = true;
          app.$emit('addToRoster', {id:this.data.Id, val:this.data.val});
          app.$emit('nextPlayer', 'switch to' + this.data.Id);
        }
      }
    }
  }
});


/*
//
SETUP
- Json files for each data list get
- Store to localstorage if not found (browser based game)
- Intro page for setting up game. set num players (with names), 
divide up roster purchase, share cards and missions. When game setup go
to main game page.

MAIN
- If no storage token revert to setup
- do not copy data and keep records, use lookup functions to find data
from storage and use ids in references.
- 4 phase
  - purchases/plans (vote for hosting wchamp, buy extra cards)
  - build card (make matches, add gimmicks)
  - present and accumulate (tally costs, award highest draw)
  - news card draw and action (each player served one action)
  x 12 rounds (1 year)
Following final round tally all $ and award winner
//
*/