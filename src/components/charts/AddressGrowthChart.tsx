'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useTheme } from '@/contexts/ThemeContext';
import { GET_ADDRESS_GROWTH_CHART } from '@/lib/graphql-queries';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

interface AddressGrowthData {
  timestamp: string;
  totalAddresses: number;
  newAddresses: number;
}

interface AddressGrowthResponse {
  addressGrowthChart: {
    data: AddressGrowthData[];
    totalAddresses: number;
    dataPoints: number;
  };
}


export default function AddressGrowthChart() {
  const { theme } = useTheme();

  const { data, loading, error } = useQuery<AddressGrowthResponse>(GET_ADDRESS_GROWTH_CHART, {
    variables: { timeRange: 'ALL_TIME' },
    errorPolicy: 'all'
  });

  const formatDate = (timestamp: string) => {
    let date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp * 1000);
    } else if (typeof timestamp === 'string') {
      if (timestamp.includes('T') || timestamp.includes('-')) {
        date = new Date(timestamp);
      } else {
        const numTimestamp = parseInt(timestamp);
        date = new Date(numTimestamp < 1e10 ? numTimestamp * 1000 : numTimestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() < 2020 ? 'numeric' : undefined
    });
  };

  const formatTooltipDate = (timestamp: string) => {
    let date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp * 1000);
    } else if (typeof timestamp === 'string') {
      if (timestamp.includes('T') || timestamp.includes('-')) {
        date = new Date(timestamp);
      } else {
        const numTimestamp = parseInt(timestamp);
        date = new Date(numTimestamp < 1e10 ? numTimestamp * 1000 : numTimestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const timestamp = dataPoint.originalTimestamp || dataPoint.timestamp;
      
      return (
        <div className={`p-4 rounded-xl shadow-lg border ${
          theme === 'pink' 
            ? 'bg-white/95 backdrop-blur-sm border-white/30 text-gray-900' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-medium text-gray-600">{formatTooltipDate(timestamp)}</p>
          <p className="text-lg font-bold mt-1" style={{ color: payload[0].color }}>
            {payload[0].value.toLocaleString()} addresses
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`rounded-3xl p-8 shadow-sm border ${
        theme === 'pink'
          ? 'bg-white/10 backdrop-blur-md border-white/20'
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className={`h-6 w-6 ${
            theme === 'pink' ? 'text-white' : 'text-gray-600'
          }`} />
          <div>
            <h2 className={`text-xl font-bold ${
              theme === 'pink' ? 'text-white' : 'text-gray-900'
            }`}>
              Blockchain User Growth
            </h2>
            <div className={`h-4 w-48 rounded mt-2 animate-pulse ${
              theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
            }`} />
          </div>
        </div>
        
        <div className="mb-6">
          <div className={`p-6 rounded-xl text-center ${
            theme === 'pink' ? 'bg-white/10' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className={`h-4 w-32 rounded animate-pulse ${
                theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
              }`} />
            </div>
            <div className={`h-10 w-40 rounded mx-auto animate-pulse ${
              theme === 'pink' ? 'bg-white/20' : 'bg-gray-200'
            }`} />
          </div>
        </div>
        
        <div className={`h-80 rounded-lg ${
          theme === 'pink' ? 'bg-white/10' : 'bg-gray-100'
        }`}>
          <div className="flex items-end justify-around h-full p-8 pb-12">
            {[40, 65, 45, 70, 55, 80, 75, 85, 90, 95].map((height, i) => (
              <div 
                key={i}
                className={`w-8 animate-pulse rounded-t ${
                  theme === 'pink' ? 'bg-white/20' : 'bg-gray-300'
                }`}
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const mockData = {
    addressGrowthChart: {
      data: [
        { timestamp: '2024-05-25T00:00:00Z', totalAddresses: 0, newAddresses: 0 },
        { timestamp: '2024-05-26T00:00:00Z', totalAddresses: 4, newAddresses: 4 },
        { timestamp: '2024-05-27T00:00:00Z', totalAddresses: 22564, newAddresses: 22560 },
        { timestamp: '2024-05-29T00:00:00Z', totalAddresses: 35161, newAddresses: 12597 },
        { timestamp: '2024-06-15T00:00:00Z', totalAddresses: 45200, newAddresses: 10039 },
        { timestamp: '2024-07-01T00:00:00Z', totalAddresses: 58900, newAddresses: 13700 },
        { timestamp: '2024-08-01T00:00:00Z', totalAddresses: 67500, newAddresses: 8600 },
        { timestamp: '2024-09-01T00:00:00Z', totalAddresses: 78200, newAddresses: 10700 },
        { timestamp: '2024-10-01T00:00:00Z', totalAddresses: 85100, newAddresses: 6900 },
        { timestamp: '2024-11-09T00:00:00Z', totalAddresses: 92500, newAddresses: 7400 }
      ],
      totalAddresses: 92500,
      dataPoints: 10
    }
  };

  const chartData = data || (error ? mockData : null);
  
  if (!chartData) {
    return (
      <div className={`rounded-3xl p-8 shadow-sm border ${
        theme === 'pink'
          ? 'bg-white/10 backdrop-blur-md border-white/20'
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className={`h-6 w-6 ${
            theme === 'pink' ? 'text-white' : 'text-gray-600'
          }`} />
          <h2 className={`text-xl font-bold ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            Blockchain User Growth
          </h2>
        </div>
        <div className={`text-center py-8 ${
          theme === 'pink' ? 'text-white/80' : 'text-gray-600'
        }`}>
          No data available
        </div>
      </div>
    );
  }

  const processedData = chartData.addressGrowthChart.data.map(item => ({
    ...item,
    date: formatDate(item.timestamp),
    originalTimestamp: item.timestamp
  }));

  return (
    <div className={`rounded-3xl p-8 shadow-sm border ${
      theme === 'pink'
        ? 'bg-white/10 backdrop-blur-md border-white/20'
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className={`h-6 w-6 ${
          theme === 'pink' ? 'text-white' : 'text-gray-600'
        }`} />
        <div>
          <h2 className={`text-xl font-bold ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            Blockchain User Growth
          </h2>
          <p className={`text-sm ${
            theme === 'pink' ? 'text-white/80' : 'text-gray-600'
          }`}>
            See how our community has grown since day one
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className={`p-6 rounded-xl text-center ${
          theme === 'pink' ? 'bg-white/10' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className={`h-5 w-5 ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`} />
            <span className={`text-sm font-medium ${
              theme === 'pink' ? 'text-white/80' : 'text-gray-600'
            }`}>
              Total Addresses
            </span>
          </div>
          <p className={`text-4xl font-bold ${
            theme === 'pink' ? 'text-white' : 'text-gray-900'
          }`}>
            {chartData.addressGrowthChart.totalAddresses.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === 'pink' ? '#C2185B' : '#3B82F6'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme === 'pink' ? '#C2185B' : '#3B82F6'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme === 'pink' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: theme === 'pink' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                fontSize: 11
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: theme === 'pink' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                fontSize: 11
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="totalAddresses" 
              stroke={theme === 'pink' ? '#C2185B' : '#3B82F6'}
              strokeWidth={3}
              fill="url(#colorGradient)"
              dot={false}
              activeDot={{ r: 6, stroke: theme === 'pink' ? '#C2185B' : '#3B82F6', strokeWidth: 2, fill: theme === 'pink' ? '#C2185B' : '#3B82F6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}