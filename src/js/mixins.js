var myMixin = {

    data: function () {
        return {
          myWallet: [],
          bitcoinPrice: 0,
          totalHoldings: {},
          masterWallet: null,
          allMyCoinsMeta: null,
        };
    },

    computed: {
        calculateHoldings: function(){
            return this.myWallet.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)
        }
    },

    filters:{
        formatUSD: function(n){
            let num = (n*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            // if the amount is less than $0.10, add an extra decimal point.
            if (num < 0.10){
                num = (n*1).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); 
            }
            return num;
        },

        formatWithCommas: function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
    },

 
    methods: {

        // THIS GETS THE LOGO
        // addLogos: function(_coins){
        //     console.log('addLogos();', _coins);

        //     for(const coin in _coins){
        //         console.log(coin);

        //         // this.$root.CMC.getMetadata({ symbol: 'BTC' }).then(
        //         //     function(re) {
        //         //         console.log('?? ~ re ~ ', re.data[1].logo);
        //         //     }).catch(console.error);
                
        //     }
        // },
 
        mixinPrebuildWallet: function(_myCoins:Object ){
            // console.log('mixinPrebuildWallet()', _myCoins);
            let theseCoins = [];
            for (const thing in _myCoins) {
                let thisCoin = {
                    'hasData': false,
                    'name': 'name_' + `${thing}`,
                    'symbol': `${thing}`,
                    'holding': `${_myCoins[thing]}`,
                    'holding_value': 0,
                    'logo': '.jpg'
                }
                // console.log(thisCoin);
                theseCoins.push(thisCoin);
            }
            // console.log('thesePrebuildCoins ', theseCoins);
            return theseCoins;        
        },

        mixinBuildWalletV2: function(_myCoins:Object, _allCoins:Array) {
            // console.log('mixinBuildWalletV2() _myCoins ', _myCoins);
            // console.log('mixinBuildWalletV2() _allCoins ', _allCoins);
            let theseCoins = [];
            let self = this;

            for (const thing in _myCoins) {
                // console.log(`${thing}: ${_myCoins[thing]}`);

                let thisCoin = this.filterCoin(`${thing}`)[0];

                if (thisCoin == undefined){
                    thisCoin = {
                        'hasData': false,
                        'name': 'name_'+`${thing}`,
                        'symbol': `${thing}`,
                        'holding': `${_myCoins[thing]}`,
                        'holding_value': 0,
                        'logo': '.•.'
                    }
                }else{
                    

// THIS MAY BE THE BEST PLACE TO SPLICE IN THE LOGO INFORMATION FROM META CALL.

                    let thisHolding = `${_myCoins[thing]}`;
                    let thisHoldingValue = `${_myCoins[thing]}`;
                    let thisLogoUrl = self.$root.allMyCoinsMeta[`${thing}`].logo;

                    // console.log('thisCoin ', thisCoin.id);
                    // console.log('this.$root.allMyCoinsMeta from BuildWallet ', self.$root.allMyCoinsMeta);
                    // console.log('this.$root.allMyCoinsMeta from BuildWallet ', self.$root.allMyCoinsMeta['LTC'].logo);
                    console.log('this.$root.allMyCoinsMeta from BuildWallet ', self.$root.allMyCoinsMeta[`${thing}`].logo);



                        // let thisCoinUrl = self.filterCoin(obj[each].symbol);
                        // // // Object.assign(thisCoin[0], {
                        // // //     'logo': logoUrl,
                        // });


                    // this.$root.CMC.getMetadata({ id: thisCoin.id })
                        // .then(function (r) {
                            // console.log('r ', r);
                            // thisLogoUrl = r;
                            Object.assign(thisCoin, {
                                'hasData': true,
                                'holding': thisHolding,
                                'holding_value': thisCoin.quote.USD.price * thisHoldingValue,
                                'logo': thisLogoUrl,
                            });
                        // });
  
                     
                }

                theseCoins.push(thisCoin);                
            }

            return theseCoins;

        },

        // OLD VERSION.. DEPRICATED.
        // mixinBuildWallet: function(_myCoins, _allCoins) {
        //     console.log('mixinBuildWallet() _myCoins ', _myCoins);
            
        //     // FILTERS THOUGH ALL OF THE COINS AND CHECK IF ONE OF MY COINS IS ONE OF THEM.
        //     return _allCoins.filter(coin => {
        //         // console.log('~!~ ', coin.symbol, Object.keys(_myCoins).indexOf(coin.symbol));
                
        //         // return Object.keys(_myCoins).indexOf(coin.symbol) >= 0;
        //         if (Object.keys(_myCoins).indexOf(coin.symbol) >= 0){
        //             // console.log('YES! ', coin, _myCoins);
        //             return Object.keys(_myCoins).indexOf(coin.symbol) >= 0;
        //         }else{
        //             // console.log('no ', coin, _myCoins);
        //             return null;
        //         }
        //     }).map(c => {
        //         // console.log('c ', c.symbol);
        //         return Object.assign({}, c, {
        //             holding: _myCoins[c.symbol],
        //             holding_value: c.quote.USD.price * (_myCoins[c.symbol])
        //         });
        //     }).sort((a, b) => {
        //         return a.holding_value - b.holding_value;
        //     }).reverse();
        // },












        // RETURNS ONLY THE COIN OBJECT YOU WANT:
        filterCoin: function(x){
            var arr = this.$store.getters.allCoins.slice();            
            return arr.filter(function(coin) {
                if(coin.symbol === x){
                    return coin.symbol.indexOf(x) > -1;
                }
            })
        }, 
 

        // THIS CREATES THE APPROPRIATE CLASSNAME FOR THE ICON
        // coinClass: function(c){
        //     let icon;
        //     switch(c) {
        //         case "EOS":
        //         case "ADA":
        //         case "RDD":
        //         case "OMG":
        //         case "SALT":
        //             icon = c;
        //             break;
        //         default:
        //             icon = c+'-alt';
        //     }
        //     return icon;
        // },

        wordifyNumber: function(n){
            // console.log( self.wordifyNumber(419281384539234123) );
            // console.log( self.wordifyNumber(419281384539234) );
            // console.log( self.wordifyNumber(419281384539) );
            // console.log( self.wordifyNumber(419281384) );
            // console.log( self.wordifyNumber(419281) );
            // console.log( self.wordifyNumber(419) );
            // console.log( self.wordifyNumber(41) );
            // console.log( self.wordifyNumber(4) );

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

            return Math.round(parseFloat(num) * 10) / 10 + ' ' + incrementName;
        },

        totalUSD: function(_thisWallet_){
            var N = _thisWallet_.reduce( (total, c) => {
                return total + c.holding_value;
            }, 0)
            this.myHoldingsTotalInUSD = N;
        },

        totalBTC: function(_thisWallet_){
            this.bitcoinPrice = this.filterCoin("BTC")[0].quote.USD.price;
            let n = Number(this.myHoldingsTotalInUSD) / Number(this.bitcoinPrice) ;
            this.myHoldingsTotalInBTC = n.toFixed(6);
        }
    }
}

export default myMixin;