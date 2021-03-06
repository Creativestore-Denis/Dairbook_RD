import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart } from "chart.js";
import { metronic } from "../../_metronic";
import moment from "moment";

export default function GenericChart({ title, desc, rawData, chartType, color, step }) {
  const ref = useRef();
  const fillArr = [true,false];
  const {  brandColor, dangerColor, successColor, primaryColor } = useSelector(
      state => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      dangerColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.danger"
      ),
      successColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.success"
      ),
      primaryColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.primary"
      )
    })
  );

  let chartColors = [successColor, brandColor, dangerColor, primaryColor];

  let months = [];
  let monthlyData = [];
  if(rawData.data && step === 'monthly'){
    rawData.data.sort(function(a, b){return a.month - b.month});
    rawData.data.forEach(function (obj, index) {
      months.push(""+moment(obj.month, 'M').format('MMMM')+"");
      monthlyData.push(""+obj.count+"");
    });
  }

  function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  function randomData(){
      return [15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20].sort(function (a, b) { return 0.5 - Math.random() });
  }

  function randomColor(){
      return chartColors[Math.floor(Math.random() * chartColors.length)];
  }

  useEffect(() => {
    let ctx = ref.current.getContext("2d");
    let type = "line";
    let gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, Chart.helpers.color(randomColor()).alpha(0.6).rgbString());
    gradient.addColorStop(1, Chart.helpers.color(randomColor()).alpha(0.3).rgbString());

    if(chartType)
        type = ""+chartType+"";

    const chart = new Chart(ref.current, {
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            // label: 'dataset 1',
              backgroundColor: color ? color: randomColor(),
              borderColor: Chart.helpers.color(randomColor()).alpha(0.5).rgbString(),
              fill: fillArr[Math.floor(Math.random() * fillArr.length)],
              data: step === 'monthly' ? monthlyData : randomData(),
              borderDash: [5, 5],
          }
        ]
      },
      type: type,
      options: {
        title: { display: false },
        tooltips: {
          intersect: false,
          mode: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    labelString: 'Value'
                }
            }]
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 10,
                bottom: 0
            }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [brandColor, dangerColor, successColor, primaryColor, monthlyData]);

  return (
    <div className="kt-chart__widget">
      <div className="kt-chart__widget_header kt-margin-b-30">
        <h3 className="kt-chart__widget_title">{title}</h3>
        <span className="kt-chart__widget_desc">{desc}</span>
      </div>
      <div className="kt-chart__widget_chart" style={{ height: "120px" }}>
        <canvas ref={ref} />
      </div>
      <div className="kt-chart__widget_legends">
              <div className="kt-chart__widget_legend">
                  <span className="flaticon2-up kt-font-success"></span>
                  <span className="kt-chart__widget_stats">{rawData ? rawData.active : 0}</span>
              </div>
              <div className="kt-chart__widget_legend">
                  <span className="flaticon2-down kt-font-danger"></span>
                  <span className="kt-chart__widget_stats">{rawData ? rawData.inactive : 0}</span>
              </div>

          </div>
    </div>
  );
}
