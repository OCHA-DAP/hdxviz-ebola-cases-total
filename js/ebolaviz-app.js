var ebolaVizApp = angular.module("ebolaVizApp", [])
	.controller("ebolaVizController", ["$scope", "dataService", function($scope, dataService) {
		yAxisNumberFormat = d3.format(",");
		xAxisDateFormat = "%b %d";

		$scope.indicators = dataService.getIndicators();
		$scope.selectedIndicator = "population";
		
		$scope.caseTypes = dataService.getCaseTypes();
		$scope.selectedCaseType = "all";

		$scope.countries = dataService.getCountries();
		if ($scope.countries.length > 0) {
			$scope.selectedCountry = $scope.countries[0].id;
		};
		
		function refreshHeadlineFigures() {
			dataService.getHeadlineFigures()
			.success(function (data) {
				$scope.headlineFigures = {};
				for (var i = 0; i < data.length; i++) {
					$scope.headlineFigures[data[i].case_definition] = data[i].value;
				}
			})
			.error(function (error) {
				$scope.headlineFigures = {};
				alert("Failed to get headline figures");
			});
		};
		refreshHeadlineFigures();
		
		function refreshCountryCasesChart(bindElement, isCases) {
			var postfix = (isCases) ? "_cases": "_deaths";
			dataService.getCountryChartData($scope.selectedCountry, $scope.selectedCaseType + postfix)
			.success(function (data) {
				generateOneCountryChart(bindElement, data);
			})
			.error(function (error) {
				alert("Failed to return chart data from the data service");
			});	
		};

		function generateOneCountryChart(bindElement,data){
			config = {
				bindto: bindElement,
				data: {
					json: data,
					mimeType: "json",
					x: "period",
<<<<<<< HEAD
					type: "line",
=======
					type: "area-spline",
>>>>>>> origin/gh-pages
					keys: {
						x: "period",
						value: ["value"]
					}
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
<<<<<<< HEAD
							format: "%e-%b",
=======
							format: xAxisDateFormat,
>>>>>>> origin/gh-pages
							culling: {
								max: 7
							},
							rotate: 0
						}
					},
					y: {
						tick: {
							format: yAxisNumberFormat,
							culling: {
								max: 5
							}
						}
					}
				},
				size: {
					height: 240
				},
				legend: {
				    show: false
				},
				point: {
					r: 3,
					select: {
						r: 5
					}
				}
			};
			return c3.generate(config);
		};
		

		function refreshCharts() {
			refreshCountryCasesChart("#casesChartArea", isCases=true);
			refreshCountryCasesChart("#deathsChartArea", isCases=false);
		};


		$scope.onChartOptionsChanged = function() {
			refreshCharts();
		};
		
		refreshCharts();

	}]);