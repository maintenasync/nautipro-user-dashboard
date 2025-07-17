// app/dashboard/components/pages/Settings.tsx

export default function Settings() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Profile Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Account Settings</h3>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm text-gray-700">Two-factor authentication</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm text-gray-700">Auto-save data</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm text-gray-700">Dark mode</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}