import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ type, data, componentName }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: type,
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                generateLabels: (chart) => {
                  const datasets = chart.data.datasets;
                  return datasets.map((dataset, i) => ({
                    text: dataset.label,
                    fillStyle: dataset.backgroundColor,
                    hidden: !chart.isDatasetVisible(i),
                    lineCap: dataset.borderCapStyle,
                    lineDash: dataset.borderDash,
                    lineDashOffset: dataset.borderDashOffset,
                    lineJoin: dataset.borderJoinStyle,
                    lineWidth: dataset.borderWidth,
                    strokeStyle: dataset.borderColor,
                    rotation: dataset.rotation
                  }));
                },
              },
            },
            title: {
              display: true,
              text: componentName,
              font: {
                size: 17,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // Hide x-axis grid lines
              },
            },
            y: {
              grid: {
                display: false, // Hide y-axis grid lines
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, data, componentName]);

  return <div className='h-60' ><canvas ref={chartRef}></canvas></div>;
};

export default ChartComponent;