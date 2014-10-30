var ebolaVizApp = angular.module("ebolaVizApp", [])
	.controller("ebolaVizController", ["$scope", "dataService", function($scope, dataService) {
		
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
				drawOneCountryCasesChart(bindElement, data);
			})
			.error(function (error) {
				alert("Failed to return chart data from the data service");
			});	
		};
		
		function drawOneCountryCasesChart(bindElement,data){
			config = {
				bindto: bindElement,
				data: {
					json: data,
					type: "timeseries",
					keys: {
						value: ["value"]
					}			
				},
				size: {
					height: 240
				},
			};
			var casesChart = c3.generate(config);
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