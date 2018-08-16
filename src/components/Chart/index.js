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

  prepareChartData() {
    let data = {};
    if (this.props.avgMonthlyRate && this.props.avgMonthlyRate.length > 0) {
      data = {
        labels: this.state.labels,
        datasets: [
          {
            label: "Среднемесячная норма",
            data: this.props.avgMonthlyRate,
            backgroundColor: "#fbb9b8"
          },
          {
            label: this.props.label,
            data: this.props.avgTemp,
            backgroundColor: "#f44b4f"
          }
        ]
      };
    }
    return data;
  }

  render() {
    const data = this.prepareChartData();
    const options = {
      enabled: true,
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      }
    };

    return (
      <div className={`chart-block`}>
        {this.props.avgMonthlyRate && this.props.avgMonthlyRate.length > 0 ? (
          <div className="chart-container">
            {this.renderSelect()}
            <Bar data={data} width={300} height={100} options={options} />
          </div>
        ) : (
          this.renderHint()
        )}
      </div>
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
