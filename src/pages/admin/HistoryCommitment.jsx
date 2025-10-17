import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Users, Target, Trash2 } from 'lucide-react';
import { employees } from '../../data/mockData';

const AdminHistoryCommitment = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [historyData, setHistoryData] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('commitmentHistory');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setHistoryData(parsedData);
    }
  }, []);

  // Filter data whenever filters change
  useEffect(() => {
    applyFilters();
  }, [dateRange, selectedEmployee, selectedTarget, historyData]);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...historyData];

    // Date range filter - only apply if both dates are set
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.dateStart);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Employee filter
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(record => record.employeeId === selectedEmployee);
    }

    // Target range filter
    if (selectedTarget !== 'all') {
      const targetValue = parseInt(selectedTarget);
      filtered = filtered.filter(record => {
        return record.target >= targetValue - 5 && record.target <= targetValue + 5;
      });
    }

    setFilteredHistory(filtered);
  };

  const handleClearFilters = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
    setSelectedEmployee('all');
    setSelectedTarget('all');
  };

  const handleDeleteRecord = (index) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedHistory = historyData.filter((_, i) => i !== index);
      setHistoryData(updatedHistory);
      localStorage.setItem('commitmentHistory', JSON.stringify(updatedHistory));
    }
  };

  const calculateStats = () => {
    if (filteredHistory.length === 0) {
      return {
        totalRecords: 0,
        avgCommitment: 0,
        avgWorkNotDone: 0,
        avgWorkNotDoneOnTime: 0
      };
    }

    return {
      totalRecords: filteredHistory.length,
      avgCommitment: Math.round(filteredHistory.reduce((acc, rec) => acc + rec.commitment, 0) / filteredHistory.length),
      avgWorkNotDone: Math.round(filteredHistory.reduce((acc, rec) => acc + rec.nextWeekPlannedWorkNotDone, 0) / filteredHistory.length),
      avgWorkNotDoneOnTime: Math.round(filteredHistory.reduce((acc, rec) => acc + rec.nextWeekPlannedWorkNotDoneOnTime, 0) / filteredHistory.length)
    };
  };

  const stats = calculateStats();
  const getHistoryIndex = (filteredRecord) => {
    return historyData.findIndex(rec => 
      rec.employeeId === filteredRecord.employeeId && 
      rec.dateStart === filteredRecord.dateStart &&
      rec.dateEnd === filteredRecord.dateEnd
    );
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">History Commitment</h1>
          <p className="text-sm text-gray-500 mt-1">Commitment tracking and performance history</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button 
            onClick={handleClearFilters}
            className="ml-auto text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
              />
            </div>
          </div>
          
          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
              />
            </div>
          </div>
          
          {/* Employee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm appearance-none bg-white"
              >
                <option value="all">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Target Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Range</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm appearance-none bg-white"
              >
                <option value="all">All Targets</option>
                <option value="85">80-90%</option>
                <option value="90">85-95%</option>
                <option value="95">90-100%</option>
                <option value="100">95-100%</option>
              </select>
            </div>
          </div>
        </div>
      </div>



      {/* History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Commitment History</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredHistory.length} records for the selected period
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Start</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week End</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned % Work Not Done</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned % Work Not Done On Time</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commitment</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record, idx) => {
                  const historyIndex = getHistoryIndex(record);
                  const submittedDate = new Date(record.submittedAt);
                  const formattedDate = submittedDate.toLocaleDateString('en-IN');
                  const formattedTime = submittedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.name}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{record.department}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.target}%</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{record.dateStart}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{record.dateEnd}</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-600"
                              style={{ width: `${Math.min(record.nextWeekPlannedWorkNotDone, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{record.nextWeekPlannedWorkNotDone}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-yellow-600"
                              style={{ width: `${Math.min(record.nextWeekPlannedWorkNotDoneOnTime, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{record.nextWeekPlannedWorkNotDoneOnTime}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          record.commitment >= 95 ? 'bg-green-100 text-green-800' : 
                          record.commitment >= 85 ? 'bg-yellow-100 text-yellow-800' : 
                          record.commitment >= 75 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.commitment}%
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-600">
                          <div>{formattedDate}</div>
                          <div className="text-gray-500">{formattedTime}</div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteRecord(historyIndex)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-3 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-8 h-8 text-gray-400" />
                      <span>No commitment records found for the selected period</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default AdminHistoryCommitment;