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
			$scope.selectedCountry = $scope.countries[0].name;
		};
		
		$scope.getSelectedCountryName = function(){
			for (i=0; i<$scope.countries; i++) {
				if ($scope.countries[i].id == $scope.selectedCountry) {
					return $scope.countries[i].name;
				}
			}
		}
		
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
			var location = ($scope.selectedCountry == "All affected countries") ? null: $scope.selectedCountry; //send the null value to getCountryData if all affected countries is selected
			dataService.getCountryChartData(location, $scope.selectedCaseType + postfix)
			.success(function (data) {
				if (location) {
					generateOneCountryChart(bindElement, data);
				}
				else {
					generateAllCountriesChart(bindElement, buildAllCountriesData(data));
				};
			})
			.error(function (error) {
				alert("Failed to return chart data from the data service");
				console.log(error);
			});	
		};

		function generateOneCountryChart(bindElement,data){
			var config = {
				bindto: bindElement,
				padding: {
					right: 50
				},
				data: {
					json: data,
					mimeType: "json",
					x: "period",
					type: "area",
					keys: {
						x: "period",
						value: ["value"]
					},
					names: {
						value: $scope.selectedCaseType.name
					}
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: xAxisDateFormat,
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
		
		function generateAllCountriesChart(bindElement,data){
			var groups = [];
			for (i=1; i<$scope.countries.length; i++) {
				groups[groups.length] = $scope.countries[i].id;
			};
			console.log(groups);
			var config2 = {
				bindto: bindElement,
				data: {
					x: "country",
					columns: data,
					type: "area-spline",
					groups: [groups]
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: xAxisDateFormat,
							culling: {
								max: 100
							}
						},
						label: {
							text: "Report date",
							position: "outer-center"
						}
					},
					y: {
						tick: {
							format: yAxisNumberFormat
						}
					}
				},
				size: {
					height: 300
				},
				padding: {
					right: 20
				}		
			}
			return c3.generate(config2);			
		};
		
		function refreshCharts() {
			refreshCountryCasesChart("#casesChartArea", isCases=true);
			refreshCountryCasesChart("#deathsChartArea", isCases=false);				
		};


		$scope.onChartOptionsChanged = function() {
			refreshCharts();
		};

		function buildAllCountriesData(data) {
			var dataArray = [[]]; //An empty two dimensional array to begin with
			dataArray[0][0] = "country";
			for (row=0; row<data.length;row++){
				var country = data[row].location;
				var period = data[row].period;
				var value = data[row].value;

				//find the index of the period. Insert it at the end if it does not exist.
				var periodIndex = -1;
				for (i=1; i < dataArray[0].length; i++) {
					if (dataArray[0][i] == period) {
						periodIndex = i;
						break;
					};
				};
				if (periodIndex == -1) { //period not found, add it to the output with all null values
					periodIndex = dataArray[0].length;
					dataArray[0][periodIndex] = period;
					for (i=1; i<dataArray.length; i++) {
						dataArray[i][periodIndex] = "";
					};
				};

				//find the index of the country. Insert it at the end if it does not exist.
				var countryIndex = -1;
				for (i=1; i < dataArray.length; i++) {
					if (dataArray[i][0] == country) {
						countryIndex = i;
						break;
					};
				};
				if (countryIndex == -1) { //country not found, add it to the output with all null values
					countryIndex = dataArray.length;
					dataArray[countryIndex] = [];
					dataArray[countryIndex][0] = country;
					for (i=1; i<dataArray[0].length; i++) {
						dataArray[countryIndex][i] = "";
					};
				};
				dataArray[countryIndex][periodIndex] = value;
			};
			console.log(dataArray);
			return dataArray;
		}

		refreshCharts();

	}]);