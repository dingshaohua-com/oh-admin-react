import { cn } from '@repo/shadcn-comps/lib/utils';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/admin',
  },
  {
    key: 'users',
    label: '用户管理',
    icon: <Users className="w-5 h-5" />,
    path: '/admin/users',
  },
  {
    key: 'content',
    label: '内容管理',
    icon: <FileText className="w-5 h-5" />,
    path: '/admin/content',
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: <Settings className="w-5 h-5" />,
    path: '/admin/settings',
  },
];

export default function Sidebar(props: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        'bg-[#001529] text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64',
        props.className
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <div className="text-xl font-bold">
          {collapsed ? 'AP' : 'Admin Pro'}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={cn(
                'flex items-center px-6 py-3 transition-colors',
                'hover:bg-[#1890ff]',
                isActive && 'bg-[#1890ff]',
                collapsed && 'justify-center px-0'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 hover:bg-white/10 rounded transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-2">收起</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
