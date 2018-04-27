

// var apiURL = 'https://api.github.com/repositories/11730342/commits?per_page=5&sha=';
var apiURL = 'https://api.coinmarketcap.com/v1/ticker/';




/*
const vues = document.querySelectorAll(".wallet");
const eachVue = Array.prototype.forEach;
eachVue.call(vues, (el, index) => {
    new Vue({
 */




new Vue({

    el: '#wallet',
    // el,
    delimiters: ['${', '}'],

    data: {
        apies : [
                "https://api.coinmarketcap.com/v1/ticker/",
                "https://api.coinmarketcap.com/v1/ticker/dent/",
                "https://api.coinmarketcap.com/v1/ticker/pillar/",
        ],
        globalMarket : "https://api.coinmarketcap.com/v1/global/",
        globalMarketCap: 0,
        bitcoinDominance: 0,
        total24HrVolume: 0,
        allCoins: [],
        // THIS HAS BEEN EXTRACTED TO PULL FROM A DATA ATTRIBUTE <data-holdings='{}'>
        myHoldings: {
            // "BCH": 1,
            // "BTC": 2,
            // "LTC": 1,
            // "ETH": 1,
            // "PPT": 20,
            // "ADA": 500,
            // "OMG": 30,
            // "EOS": 130,
            // "RDD": 1800,
            // "SALT": 0,
            // "VERI": 2,
            // "PLR": 350
        },
        myWallet: [],
        myHoldingsTotalInUSD: 0,
        myHoldingsTotalInBTC: 0,
        fetchTick: 0,
        bitcoinPrice: 0,

    },





    mounted: function() {

        var x = this.$el.getAttribute('data-holdings');
        this.myHoldings = JSON.parse(x);

        console.log(this.myHoldings);

        this.fetchData();

        setInterval(function () {
            this.fetchData();
        }.bind(this), 60*1000);

    },







    computed: {
        calculateHoldings: function(){
            return this.myWallet.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)
        }
    },





    filters:{
        formatUSD: function(n) {
            return (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
    },




    methods: {
        formatAsUSD: function(n) {
            return (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        },

        coinClass: function(c){
            let icon;
            switch(c) {
                case "EOS":
                case "ADA":
                case "RDD":
                case "OMG":
                case "SALT":
                    icon = c;
                    break;
                default:
                    icon = c+'-alt';
            }
            return icon;
        }

        ,fetchData: function() {

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
                // console.log('nice! now do something.', d);
                self.allCoins = d.reduce((acc, cur) => {
                    return acc.concat(cur);
                }, [] );

                // console.log('self.allCoins', self.allCoins);
                self.myWallet = self.buildMyWallet(self.allCoins);
                self.totalUSD();
                self.totalBTC();
                self.buildChart2();

            }).catch(e => {
                console.log('oops, something has gone wrong.', e);
            });




            fetch(self.globalMarket)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJSON) {
                    // console.log(myJSON);
                    // self.globalMarketCap = myJSON.total_market_cap_usd;
                    // self.globalMarketCap = self.formatAsUSD(myJSON.total_market_cap_usd);
                    self.bitcoinDominance = myJSON.bitcoin_percentage_of_market_cap;
                    self.total24HrVolume = self.wordifyNumber(myJSON.total_24h_volume_usd);
                    // console.log(self.formatAsUSD(self.globalMarketCap));
                    // console.log(self.globalMarketCap);

                    self.globalMarketCap = self.wordifyNumber(myJSON.total_market_cap_usd);
                    // console.log( self.wordifyNumber(419281384539234123) );
                    // console.log( self.wordifyNumber(419281384539234) );
                    // console.log( self.wordifyNumber(419281384539) );
                    // console.log( self.wordifyNumber(419281384) );
                    // console.log( self.wordifyNumber(419281) );
                    // console.log( self.wordifyNumber(419) );
                    // console.log( self.wordifyNumber(41) );
                    // console.log( self.wordifyNumber(4) );

                });



            self.fetchTick++;
        },

        wordifyNumber: function(n){

            let incrementName = '';
            let num;

            if (Math.abs(Number(n)) >= 1.0e+15) {
                num = Math.abs(Number(n)) / 1.0e+15
                incrementName = "Quadrillion";

            } else if (Math.abs(Number(n)) >= 1.0e+12) {
                num = Math.abs(Number(n)) / 1.0e+12
                incrementName = "Trillion";

            } else if (Math.abs(Number(n)) >= 1.0e+9) {
                num = Math.abs(Number(n)) / 1.0e+9
                incrementName = "Billion";

            } else if (Math.abs(Number(n)) >= 1.0e+6) {
                num = Math.abs(Number(n)) / 1.0e+6
                incrementName = "Million";

            } else if (Math.abs(Number(n)) >= 1.0e+3) {
                num = Math.abs(Number(n)) / 1.0e+3
                incrementName = "Thousand";

            } else {
                num = n;
                incrementName = "";
            }

            // let combinedAmount = (Math.round(parseFloat(num) * 10) / 10) + ' ' + incrementName;

            return Math.round(parseFloat(num) * 10) / 10 + ' ' + incrementName;

        },

        totalUSD: function(){

            var N = this.myWallet.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)

            this.myHoldingsTotalInUSD = N;

        },



        totalBTC: function(){
            // console.log('totalBTC()');
            this.bitcoinPrice = this.filterCoin("BTC")[0].price_usd;

            let n = Number(this.myHoldingsTotalInUSD) / Number(this.bitcoinPrice) ;
            // let n = this.myHoldingsTotalInUSD / this.bitcoinPrice ;

            // this.myHoldingsTotalInBTC = n;
            this.myHoldingsTotalInBTC = n.toFixed(6);

            // console.log( this.myHoldingsTotalInUSD, this.bitcoinPrice );

            // console.log( this.myHoldingsTotalInUSD );
            // console.log( this.myHoldingsTotalInBTC );
            // console.log( this.filterCoin("BTC"));
            // console.log( this.filterCoin("BTC")[0].price_usd );

        },





        buildMyWallet: function(coins) {
            // window.console.log('buildmyWallet()', this.myHoldings);
            // this.allCoins = coins;

            return coins.filter( coin => {
                // return Object.keys(this.myHoldings).indexOf(coin.id) >= 0;
                return Object.keys(this.myHoldings).indexOf(coin.symbol) >= 0;
            }).map( c => {
                return Object.assign({}, c, {
                    // holding: this.myHoldings[c.id],
                    // holding_value:  c.price_usd * this.myHoldings[c.id]
                    holding: this.myHoldings[c.symbol]
                    ,holding_value:  c.price_usd * this.myHoldings[c.symbol]

                });
            });
        },





        filterCoin: function(x){
            var arr = this.allCoins.slice();
              return arr.filter(function(coin) {

                  // return coin.id.indexOf(x) > -1;
                  if(coin.symbol === x){

                      return coin.symbol.indexOf(x) > -1;
                  }

              })
        },






