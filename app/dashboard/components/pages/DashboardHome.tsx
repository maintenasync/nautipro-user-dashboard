// app/dashboard/components/pages/DashboardHome.tsx

export default function DashboardHome() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total Companies</h3>
                    <p className="text-3xl font-bold text-blue-600">1</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total Vessels</h3>
                    <p className="text-3xl font-bold text-green-600">1</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Active Licenses</h3>
                    <p className="text-3xl font-bold text-purple-600">1</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Expiring Soon</h3>
                    <p className="text-3xl font-bold text-orange-600">0</p>
                </div>
            </div>
        </div>
    );
}