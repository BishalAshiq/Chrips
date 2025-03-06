'use client';

import NavbarWrapper from '../public_components/NavbarWrapper';
import Footer from '../public_components/Footer';
import Image from 'next/image';

export default function ModeratorDashboard() {
  // Dummy data for tasks assigned to the moderator
  const moderationTasks = [
    { id: 1, postTitle: 'Climate Change is a Hoax?', status: 'Pending', date: '2025-01-28' },
    { id: 2, postTitle: 'Breaking News: New Virus Alert', status: 'Reviewed', date: '2025-01-27' },
    { id: 3, postTitle: 'Top 10 Investment Tips', status: 'Pending', date: '2025-01-26' },
    { id: 4, postTitle: 'AI Taking Over Jobs?', status: 'Reviewed', date: '2025-01-25' },
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
            <h1 className="text-3xl font-bold text-gray-800">Moderator Dashboard</h1>
            <button className="bg-green-brand text-white font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-green-800 transition">
              Assign Task
            </button>
          </div>

          {/* Dashboard Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Stat Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
              <Image
                src="https://placehold.co/50x50"
                alt="Pending Posts"
                width={50}
                height={50}
                className="mx-auto mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Pending Posts</h2>
              <p className="text-3xl font-semibold text-yellow-600">15</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
              <Image
                src="https://placehold.co/50x50"
                alt="Reviewed Posts"
                width={50}
                height={50}
                className="mx-auto mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Reviewed Posts</h2>
              <p className="text-3xl font-semibold text-green-800">102</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
              <Image
                src="https://placehold.co/50x50"
                alt="Reports Resolved"
                width={50}
                height={50}
                className="mx-auto mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Reports Resolved</h2>
              <p className="text-3xl font-semibold text-green-800">56</p>
            </div>
          </section>

          {/* Moderation Tasks */}
          <section className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Moderation Tasks</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Post Title</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {moderationTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{task.postTitle}</td>
                    <td
                      className={`border border-gray-300 px-4 py-2 text-sm font-semibold ${
                        task.status === 'Reviewed' ? 'text-green-800' : 'text-yellow-600'
                      }`}
                    >
                      {task.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{task.date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      <button className="text-blue-500 hover:underline">Review</button>
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
