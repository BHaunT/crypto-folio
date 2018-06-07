

// var apiURL = 'https://api.github.com/repositories/11730342/commits?per_page=5&sha=';
// var apiURL = 'https://api.coinmarketcap.com/v1/ticker/';

import EventBus from './eventBus.js';
import myMixin from './mixins.js';
import './components.js';





// new Vue({
var w = new Vue({
    el: '#masterWallet',
    delimiters: ['${', '}'],
    mixins: [myMixin],
    data: function () {
        return {
            wallet:'wallet',
            apies : [
                    "https://api.coinmarketcap.com/v1/ticker/",
                    "https://api.coinmarketcap.com/v1/ticker/dent/",
                    "https://api.coinmarketcap.com/v1/ticker/pillar/",
                    // "https://api.coinmarketcap.com/v1/ticker/theta-token/",
            ],
            globalMarket : "https://api.coinmarketcap.com/v1/global/",
            globalMarketCap: 0,
            bitcoinDominance: 0,
            total24HrVolume: 0,
            allCoins: [],

            // THIS HAS BEEN EXTRACTED TO PULL FROM A DATA ATTRIBUTE <data-holdings='{}'>
            myHoldings: {},
            myWallet: [],
            // myHoldingsTotalInUSD: 0,
            // myHoldingsTotalInBTC: 0,
            bitcoinPrice: 0,

            fetchTick: 0,
            descrete:true
        }
    },

    created: function() {
        console.log('primaryComponent created() ~~~~~~~~~');
    },

    mounted: function(){
        console.log('mounted()');
        // var x = this.$el.getAttribute('data-holdings');
        // this.myHoldings = JSON.parse(x);

        // console.log(this.myHoldings);


        this.fetchData();
        this.fetchGlobalData();


        // setInterval(function () {
        //     this.fetchData();
        // }.bind(this), 30000);

    },

    // computed: {
    //     calculateHoldings: function(){
    //         return this.myWallet.reduce( (total, c) => {
    //             return total + c.holding_value;
    //         }, 0)
    //     }
    // },

    // filters:{
    //     formatUSD: function(n){
    //         return (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    //     }
    // },

    methods: {

        // EXPLAIN IN ENGLISH WHAT THIS DOES
        // buildMyWallet: function(coins) {
        //     return coins.filter( coin => {
        //         return Object.keys(this.myHoldings).indexOf(coin.symbol) >= 0;
        //     }).map( c => {
        //         return Object.assign({}, c, {
        //             holding: this.myHoldings[c.symbol]
        //             ,holding_value:  c.price_usd * (this.myHoldings[c.symbol] )
        //         });
        //     }).sort( (a, b) => {
        //         return a.holding_value - b.holding_value;
        //     }).reverse();
        // },


        //
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
                    return acc.concat(cur);
                }, [] );

                // self.myWallet = self.buildMyWallet(self.allCoins);
                // self.totalUSD();
                // self.totalBTC();
                // self.buildChart2();

                // document.title = this.formatAsUSD(this.myHoldingsTotalInUSD);

                console.log('data is available');

                Vue.nextTick(function () {
                    Vue.nextTick(function () {
                        EventBus.$emit('on-data-has-loaded');
                    })
                })

            }).catch(e => {
                console.log('oops, something has gone wrong.', e);
            });


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

            // self.fetchTick++;

        },

        buildChart2: function(){
            // console.log('this.el', this.$el);
            // console.log('``` ', this.$el.querySelectorAll(".wallet") );

            var thisWallet = this.$el;
            var thisChart = thisWallet.querySelectorAll(".chart")[0];
            var thisLegend = thisWallet.querySelectorAll(".legend")[0];

            var chartData = [];
            chartData = chartData.concat( this.myWallet.filter(coin => coin.holding > 0 ).map( coin => [coin.name, coin.holding_value] ) );
            // console.log('chartData', chartData);

            var chartTitle = "";

            // if (!this.descrete){
                // chartTitle = "$ " + String(this.formatAsUSD(this.myHoldingsTotalInUSD))+'\n \n'+String(this.myHoldingsTotalInBTC)+' BTC';
            // }

            var chart = bb.generate({
                // bindto: "#chart",
                bindto: thisChart,
                donut: {
                    title: chartTitle,
                    // padAngle: 0.01,
                    label: {
                        ratio: 1
                    }
                },
                legend:{
                    show:false,
                    position:"right",
                    // contents: {
                        // bindto: thisLegend,
                        // template: '<div style="color:#fff; padding:10px 15px; background-color:{=COLOR}">{=TITLE}</div>',
                    // },
                    // item: {
                        // onover: function(id) {
                        //     console.log(id);
                        //         d3.select(".bb-chart-arc.bb-target-"+ id +" text")
                        //         .style("fill-opacity", 1);
                        // },
                        // onout: function(id) {
                        //     console.log(id);
                        //         d3.select(".bb-chart-arc.bb-target-"+ id +" text")
                        //         .style("fill-opacity", 0);
                        // },
                        // onclick: function(id){
                            // THIS IS IN PLACE TO NULLIFY THE DEFAULT BEHAVIOR
                            // console.log(id);
                        // }
                    // }
                },
                data: {
                    type: "donut",
                    columns: chartData,
                    labels: false,
                    // labels: {
                        // format: function(v, id, i, j) {
                            // console.log('labels format something 1');
                            // console.log(v, id, i, j);
                        // },
                        // position does not seem to work:
                        // position: {
                            // x: 0,
                            // y: 0
                        // }
                    // },
                    colors: {
                        "Bitcoin" : "#f9a021",
                        "Litecoin" : "#b6b6b6",
                        "Ethereum" : "#999999",
                        "OmiseGO" : "#3979ff",
                        "EOS" : "#9aa3ee",
                        "Populous" : '#cfb949',
                        "ReddCoin" : "#f01416",
                        "Veritaseum" : "#ff991d",
                        "Pillar" : "#00beff",
                        "Dent" : "#af0000",
                        "Cardano" : "#33c8c9"
                    }
                }


                // chart.data.colors({
                //     "Bitcoin" : "#f9a021",
                //     "Litecoin" : "#b6b6b6",
                //     "Ethereum" : "#999999",
                //     "OmiseGO" : "#3979ff",
                //     "EOS" : "#9aa3ee",
                //     "Populous" : '#cfb949',
                //     "ReddCoin" : "#f01416",
                //     "Veritaseum" : "#ff991d",
                //     "Pillar" : "#00beff",
                //     "Dent" : "#af0000",
                //     "Cardano" : "#33c8c9"
                // })



            });

        }

    }

})


// });
