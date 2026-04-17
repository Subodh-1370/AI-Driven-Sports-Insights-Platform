import React from 'react';

const DataSummary = ({ dataStats }) => {
  const stats = [
    { label: 'Total Records', value: dataStats?.totalRecords || 0, color: 'blue' },
    { label: 'Matches', value: dataStats?.matches || 0, color: 'green' },
    { label: 'Players', value: dataStats?.players || 0, color: 'purple' },
    { label: 'Data Quality', value: dataStats?.quality || '95%', color: 'yellow' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center`}>
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataSummary;
