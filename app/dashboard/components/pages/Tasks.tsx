// app/dashboard/components/pages/Tasks.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAllVessels } from '@/app/hooks/useApiQuery';
import authService from "@/app/services/authService";

const BASE_URL = 'https://dev-api.nautiproconnect.com/api/v1/web';

// --- INTERFACES ---
interface Component {
    id: number;
    name: string;
    asset_code: string;
    serial_number: string;
    is_critical: boolean;
    critical_level: string;
}

interface Department {
    id: number;
    name: string;
    is_custom: boolean;
    vessel_id: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

interface Task {
    id: number;
    name: string;
    component_id: number;
    man_hours: number;
    priority: string;
    department_id: number;
    is_class_job: boolean;
    interval_frequency: string;
    last_done: string;
    trigger_type: string;
    component: Component;
    department: Department;
}

interface AssignedUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface TaskHistory {
    id: number;
    task_id: number;
    assign_to: string;
    assign_to_user: AssignedUser;
    is_done: boolean;
    image_path: string;
    image_path_url: string;
    done_at: string;
    description: string;
    progress: number;
    is_deleted: boolean;
    due_date: string;
    vessel_id: string;
    remark: string;
    created_at: string;
    updated_at: string;
    is_approved: boolean;
    approved_by: string;
    approved_at: string;
    task: Task;
    completion_status?: string;
    days_overdue?: number;
}

interface ApiResponse {
    code: number;
    status: string;
    data: {
        data: TaskHistory[];
        pagination: {
            current_page: number;
            limit: number;
            total_items: number;
            total_pages: number;
        };
    };
}

export default function Tasks() {
    // --- STATE ---
    const [taskHistories, setTaskHistories] = useState<TaskHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVesselId, setSelectedVesselId] = useState<string>('');

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        priority: '',
        department: '',
        status: '',
        approvalStatus: '',
        dateFrom: '',
        dateTo: '',
    });

    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskHistory | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isDownloadingImage, setIsDownloadingImage] = useState(false);

    const { data: vesselsData, isLoading: vesselsLoading } = useAllVessels();

    useEffect(() => {
        if (vesselsData && vesselsData.length > 0 && !selectedVesselId) {
            setSelectedVesselId(vesselsData[0].id);
        }
    }, [vesselsData]);

    const fetchTaskHistories = async (vesselId: string) => {
        if (!vesselId) return;
        setIsLoading(true);
        setError(null);
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch(
                `${BASE_URL}/task-histories-by-vessel/${vesselId}?limit=100&offset=0`,
                { method: "GET", headers: headers }
            );
            if (!response.ok) throw new Error('Failed to fetch task histories');
            const data: ApiResponse = await response.json();

            const processedTasks = data.data.data.map(task => {
                let daysOverdue = 0;
                let completionStatus = 'Pending';
                if (task.due_date) {
                    const dueDate = new Date(parseInt(task.due_date));
                    const today = new Date();
                    daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                }
                if (task.is_done) {
                    completionStatus = task.is_approved ? 'Approved' : 'Completed';
                } else {
                    if (daysOverdue > 0) completionStatus = 'Overdue';
                }
                return { ...task, completion_status: completionStatus, days_overdue: daysOverdue };
            });
            setTaskHistories(processedTasks);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedVesselId) fetchTaskHistories(selectedVesselId);
    }, [selectedVesselId]);

    // --- FILTER LOGIC ---
    const filteredTasks = taskHistories.filter(task => {
        const taskName = task?.task?.name || '';
        const componentName = task?.task?.component?.name || '';
        const description = task?.description || '';
        const priority = task?.task?.priority || '';
        const deptName = task?.task?.department?.name || '';

        const matchesSearch = taskName.toLowerCase().includes(filters.search.toLowerCase()) ||
            componentName.toLowerCase().includes(filters.search.toLowerCase()) ||
            description.toLowerCase().includes(filters.search.toLowerCase());

        const matchesPriority = !filters.priority || priority === filters.priority;
        const matchesDepartment = !filters.department || deptName === filters.department;
        const matchesStatus = !filters.status || task.completion_status === filters.status;

        let matchesApproval = true;
        if (filters.approvalStatus === 'Approved') {
            matchesApproval = task.is_approved === true;
        } else if (filters.approvalStatus === 'Unapproved') {
            matchesApproval = task.is_approved === false;
        }

        let matchesDate = true;
        if (filters.dateFrom || filters.dateTo) {
            const taskDate = parseInt(task.due_date);
            if (!isNaN(taskDate)) {
                if (filters.dateFrom) {
                    const fromDate = new Date(filters.dateFrom).getTime();
                    if (taskDate < fromDate) matchesDate = false;
                }
                if (filters.dateTo) {
                    const toDate = new Date(filters.dateTo);
                    toDate.setHours(23, 59, 59, 999);
                    if (taskDate > toDate.getTime()) matchesDate = false;
                }
            }
        }

        return matchesSearch && matchesPriority && matchesDepartment && matchesStatus && matchesApproval && matchesDate;
    });

    const priorities = ['All Priorities', ...Array.from(new Set(taskHistories.map(t => t?.task?.priority).filter(Boolean)))];
    const departments = ['All Departments', ...Array.from(new Set(taskHistories.map(t => t?.task?.department?.name).filter(Boolean)))];
    const statuses = ['All Status', 'Pending', 'Overdue', 'Completed', 'Approved'];

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const handleVesselChange = (vesselId: string) => {
        setSelectedVesselId(vesselId);
        setFilters({ search: '', priority: '', department: '', status: '', approvalStatus: '', dateFrom: '', dateTo: '' });
    };

    const clearFilters = () => setFilters({ search: '', priority: '', department: '', status: '', approvalStatus: '', dateFrom: '', dateTo: '' });

    // --- HELPERS ---
    const getPriorityColor = (priority: string = '') => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 [data-theme=\'dark\']_&:bg-yellow-900 [data-theme=\'dark\']_&:text-yellow-200';
            case 'Low': return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            default: return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const getStatusColor = (status: string = '') => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'Completed': return 'bg-blue-100 text-blue-800 [data-theme=\'dark\']_&:bg-blue-900 [data-theme=\'dark\']_&:text-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 [data-theme=\'dark\']_&:bg-yellow-900 [data-theme=\'dark\']_&:text-yellow-200';
            case 'Overdue': return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default: return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const formatDate = (timestamp: string | undefined | null) => {
        if (!timestamp) return '-';
        try {
            const date = new Date(parseInt(timestamp));
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) { return '-'; }
    };

    const formatDateTime = (timestamp: string | undefined | null) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(parseInt(timestamp));
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) { return 'N/A'; }
    };

    const handleViewDetail = (taskId: number) => {
        const task = taskHistories.find(t => t.id === taskId);
        if (task) {
            setSelectedTask(task);
            setShowDetailDialog(true);
        }
    };

    const handleCloseDetailDialog = () => {
        setShowDetailDialog(false);
        setTimeout(() => setSelectedTask(null), 100);
    };

    const handleDownloadImage = async (imageUrl: string, fileName: string) => {
        try {
            setIsDownloadingImage(true);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('Failed to download image.');
        } finally {
            setIsDownloadingImage(false);
        }
    };

    const handleApproveTask = async () => {
        if (!selectedTask) return;
        setIsApproving(true);
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch(`${BASE_URL}/approve-task-history/${selectedVesselId}/${selectedTask.id}`, { method: "GET", headers: headers });
            if (!response.ok) throw new Error('Failed to approve task');

            await fetchTaskHistories(selectedVesselId);

            // Refresh Modal State Instantly
            setSelectedTask(prev => prev ? ({ ...prev, is_approved: true, approved_at: Date.now().toString(), completion_status: 'Approved' }) : null);

            alert('Task approved successfully!');
        } catch (err) { alert(err instanceof Error ? err.message : 'Failed to approve task'); } finally { setIsApproving(false); }
    };

    const handleRejectTask = async () => {
        if (!selectedTask) return;
        setIsApproving(true);
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch(`${BASE_URL}/reject-task-history/${selectedVesselId}/${selectedTask.id}`, { method: "GET", headers: headers });
            if (!response.ok) throw new Error('Failed to reject task');

            await fetchTaskHistories(selectedVesselId);

            // Refresh Modal State Instantly
            setSelectedTask(prev => prev ? ({ ...prev, is_approved: false, approved_at: '', completion_status: 'Completed' }) : null);

            alert('Task approval rejected successfully!');
        } catch (err) { alert(err instanceof Error ? err.message : 'Failed to reject task'); } finally { setIsApproving(false); }
    };

    // Prepare Display Data
    const displayData = selectedTask ? {
        taskName: selectedTask?.task?.name || '-',
        componentName: selectedTask?.task?.component?.name || '-',
        assetCode: selectedTask?.task?.component?.asset_code || '',
        isCritical: selectedTask?.task?.component?.is_critical || false,
        deptName: selectedTask?.task?.department?.name || '-',
        priority: selectedTask?.task?.priority || 'Normal',
        userName: selectedTask?.assign_to_user?.name || 'Unassigned',
        userEmail: selectedTask?.assign_to_user?.email || '',
        userAvatar: selectedTask?.assign_to_user?.avatar || null,
        dueDate: selectedTask.due_date,
        isOverdue: selectedTask.completion_status === 'Overdue',
        daysOverdue: selectedTask.days_overdue,
        frequency: selectedTask?.task?.interval_frequency || '-',
        manHours: selectedTask?.task?.man_hours || 0,
        progress: selectedTask?.progress || 0, // Data progress 0-100
        isClassJob: selectedTask?.task?.is_class_job || false,
        description: selectedTask.description || '',
        remark: selectedTask.remark || '',
        createdAt: selectedTask.created_at,
        doneAt: selectedTask.done_at,
        approvedAt: selectedTask.approved_at,
        imagePath: selectedTask.image_path_url,
        status: selectedTask.completion_status || 'Pending',
        isApproved: selectedTask.is_approved,
        taskId: selectedTask.id
    } : null;

    if (vesselsLoading || (isLoading && !taskHistories.length)) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Task History Management</h1></div></div>
                <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800"><div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>))}</div></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6"><div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">Error: {error} <button onClick={() => fetchTaskHistories(selectedVesselId)} className="ml-4 underline">Retry</button></div></div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div><h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Task History Management</h1><p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Track maintenance tasks</p></div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-6 [data-theme='dark']_&:bg-gray-800">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1"><label className="block text-sm font-medium mb-2 [data-theme='dark']_&:text-gray-300">Select Vessel</label><select value={selectedVesselId} onChange={(e) => handleVesselChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white">{vesselsData?.map((vessel) => (<option key={vessel.id} value={vessel.id}>{vessel.name}</option>))}</select></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 [data-theme='dark']_&:text-gray-300">Search</label>
                        <input type="text" placeholder="Search..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="w-full px-3 py-2 border rounded-md [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 [data-theme='dark']_&:text-gray-300">From Date</label>
                        <input type="date" value={filters.dateFrom} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} className="w-full px-3 py-2 border rounded-md [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 [data-theme='dark']_&:text-gray-300">To Date</label>
                        <input type="date" value={filters.dateTo} onChange={(e) => handleFilterChange('dateTo', e.target.value)} className="w-full px-3 py-2 border rounded-md [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 [data-theme='dark']_&:text-gray-300">Approval</label>
                        <select value={filters.approvalStatus} onChange={(e) => handleFilterChange('approvalStatus', e.target.value)} className="w-full px-3 py-2 border rounded-md [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white">
                            <option value="">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Unapproved">Unapproved</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 [data-theme='dark']_&:text-gray-300">Dept</label>
                        <select value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)} className="w-full px-3 py-2 border rounded-md [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white">
                            <option value="">All</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end md:col-span-6 lg:col-span-6">
                        <button onClick={clearFilters} className="w-full px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 [data-theme='dark']_&:bg-gray-600 [data-theme='dark']_&:text-white">Clear Filters</button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 [data-theme='dark']_&:bg-gray-700">
                        <tr>
                            {['Task', 'Component', 'Dept', 'User', 'Due Date', 'Priority', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider [data-theme='dark']_&:text-gray-300">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 [data-theme='dark']_&:bg-gray-800 [data-theme='dark']_&:divide-gray-600">
                        {filteredTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700">
                                <td className="px-6 py-4"><div className="text-sm font-medium [data-theme='dark']_&:text-white">{task?.task?.name || '-'}</div></td>
                                <td className="px-6 py-4 text-sm [data-theme='dark']_&:text-gray-300">{task?.task?.component?.name || '-'}</td>
                                <td className="px-6 py-4 text-sm [data-theme='dark']_&:text-gray-300">{task?.task?.department?.name || '-'}</td>
                                <td className="px-6 py-4 text-sm [data-theme='dark']_&:text-gray-300">{task?.assign_to_user?.name || '-'}</td>
                                <td className="px-6 py-4 text-sm [data-theme='dark']_&:text-gray-300">{formatDate(task.due_date)}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task?.task?.priority)}`}>{task?.task?.priority || '-'}</span></td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.completion_status)}`}>{task.completion_status || '-'}</span></td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button onClick={() => handleViewDetail(task.id)} className="text-blue-600 hover:text-blue-900 [data-theme='dark']_&:text-blue-400 mr-4">View Details</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL DIALOG --- */}
            {showDetailDialog && selectedTask && displayData && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background Blur */}
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={handleCloseDetailDialog}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Konten Modal */}
                        <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full [data-theme='dark']_&:bg-gray-800">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 [data-theme='dark']_&:bg-gray-800">
                                <div className="sm:flex sm:items-start">
                                    <div className="w-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center [data-theme='dark']_&:bg-purple-900">
                                                    <svg className="h-7 w-7 text-purple-600 [data-theme='dark']_&:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg leading-6 font-medium text-gray-900 [data-theme='dark']_&:text-white" id="modal-title">Task Details</h3>
                                                    <p className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">Complete information about this maintenance task</p>
                                                </div>
                                            </div>
                                            <button onClick={handleCloseDetailDialog} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none [data-theme='dark']_&:bg-gray-700"><span className="sr-only">Close</span><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                        </div>

                                        <div className="mb-6">
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(displayData.status)}`}>{displayData.status}</span>
                                            {displayData.isApproved && (<span className="ml-2 inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 [data-theme='dark']_&:bg-green-900 [data-theme='dark']_&:text-green-200">✓ Approved</span>)}
                                        </div>

                                        {/* Task Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Task Name</label><p className="mt-1 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{displayData.taskName}</p></div>
                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Component</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{displayData.componentName}</p><p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">{displayData.assetCode}</p></div>
                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Department</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{displayData.deptName}</p></div>
                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Priority</label><span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(displayData.priority)}`}>{displayData.priority}</span></div>

                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Assigned To</label>
                                                <div className="mt-1 flex items-center">
                                                    {displayData.userAvatar ? <img className="h-8 w-8 rounded-full" src={displayData.userAvatar} alt="" /> : <div className="h-8 w-8 rounded-full bg-gray-200"></div>}
                                                    <div className="ml-2"><p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{displayData.userName}</p><p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">{displayData.userEmail}</p></div>
                                                </div>
                                            </div>

                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Due Date</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{formatDate(displayData.dueDate)}</p>{displayData.isOverdue && (<p className="text-xs text-red-600 [data-theme='dark']_&:text-red-400">{displayData.daysOverdue} days overdue</p>)}</div>
                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Interval Frequency</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{displayData.frequency}</p></div>
                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Man Hours</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{displayData.manHours} hours</p></div>

                                            {/* PROGRESS BAR SECTION (DITAMBAHKAN) */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Progress</label>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="flex-grow bg-gray-200 rounded-full h-2.5 [data-theme='dark']_&:bg-gray-700 overflow-hidden">
                                                        <div
                                                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                                                displayData.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                                                            }`}
                                                            style={{ width: `${displayData.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 min-w-[3ch]">
                                                        {displayData.progress}%
                                                    </span>
                                                </div>
                                            </div>

                                            {displayData.isClassJob && (<div><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 [data-theme='dark']_&:bg-indigo-900 [data-theme='dark']_&:text-indigo-200">Class Job</span></div>)}
                                            {displayData.isCritical && (<div><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 [data-theme='dark']_&:bg-orange-900 [data-theme='dark']_&:text-orange-200">Critical Component</span></div>)}
                                        </div>

                                        {displayData.description && (<div className="mb-6"><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Description</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white whitespace-pre-wrap">{displayData.description}</p></div>)}
                                        {displayData.remark && (<div className="mb-6"><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Remark</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white whitespace-pre-wrap">{displayData.remark}</p></div>)}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Created At</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{formatDateTime(displayData.createdAt)}</p></div>
                                            {displayData.doneAt && (<div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Completed At</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{formatDateTime(displayData.doneAt)}</p></div>)}
                                            {displayData.approvedAt && (<div><label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Approved At</label><p className="mt-1 text-sm text-gray-900 [data-theme='dark']_&:text-white">{formatDateTime(displayData.approvedAt)}</p></div>)}
                                        </div>

                                        {displayData.imagePath && (
                                            <div className="mb-6 border-t pt-4 border-gray-200 [data-theme='dark']_&:border-gray-700">
                                                <label className="block text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 mb-3">Attached Image</label>
                                                <div className="mb-4 bg-gray-100 p-2 rounded-lg [data-theme='dark']_&:bg-gray-900 flex justify-center">
                                                    <img src={displayData.imagePath} alt="Task attachment" className="w-auto h-auto max-h-[400px] object-contain rounded-lg" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownloadImage(displayData.imagePath!, `task-${displayData.taskId}-evidence.jpg`)}
                                                    disabled={isDownloadingImage}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white disabled:opacity-50"
                                                >
                                                    {isDownloadingImage ? 'Downloading...' : 'Download Image'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse [data-theme='dark']_&:bg-gray-700">
                                {selectedTask.is_done && !selectedTask.is_approved && (<button type="button" disabled={isApproving} onClick={handleApproveTask} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">{isApproving ? 'Approving...' : 'Approve Task'}</button>)}
                                {selectedTask.is_approved && (<button type="button" disabled={isApproving} onClick={handleRejectTask} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">{isApproving ? 'Processing...' : 'Unapprove Task'}</button>)}
                                <button type="button" onClick={handleCloseDetailDialog} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm [data-theme='dark']_&:bg-gray-600 [data-theme='dark']_&:text-white">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}