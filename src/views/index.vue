<template>

    <div id="jdkInfo"></div>

</template>

<script>
    export default {
        name: 'index',
        data() {
            return {

            }
        },
        mounted: function () {
            this.jdkInfo();
        },
        methods: {
            jdkInfo: function () {
                let myChart = this.$echarts.init(document.getElementById('jdkInfo'));
                let option = {
                    title: {
                        text: 'Java虚拟机运行内存使用曲线图'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['总内存','已使用','剩余内存']
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'总内存',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'已使用',
                            type:'line',
                            stack: '总量',
                            data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name:'剩余内存',
                            type:'line',
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                    ]
                };
                myChart.setOption(option);
            }
        },
        computed: {

        }
    }
</script>

<style scoped>

</style>
