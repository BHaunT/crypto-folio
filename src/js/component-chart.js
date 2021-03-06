
import Vue from "vue/dist/vue.esm.js";
import EventBus from './eventBus.js';
import myMixin from './mixins.js';
import store from "./store.js";


Vue.component('chart', {
    data: function () {
        return {
            thisChart: null,
        }
    },
    mixins: [myMixin],
    template: `<div ref='chart' class="chart tc "></div>`,

    created: function(){
        this.setupEvents();
    },

    updated: function(){
        // console.log('chart component was updated');
    },


    methods: {
        setupEvents: function(){
            EventBus.$on(`coin-mouseover-${this.$parent._uid}`, (c) => {
                this.thisChart.focus(c);
            });
            EventBus.$on(`coin-mouseleave-${this.$parent._uid}`, (c) => {
                this.thisChart.defocus(c);
                this.thisChart.revert();
            });
            
            EventBus.$on(`wallet-prebuilt-${this.$parent._uid}`, this.prebuildChart );
            
            EventBus.$on(`wallet-built-${this.$parent._uid}`, this.buildChart );
        },


        prebuildChart: function(_thisWallet_){
            console.log('prebuildChart()', _thisWallet_);

            var chartDiv = this.$refs.chart;
            var chartData = [];

            chartData = chartData.concat(_thisWallet_.filter(coin => 1 > 0).map(coin => [coin.name, 1]));

            this.thisChart = bb.generate({
                bindto: chartDiv,
                donut: {
                    // title: "prebuilt",
                    labels: false,
                    expand: true,
                    label: {
                        show: false
                        // ratio: 0.01,
                    }
                },
                legend:{
                    show:false,
                    position:"bottom",
                },
                data: {
                    type: "donut",
                    labels: false,
                    columns: chartData,
                },
            });
        },






        buildChart: function(_thisWallet_){
            // console.log("~! component-chart : buildChart(){} ", _thisWallet_);
            var chartDiv = this.$refs.chart;
            var chartData = [];

            chartData = chartData.concat( _thisWallet_.filter(coin => coin.holding > 0 ).map( coin => [coin.name, coin.holding_value] ) );


            // ---- maybe this should be  bb.update() or similar since this now being prebuilt.
            this.thisChart = bb.generate({
                bindto: chartDiv,
                donut: {
                    // title: "",
                    labels: false,
                    expand: true,
                    label: {
                        show: false
                        // ratio: 0.01,
                    }
                },
                // legend:{
                    // show:false,
                    // position:"bottom",
                // },
                data: {
                    type: "donut",
                    labels: false,
                    columns: chartData,
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
                        "Cardano" : "#33c8c9", 
                        "DigiByte": "#06c",
                    },
                    onclick: function (d, i) {
                        // console.log("onclick", d, i);
                    },
                    onover: function (d, i) {
                        // console.log("onover", d, i);
                    },
                    onout: function (d, i) {
                        // console.log("onout", d, i);
                    }

                },


            });

            this.thisChart.legend.hide();

        }
    }

})


export default ' ';
