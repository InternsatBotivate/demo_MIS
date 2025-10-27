import React, { useState, useMemo } from 'react';
import { Search, Clock } from 'lucide-react';

// Employee data
const employees = [
  {
    id: 'emp-001',
    name: 'Pratap Kumar',
    email: 'pratap@company.com',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Engineering',
    designation: 'CRM'
  },
  {
    id: 'emp-002',
    name: 'Chetan Sharma',
    email: 'chetan@company.com',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Design',
    designation: 'PURCHASE'
  },
  {
    id: 'emp-003',
    name: 'Digendra Patel',
    email: 'digendra@company.com',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Marketing',
    designation: 'HR'
  },
  {
    id: 'emp-004',
    name: 'Durgesh Gupta',
    email: 'durgesh@company.com',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Sales',
    designation: 'EA'
  },
  {
    id: 'emp-005',
    name: 'Vikash Singh',
    email: 'vikash@company.com',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Engineering',
    designation: 'ACCOUNTANT'
  },
  {
    id: 'emp-006',
    name: 'Anubhav Kumar',
    email: 'anubhav@company.com',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'IT',
    designation: 'CRM'
  },
  {
    id: 'emp-007',
    name: 'Muzammil Ahmed',
    email: 'muzammil@company.com',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Operations',
    designation: 'PURCHASE'
  },
  {
    id: 'emp-008',
    name: 'Pooja Verma',
    email: 'pooja@company.com',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'HR',
    designation: 'HR'
  }
];

// Pending task data with employee references
const tasks = [
  {
    id: 'task-001',
    fmsName: 'Project Alpha',
    taskName: 'Frontend Development',
    assignedTo: 'emp-001',
    pendingTaskCount: 5,
    dueDate: '2025-10-15'
  },
  {
    id: 'task-002',
    fmsName: 'Project Beta',
    taskName: 'UI Design',
    assignedTo: 'emp-002',
    pendingTaskCount: 3,
    dueDate: '2025-10-14'
  },
  {
    id: 'task-003',
    fmsName: 'Project Gamma',
    taskName: 'Marketing Campaign',
    assignedTo: 'emp-003',
    pendingTaskCount: 8,
    dueDate: '2025-10-16'
  },
  {
    id: 'task-004',
    fmsName: 'Project Delta',
    taskName: 'Sales Presentation',
    assignedTo: 'emp-004',
    pendingTaskCount: 2,
    dueDate: '2025-10-13'
  },
  {
    id: 'task-005',
    fmsName: 'Project Epsilon',
    taskName: 'Backend Development',
    assignedTo: 'emp-005',
    pendingTaskCount: 12,
    dueDate: '2025-10-18'
  },
  {
    id: 'task-006',
    fmsName: 'Project Zeta',
    taskName: 'Quality Assurance',
    assignedTo: 'emp-006',
    pendingTaskCount: 7,
    dueDate: '2025-10-17'
  },
  {
    id: 'task-007',
    fmsName: 'Project Eta',
    taskName: 'Documentation',
    assignedTo: 'emp-007',
    pendingTaskCount: 4,
    dueDate: '2025-10-14'
  },
  {
    id: 'task-008',
    fmsName: 'Project Theta',
    taskName: 'HR Process',
    assignedTo: 'emp-008',
    pendingTaskCount: 6,
    dueDate: '2025-10-15'
  },
  {
    id: 'task-009',
    fmsName: 'Checklist & Delegation',
    taskName: 'Checklist Task-Afroj Begam',
    assignedTo: 'emp-001',
    pendingTaskCount: 15,
    dueDate: '2025-10-20'
  },
  {
    id: 'task-010',
    fmsName: 'OTD V.2-HTML',
    taskName: 'Audit',
    assignedTo: 'emp-002',
    pendingTaskCount: 9,
    dueDate: '2025-10-19'
  },
  {
    id: 'task-011',
    fmsName: 'Checklist & Delegation',
    taskName: 'Checklist Task-Amlan Dikshit',
    assignedTo: 'emp-003',
    pendingTaskCount: 11,
    dueDate: '2025-10-21'
  },
  {
    id: 'task-012',
    fmsName: 'OTD V.2-HTML',
    taskName: 'Billing',
    assignedTo: 'emp-004',
    pendingTaskCount: 10,
    dueDate: '2025-10-16'
  }
];

