import { cn } from '@repo/shadcn-comps/lib/utils';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Crown,
} from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';

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
    path: '/',
  },
  {
    key: 'users',
    label: '用户管理',
    icon: <Users className="w-5 h-5" />,
    path: '/users',
  },
  {
    key: 'content',
    label: '内容管理',
    icon: <FileText className="w-5 h-5" />,
    path: '/content',
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: <Settings className="w-5 h-5" />,
    path: '/settings',
  },
];

export default function Sidebar(props: SidebarProps) {
  const { collapsed } = useLayout();
  const location = useLocation();

  return (
    <div
      className={cn(
        'bg-[#001529] text-white transition-all duration-200 flex flex-col h-full',
        collapsed ? 'w-20' : 'w-[256px]',
        props.className
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center shrink-0 overflow-hidden pl-[22px] gap-2">
        <Crown className="w-8 h-8 text-[#1890ff] shrink-0" />
        {!collapsed && (
          <div className="text-xl font-bold whitespace-nowrap">
            Ant Design Pro
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={cn(
                'flex items-center h-10 my-1  pl-6 rounded transition-all duration-200 overflow-hidden',
                'hover:bg-[#1890ff]',
                isActive && 'bg-[#1890ff]'
              )}
            >
              <span className="shrink-0 flex items-center justify-center w-5">
                {item.icon}
              </span>
              {!collapsed && (
                <span className="ml-3 whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
