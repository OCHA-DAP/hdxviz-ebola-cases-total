var ebolaVizApp = angular.module("ebolaVizApp", [])
	.controller("ebolaVizController", ["$scope", "dataService", function($scope, dataService) {
		yAxisNumberFormat = d3.format(",");
		xAxisDateFormat = "%e %b";

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
					type: "line",
					keys: {
						x: "period",
						value: ["value"]
					}			
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: "%e-%b",
							culling: {
								max: 100
							}
						}
					},
					y: {
						tick: {
							format: d3.format(",")
						}
					}
				},
				size: {
					height: 240
				},
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