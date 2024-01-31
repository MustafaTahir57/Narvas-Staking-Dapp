import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';

const DailyIncreaseChart = ({ totalEarnStaked, depositTime }) => {
  const [data, setData] = useState([]);
  const [dynamicTime, setDynamicTime] = useState('');

  // Update dynamic time whenever totalEarnStaked changes
  useEffect(() => {
    const currentTime = new Date();
    const formattedDate = `${currentTime.getDate().toString().padStart(2, '0')}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}`;
    const formattedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    setDynamicTime(`${formattedTime} /${formattedDate}`);
  }, [totalEarnStaked]);

  // Initialize data with deposit time
  useEffect(() => {
    setData([{ time: depositTime, value: 0 }]);
  }, [depositTime]);

  // When data updates, add a new entry with dynamic time and totalEarnStaked
  useEffect(() => {
    if (data.length > 0) {
      setData(prevData => [...prevData, { time: dynamicTime, value: totalEarnStaked }]);
    }
  }, [dynamicTime,depositTime]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#3F8DE5" fill="#3f8ce5b5" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DailyIncreaseChart;








// import React, { useState, useEffect } from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// const DailyIncreaseChart = ({ totalEarnStaked ,depositTime }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const currentTime = new Date();
//     const formattedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;
//     if (data.length === 0) {
//       setData([{ time: formattedTime, value: 0 }]);
//     } else {
//       setData(prevData => [...prevData, { time: formattedTime, value: totalEarnStaked }]);
//     }
//   }, [totalEarnStaked]);
  

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <AreaChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="time" />
//         <YAxis />
//         <Tooltip />
//         <Area type="monotone" dataKey="value" stroke="#3F8DE5" fill="#3f8ce5b5" />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default DailyIncreaseChart;



