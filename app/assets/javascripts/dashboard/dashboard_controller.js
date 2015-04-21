/**@ngInject*/
function DashboardController($scope, serviceAllCount,
                             serviceProjectCount, projectList) {
  "use strict";

  this.projectList = projectList;
  $scope.budgetCharts = [];

  angular.forEach(projectList, function (value) {

      if (_.inRange(value.budget, 0, 9999)) {
        $scope.temp = {
          title: value.name,
          subtitle: "($ USD)",
          ranges: [0, 0, value.budget],
          measures: [value.spent],
          markers: [0]
        };
      } else if (_.inRange(value.budget, 10000, 999999)) {
        $scope.temp = {
          title: value.name,
          subtitle: "($ USD, thousands)",
          ranges: [0, 0, (value.budget / 1000)],
          measures: [(value.spent / 1000)],
          markers: [0]
        };
      } else if (_.inRange(value.budget, 1000000, 999999999)) {
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
            top: 5,
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
          top: 5,
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
        value.data = serviceProjectCount;
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
window.lodash = _;