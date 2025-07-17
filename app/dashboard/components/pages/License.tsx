// app/dashboard/components/pages/License.tsx

interface License {
    id: number;
    name: string;
    vessel: string;
    issueDate: string;
    expiryDate: string;
    status: string;
}

export default function License() {
    const licenses: License[] = [
        {
            id: 1,
            name: 'Maintena Sync License',
            vessel: 'Ocean Explorer',
            issueDate: '2024-01-15',
            expiryDate: '2025-01-15',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Maintena Sync License',
            vessel: 'Sea Pioneer',
            issueDate: '2024-02-20',
            expiryDate: '2025-02-20',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Maintena Sync License',
            vessel: 'Wave Rider',
            issueDate: '2024-03-10',
            expiryDate: '2024-12-10',
            status: 'Expiring Soon'
        },
    ];

    const getDaysRemaining = (expiryDate: string): number => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const timeDiff = expiry.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };

    const getProgressPercentage = (issueDate: string, expiryDate: string): number => {
        const issue = new Date(issueDate);
        const expiry = new Date(expiryDate);
        const today = new Date();

        const totalDuration = expiry.getTime() - issue.getTime();
        const elapsed = today.getTime() - issue.getTime();
        const percentage = (elapsed / totalDuration) * 100;

        return Math.min(Math.max(percentage, 0), 100);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">License Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {licenses.map((license) => {
                    const daysRemaining = getDaysRemaining(license.expiryDate);
                    const progress = getProgressPercentage(license.issueDate, license.expiryDate);

                    return (
                        <div key={license.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">{license.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    license.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                  {license.status}
                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">🚢 Vessel: <span className="font-medium">{license.vessel}</span></p>
                                <p className="text-sm text-gray-600 mb-1">📅 Issued: {license.issueDate}</p>
                                <p className="text-sm text-gray-600 mb-3">⏰ Expires: {license.expiryDate}</p>

                                <div className="mb-2">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Duration Progress</span>
                                        <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">View</button>
                                <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200">Renew</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}