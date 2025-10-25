// ============ DASHBOARD PAGE ============
import React, { useState, useEffect } from 'react';
import { Download, Users, CheckSquare, Clock, Target, ChevronDown, X } from 'lucide-react';
import { 
  employees, 
  getTopScorers, 
  getLowestScorers, 
  getEmployeesByPendingTasks,
  departments,
  getWeeklyCommitmentComparison
} from '../../data/mockData';
import EmployeesTable from '../../components/tables/EmployeesTable';
import HalfCircleChart from '../../components/charts/HalfCircleChart';
import HorizontalBarChart from '../../components/charts/HorizontalBarChart';
import VerticalBarChart from '../../components/charts/VerticalBarChart';
import { generateDashboardPDF } from '../../utils/pdfGenerator';

const AdminDashboard = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [employeeCommitments, setEmployeeCommitments] = useState({});
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterHR, setFilterHR] = useState('');
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('employeeCommitments');
    if (saved) {
      setEmployeeCommitments(JSON.parse(saved));
    }
  }, []);

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesName = emp.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesDepartment = filterDepartment === '' || emp.department === filterDepartment;
    const matchesHR = filterHR === '' || emp.hrName === filterHR;
    return matchesName && matchesDepartment && matchesHR;
  });

  // Get unique departments and HR names
  const uniqueDepartments = [...new Set(employees.map(emp => emp.department))];
  const uniqueHRNames = [...new Set(employees.map(emp => emp.hrName).filter(Boolean))];

  const topScorers = getTopScorers(5);
  const lowestScorers = getLowestScorers(5);
  const employeesByPending = getEmployeesByPendingTasks().slice(0, 5);
  const commitmentComparison = getWeeklyCommitmentComparison();
  
  const topScorersData = topScorers.map(emp => emp.score);
  const topScorersLabels = topScorers.map(emp => emp.name);
  const lowestScorersData = lowestScorers.map(emp => emp.score);
  const lowestScorersLabels = lowestScorers.map(emp => emp.name);
  const pendingTasksData = employeesByPending.map(emp => emp.pendingTasks);
  const pendingTasksLabels = employeesByPending.map(emp => emp.name);
  const departmentScoresData = departments.map(dept => dept.averageScore);
  const departmentScoresLabels = departments.map(dept => dept.name);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
    setSelectAll(!selectAll);
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleCommitmentChange = (employeeId, field, value) => {
    setEmployeeCommitments(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleRowClick = (employee) => {
    // Add demo task data for the selected user
    const employeeWithDemoTasks = {
      ...employee,
      tasks: [
        {
          fmsName: "Project Alpha",
          taskName: "Design System Implementation",
          target: 100,
          actualAchievement: 85,
          workNotDone: 15,
          workNotDoneOnTime: 8,
          allPendingTillDate: 3
        },
        {
          fmsName: "Project Beta",
          taskName: "API Integration",
          target: 100,
          actualAchievement: 92,
          workNotDone: 8,
          workNotDoneOnTime: 5,
          allPendingTillDate: 1
        },
        {
          fmsName: "Project Gamma",
          taskName: "User Testing",
          target: 100,
          actualAchievement: 78,
          workNotDone: 22,
          workNotDoneOnTime: 12,
          allPendingTillDate: 5
        },
        {
          fmsName: "Project Delta",
          taskName: "Documentation",
          target: 100,
          actualAchievement: 95,
          workNotDone: 5,
          workNotDoneOnTime: 2,
          allPendingTillDate: 0
        },
        {
          fmsName: "Project Epsilon",
          taskName: "Performance Optimization",
          target: 100,
          actualAchievement: 88,
          workNotDone: 12,
          workNotDoneOnTime: 7,
          allPendingTillDate: 2
        }
      ]
    };
    setSelectedUserDetails(employeeWithDemoTasks);
  };

  const handleSubmit = () => {
    const selectedEmployeeData = selectedEmployees.map(empId => {
      const emp = employees.find(e => e.id === empId);
      const nextWeekStart = getNextWeekDateRange().start;
      const nextWeekEnd = getNextWeekDateRange().end;
      
      return {
        employeeId: empId,
        name: emp.name,
        department: emp.department,
        target: emp.target,
        commitment: employeeCommitments[empId]?.commitment || 0,
        nextWeekPlannedWorkNotDone: employeeCommitments[empId]?.nextWeekPlannedWorkNotDone || 0,
        nextWeekPlannedWorkNotDoneOnTime: employeeCommitments[empId]?.nextWeekPlannedWorkNotDoneOnTime || 0,
        dateStart: nextWeekStart,
        dateEnd: nextWeekEnd,
        submittedAt: new Date().toISOString()
      };
    });

    const existingHistory = JSON.parse(localStorage.getItem('commitmentHistory') || '[]');
    const updatedHistory = [...existingHistory, ...selectedEmployeeData];
    
    localStorage.setItem('commitmentHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('employeeCommitments', JSON.stringify(employeeCommitments));

    alert('Commitments submitted successfully!');
    setSelectedEmployees([]);
    setSelectAll(false);
  };

  const getNextWeekDateRange = () => {
    const today = new Date();
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(nextWeekStart.getDate() + (8 - nextWeekStart.getDay()));
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
    
    return {
      start: nextWeekStart.toISOString().split('T')[0],
      end: nextWeekEnd.toISOString().split('T')[0]
    };
  };

  return (
    <div className="space-y-4 lg:space-y-6 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button 
          onClick={generateDashboardPDF}
          className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs md:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </button>
      </div>

      {/* List of People Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 md:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">List of People</h2>
            <button 
              onClick={handleSubmit}
              disabled={selectedEmployees.length === 0}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
            >
              Submit ({selectedEmployees.length})
            </button>
          </div>
          
          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Filter by Name
              </label>
              <input
                type="text"
                placeholder="Search employee name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Filter by HR Name
              </label>
              <select
                value={filterHR}
                onChange={(e) => setFilterHR(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All HR Names</option>
                {uniqueHRNames.map(hr => (
                  <option key={hr} value={hr}>{hr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Target</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actual Work</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Weekly Done %</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Weekly On Time %</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Work</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Week Pending</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">All Pending</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Planned Not Done %</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Not Done On Time %</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Commitment</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Next Week Not Done</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Next Week Not Done On Time</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Next Week Commitment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  onClick={() => handleRowClick(employee)}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedEmployees.includes(employee.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="w-12 px-3 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelect(employee.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.id}</td>
              
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-8 w-8 rounded-full object-cover" 
                        src={employee.image} 
                        alt={employee.name} 
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">{employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.target}%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.actualWorkDone}%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.weeklyWorkDone}%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.weeklyWorkDoneOnTime}%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.totalWorkDone}%</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      employee.weekPending > 3 ? 'bg-red-100 text-red-800' : 
                      employee.weekPending > 1 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {employee.weekPending}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.allPendingTillDate}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.plannedWorkNotDone}%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.plannedWorkNotDoneOnTime}%</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.commitment}%</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {selectedEmployees.includes(employee.id) ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={employeeCommitments[employee.id]?.nextWeekPlannedWorkNotDone || 0}
                        onChange={(e) => handleCommitmentChange(employee.id, 'nextWeekPlannedWorkNotDone', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm text-gray-500">0</span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {selectedEmployees.includes(employee.id) ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={employeeCommitments[employee.id]?.nextWeekPlannedWorkNotDoneOnTime || 0}
                        onChange={(e) => handleCommitmentChange(employee.id, 'nextWeekPlannedWorkNotDoneOnTime', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm text-gray-500">0</span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {selectedEmployees.includes(employee.id) ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={employeeCommitments[employee.id]?.commitment || 0}
                        onChange={(e) => handleCommitmentChange(employee.id, 'commitment', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm text-gray-500">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Fixed */}
        <div className="md:hidden">
          <div className="px-3 py-3 bg-gray-50 flex items-center gap-3 border-b border-gray-200 sticky top-0 z-10">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Select All ({filteredEmployees.length})</span>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className={`border-b border-gray-200 ${selectedEmployees.includes(employee.id) ? 'bg-blue-50' : ''}`}>
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelect(employee.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleRowClick(employee)}
                      >
                        <img 
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0" 
                          src={employee.image} 
                          alt={employee.name} 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{employee.name}</div>
                          <div className="text-xs text-gray-500 truncate">{employee.department}</div>
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Target:</span>
                          <span className="font-semibold">{employee.target}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Actual:</span>
                          <span className="font-semibold">{employee.actualWorkDone}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pending:</span>
                          <span className={`font-semibold ${
                            employee.weekPending > 3 ? 'text-red-600' : 
                            employee.weekPending > 1 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {employee.weekPending}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Commitment:</span>
                          <span className="font-semibold">{employee.commitment}%</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedEmployee(expandedEmployee === employee.id ? null : employee.id)}
                      className="p-2 hover:bg-gray-200 rounded flex-shrink-0"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedEmployee === employee.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedEmployee === employee.id && (
                    <div className="mt-3 space-y-3 border-t border-gray-200 pt-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500">Weekly Done</p>
                          <p className="font-semibold text-gray-900">{employee.weeklyWorkDone}%</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500">On Time</p>
                          <p className="font-semibold text-gray-900">{employee.weeklyWorkDoneOnTime}%</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500">Total Work</p>
                          <p className="font-semibold text-gray-900">{employee.totalWorkDone}%</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500">All Pending</p>
                          <p className="font-semibold text-gray-900">{employee.allPendingTillDate}</p>
                        </div>
                      </div>

                      {selectedEmployees.includes(employee.id) && (
                        <div className="bg-blue-50 p-3 rounded border border-blue-200 space-y-3">
                          <p className="text-xs font-semibold text-blue-900">Next Week Inputs</p>
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs text-gray-600 block mb-1">Work Not Done %</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={employeeCommitments[employee.id]?.nextWeekPlannedWorkNotDone || 0}
                                onChange={(e) => handleCommitmentChange(employee.id, 'nextWeekPlannedWorkNotDone', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600 block mb-1">Work Not Done On Time %</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={employeeCommitments[employee.id]?.nextWeekPlannedWorkNotDoneOnTime || 0}
                                onChange={(e) => handleCommitmentChange(employee.id, 'nextWeekPlannedWorkNotDoneOnTime', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600 block mb-1">Commitment %</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={employeeCommitments[employee.id]?.commitment || 0}
                                onChange={(e) => handleCommitmentChange(employee.id, 'commitment', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Details Modal - Fixed for Mobile */}
      {selectedUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0" 
                  src={selectedUserDetails.image} 
                  alt={selectedUserDetails.name} 
                />
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900 truncate">{selectedUserDetails.name}</h2>
                  <p className="text-xs text-gray-500 truncate">{selectedUserDetails.department}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Tasks Table */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Task Details</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <div className="min-w-[600px]">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">FMS Name</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Task Name</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Target</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Actual</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Not Done</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Late</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Pending</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedUserDetails.tasks && selectedUserDetails.tasks.length > 0 ? (
                            selectedUserDetails.tasks.map((task, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap">{task.fmsName}</td>
                                <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap">{task.taskName}</td>
                                <td className="px-3 py-2 text-xs text-gray-900 font-medium whitespace-nowrap">{task.target}</td>
                                <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    task.actualAchievement < task.target ? 'bg-red-100 text-red-800' :
                                    task.actualAchievement === task.target ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {task.actualAchievement}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap">{task.workNotDone}%</td>
                                <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap">{task.workNotDoneOnTime}%</td>
                                <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap">{task.allPendingTillDate}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="px-3 py-2 text-center text-xs text-gray-500">No tasks available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 flex justify-end gap-2 flex-shrink-0">
              <button
                onClick={() => setSelectedUserDetails(null)}
                className="px-3 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
  {/* Charts Grid - Fixed for Mobile */}
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
  {/* Top 5 Scorers */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
    <h2 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">Top 5 Scorers</h2>
    <div className="h-40 md:h-48 lg:h-56 overflow-hidden">
      <HalfCircleChart 
        data={topScorersData} 
        labels={topScorersLabels}
        colors={[
          '#8DD9D5',
          '#6BBBEA',
          '#BEA1E8',
          '#FFB77D',
          '#FF99A8'
        ]}
      />
    </div>
  </div>
  
  {/* Pending Tasks */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
    <h2 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">Pending Tasks by User</h2>
    <div className="h-40 md:h-48 lg:h-56 overflow-hidden">
      <HorizontalBarChart 
        data={pendingTasksData} 
        labels={pendingTasksLabels}
        colors={['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2']}
        maxValue={Math.max(...pendingTasksData) + 1}
      />
    </div>
  </div>
  
  {/* Lowest Scores */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
    <h2 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">Lowest Scores</h2>
    <div className="h-40 md:h-48 lg:h-56 overflow-hidden">
      <VerticalBarChart 
        data={lowestScorersData} 
        labels={lowestScorersLabels}
        colors={['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7']}
        maxValue={100}
      />
    </div>
  </div>
</div>

{/* Department Scores */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
  <h2 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">Department Scores</h2>
  <div className="h-48 md:h-56 lg:h-64 overflow-hidden">
    <VerticalBarChart 
      data={departmentScoresData} 
      labels={departmentScoresLabels}
      colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']}
      maxValue={100}
    />
  </div>
</div>
    </div>
  );
};

export default AdminDashboard;