"use client";

import React, { useState } from 'react';

// Define the Registration interface
interface Registration {
  id: number;
  name: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  city: string;
  idNumber: string;
  address: string;
  phoneNumber: string;
}

// Mock data for user registrations
const initialRegistrations: Registration[] = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    email: 'sarah.j@example.com', 
    date: '2023-06-15', 
    status: 'pending',
    city: 'Los Angeles',
    idNumber: 'ID12345678',
    address: '123 Main St, Los Angeles, CA 90001',
    phoneNumber: '+1 (555) 123-4567'
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    email: 'm.chen@example.com', 
    date: '2023-06-14', 
    status: 'pending',
    city: 'San Francisco',
    idNumber: 'ID87654321',
    address: '456 Oak Ave, San Francisco, CA 94101',
    phoneNumber: '+1 (555) 987-6543'
  },
  { 
    id: 3, 
    name: 'Emma Rodriguez', 
    email: 'emma@example.com', 
    date: '2023-06-13', 
    status: 'approved',
    city: 'New York',
    idNumber: 'ID11223344',
    address: '789 Elm St, New York, NY 10001',
    phoneNumber: '+1 (555) 456-7890'
  },
  { 
    id: 4, 
    name: 'David Kim', 
    email: 'davidk@example.com', 
    date: '2023-06-12', 
    status: 'pending',
    city: 'Chicago',
    idNumber: 'ID55667788',
    address: '101 Pine Rd, Chicago, IL 60601',
    phoneNumber: '+1 (555) 321-6547'
  },
  { 
    id: 5, 
    name: 'Sophia Martinez', 
    email: 'sophia@example.com', 
    date: '2023-06-11', 
    status: 'rejected',
    city: 'Miami',
    idNumber: 'ID99887766',
    address: '202 Palm Blvd, Miami, FL 33101',
    phoneNumber: '+1 (555) 789-0123'
  },
];

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [filter, setFilter] = useState<string>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  // Filter registrations based on status
  const filteredRegistrations = filter === 'all' 
    ? registrations 
    : registrations.filter(reg => reg.status === filter);

  // Handle status change
  const handleStatusChange = (id: number, status: 'pending' | 'approved' | 'rejected') => {
    setRegistrations(
      registrations.map(reg => 
        reg.id === id ? { ...reg, status } : reg
      )
    );
    
    if (selectedRegistration && selectedRegistration.id === id) {
      setSelectedRegistration({ ...selectedRegistration, status });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">User Registrations</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and review user registration applications</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Applications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review and approve new user registrations</p>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">Filter:</span>
            <select
              value={filter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{registration.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{registration.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      registration.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : registration.status === 'rejected' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => setSelectedRegistration(registration)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Registration Details
                  </h3>
                  <div className="mt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.name}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">ID Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.idNumber}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.phoneNumber}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.address}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">City</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.city}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Application Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRegistration.date}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Documents</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            View ID Document
                          </button>
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedRegistration.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : selectedRegistration.status === 'rejected' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedRegistration.status.charAt(0).toUpperCase() + selectedRegistration.status.slice(1)}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                {selectedRegistration.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedRegistration.id, 'approved')}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedRegistration.id, 'rejected')}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedRegistration(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 