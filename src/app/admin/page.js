'use client';

import NavbarWrapper from '../public_components/NavbarWrapper';
import Footer from '../public_components/Footer';
import Image from 'next/image';

export default function AdminDashboard() {
  // Dummy data for recent activity
  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Reviewed a post', date: '2025-01-28', status: 'Completed' },
    { id: 2, user: 'Jane Smith', action: 'Reported a misinformation', date: '2025-01-27', status: 'Pending' },
    { id: 3, user: 'Mark Johnson', action: 'Banned a user', date: '2025-01-26', status: 'Completed' },
    { id: 4, user: 'Emma Brown', action: 'Updated system settings', date: '2025-01-25', status: 'Completed' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <NavbarWrapper />
      </div>

      {/* Main Content */}
      <main className="flex-grow px-6 py-8 lg:px-16 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button className="bg-green-brand text-white font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-green-800 transition">
              Add New User
            </button>
          </div>

          {/* Dashboard Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Stat Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
              <Image
                src="https://placehold.co/50x50"
                alt="Users"
                width={50}
                height={50}
                className="mx-auto mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Users</h2>
              <p className="text-3xl font-semibold text-green-800">1,234</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
              <Image
                src="https://placehold.co/50x50"
                alt="Posts Reviewed"
                width={50}
                height={50}
                className="mx-auto mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Posts Reviewed</h2>
              <p className="text-3xl font-semibold text-green-800">678</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
              <Image
                src="https://placehold.co/50x50"
                alt="Reports"
                width={50}
                height={50}
                className="mx-auto mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Reports</h2>
              <p className="text-3xl font-semibold text-green-800">56</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
              <Image
                src="https://placehold.co/50x50"
                alt="System Health"
                width={50}
                height={50}
                className="mx-auto mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">System Health</h2>
              <p className="text-3xl font-semibold text-green-800">98%</p>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{activity.user}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{activity.action}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{activity.date}</td>
                    <td
                      className={`border border-gray-300 px-4 py-2 text-sm font-semibold ${
                        activity.status === 'Completed' ? 'text-green-800' : 'text-yellow-600'
                      }`}
                    >
                      {activity.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
