// app/dashboard/components/pages/Components.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAllVessels } from '@/app/hooks/useApiQuery';
import authService from "@/app/services/authService";

const BASE_URL = 'https://dev-api.nautiproconnect.com/api/v1/web';

interface Component {
    id: number;
    name: string;
    is_mounted: boolean;
    running_hours: number;
    manufacturer_id: number;
    serial_number: string;
    vendor_id: number;
    location_id: number;
    asset_code: string;
    last_condition: string;
    last_condition_date: string;
    is_critical: boolean;
    critical_desc: string;
    critical_level: string;
    parent_component_id: number;
    department_id: number;
    component_type_id: number;
    vessel_id: string;
    original_manufacturer_id: number;
    owning_type_id: number;
    class_code: string;
    is_major_component: boolean;
    is_circulating_component: boolean;
    is_grouped_component: boolean;
    is_component_lending: boolean;
    main_spec: string;
    criticality_desc: string;
    installation_desc: string;
    remarks: string;
    is_deleted: boolean;
    image_path: string;
    created_at: string;
    updated_at: string;
    vendor?: any;
    location?: any;
    department?: any;
    component_type?: any;
    vessel?: any;
    original_manufacturer?: any;
    owning_type?: any;
}

interface ApiResponse {
    code: number;
    status: string;
    data: Component[];
}

interface TreeNode extends Component {
    children: TreeNode[];
}

