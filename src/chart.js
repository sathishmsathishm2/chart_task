// src/MultiDatasetChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MultiDatasetChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from JSONPlaceholder API
    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts').then(response => response.json()),
      fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json())
    ])
    .then(([posts, users]) => {
      // Process the data
      const userPostCounts = posts.reduce((acc, post) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1;
        return acc;
      }, {});

      const userNames = users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});

      const labels = Object.keys(userPostCounts).map(userId => userNames[userId]);
      const postCounts = Object.values(userPostCounts);

      // Assuming we want to show two datasets
      const anotherDataset = postCounts.map(count => count * Math.random()); // Example dataset for demonstration

      setChartData({
        labels,
        datasets: [
          {
            label: 'Number of Posts',
            backgroundColor: 'rgba(75,192,192,0.6)',
            borderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: 'rgba(75,192,192,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75,192,192,1)',
            fill: false,
            data: postCounts,
          },
          {
            label: 'Another Dataset',
            backgroundColor: 'rgba(153,102,255,0.6)',
            borderColor: 'rgba(153,102,255,1)',
            pointBackgroundColor: 'rgba(153,102,255,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(153,102,255,1)',
            fill: false,
            data: anotherDataset,
          },
        ],
      });
      setLoading(false);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart with Multiple Datasets',
      },
    },
  };

  return (
    <div>
      <h2>Multi-Dataset Line Chart</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MultiDatasetChart;
