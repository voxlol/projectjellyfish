/**@ngInject*/
function DashboardController($scope, serviceAllCount,
                             serviceProjectCount, projectList) {
  "use strict";

  this.projectList = projectList;
  $scope.budgetCharts = [];

  angular.forEach(projectList, function (value) {
      if (_.inRange(value.budget, 10000, 999999)) {
        $scope.temp = {
          title: value.name,
          subtitle: "($ USD, thousands)",
          ranges: [0, 0, (value.budget / 1000)],
          measures: [(value.spent / 1000)],
          markers: [0]
        };
      } else if (_.inRange(value.budget, 1000000, 999999999999)) {
        $scope.temp = {
          title: value.name,
          subtitle: "($ USD, millions)",
          ranges: [0, 0, (value.budget / 1000000)],
          measures: [(value.spent / 1000000)],
          markers: [0]
        };
      } else {
        $scope.temp = {
          title: value.name,
          subtitle: "($ USD)",
          ranges: [0, 0, value.budget],
          measures: [value.spent],
          markers: [0]
        };
      }
      $scope.budgetCharts.push($scope.temp);
    }
  );
  $scope.chartCollection = [{
    options: {
      title: {
        enable: true,
        text: "Daily Cost Analysis",
        class: "h4",
        css: {width: "nullpx", textAlign: "center"}
      },
      chart: {
        type: "multiBarChart",
        height: 350,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 80
        },
        clipEdge: true,
        staggerLabels: true,
        transitionDuration: 500,
        stacked: true,
        xAxis: {
          axisLabel: "Date",
          showMaxMin: false,
          axisLabelDistance: 2,
          tickFormat: function(d) {
            return d3.time.format("%x")(new Date(d));
          }
        },
        yAxis: {
          axisLabel: "Cost ($ USD)",
          axisLabelDistance: 10,
          tickFormat: function(d) {
            return d3.format(",.1f")(d);
          }
        },
        tooltips:true,
        tooltipContent: function(key, x, y) {

          //         var total = e.point.y+e.point.y0+e.point.y1;
          return "<h3>" + key + "</h3>" +
            "<p>$" + y + " on " + x +"</p>";

        }
      }
    }, data: [{
      key: "Project Jellyfish",
      values: [{
        x: 1430366400000,
        y: 12258.05,
        y0: 0,
        series: 0,
        size: 12258.05,
        y1: 12258.05
      }, {
        x: 1430452500000,
        y: 14100.6,
        y0: 0,
        series: 0,
        size: 14100.6,
        y1: 14100.6
      }, {
        x: 1430538600000,
        y: 10356.28,
        y0: 0,
        series: 0,
        size: 10356.28,
        y1: 10356.28
      }, {
        x: 1430624700000,
        y: 12215.92,
        y0: 0,
        series: 0,
        size: 12215.92,
        y1: 12215.92
      }, {
        x: 1430710800000,
        y: 12358.6,
        y0: 0,
        series: 0,
        size: 12358.6,
        y1: 12358.6
      }, {
        x: 1430796900000,
        y: 16229.81,
        y0: 0,
        series: 0,
        size: 16229.81,
        y1: 16229.81
      }, {
        x: 1430883000000,
        y: 12847.03,
        y0: 0,
        series: 0,
        size: 12847.03,
        y1: 12847.03
      }, {
        x: 1430969100000,
        y: 10907.96,
        y0: 0,
        series: 0,
        size: 10907.96,
        y1: 10907.96
      }, {
        x: 1431055200000,
        y: 15130.12,
        y0: 0,
        series: 0,
        size: 15130.12,
        y1: 15130.12
      }, {
        x: 1431141300000,
        y: 12370.09,
        y0: 0,
        series: 0,
        size: 12370.09,
        y1: 12370.09
      }, {
        x: 1431227400000,
        y: 13941.91,
        y0: 0,
        series: 0,
        size: 13941.91,
        y1: 13941.91
      }, {
        x: 1431313500000,
        y: 9503.14,
        y0: 0,
        series: 0,
        size: 9503.14,
        y1: 9503.14
      }, {
        x: 1431399600000,
        y: 9424.73,
        y0: 0,
        series: 0,
        size: 9424.73,
        y1: 9424.73
      }, {
        x: 1431485700000,
        y: 16404.26,
        y0: 0,
        series: 0,
        size: 16404.26,
        y1: 16404.26
      }, {
        x: 1431571800000,
        y: 9803.69,
        y0: 0,
        series: 0,
        size: 9803.69,
        y1: 9803.69
      }, {
        x: 1431657900000,
        y: 15260.46,
        y0: 0,
        series: 0,
        size: 15260.46,
        y1: 15260.46
      }, {
        x: 1431744000000,
        y: 16171.12,
        y0: 0,
        series: 0,
        size: 16171.12,
        y1: 16171.12
      }, {
        x: 1431830100000,
        y: 14188.93,
        y0: 0,
        series: 0,
        size: 14188.93,
        y1: 14188.93
      }, {
        x: 1431916200000,
        y: 18863.12,
        y0: 0,
        series: 0,
        size: 18863.12,
        y1: 18863.12
      }, {
        x: 1432002300000,
        y: 18131.37,
        y0: 0,
        series: 0,
        size: 18131.37,
        y1: 18131.37
      }, {
        x: 1432088400000,
        y: 26329.31,
        y0: 0,
        series: 0,
        size: 26329.31,
        y1: 26329.31
      }, {
        x: 1432174500000,
        y: 32493.16,
        y0: 0,
        series: 0,
        size: 32493.16,
        y1: 32493.16
      }, {
        x: 1432260600000,
        y: 25001.84,
        y0: 0,
        series: 0,
        size: 25001.84,
        y1: 25001.84
      }, {
        x: 1432346700000,
        y: 22427.1,
        y0: 0,
        series: 0,
        size: 22427.1,
        y1: 22427.1
      }, {
        x: 1432432800000,
        y: 11979.55,
        y0: 0,
        series: 0,
        size: 11979.55,
        y1: 11979.55
      }, {
        x: 1432518900000,
        y: 14960.5,
        y0: 0,
        series: 0,
        size: 14960.5,
        y1: 14960.5
      }, {
        x: 1432605000000,
        y: 16412.98,
        y0: 0,
        series: 0,
        size: 16412.98,
        y1: 16412.98
      }, {
        x: 1432691100000,
        y: 17731.44,
        y0: 0,
        series: 0,
        size: 17731.44,
        y1: 17731.44
      }, {
        x: 1432777200000,
        y: 14748.99,
        y0: 0,
        series: 0,
        size: 14748.99,
        y1: 14748.99
      }, {
        x: 1432863300000,
        y: 11231.39,
        y0: 0,
        series: 0,
        size: 11231.39,
        y1: 11231.39
      }, {
        x: 1432949400000,
        y: 17376.76,
        y0: 0,
        series: 0,
        size: 17376.76,
        y1: 17376.76
      }]
    }, {
      key: "Cloud Exchange",
      values: [{
        x: 1430366400000,
        y: 20095.37,
        y0: 12258.05,
        series: 1,
        size: 20095.37,
        y1: 32353.42
      }, {
        x: 1430452500000,
        y: 11613.29,
        y0: 14100.6,
        series: 1,
        size: 11613.29,
        y1: 25713.89
      }, {
        x: 1430538600000,
        y: 12823,
        y0: 10356.28,
        series: 1,
        size: 12823,
        y1: 23179.28
      }, {
        x: 1430624700000,
        y: 13650.81,
        y0: 12215.92,
        series: 1,
        size: 13650.81,
        y1: 25866.73
      }, {
        x: 1430710800000,
        y: 15500.36,
        y0: 12358.6,
        series: 1,
        size: 15500.36,
        y1: 27858.96
      }, {
        x: 1430796900000,
        y: 12812.62,
        y0: 16229.81,
        series: 1,
        size: 12812.62,
        y1: 29042.43
      }, {
        x: 1430883000000,
        y: 11296.6,
        y0: 12847.03,
        series: 1,
        size: 11296.6,
        y1: 24143.63
      }, {
        x: 1430969100000,
        y: 11714.33,
        y0: 10907.96,
        series: 1,
        size: 11714.33,
        y1: 22622.29
      }, {
        x: 1431055200000,
        y: 13754.22,
        y0: 15130.12,
        series: 1,
        size: 13754.22,
        y1: 28884.34
      }, {
        x: 1431141300000,
        y: 26858.89,
        y0: 12370.09,
        series: 1,
        size: 26858.89,
        y1: 39228.979999999996
      }, {
        x: 1431227400000,
        y: 37398.96,
        y0: 13941.91,
        series: 1,
        size: 37398.96,
        y1: 51340.869999999995
      }, {
        x: 1431313500000,
        y: 26193.27,
        y0: 9503.14,
        series: 1,
        size: 26193.27,
        y1: 35696.41
      }, {
        x: 1431399600000,
        y: 15376.01,
        y0: 9424.73,
        series: 1,
        size: 15376.01,
        y1: 24800.739999999998
      }, {
        x: 1431485700000,
        y: 16787.7,
        y0: 16404.26,
        series: 1,
        size: 16787.7,
        y1: 33191.96
      }, {
        x: 1431571800000,
        y: 16704.21,
        y0: 9803.69,
        series: 1,
        size: 16704.21,
        y1: 26507.9
      }, {
        x: 1431657900000,
        y: 17178.08,
        y0: 15260.46,
        series: 1,
        size: 17178.08,
        y1: 32438.54
      }, {
        x: 1431744000000,
        y: 11716.15,
        y0: 16171.12,
        series: 1,
        size: 11716.15,
        y1: 27887.27
      }, {
        x: 1431830100000,
        y: 11825.22,
        y0: 14188.93,
        series: 1,
        size: 11825.22,
        y1: 26014.15
      }, {
        x: 1431916200000,
        y: 17071.13,
        y0: 18863.12,
        series: 1,
        size: 17071.13,
        y1: 35934.25
      }, {
        x: 1432002300000,
        y: 10651.25,
        y0: 18131.37,
        series: 1,
        size: 10651.25,
        y1: 28782.62
      }, {
        x: 1432088400000,
        y: 16590.76,
        y0: 26329.31,
        series: 1,
        size: 16590.76,
        y1: 42920.07
      }, {
        x: 1432174500000,
        y: 13952.16,
        y0: 32493.16,
        series: 1,
        size: 13952.16,
        y1: 46445.32
      }, {
        x: 1432260600000,
        y: 11530.75,
        y0: 25001.84,
        series: 1,
        size: 11530.75,
        y1: 36532.59
      }, {
        x: 1432346700000,
        y: 16036.43,
        y0: 22427.1,
        series: 1,
        size: 16036.43,
        y1: 38463.53
      }, {
        x: 1432432800000,
        y: 9068.72,
        y0: 11979.55,
        series: 1,
        size: 9068.72,
        y1: 21048.269999999997
      }, {
        x: 1432518900000,
        y: 14633.72,
        y0: 14960.5,
        series: 1,
        size: 14633.72,
        y1: 29594.22
      }, {
        x: 1432605000000,
        y: 13307.04,
        y0: 16412.98,
        series: 1,
        size: 13307.04,
        y1: 29720.02
      }, {
        x: 1432691100000,
        y: 14989.44,
        y0: 17731.44,
        series: 1,
        size: 14989.44,
        y1: 32720.879999999997
      }, {
        x: 1432777200000,
        y: 17557.75,
        y0: 14748.99,
        series: 1,
        size: 17557.75,
        y1: 32306.739999999998
      }, {
        x: 1432863300000,
        y: 10944.17,
        y0: 11231.39,
        series: 1,
        size: 10944.17,
        y1: 22175.559999999998
      }, {
        x: 1432949400000,
        y: 14957.24,
        y0: 17376.76,
        series: 1,
        size: 14957.24,
        y1: 32334
      }]
    }, {
      key: "Blog",
      values: [{
        x: 1430366400000,
        y: 11418.43,
        y0: 32353.42,
        series: 2,
        size: 11418.43,
        y1: 43771.85
      }, {
        x: 1430452500000,
        y: 14339.26,
        y0: 25713.89,
        series: 2,
        size: 14339.26,
        y1: 40053.15
      }, {
        x: 1430538600000,
        y: 9484.78,
        y0: 23179.28,
        series: 2,
        size: 9484.78,
        y1: 32664.059999999998
      }, {
        x: 1430624700000,
        y: 15891.26,
        y0: 25866.73,
        series: 2,
        size: 15891.26,
        y1: 41757.99
      }, {
        x: 1430710800000,
        y: 9895.74,
        y0: 27858.96,
        series: 2,
        size: 9895.74,
        y1: 37754.7
      }, {
        x: 1430796900000,
        y: 12615.36,
        y0: 29042.43,
        series: 2,
        size: 12615.36,
        y1: 41657.79
      }, {
        x: 1430883000000,
        y: 12878.17,
        y0: 24143.63,
        series: 2,
        size: 12878.17,
        y1: 37021.8
      }, {
        x: 1430969100000,
        y: 9870.84,
        y0: 22622.29,
        series: 2,
        size: 9870.84,
        y1: 32493.13
      }, {
        x: 1431055200000,
        y: 10719.78,
        y0: 28884.34,
        series: 2,
        size: 10719.78,
        y1: 39604.12
      }, {
        x: 1431141300000,
        y: 10688.14,
        y0: 39228.979999999996,
        series: 2,
        size: 10688.14,
        y1: 49917.119999999995
      }, {
        x: 1431227400000,
        y: 15038.91,
        y0: 51340.869999999995,
        series: 2,
        size: 15038.91,
        y1: 66379.78
      }, {
        x: 1431313500000,
        y: 13106.14,
        y0: 35696.41,
        series: 2,
        size: 13106.14,
        y1: 48802.55
      }, {
        x: 1431399600000,
        y: 15599.85,
        y0: 24800.739999999998,
        series: 2,
        size: 15599.85,
        y1: 40400.59
      }, {
        x: 1431485700000,
        y: 15305.64,
        y0: 33191.96,
        series: 2,
        size: 15305.64,
        y1: 48497.6
      }, {
        x: 1431571800000,
        y: 9636.09,
        y0: 26507.9,
        series: 2,
        size: 9636.09,
        y1: 36143.990000000005
      }, {
        x: 1431657900000,
        y: 15192.49,
        y0: 32438.54,
        series: 2,
        size: 15192.49,
        y1: 47631.03
      }, {
        x: 1431744000000,
        y: 9166.61,
        y0: 27887.27,
        series: 2,
        size: 9166.61,
        y1: 37053.880000000005
      }, {
        x: 1431830100000,
        y: 13216.31,
        y0: 26014.15,
        series: 2,
        size: 13216.31,
        y1: 39230.46
      }, {
        x: 1431916200000,
        y: 9519.54,
        y0: 35934.25,
        series: 2,
        size: 9519.54,
        y1: 45453.79
      }, {
        x: 1432002300000,
        y: 9715.1,
        y0: 28782.62,
        series: 2,
        size: 9715.1,
        y1: 38497.72
      }, {
        x: 1432088400000,
        y: 13254.82,
        y0: 42920.07,
        series: 2,
        size: 13254.82,
        y1: 56174.89
      }, {
        x: 1432174500000,
        y: 12390.55,
        y0: 46445.32,
        series: 2,
        size: 12390.55,
        y1: 58835.869999999995
      }, {
        x: 1432260600000,
        y: 12624.26,
        y0: 36532.59,
        series: 2,
        size: 12624.26,
        y1: 49156.85
      }, {
        x: 1432346700000,
        y: 14714.53,
        y0: 38463.53,
        series: 2,
        size: 14714.53,
        y1: 53178.06
      }, {
        x: 1432432800000,
        y: 12607.47,
        y0: 21048.269999999997,
        series: 2,
        size: 12607.47,
        y1: 33655.74
      }, {
        x: 1432518900000,
        y: 9106.57,
        y0: 29594.22,
        series: 2,
        size: 9106.57,
        y1: 38700.79
      }, {
        x: 1432605000000,
        y: 14918.49,
        y0: 29720.02,
        series: 2,
        size: 14918.49,
        y1: 44638.51
      }, {
        x: 1432691100000,
        y: 11707.08,
        y0: 32720.879999999997,
        series: 2,
        size: 11707.08,
        y1: 44427.96
      }, {
        x: 1432777200000,
        y: 17454.86,
        y0: 32306.739999999998,
        series: 2,
        size: 17454.86,
        y1: 49761.6
      }, {
        x: 1432863300000,
        y: 10995.06,
        y0: 22175.559999999998,
        series: 2,
        size: 10995.06,
        y1: 33170.619999999995
      }, {
        x: 1432949400000,
        y: 14742.56,
        y0: 32334,
        series: 2,
        size: 14742.56,
        y1: 47076.56
      }]
    }] }, {
    options: {
      title: {
        enable: true,
        text: "Hourly Cost Analysis",
        class: "h4",
        css: {width: "nullpx", textAlign: "center"}
      },
      chart: {
        type: "lineChart",
        height: 350,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 100
        },
        useInteractiveGuideline: true,
        transitionDuration: 500,
        xAxis: {
          axisLabel: "24 Hours",
          tickFormat: function (d) {
            return d3.format(",f")(d) + "00";
          }
        },
        yAxis: {
          axisLabel: "Cost ($USD)",
          tickFormat: function (d) {
            return d3.format(",.2f")(d);
          },
          rotateYLabel: true
        }
      }
    }, data: [
      {
        key: "Projects Total",
        values: [{x: 1, y: 525.46, series: 3}, {x: 2, y: 723.23, series: 3}, {
          x: 3,
          y: 1262.29,
          series: 3
        }, {x: 4, y: 1917.29, series: 3}, {x: 5, y: 2228.8900000000003, series: 3}, {
          x: 6,
          y: 2221.76,
          series: 3
        }, {x: 7, y: 2026.8, series: 3}, {x: 8, y: 1972.23, series: 3}, {
          x: 9,
          y: 1333.77,
          series: 3
        }, {x: 10, y: 921.3100000000001, series: 3}, {x: 11, y: 633.71, series: 3}, {
          x: 12,
          y: 476.09000000000003,
          series: 3
        }, {x: 13, y: 425.66, series: 3}, {x: 14, y: 434.1, series: 3}, {
          x: 15,
          y: 391.57,
          series: 3
        }, {x: 16, y: 454.18999999999994, series: 3}, {x: 17, y: 451.22, series: 3}, {
          x: 18,
          y: 906.01,
          series: 3
        }, {x: 19, y: 1734.42, series: 3}, {x: 20, y: 3134.19, series: 3}, {
          x: 21,
          y: 3997.1099999999997,
          series: 3
        }, {x: 22, y: 3429.96, series: 3}, {x: 23, y: 1941.26, series: 3}, {
          x: 24,
          y: 910.67,
          series: 3
        }]
      },
      {
        key: "Project Jellyfish",
        values: [
          {
            x: 1,
            y: 160.41,
            series: 0
          },
          {
            x: 2,
            y: 110.26,
            series: 0
          },
          {
            x: 3,
            y: 106.05,
            series: 0
          },
          {
            x: 4,
            y: 160.38,
            series: 0
          },
          {
            x: 5,
            y: 163.91,
            series: 0
          },
          {
            x: 6,
            y: 123.21,
            series: 0
          },
          {
            x: 7,
            y: 104.8,
            series: 0
          },
          {
            x: 8,
            y: 197.47,
            series: 0
          },
          {
            x: 9,
            y: 153.76,
            series: 0
          },
          {
            x: 10,
            y: 116.7,
            series: 0
          },
          {
            x: 11,
            y: 185.07,
            series: 0
          },
          {
            x: 12,
            y: 129.25,
            series: 0
          },
          {
            x: 13,
            y: 142.8,
            series: 0
          },
          {
            x: 14,
            y: 111.45,
            series: 0
          },
          {
            x: 15,
            y: 144.19,
            series: 0
          },
          {
            x: 16,
            y: 155.12,
            series: 0
          },
          {
            x: 17,
            y: 242.24,
            series: 0
          },
          {
            x: 18,
            y: 595.17,
            series: 0
          },
          {
            x: 19,
            y: 1485.6,
            series: 0
          },
          {
            x: 20,
            y: 2859.21,
            series: 0
          },
          {
            x: 21,
            y: 3757.29,
            series: 0
          },
          {
            x: 22,
            y: 3071.19,
            series: 0
          },
          {
            x: 23,
            y: 1648.3,
            series: 0
          },
          {
            x: 24,
            y: 586.85,
            series: 0
          }
        ]
      },
      {
        key: "Cloud File Exchange",
        values: [
          {
            x: 1,
            y: 162.21,
            series: 1
          },
          {
            x: 2,
            y: 371.98,
            series: 1
          },
          {
            x: 3,
            y: 809.97,
            series: 1
          },
          {
            x: 4,
            y: 1160.43,
            series: 1
          },
          {
            x: 5,
            y: 947.59,
            series: 1
          },
          {
            x: 6,
            y: 561.06,
            series: 1
          },
          {
            x: 7,
            y: 225.39,
            series: 1
          },
          {
            x: 8,
            y: 157.14,
            series: 1
          },
          {
            x: 9,
            y: 158.44,
            series: 1
          },
          {
            x: 10,
            y: 169.42,
            series: 1
          },
          {
            x: 11,
            y: 148.85,
            series: 1
          },
          {
            x: 12,
            y: 190.49,
            series: 1
          },
          {
            x: 13,
            y: 143.41,
            series: 1
          },
          {
            x: 14,
            y: 140.19,
            series: 1
          },
          {
            x: 15,
            y: 109.83,
            series: 1
          },
          {
            x: 16,
            y: 194.66,
            series: 1
          },
          {
            x: 17,
            y: 106.55,
            series: 1
          },
          {
            x: 18,
            y: 174.27,
            series: 1
          },
          {
            x: 19,
            y: 129.67,
            series: 1
          },
          {
            x: 20,
            y: 170.21,
            series: 1
          },
          {
            x: 21,
            y: 111.06,
            series: 1
          },
          {
            x: 22,
            y: 182.21,
            series: 1
          },
          {
            x: 23,
            y: 118.43,
            series: 1
          },
          {
            x: 24,
            y: 189.92,
            series: 1
          }
        ]
      },
      {
        key: Blog,
        values: [
          {
            x: 1,
            y: 202.84,
            series: 2
          },
          {
            x: 2,
            y: 240.99,
            series: 2
          },
          {
            x: 3,
            y: 346.27,
            series: 2
          },
          {
            x: 4,
            y: 596.48,
            series: 2
          },
          {
            x: 5,
            y: 1117.39,
            series: 2
          },
          {
            x: 6,
            y: 1537.49,
            series: 2
          },
          {
            x: 7,
            y: 1696.61,
            series: 2
          },
          {
            x: 8,
            y: 1617.62,
            series: 2
          },
          {
            x: 9,
            y: 1021.57,
            series: 2
          },
          {
            x: 10,
            y: 635.19,
            series: 2
          },
          {
            x: 11,
            y: 299.79,
            series: 2
          },
          {
            x: 12,
            y: 156.35,
            series: 2
          },
          {
            x: 13,
            y: 139.45,
            series: 2
          },
          {
            x: 14,
            y: 182.46,
            series: 2
          },
          {
            x: 15,
            y: 137.55,
            series: 2
          },
          {
            x: 16,
            y: 104.41,
            series: 2
          },
          {
            x: 17,
            y: 102.43,
            series: 2
          },
          {
            x: 18,
            y: 136.57,
            series: 2
          },
          {
            x: 19,
            y: 119.15,
            series: 2
          },
          {
            x: 20,
            y: 104.77,
            series: 2
          },
          {
            x: 21,
            y: 128.76,
            series: 2
          },
          {
            x: 22,
            y: 176.56,
            series: 2
          },
          {
            x: 23,
            y: 174.53,
            series: 2
          },
          {
            x: 24,
            y: 133.9,
            series: 2
          }
        ]
      }
    ]
  }, {
    options: {
      chart: {
        type: "multiBarChart",
        height: 350,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 45
        },
        clipEdge: true,
        staggerLabels: true,
        transitionDuration: 500,
        stacked: true,
        xAxis: {
          axisLabel: "",
          showMaxMin: false,
          tickFormat: function (d) {
            return d;
          }
        },
        yAxis: {
          axisLabel: "Number of Instances",
          axisLabelDistance: 50,
          tickFormat: function (d) {
            return d;
          }
        }
      },
      title: {
        enable: true,
        text: "Service Allocation by Project",
        class: "h4",
        css: {width: "nullpx", textAlign: "center"}
      }
    },
    data: []
  }, {
    options: {
      chart: {
        type: "pieChart",
        height: 350,
        pie: {
          growOnHover: true
        },
        noData: "Data Incoming, Thanks for your patience.",
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return d.value;
        },
        showLabels: false,
        transitionDuration: 500,
        labelThreshold: 0.01,
        legend: {
          margin: {
            top: 20,
            right: 35,
            bottom: 5,
            left: 0
          }
        }
      },
      title: {
        enable: true,
        text: "Cumulative Service Allocation",
        class: "h3",
        css: {width: "nullpx", textAlign: "center"}
      }
    },
    data: []
  }, {
    options: {
      chart: {
        type: "bulletChart",
        transitionDuration: 500,
        bullet: {
          dispatch: {},
          forceX: [
            0
          ],
          tickFormat: null,
          margin: {
            top: 0,
            right: 10,
            bottom: 0,
            left: 10
          },
          orient: "left"
        },
        dispatch: {},
        forceX: [
          0
        ],
        width: null,
        height: 50,
        tickFormat: null,
        margin: {
          top: 20,
          right: 40,
          bottom: 20,
          left: 180
        },
        orient: "left",
        tooltips: true,
        noData: "Data Incoming, Thanks for your patience."
      }
    },
    data: {}
  }, {
    options: {
      chart: {
        type: "discreteBarChart",
        height: 350,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function (d) {
          return d.key;
        },
        y: function (d) {
          return d.value;
        },
        showValues: true,
        valueFormat: function (d) {
          return d;
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: "Week"
        },
        yAxis: {
          axisLabel: "Volume",
          axisLabelDistance: 30
        }
      },
      title: {
        enable: true,
        text: "*NOTIONAL* Order Frequency Insight",
        class: "h3",
        css: {width: "nullpx", textAlign: "center"}
      }
    },
    data: [{
      key: "Cumulative Return",
      values: [{
        key: 1,
        value: -29.765957771107
      }, {
        key: 2,
        value: 0
      }, {
        key: 3,
        value: 32.807804682612
      }, {
        key: 4,
        value: 196.45946739256
      }, {
        key: 5,
        value: 0.19434030906893
      }, {
        key: 6,
        value: -98.079782601442
      }, {
        key: 7,
        value: -13.925743130903
      }, {
        key: 8,
        value: -5.1387322875705
      }]
    }]
  }
  ];

  angular.forEach($scope.chartCollection, function (value) {
    switch (value.options.chart.type) {
      case "pieChart":
        value.data = serviceAllCount;
        break;
      case "multiBarChart":
        if(value.options.title.text == "Service Allocation by Project"){
          value.data = serviceProjectCount;
        }
        break;
    }
  });

  $scope.onDropComplete = function (index, obj) {
    var secondObj = $scope.chartCollection[index];
    var secondIndex = $scope.chartCollection.indexOf(obj);
    $scope.chartCollection[index] = obj;
    $scope.chartCollection[secondIndex] = secondObj;
  };
}

DashboardController.resolve = {
  /**@ngInject*/
  serviceAllCount: function (ServiceAllCountResource) {

    return ServiceAllCountResource.query().$promise;
  },
  /**@ngInject*/
  serviceProjectCount: function (ServiceProjectCountResource) {
    return ServiceProjectCountResource.query().$promise;
  },
  /**@ngInject*/
  projectList: function (ProjectsResource) {
    return ProjectsResource.query().$promise;
  }
};

window.DashboardController = DashboardController;