export default function Components() {
    const [components, setComponents] = useState<Component[]>([]);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVesselId, setSelectedVesselId] = useState<string>('');
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCritical, setFilterCritical] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'installed' | 'inventory'>('installed');

    // Fetch vessels using the hook
    const { data: vesselsData, isLoading: vesselsLoading } = useAllVessels();

    // Set default vessel when vessels are loaded
    useEffect(() => {
        if (vesselsData && vesselsData.length > 0 && !selectedVesselId) {
            setSelectedVesselId(vesselsData[0].id);
        }
    }, [vesselsData]);

    // Calculate running hours from last condition date to now
    const calculateRunningHours = (lastConditionDate: string): number => {
        const lastDate = new Date(parseInt(lastConditionDate));
        const now = new Date();
        const diffMs = now.getTime() - lastDate.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        return diffHours > 0 ? diffHours : 0;
    };

    // Fetch components from API
    const fetchComponents = async (vesselId: string) => {
        if (!vesselId) return;

        setIsLoading(true);
        setError(null);
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch(
                `${BASE_URL}/components-by-vessel/${vesselId}`,
                {
                    method: "GET",
                    headers: headers
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch components');
            }

            const data: ApiResponse = await response.json();

            // Process components to calculate running hours
            const processedComponents = data.data.map(component => ({
                ...component,
                running_hours: calculateRunningHours(component.last_condition_date)
            }));

            setComponents(processedComponents);
            buildTreeStructure(processedComponents);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Build tree structure from flat array (only mounted components)
    const buildTreeStructure = (data: Component[]) => {
        // Filter only mounted components for tree view
        const mountedComponents = data.filter(c => c.is_mounted);

        const componentMap = new Map<number, TreeNode>();
        const rootNodes: TreeNode[] = [];

        // First, create all nodes
        mountedComponents.forEach(component => {
            componentMap.set(component.id, { ...component, children: [] });
        });

        // Then, build the tree structure
        mountedComponents.forEach(component => {
            const node = componentMap.get(component.id)!;

            if (component.parent_component_id === 0) {
                // Root level component
                rootNodes.push(node);
            } else {
                // Child component
                const parent = componentMap.get(component.parent_component_id);
                if (parent) {
                    parent.children.push(node);
                } else {
                    // If parent not found, treat as root
                    rootNodes.push(node);
                }
            }
        });

        setTreeData(rootNodes);
    };

    // Fetch components when vessel is selected
    useEffect(() => {
        if (selectedVesselId) {
            fetchComponents(selectedVesselId);
        }
    }, [selectedVesselId]);

    // Toggle node expansion
    const toggleNode = (nodeId: number) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };

    // Expand all nodes
    const expandAll = () => {
        const allIds = new Set<number>();
        const collectIds = (nodes: TreeNode[]) => {
            nodes.forEach(node => {
                if (node.children.length > 0) {
                    allIds.add(node.id);
                    collectIds(node.children);
                }
            });
        };
        collectIds(treeData);
        setExpandedNodes(allIds);
    };

    // Collapse all nodes
    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

    // Handle vessel change
    const handleVesselChange = (vesselId: string) => {
        setSelectedVesselId(vesselId);
        setExpandedNodes(new Set());
        setSelectedComponent(null);
        setSearchTerm('');
        setFilterCritical('all');
        setActiveTab('installed');
    };

    // Get status color
    const getStatusColor = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'normal':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'critical':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    // Format date
    const formatDate = (timestamp: string) => {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Filter tree data
    const filterTree = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.filter(node => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.asset_code.toLowerCase().includes(searchTerm.toLowerCase());

            // Critical filter
            const matchesCritical = filterCritical === 'all' ||
                (filterCritical === 'critical' && node.is_critical) ||
                (filterCritical === 'not_critical' && !node.is_critical);

            // Check if any children match
            const filteredChildren = filterTree(node.children);
            const hasMatchingChildren = filteredChildren.length > 0;

            if (matchesSearch && matchesCritical) {
                return true;
            }

            return hasMatchingChildren;
        }).map(node => ({
            ...node,
            children: filterTree(node.children)
        }));
    };

    // Filter inventory (not mounted components)
    const filterInventory = (): Component[] => {
        return components.filter(component => {
            if (component.is_mounted) return false;

            // Search filter
            const matchesSearch = searchTerm === '' ||
                component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                component.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                component.asset_code.toLowerCase().includes(searchTerm.toLowerCase());

            // Critical filter
            const matchesCritical = filterCritical === 'all' ||
                (filterCritical === 'critical' && component.is_critical) ||
                (filterCritical === 'not_critical' && !component.is_critical);

            return matchesSearch && matchesCritical;
        });
    };

    // Render tree node
    const renderTreeNode = (node: TreeNode, level: number = 0) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        const isSelected = selectedComponent?.id === node.id;

        return (
            <div key={node.id} className="w-full">
                <div
                    className={`flex items-center py-2 px-3 hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 [data-theme=\'dark\']_&:bg-blue-900' : ''
                    }`}
                    style={{ paddingLeft: `${level * 24 + 12}px` }}
                    onClick={() => setSelectedComponent(node)}
                >
                    {/* Expand/Collapse Icon */}
                    <div className="w-6 flex items-center justify-center mr-2">
                        {hasChildren && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNode(node.id);
                                }}
                                className="hover:bg-gray-200 [data-theme='dark']_&:hover:bg-gray-600 rounded p-1"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Component Icon */}
                    <div className="flex-shrink-0 h-8 w-8 mr-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            node.is_major_component
                                ? 'bg-blue-100 [data-theme=\'dark\']_&:bg-blue-900'
                                : 'bg-gray-100 [data-theme=\'dark\']_&:bg-gray-700'
                        }`}>
                            <svg className={`h-5 w-5 ${
                                node.is_major_component
                                    ? 'text-blue-600 [data-theme=\'dark\']_&:text-blue-400'
                                    : 'text-gray-600 [data-theme=\'dark\']_&:text-gray-400'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                    </div>

                    {/* Component Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white truncate">
                                {node.name}
                            </p>
                            {!node.is_mounted && (
                                <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-gray-200">
                                    Not Mounted
                                </span>
                            )}
                            {node.is_critical && (
                                <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:text-red-200">
                                    Critical
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">
                            {node.asset_code} • {node.serial_number}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className="ml-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(node.last_condition)}`}>
                            {node.last_condition}
                        </span>
                    </div>

                    {/* Child Count */}
                    {hasChildren && (
                        <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 [data-theme='dark']_&:text-gray-400 bg-gray-100 [data-theme='dark']_&:bg-gray-700 rounded-full">
                                {node.children.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div>
                        {node.children.map(child => renderTreeNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Get selected vessel name
    const selectedVesselName = vesselsData?.find(v => v.id === selectedVesselId)?.name || 'Select Vessel';

    // Calculate statistics
    const stats = {
        total: components.length,
        mounted: components.filter(c => c.is_mounted).length,
        inventory: components.filter(c => !c.is_mounted).length,
        critical: components.filter(c => c.is_critical).length,
        normal: components.filter(c => c.last_condition === 'Normal').length,
    };

    const filteredTreeData = filterTree(treeData);
    const filteredInventory = filterInventory();

    // Loading state
    if (vesselsLoading || (isLoading && !components.length)) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Component Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel components and equipment</p>
                    </div>
                </div>

                {/* Loading Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse [data-theme='dark']_&:bg-gray-800">
                            <div className="h-4 bg-gray-200 rounded mb-2 [data-theme='dark']_&:bg-gray-700"></div>
                            <div className="h-8 bg-gray-200 rounded [data-theme='dark']_&:bg-gray-700"></div>
                        </div>
                    ))}
                </div>

                {/* Loading Tree */}
                <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800">
                    <div className="p-6">
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded [data-theme='dark']_&:bg-gray-700"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Component Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel components and equipment</p>
                    </div>
                    <button
                        onClick={() => fetchComponents(selectedVesselId)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Retry</span>
                    </button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:border-red-700">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 [data-theme='dark']_&:text-red-200">
                                Error loading components
                            </h3>
                            <div className="mt-2 text-sm text-red-700 [data-theme='dark']_&:text-red-300">
                                <p>Failed to fetch component data. Please check your connection and try again.</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => fetchComponents(selectedVesselId)}
                                    className="bg-red-100 text-red-800 px-3 py-2 text-sm rounded-md hover:bg-red-200 [data-theme='dark']_&:bg-red-800 [data-theme='dark']_&:text-red-200 [data-theme='dark']_&:hover:bg-red-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Component Management</h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel components and equipment</p>
                </div>
            </div>

            {/* Vessel Selection */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 [data-theme='dark']_&:bg-gray-800">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-2">
                            Select Vessel
                        </label>
                        <select
                            value={selectedVesselId}
                            onChange={(e) => handleVesselChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            {vesselsData?.map((vessel) => (
                                <option key={vessel.id} value={vessel.id}>
                                    {vessel.name} - {vessel.imo} ({vessel.company})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Components</h3>
                    <p className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{stats.total}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">{selectedVesselName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Installed</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.mounted}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Currently mounted</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Inventory</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats.inventory}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">In storage</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Critical</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Needs attention</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tree View / List View */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 [data-theme='dark']_&:border-gray-700">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('installed')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'installed'
                                            ? 'border-blue-500 text-blue-600 [data-theme=\'dark\']_&:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 [data-theme=\'dark\']_&:text-gray-400 [data-theme=\'dark\']_&:hover:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span>Installed ({stats.mounted})</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'inventory'
                                            ? 'border-blue-500 text-blue-600 [data-theme=\'dark\']_&:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 [data-theme=\'dark\']_&:text-gray-400 [data-theme=\'dark\']_&:hover:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span>Inventory ({stats.inventory})</span>
                                    </div>
                                </button>
                            </nav>
                        </div>

                        {/* Filters & Controls */}
                        <div className="p-4 border-b border-gray-200 [data-theme='dark']_&:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Search components..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white text-sm"
                                    />
                                </div>

                                {/* Critical Filter */}
                                <div>
                                    <select
                                        value={filterCritical}
                                        onChange={(e) => setFilterCritical(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white text-sm"
                                    >
                                        <option value="all">All Priority</option>
                                        <option value="critical">Critical Only</option>
                                        <option value="not_critical">Non-Critical</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tree Controls - Only show for Installed tab */}
                            {activeTab === 'installed' && (
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={expandAll}
                                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:bg-blue-900"
                                        >
                                            Expand All
                                        </button>
                                        <button
                                            onClick={collapseAll}
                                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded [data-theme='dark']_&:text-gray-400 [data-theme='dark']_&:hover:bg-gray-700"
                                        >
                                            Collapse All
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600 [data-theme='dark']_&:text-gray-400">
                                        {filteredTreeData.length} root components
                                    </div>
                                </div>
                            )}

                            {/* Inventory Info */}
                            {activeTab === 'inventory' && (
                                <div className="flex items-center justify-end">
                                    <div className="text-sm text-gray-600 [data-theme='dark']_&:text-gray-400">
                                        {filteredInventory.length} items in inventory
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="overflow-auto" style={{ maxHeight: '600px' }}>
                            {activeTab === 'installed' ? (
                                // Tree View for Installed Components
                                filteredTreeData.length > 0 ? (
                                    <div>
                                        {filteredTreeData.map(node => renderTreeNode(node, 0))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No installed components found</h3>
                                        <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                            {searchTerm || filterCritical !== 'all'
                                                ? 'No components match your current filters.'
                                                : `No installed components for ${selectedVesselName}.`
                                            }
                                        </p>
                                    </div>
                                )
                            ) : (
                                // List View for Inventory
                                filteredInventory.length > 0 ? (
                                    <div className="divide-y divide-gray-200 [data-theme='dark']_&:divide-gray-700">
                                        {filteredInventory.map((component) => (
                                            <div
                                                key={component.id}
                                                onClick={() => setSelectedComponent(component)}
                                                className={`p-4 hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700 cursor-pointer transition-colors ${
                                                    selectedComponent?.id === component.id ? 'bg-blue-50 [data-theme=\'dark\']_&:bg-blue-900' : ''
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    {/* Component Icon */}
                                                    <div className="flex-shrink-0 h-12 w-12 mr-4">
                                                        <div className="h-12 w-12 rounded-lg bg-purple-100 [data-theme='dark']_&:bg-purple-900 flex items-center justify-center">
                                                            <svg className="h-6 w-6 text-purple-600 [data-theme='dark']_&:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Component Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <p className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white truncate">
                                                                {component.name}
                                                            </p>
                                                            {component.is_critical && (
                                                                <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:text-red-200">
                                                                    Critical
                                                                </span>
                                                            )}
                                                            {component.is_circulating_component && (
                                                                <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 [data-theme='dark']_&:bg-blue-900 [data-theme='dark']_&:text-blue-200">
                                                                    Circulating
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mb-1">
                                                            {component.asset_code} • {component.serial_number}
                                                        </p>
                                                        <div className="flex items-center space-x-4 text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">
                                                            {component.component_type && (
                                                                <span>Type: {component.component_type.name}</span>
                                                            )}
                                                            {component.location && (
                                                                <span>Location: {component.location.name}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Status & Hours */}
                                                    <div className="ml-4 flex-shrink-0 text-right">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(component.last_condition)}`}>
                                                            {component.last_condition}
                                                        </span>
                                                        <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">
                                                            {component.running_hours.toLocaleString()} hrs
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No inventory items found</h3>
                                        <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                            {searchTerm || filterCritical !== 'all'
                                                ? 'No items match your current filters.'
                                                : `No items in inventory for ${selectedVesselName}.`
                                            }
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow [data-theme='dark']_&:bg-gray-800 sticky top-6">
                        {selectedComponent ? (
                            <div>
                                {/* Header */}
                                <div className="p-4 border-b border-gray-200 [data-theme='dark']_&:border-gray-700">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 [data-theme='dark']_&:text-white">
                                            Component Details
                                        </h3>
                                        <button
                                            onClick={() => setSelectedComponent(null)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 overflow-auto" style={{ maxHeight: '550px' }}>
                                    {/* Image */}
                                    {selectedComponent.image_path && !selectedComponent.image_path.includes('?X-Amz') && (
                                        <div className="mb-4">
                                            <img
                                                src={selectedComponent.image_path}
                                                alt={selectedComponent.name}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {/* Name & Status */}
                                    <div className="mb-4">
                                        <h4 className="text-xl font-bold text-gray-900 [data-theme='dark']_&:text-white mb-2">
                                            {selectedComponent.name}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedComponent.last_condition)}`}>
                                                {selectedComponent.last_condition}
                                            </span>
                                            {selectedComponent.is_mounted && (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 [data-theme='dark']_&:bg-blue-900 [data-theme='dark']_&:text-blue-200">
                                                    Mounted
                                                </span>
                                            )}
                                            {selectedComponent.is_critical && (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:text-red-200">
                                                    Critical
                                                </span>
                                            )}
                                            {selectedComponent.is_major_component && (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 [data-theme='dark']_&:bg-purple-900 [data-theme='dark']_&:text-purple-200">
                                                    Major
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="space-y-3 mb-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Asset Code</label>
                                            <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.asset_code}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Serial Number</label>
                                            <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.serial_number}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Class Code</label>
                                            <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.class_code || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Running Hours</label>
                                            <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.running_hours.toLocaleString()} hrs</p>
                                        </div>
                                    </div>

                                    {/* Location & Department */}
                                    <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-700 pt-4 mb-4">
                                        <h5 className="text-sm font-semibold text-gray-900 [data-theme='dark']_&:text-white mb-3">Location & Department</h5>
                                        <div className="space-y-3">
                                            {selectedComponent.location && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Location</label>
                                                    <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.location.name}</p>
                                                </div>
                                            )}
                                            {selectedComponent.department && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Department</label>
                                                    <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.department.name}</p>
                                                </div>
                                            )}
                                            {selectedComponent.component_type && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Type</label>
                                                    <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.component_type.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Manufacturer & Vendor */}
                                    <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-700 pt-4 mb-4">
                                        <h5 className="text-sm font-semibold text-gray-900 [data-theme='dark']_&:text-white mb-3">Manufacturer & Vendor</h5>
                                        <div className="space-y-3">
                                            {selectedComponent.original_manufacturer && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Manufacturer</label>
                                                    <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.original_manufacturer.name}</p>
                                                </div>
                                            )}
                                            {selectedComponent.vendor && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Vendor</label>
                                                    <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.vendor.name}</p>
                                                </div>
                                            )}
                                            {selectedComponent.owning_type && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Ownership</label>
                                                    <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.owning_type.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-700 pt-4 mb-4">
                                        <h5 className="text-sm font-semibold text-gray-900 [data-theme='dark']_&:text-white mb-3">Specifications</h5>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Main Spec</label>
                                                <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.main_spec || '-'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Installation</label>
                                                <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.installation_desc || '-'}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-400 uppercase">Criticality</label>
                                                <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.criticality_desc || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Critical Info */}
                                    {selectedComponent.is_critical && selectedComponent.critical_desc && (
                                        <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-700 pt-4 mb-4">
                                            <h5 className="text-sm font-semibold text-gray-900 [data-theme='dark']_&:text-white mb-3">Critical Information</h5>
                                            <div className="bg-red-50 [data-theme='dark']_&:bg-red-900 p-3 rounded-lg">
                                                <p className="text-sm text-red-900 [data-theme='dark']_&:text-red-200">
                                                    {selectedComponent.critical_desc}
                                                </p>
                                                {selectedComponent.critical_level && (
                                                    <p className="text-xs text-red-700 [data-theme='dark']_&:text-red-300 mt-1">
                                                        Level: {selectedComponent.critical_level}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Condition History */}
                                    <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-700 pt-4 mb-4">
                                        <h5 className="text-sm font-semibold text-gray-900 [data-theme='dark']_&:text-white mb-3">Last Condition Check</h5>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">Date</span>
                                                <span className="text-sm text-gray-900 [data-theme='dark']_&:text-white">
                                                    {formatDate(selectedComponent.last_condition_date)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">Status</span>
                                                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(selectedComponent.last_condition)}`}>
                                                    {selectedComponent.last_condition}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remarks */}
                                    {selectedComponent.remarks && selectedComponent.remarks !== '-' && (
                                        <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-700 pt-4 mb-4">
                                            <h5 className="text-sm font-semibold text-gray-900 [data-theme='dark']_&:text-white mb-3">Remarks</h5>
                                            <p className="text-sm text-gray-900 [data-theme='dark']_&:text-white">{selectedComponent.remarks}</p>
                                        </div>
                                    )}

                                    {/* Component Flags */}
                                    <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-700 pt-4">
                                        <h5 className="text-sm font-semibold text-gray-900 [data-theme='dark']_&:text-white mb-3">Component Attributes</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className={`p-2 rounded text-center ${selectedComponent.is_major_component ? 'bg-blue-100 [data-theme=\'dark\']_&:bg-blue-900' : 'bg-gray-100 [data-theme=\'dark\']_&:bg-gray-700'}`}>
                                                <p className="text-xs text-gray-600 [data-theme='dark']_&:text-gray-400">Major</p>
                                                <p className="text-sm font-semibold">{selectedComponent.is_major_component ? 'Yes' : 'No'}</p>
                                            </div>
                                            <div className={`p-2 rounded text-center ${selectedComponent.is_circulating_component ? 'bg-purple-100 [data-theme=\'dark\']_&:bg-purple-900' : 'bg-gray-100 [data-theme=\'dark\']_&:bg-gray-700'}`}>
                                                <p className="text-xs text-gray-600 [data-theme='dark']_&:text-gray-400">Circulating</p>
                                                <p className="text-sm font-semibold">{selectedComponent.is_circulating_component ? 'Yes' : 'No'}</p>
                                            </div>
                                            <div className={`p-2 rounded text-center ${selectedComponent.is_grouped_component ? 'bg-green-100 [data-theme=\'dark\']_&:bg-green-900' : 'bg-gray-100 [data-theme=\'dark\']_&:bg-gray-700'}`}>
                                                <p className="text-xs text-gray-600 [data-theme='dark']_&:text-gray-400">Grouped</p>
                                                <p className="text-sm font-semibold">{selectedComponent.is_grouped_component ? 'Yes' : 'No'}</p>
                                            </div>
                                            <div className={`p-2 rounded text-center ${selectedComponent.is_component_lending ? 'bg-yellow-100 [data-theme=\'dark\']_&:bg-yellow-900' : 'bg-gray-100 [data-theme=\'dark\']_&:bg-gray-700'}`}>
                                                <p className="text-xs text-gray-600 [data-theme='dark']_&:text-gray-400">Lending</p>
                                                <p className="text-sm font-semibold">{selectedComponent.is_component_lending ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No component selected</h3>
                                <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                    Select a component from the tree to view details
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}