const AdminPendingTasks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [personFilter, setPersonFilter] = useState('all');
  const [fmsFilter, setFmsFilter] = useState('all');

  // Get employee by ID
  const getEmployee = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  // Enrich tasks with employee data
  const enrichedTasks = useMemo(() => {
    return tasks.map(task => {
      const employee = getEmployee(task.assignedTo);
      return {
        ...task,
        personName: employee?.name || 'Unknown',
        personImage: employee?.image || '',
        department: employee?.department || 'N/A'
      };
    });
  }, []);

  // Extract unique persons and FMS names
  const persons = useMemo(() => {
    const uniquePersons = [...new Set(enrichedTasks.map(task => task.personName))];
    return uniquePersons.sort();
  }, [enrichedTasks]);

  const fmsNames = useMemo(() => {
    const uniqueFMS = [...new Set(enrichedTasks.map(task => task.fmsName))];
    return uniqueFMS.sort();
  }, [enrichedTasks]);

  // Filter tasks based on all criteria
  const filteredTasks = useMemo(() => {
    return enrichedTasks.filter(task => {
      const matchesSearch = 
        task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.fmsName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPerson = personFilter === 'all' || task.personName === personFilter;
      const matchesFMS = fmsFilter === 'all' || task.fmsName === fmsFilter;
      
      return matchesSearch && matchesPerson && matchesFMS;
    });
  }, [enrichedTasks, searchQuery, personFilter, fmsFilter]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            
            {/* Person Filter */}
            <div className="w-full md:w-56">
              <select
                value={personFilter}
                onChange={(e) => setPersonFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Persons</option>
                {persons.map(person => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
            </div>

            {/* FMS Name Filter */}
            <div className="w-full md:w-56">
              <select
                value={fmsFilter}
                onChange={(e) => setFmsFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All FMS Names</option>
                {fmsNames.map(fms => (
                  <option key={fms} value={fms}>{fms}</option>
                ))}
              </select>
            </div>
          </div>
        </div>


{/* Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {/* Total Persons Card */}
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Persons</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {personFilter === 'all' 
            ? persons.length 
            : 1
          }
        </p>
      </div>
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>
  </div>

  {/* Total FMS Names Card */}
<div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Total FMS Names</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {[...new Set(filteredTasks.map(task => task.fmsName))].length}
      </p>
    </div>
    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  </div>
</div>

  {/* Total Task Names Card */}
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Task Names</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {[...new Set(filteredTasks.map(task => task.taskName))].length}
        </p>
      </div>
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    </div>
  </div>

  {/* Total Pending Tasks Card */}
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Pending Tasks</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {filteredTasks.reduce((total, task) => total + task.pendingTaskCount, 0)}
        </p>
      </div>
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <Clock className="w-5 h-5 text-orange-600" />
      </div>
    </div>
  </div>
</div>
        {/* Tasks List */}
        <div className="bg-white rounded shadow-sm">
          {/* Section Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-700">Pending Tasks</h2>
          </div>

          {filteredTasks.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Link with Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FMS Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending Tasks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map(task => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {task.assignedTo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={task.personImage} 
                              alt={task.personName}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                            <span className="text-sm text-gray-900">{task.personName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.fmsName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.taskName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {task.pendingTaskCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredTasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center flex-1">
                        <img 
                          src={task.personImage} 
                          alt={task.personName}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">
                            ID: {task.assignedTo}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">Link with Name</div>
                          <div className="text-sm font-medium text-gray-900">{task.personName}</div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500 mb-1">Pending</div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {task.pendingTaskCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1">FMS Name</div>
                      <div className="text-sm text-gray-900">{task.fmsName}</div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1">Task Name</div>
                      <div className="text-sm text-gray-900">{task.taskName}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Due Date</div>
                      <div className="text-sm text-gray-600">{formatDate(task.dueDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                No Pending Tasks Found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPendingTasks;