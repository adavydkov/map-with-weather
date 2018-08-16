import React, { Component } from "react";
import { fetchGmxIdByGeoPoint, fetchTempByGmxId } from "../actions/geoMixer";

import Chart from "../components/Chart";
import { Map } from "../components/Map";
import Preloader from "../components/Preloader";

class App extends Component {
  constructor(props) {
    super(props);
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12"
    ];

    this.state = {
      months: months,
      firstLoadComplete: false,

      fetching: false,
      allYearsAvgTempByMonth: {},
      avgMonthlyRate: [],

      currentAvgTempDataSet: [],
      yearSelected: "2018",

      mapCenterLat: 55.755826,
      mapCenterLng: 37.617299900000035,
      markerLat: "",
      markerLng: "",
      mapInit: new Date().toISOString()
    };
  }

  componentDidMount() {
    this.getBrowserGeoLocation();
  }

  getBrowserGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.mapReInit(position.coords.latitude, position.coords.longitude);
        }
      });
    }
  }

  mapReInit(lat, lng) {
    this.setState({
      mapCenterLat: lat,
      mapCenterLng: lng,
      mapInit: new Date().toISOString()
    });
  }

  toggleFetching() {
    this.setState({
      fetching: !this.state.fetching
    });
  }

  markFirstLoadComplete() {
    this.setState({
      firstLoadComplete: true
    });
  }

  coordsRound(coord) {
    return Math.round(coord / 0.25) * 0.25;
  }

  clearTempData() {
    this.setState({
      allYearsAvgTempByMonth: {},
      avgMonthlyRate: [],
      currentAvgTempDataSet: []
    });
  }

  setMarkerCoords(coords) {
    this.setState({
      markerLat: coords.latLng.lat(),
      markerLng: coords.latLng.lng()
    });
  }

  getGmxIdByGeoPoint(coords) {
    this.toggleFetching();
    this.setMarkerCoords(coords);
    const data = {
      lat: this.coordsRound(coords.latLng.lat()),
      lon: this.coordsRound(coords.latLng.lng())
    };
    fetchGmxIdByGeoPoint(data).then(gmxIdByGeoPointResult => {
      if (!this.state.firstLoadComplete) {
        this.markFirstLoadComplete();
      }

      if (
        gmxIdByGeoPointResult.features &&
        gmxIdByGeoPointResult.features.length > 0 &&
        gmxIdByGeoPointResult.features[0].properties &&
        gmxIdByGeoPointResult.features[0].properties.gmx_id
      ) {
        this.getTempByGmxId(
          gmxIdByGeoPointResult.features[0].properties.gmx_id
        );
      } else {
        this.toggleFetching();
        this.clearTempData();
      }
    });
  }

  getTempByGmxId(gmx_id) {
    fetchTempByGmxId(gmx_id).then(tempByGmxIdResult => {
      if (tempByGmxIdResult.features && tempByGmxIdResult.features.length > 0) {
        this.processingResult(tempByGmxIdResult);
      } else {
        this.toggleFetching();
        this.clearTempData();
      }
    });
  }

  processingResult(tempByGmxIdResult) {
    const allYearsGroupByMonth = this.groupDataByMonth(tempByGmxIdResult);

    const allYearsAvgTempByMonth = this.calculateAvgTempByMonthForEachYear(
      allYearsGroupByMonth
    );

    const avgMonthlyRate = this.calculateAvgMonthlyRate(allYearsAvgTempByMonth);

    this.setState(
      {
        allYearsAvgTempByMonth: allYearsAvgTempByMonth,
        avgMonthlyRate: avgMonthlyRate
      },
      () => this.getCurrentDataSet(this.state.yearSelected),
      this.toggleFetching()
    );
  }

  groupDataByMonth(data) {
    let dataGroupByMonth = {};
    for (let value of data.features) {
      if (value.properties && value.properties.AvgTemp) {
        let yearMonthKey = value.properties.Date.substring(0, 7);
        if (!dataGroupByMonth[yearMonthKey]) {
          dataGroupByMonth[yearMonthKey] = [];
        }
        dataGroupByMonth[yearMonthKey].push(value.properties.AvgTemp);
      }
    }

    return dataGroupByMonth;
  }

  calculateAvgTempByMonthForEachYear(allYearsGroupByMonth) {
    let allYearsAvgTempByMonth = {};
    for (let prop in allYearsGroupByMonth) {
      let sumTempByMonth = 0;
      for (let valueInMonth of allYearsGroupByMonth[prop]) {
        sumTempByMonth += valueInMonth;
      }
      let avgTempByMonth = sumTempByMonth / allYearsGroupByMonth[prop].length;
      let year = prop.substring(0, 4);
      let month = prop.substring(prop.length - 2);
      if (!allYearsAvgTempByMonth[year]) {
        allYearsAvgTempByMonth[year] = {};
      }
      allYearsAvgTempByMonth[year][month] = avgTempByMonth;
    }

    return allYearsAvgTempByMonth;
  }

  calculateAvgMonthlyRate(allYearsAvgTempByMonth) {
    let avgMonthlyRate = [];
    for (let month of this.state.months) {
      let sumAvgTemp = 0;
      let yearsCount = 0;
      for (let prop in allYearsAvgTempByMonth) {
        if (allYearsAvgTempByMonth[prop].hasOwnProperty(month)) {
          sumAvgTemp += allYearsAvgTempByMonth[prop][month];
          yearsCount++;
        }
      }
      if (yearsCount) {
        avgMonthlyRate.push(sumAvgTemp / yearsCount);
      } else {
        avgMonthlyRate.push(0);
      }
    }

    return avgMonthlyRate;
  }

  getCurrentDataSet(year) {
    let currentAvgTempDataSet = [];

    if (this.state.allYearsAvgTempByMonth[year]) {
      for (let month of this.state.months) {
        if (this.state.allYearsAvgTempByMonth[year].hasOwnProperty(month)) {
          currentAvgTempDataSet.push(
            this.state.allYearsAvgTempByMonth[year][month]
          );
        }
      }
    }

    this.setState({
      currentAvgTempDataSet: currentAvgTempDataSet
    });
  }

  handleSelect(event) {
    const year = event.target.value;
    this.setState(
      {
        yearSelected: year
      },
      () => this.getCurrentDataSet(year)
    );
  }

  render() {
    return (
      <div className="App">
        <Map
          key={this.state.mapInit}
          onClick={this.getGmxIdByGeoPoint.bind(this)}
          mapCenterLat={this.state.mapCenterLat}
          mapCenterLng={this.state.mapCenterLng}
          markerLat={this.state.markerLat}
          markerLng={this.state.markerLng}
        />

        <Chart
          avgMonthlyRate={this.state.avgMonthlyRate}
          avgTemp={this.state.currentAvgTempDataSet}
          label={this.state.yearSelected}
          handleSelect={this.handleSelect.bind(this)}
          firstLoadComplete={this.state.firstLoadComplete}
          fetching={this.state.fetching}
        />

        {this.state.fetching && <Preloader />}
      </div>
    );
  }
}

export default App;
