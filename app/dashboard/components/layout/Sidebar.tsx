// app/dashboard/components/layout/Sidebar.tsx

import { MenuIcon, XIcon } from '../icons/Icons';
import { LogoFull, LogoIcon } from '../icons/Logos';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType;
    component: React.ComponentType;
}

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    menuItems: MenuItem[];
    activeMenuItem: string;
    setActiveMenuItem: (id: string) => void;
}

export default function Sidebar({
                                    sidebarOpen,
                                    setSidebarOpen,
                                    menuItems,
                                    activeMenuItem,
                                    setActiveMenuItem
                                }: SidebarProps) {
    const toggleSidebar = () => {
        console.log('Toggle sidebar clicked, current state:', sidebarOpen);
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0`}> {/* Sesuaikan lebar w-20 atau w-16 agar sesuai dengan ikon */}
            <div className="flex flex-col h-full">
                {/* Header dengan Logo dan Tombol Toggle */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex-grow flex items-center justify-center"> {/* Container untuk logo agar di tengah saat terbuka */}
                        {sidebarOpen ? (
                            <LogoFull className="h-8 w-auto text-blue-600" /> // Contoh logo penuh, sesuaikan ukuran dan warna
                        ) : (
                            <LogoIcon className="h-8 w-8 text-blue-600" /> // Contoh logo ikon, sesuaikan ukuran dan warna
                        )}
                    </div>
                    {/* Tombol toggle dipindah ke sisi kiri (atau kanan jika ingin bersebelahan dengan logo)
                       Ini opsional, Anda bisa sesuaikan posisi tombol sesuai keinginan */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 ml-2" // ml-2 untuk jarak dari logo
                        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    >
                        {sidebarOpen ? <XIcon/> : <MenuIcon />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto"> {/* Tambah overflow-y-auto jika menu banyak */}
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveMenuItem(item.id)}
                                        className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition-colors group ${
                                            activeMenuItem === item.id
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        title={item.label} // Title attribute untuk tooltip saat ikon saja
                                    >
                                        <Icon className={`${activeMenuItem === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} h-6 w-6 transition-colors`} /> {/* Tambahkan kelas untuk ikon */}
                                        <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden whitespace-nowrap'}`}>
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}