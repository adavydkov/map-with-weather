import React from "react";
import { Bar } from "react-chartjs-2";

import "./style.css";

class Chart extends React.Component {
  constructor(props) {
    super(props);
    const labels = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь"
    ];

    const years = [
      "2018",
      "2017",
      "2016",
      "2015",
      "2014",
      "2013",
      "2012",
      "2011"
    ];

    this.state = {
      labels: labels,
      years: years
    };
  }

  prepareDataSets() {
    const avgMonthlyRate = this.props.avgMonthlyRate;
    const avgTemp = this.props.avgTemp;

    let avgTempSetLessRate = [];
    let avgTempSetMoreRate = [];

    for (let i = 0; i < 12; i++) {
      if (Math.abs(avgTemp[i]) > Math.abs(avgMonthlyRate[i])) {
        avgTempSetMoreRate.push(avgTemp[i]);
        avgTempSetLessRate.push(null);
      } else {
        avgTempSetMoreRate.push(null);
        avgTempSetLessRate.push(avgTemp[i]);
      }
    }

    return {
      avgTempSetMoreRate: avgTempSetMoreRate,
      avgTempSetLessRate: avgTempSetLessRate
    };
  }

  prepareChartData() {
    let data = {};
    if (this.props.avgMonthlyRate && this.props.avgMonthlyRate.length > 0) {
      const preparedDataSets = this.prepareDataSets();
      data = {
        labels: this.state.labels,
        datasets: [
          {
            label: this.props.label,
            data: preparedDataSets.avgTempSetLessRate,
            backgroundColor: "#f44b4f"
          },

          {
            label: "Среднемесячная норма",
            data: this.props.avgMonthlyRate,
            backgroundColor: "#fbb9b8"
          },
          {
            label: this.props.label,
            data: preparedDataSets.avgTempSetMoreRate,
            backgroundColor: "#f44b4f"
          }
        ]
      };
    }
    return data;
  }

  getUniqueKey() {
    return Math.random() * Math.pow(10, 20);
  }

  render() {
    const data = this.prepareChartData();
    const options = {
      enabled: true,
      legend: false,
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [
          {
            stacked: false,
            scaleLabel: {
              display: true,
              labelString: "Температура °C"
            }
          }
        ]
      }
    };

    return (
      <div className={`chart-block`}>
        {this.props.avgMonthlyRate && this.props.avgMonthlyRate.length > 0 ? (
          <div className="chart-container">
            {this.renderLegend()}
            {this.renderSelect()}
            <Bar
              data={data}
              width={300}
              height={100}
              options={options}
              datasetKeyProvider={this.getUniqueKey}
            />
          </div>
        ) : (
          this.renderHint()
        )}
      </div>
    );
  }

  renderLegend() {
    return (
      <ul className={`legend`}>
        <li>
          <div className={`marker rose`} />
          Среднемесячная норма
        </li>
        <li>
          <div className={`marker red`} />
          {this.props.label}
        </li>
      </ul>
    );
  }

  renderSelect() {
    return (
      <select
        onChange={this.props.handleSelect}
        value={this.props.yearSelected}
      >
        {this.state.years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
    );
  }

  renderHint() {
    if (!this.props.fetching) {
      if (this.props.firstLoadComplete) {
        return <p>Для данной местности данные не найдены</p>;
      } else {
        return (
          <p>
            Выберите точку на карте для получения сведений о средней температуре
          </p>
        );
      }
    } else return null;
  }
}

export default Chart;
