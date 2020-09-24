

// var apiURL = 'https://api.github.com/repositories/11730342/commits?per_page=5&sha=';
// var apiURL = 'https://api.coinmarketcap.com/v1/ticker/';
 
 
import Vue from "vue/dist/vue.esm.js";
// import Vuex from "vuex";
// import Rx from "rxjs/Rx";
import _ from "lodash";

 
import EventBus from './eventBus.js';
import myMixin from './mixins.js';
import store from "./store.js";

import './component-jsonwallets.js';
import './component-wallet.js';
import './component-coinbox.js';
import './component-coin.js';
import './component-chart.js';
import './component-totals.js';

  
// https://pro.coinmarketcap.com/migrate/

var masterWallet = new Vue({
    el: '#masterWallet',
    delimiters: ['${', '}'],
    mixins: [myMixin],
    store: store,
    data: function () {
        return {
          wallet: "wallet",
          apies: [
            "https://api.coinmarketcap.com/v1/ticker/",
            "https://api.coinmarketcap.com/v1/ticker/dent/",
            "https://api.coinmarketcap.com/v1/ticker/pillar/",
            "https://api.coinmarketcap.com/v1/ticker/veritaseum/",
            "https://api.coinmarketcap.com/v1/ticker/substratum/",
            // "https://api.coinmarketcap.com/v1/ticker/theta-token/",
          ],

          globalMarket: "https://api.coinmarketcap.com/v1/global/",
          globalMarketCap: 0,
          bitcoinDominance: 0,
          total24HrVolume: 0,
            //   allCoin: [],
          allCoins: [],
          bitcoinPrice: 0,
          thisWallet: null,
          masterWallet: null,
          fetchTick: 0,
            //   myHoldingsTotalInUSD: 0,
            //   myHoldingsTotalInBTC: 0,

            //   descrete:true
        };
    },

 

    created: function() {
        console.log('primaryComponent created() ~~~~~~~~~');
    },



    mounted: function(){
        this.fetchData();
        this.fetchGlobalData();
    },



    methods: {

        fetchData: function(){

            var self = this;

            let status = (r) => {
                if (r.ok) {
                    return r;
                } else {
                    throw new Error(r.statusText);
                }
            }

            let _json = (r) => r.json();

            let promises = self.apies.map(url => {
                return fetch(url).then(_json)
            });

            Promise.all(promises).then(d => {

                self.allCoins = d.reduce((acc, cur) => {
                // self.$root.allCoins = d.reduce((acc, cur) => {
                    return acc.concat(cur);
                }, [] );

                store.commit('addAllCoins', self.allCoins);

                self.masterWallet = self.mixinBuildWallet(self.totalHoldings, self.allCoins);
                // self.masterWallet = self.mixinBuildWallet(self.totalHoldings, self.$root.allCoins);

                console.log('data is available', self.masterWallet);
                
                Vue.nextTick(function () {
                // console.log( "?~~~~~~~ ", this.$store.getters.allCoins );
                    EventBus.$emit(
                        "on-data-has-loaded"
                    );
                })

            }).catch(e => {
                console.log('oops, something has gone wrong.', e);
            });

            // console.log('? ', self.allCoins);

        },









        fetchGlobalData: function(){
            var self = this;

            fetch(self.globalMarket)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJSON) {
                    self.bitcoinDominance = myJSON.bitcoin_percentage_of_market_cap;
                    self.total24HrVolume = self.wordifyNumber(myJSON.total_24h_volume_usd);
                    self.globalMarketCap = self.wordifyNumber(myJSON.total_market_cap_usd);
                });

            self.fetchTick++;

        }







    }

})
