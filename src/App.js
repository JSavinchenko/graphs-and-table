import React, {useState} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './App.css';
import {data} from './initialData';

const App = () => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (index) => {
    setSelectedRow(selectedRow === index ? null : index);
  };

  const calculatePercentageChange = (today, yesterday) => {
    if (yesterday === 0) return 'N/A';
    return ((today - yesterday) / yesterday) * 100;
  };

  return (
    <div className='table-container'>
      <table className='stats-table'>
        <thead>
          <tr>
            <th>Показатель</th>
            <th style={{backgroundColor: '#edf8ff'}}>Текущий день</th>
            <th>Вчера</th>
            <th>Этот день недели</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const percentageChange = calculatePercentageChange(
              row.today,
              row.yesterday,
            );
            const isPositive = percentageChange > 0;
            const isZero = percentageChange === 0;
            const weekdayBackground =
              row.weekday === row.today
                ? '#f0f0f0'
                : row.weekday < row.today
                  ? '#d4edda'
                  : '#f8d7da';

            return (
              <React.Fragment key={index}>
                <tr
                  onClick={() => handleRowClick(index)}
                  className='clickable-row'
                >
                  <td>{row.indicator}</td>
                  <td className='this-day'>
                    {row.today.toLocaleString('ru-RU')}
                  </td>
                  <td
                    style={{
                      backgroundColor: isZero
                        ? '#f0f0f0'
                        : isPositive
                          ? '#d4edda'
                          : '#f8d7da',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    {row.yesterday.toLocaleString('ru-RU')}{' '}
                    <span
                      style={{
                        color: isZero ? 'green' : isPositive ? 'green' : 'red',
                      }}
                    >
                      <b>{percentageChange.toFixed()}%</b>
                    </span>
                  </td>
                  <td style={{backgroundColor: weekdayBackground}}>
                    {row.weekday.toLocaleString('ru-RU')}
                  </td>
                </tr>

                {selectedRow === index && (
                  <tr>
                    <td colSpan='4'>
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                          title: {text: row.indicator},
                          xAxis: {categories: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']},
                          series: [{name: row.indicator, data: row.history}],
                        }}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
