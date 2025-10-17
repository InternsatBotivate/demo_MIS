import React, { useState, useEffect } from 'react';
import { Filter, Search, Calendar, ChevronDown } from 'lucide-react';
import { employees, tasks, departments } from '../../data/mockData';

const Report = () => {
  const [filterName, setFilterName] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);

  useEffect(() => {
    // Get unique departments
    const depts = [...new Set(employees.map(emp => emp.department))];
    setUniqueDepartments(depts);
    
    // Get unique employee names
    const names = [...new Set(employees.map(emp => emp.name))];
    setUniqueNames(names);
    
    // Initialize with all data
    applyFilters();
  }, []);

  const applyFilters = () => {
    let filteredTasks = [...tasks];

    // Filter by name
    if (filterName) {
      filteredTasks = filteredTasks.filter(task => 
        task.personName.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    // Filter by department
    if (filterDepartment) {
      const departmentEmployees = employees.filter(emp => 
        emp.department === filterDepartment
      ).map(emp => emp.id);
      
      filteredTasks = filteredTasks.filter(task => 
        departmentEmployees.includes(task.assignedTo)
      );
    }

    // Filter by date range
    if (startDate) {
      filteredTasks = filteredTasks.filter(task => 
        task.dueDate >= startDate
      );
    }

    if (endDate) {
      filteredTasks = filteredTasks.filter(task => 
        task.dueDate <= endDate
      );
    }

    setFilteredData(filteredTasks);
  };

  const clearFilters = () => {
    setFilterName('');
    setFilterDepartment('');
    setStartDate('');
    setEndDate('');
    setFilteredData(tasks);
  };

  const handleNameSelect = (name) => {
    setFilterName(name);
    setIsNameDropdownOpen(false);
  };

  // Calculate metrics for each task
  const getTaskMetrics = (task) => {
    const employee = employees.find(emp => emp.id === task.assignedTo);
    if (!employee) return null;

    return {
      target: employee.target,
      totalAchievement: employee.actualWorkDone,
      workDonePercentage: employee.totalWorkDone,
      workDoneOnTimePercentage: employee.weeklyWorkDoneOnTime,
      allPendingTillDate: employee.allPendingTillDate
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { color: 'bg-red-100 text-red-800', label: 'High' },
      'medium': { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      'low': { color: 'bg-green-100 text-green-800', label: 'Low' }
    };
    
    const config = priorityConfig[priority] || { color: 'bg-gray-100 text-gray-800', label: priority };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    applyFilters();
  }, [filterName, filterDepartment, startDate, endDate]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Report</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of all department tasks and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>{filteredData.length} tasks found</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filter by Name - Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Name
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNameDropdownOpen(!isNameDropdownOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white flex items-center justify-between"
              >
                <span className={filterName ? "text-gray-900" : "text-gray-500"}>
                  {filterName || "Select employee..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isNameDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isNameDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  <div className="py-1">
                    <button
                      onClick={() => handleNameSelect('')}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-gray-700"
                    >
                      All Employees
                    </button>
                    {uniqueNames.map((name) => (
                      <button
                        key={name}
                        onClick={() => handleNameSelect(name)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-gray-900 flex items-center gap-3"
                      >
                        {/* <img 
                          className="h-6 w-6 rounded-full object-cover" 
                          src={employees.find(emp => emp.name === name)?.image} 
                          alt={name} 
                        /> */}
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter by Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  FMS Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Task Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Target 🎯
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Total Achievement 👍
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  % Work Done
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  % Work Done On Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  All Pending Till Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((task) => {
                  const employee = employees.find(emp => emp.id === task.assignedTo);
                  const metrics = getTaskMetrics(task);
                  
                  if (!employee || !metrics) return null;

                  return (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {task.fmsName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{task.taskName}</div>
                          <div className="text-gray-500 text-xs mt-1">{task.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-8 w-8 rounded-full object-cover mr-3" 
                            src={employee.image} 
                            alt={employee.name} 
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {metrics.target}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className={`inline-flex items-center justify-center w-12 h-8 rounded-full text-sm font-semibold ${
                          metrics.totalAchievement >= metrics.target 
                            ? 'bg-green-100 text-green-800' 
                            : metrics.totalAchievement >= metrics.target * 0.8 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {metrics.totalAchievement}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className={`inline-flex items-center justify-center w-16 h-8 rounded-full text-sm font-semibold ${
                          metrics.workDonePercentage >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : metrics.workDonePercentage >= 70 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {metrics.workDonePercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className={`inline-flex items-center justify-center w-16 h-8 rounded-full text-sm font-semibold ${
                          metrics.workDoneOnTimePercentage >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : metrics.workDoneOnTimePercentage >= 70 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {metrics.workDoneOnTimePercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                          metrics.allPendingTillDate === 0 
                            ? 'bg-green-100 text-green-800' 
                            : metrics.allPendingTillDate <= 3 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {metrics.allPendingTillDate}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="w-12 h-12 text-gray-300 mb-2" />
                      <p className="text-lg font-medium text-gray-900">No tasks found</p>
                      <p className="text-gray-500">Try adjusting your filters to see more results</p>
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

export default Report;