/*
    BILLBOARD CHARTS
    https://naver.github.io/billboard.js/
 */
        buildChart2: function(){

            var chartData = [];

            chartData = chartData.concat( this.myWallet.filter(coin => coin.holding > 0 ).map( coin => [coin.name, coin.holding_value] ) );

            // console.log('chartData', chartData);


             var chart = bb.generate({
                bindto: "#chart",
                donut: {
                    title: "$ " + String(this.formatAsUSD(this.myHoldingsTotalInUSD))+'\n \n'+String(this.myHoldingsTotalInBTC)+' BTC',
                    padAngle: 0.01,
                    label: {
                        ratio: 1
                    }
                },
                legend:{
                    show:true,
                    contents: {
                      bindto: "#legend",
                      template: "<span style='color:#fff;padding:10px;background-color:{=COLOR}'>{=TITLE}</span>"
                    }
                },
                // pie: {
                //     innerRadius: 20
                // },
                data: {
                    type: "donut",
                    columns: chartData,
                    colors: {
                        // "Bitcoin": "gold",
                        // "Litecoin": "silver",
                        // "Ethereum": "gray",
                        // "OmiseGO": "navy",
                        // "EOS": "purple"
                    }

                }
            });



        //     function toggle(id) {
        //         chart.toggle(id);
        //     }
        //
        //     d3.select('.chart_wrapper')
        //         // .insert('div', '.chart')
        //         // .attr('class', 'legend')
        //         // .selectAll('span')
        //         // .data( this.myWallet.filter(coin => coin.holding > 0 ).map( coin => [coin.name] ) )
        //         // .enter()
        //         // .append('span')
        //         .attr('data-id', function(id) {
        //             return id;
        //         })
        //         .html(function(id) {
        //             return id;
        //         })
        //         .each(function(id) {
        //             d3.select(this)
        //                 .style('background-color', chart.color(id))
        //         })
        //         .on('mouseover', function(id) {
        //             chart.focus(id);
        //         })
        //         .on('mouseout', function(id) {
        //             chart.revert();
        //         })
        //         .on('click', function(id) {
        //             // chart.toggle(id);
        //         });











        }


    }


})



/*
});
 */






    var chart5 = bb.generate({
        data: {
            columns: [
                ["data1", 100],
                ["data2", 300],
                ["data3", 200]
            ],
            type: "donut"
        },
        legend: {
            show: false
        },
        bindto: "#custom"
    });

    function toggle(id) {
        chart5.toggle(id);
    }

    d3.select('.chart_area')
        .insert('div', '.chartkey')
        .attr('class', 'legend')
        .selectAll('span')
        .data(['data1', 'data2', 'data3'])
        .enter()
        .append('span')
        .attr('data-id', function(id) {
            return id;
        })
        .html(function(id) {
            return id;
        })
        .each(function(id) {
            d3.select(this)
                .style('background-color', chart5.color(id))
                // .style('color', 'red')
                .style('padding', '5px')
        })
        .on('mouseover', function(id) {
            chart5.focus(id);
        })
        .on('mouseout', function(id) {
            chart5.revert();
        })
        .on('click', function(id) {
            chart5.toggle(id);
        });
