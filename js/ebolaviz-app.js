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
					configureCurrentDataset();
				};
			})
			.error(function (error) {
				console.log("Failed to return chart data from the data service");
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
					xs: {
			            'period': 'x1'
			        },
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
					type: "line"
					// groups: [groups]
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: xAxisDateFormat,
							culling: {
								max: 7
							},
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
					right: 50
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
			configureCurrentDataset();
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
						dataArray[i][periodIndex] = null;
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
						dataArray[countryIndex][i] = null;
					};
				};
				dataArray[countryIndex][periodIndex] = value;
			};
			console.log(dataArray);
			return dataArray;
		}

		function refreshDatasets() {
			$scope.datasets = [];

			//update headline figures
			dataService.getLatestFiguresPromise()
			.success(function (data) {
				getLatestFigures($scope.datasets, data);
				addAllAffectedCountriesLatestFigues($scope.datasets);
			})
			.error(function (error) {
				$scope.headlineFigures = {};
				console.log("Failed to update headline figures");
			});
		};

		function getLatestFigures(datasetsArray, data) {
			for (var i=0; i<data.length; i++) {
				var indicator = data[i].case_definition;
				var value = data[i].value;
				var locationIndex = getDatasetIndex(datasetsArray, data[i].location, true);
				if (indicator == "all_cases") {
					datasetsArray[locationIndex].latestFigures.cases.all = value;
				} else if (indicator == "confirmed_cases") {
					datasetsArray[locationIndex].latestFigures.cases.confirmed = value;
				} else if (indicator == "probable_cases") {
					datasetsArray[locationIndex].latestFigures.cases.probable = value;
				} else if (indicator == "suspected_cases") {
					datasetsArray[locationIndex].latestFigures.cases.suspected = value;
				} else if (indicator == "all_deaths") {
					datasetsArray[locationIndex].latestFigures.deaths.all = value;
				} else if (indicator == "confirmed_deaths") {
					datasetsArray[locationIndex].latestFigures.deaths.confirmed = value;
				} else if (indicator == "probable_deaths") {
					datasetsArray[locationIndex].latestFigures.deaths.probable = value;
				} else if (indicator == "suspected_deaths") {
					datasetsArray[locationIndex].latestFigures.deaths.suspected = value;
				};
			};
		};

		function addAllAffectedCountriesLatestFigues(datasetsArray) {
			var allCountriesindex = getDatasetIndex(datasetsArray, "All affected countries", true);
			datasetsArray[allCountriesindex].latestFigures.cases.all = 0;
			datasetsArray[allCountriesindex].latestFigures.cases.confirmed = 0;
			datasetsArray[allCountriesindex].latestFigures.cases.probable = 0;
			datasetsArray[allCountriesindex].latestFigures.cases.suspected = 0;
			datasetsArray[allCountriesindex].latestFigures.deaths.all = 0;
			datasetsArray[allCountriesindex].latestFigures.deaths.confirmed = 0;
			datasetsArray[allCountriesindex].latestFigures.deaths.probable = 0;
			datasetsArray[allCountriesindex].latestFigures.deaths.suspected = 0;
			for (var i=0; i<datasetsArray.length - 1; i++) {
				datasetsArray[allCountriesindex].latestFigures.cases.all += datasetsArray[i].latestFigures.cases.all;
				datasetsArray[allCountriesindex].latestFigures.cases.confirmed += datasetsArray[i].latestFigures.cases.confirmed;
				datasetsArray[allCountriesindex].latestFigures.cases.probable += datasetsArray[i].latestFigures.cases.probable;
				datasetsArray[allCountriesindex].latestFigures.cases.suspected += datasetsArray[i].latestFigures.cases.suspected;
				datasetsArray[allCountriesindex].latestFigures.deaths.all += datasetsArray[i].latestFigures.deaths.all;
				datasetsArray[allCountriesindex].latestFigures.deaths.confirmed += datasetsArray[i].latestFigures.deaths.confirmed;
				datasetsArray[allCountriesindex].latestFigures.deaths.probable += datasetsArray[i].latestFigures.deaths.probable;
				datasetsArray[allCountriesindex].latestFigures.deaths.suspected += datasetsArray[i].latestFigures.deaths.suspected;
			};
			$scope.currentDataset = datasetsArray[allCountriesindex];
		};

		function getDatasetIndex(datasetsArray, location, create) {
			for (var i=0; i<datasetsArray.length; i++) {
				if (location == datasetsArray[i].location) {
					return i;
					break;
				};
			};
			
			//We have reached this far because the location has not been found.
			//We may have to create an entry for the location based on the the
			//setting of the create parameter.
			if (create) {
				var dataset = {
					location: location,
					latestFigures: {
						cases: {
							all: "",
							confirmed: "",
							probable: "",
							suspected: ""
						},
						deaths: {
							all: "",
							confirmed: "",
							probable: "",
							suspected: ""
						}
					},
					casesData: {
						all: [
							["period", "value"]
						],
						confirmed: [
							["period", "value"]
						],
						probable: [
							["period", "value"]
						],
						suspected: [
							["period", "value"]
						]
					},
					deathsData: {
						all: [
							["period", "value"]
						],
						confirmed: [
							["period", "value"]
						],
						probable: [
							["period", "value"]
						],
						suspected: [
							["period", "value"]
						]
					}					
				};
				return datasetsArray.push(dataset)-1;
			} else {
				return -1;
			};
		};

		function configureCurrentDataset() {
			var datasetIndex = getDatasetIndex($scope.datasets, $scope.selectedCountry, false);
			if (datasetIndex >= 0) {
				$scope.currentDataset = $scope.datasets[datasetIndex];
			} else {
				console.log("Data configuration failed")
			};
		};

		$scope.initApplication = function () {
			refreshDatasets();
			refreshCharts();
		};

		$scope.initApplication();

	}]);