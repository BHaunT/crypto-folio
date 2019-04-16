

import EventBus from './eventBus.js';
import myMixin from './mixins.js';


Vue.component("jsonwallet", {
  mixins: [myMixin],

  data: function() {
    return {
      myHoldingsTotalInUSD: 0,
      myHoldingsTotalInBTC: 0,
      thisWallet: null,
      walletJson: null,

      globalMarketCap: 0,
      bitcoinDominance: 0,
      total24HrVolume: 0
    };
  },

  props: ["holding", "jsonholding", "allCoins", "title"],

  template: `
    <div>
      <h1>HELLO jsonwallet FRIEND</h1>
      <div v-for="wallets in walletJson">
        <div v-for="wallet in wallets">
            <wallet :all-coins="allCoins" :holding=wallet>
                <h3>{{wallet}}</h3>
            </wallet>       
        </div>
      </div>
    </div>`,

  created() {
    console.log("<jsonwallet> component created");
    // EventBus.$on("on-data-has-loaded", this.buildWallet);
    // console.log('holding ', this.holding);
    console.log(this);
    // console.log(this.$el);
    // console.log(this.$refs.jsonwallet.dataset.jsonholding);
    // console.log(this.$el.dataset.jsonholding);
  },
  mounted() {
    // console.log("~~mounted()", this.$el.dataset.jsonholding);
    this.loadJSON(this.$el.dataset.jsonholding);
  },
  methods: {
    buildWallet() {
      console.log("oh.. hello component for my jsonwallet !");
    },
    loadJSON(json) {
      let self = this;
      // console.log(json);
      fetch(json)
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          console.log("!1", myJson);
          self.walletJson = myJson;
          // self.walletJson = JSON.stringify(myJson);
          console.log(self.walletJson);
          // console.log('!2', JSON.stringify(myJson));
        })
        .catch(function() {
          console.log("there must have been an error");
        });
    }
  }
});


export default '';
 