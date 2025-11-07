import { cn } from '@repo/shadcn-comps/lib/utils';
import { useLocation, Link } from 'react-router';
import { Bell, User, ChevronRight } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

// 路由到面包屑的映射
const breadcrumbMap: Record<string, string[]> = {
  '/admin': ['首页', '仪表盘'],
  '/admin/users': ['首页', '用户管理'],
  '/admin/content': ['首页', '内容管理'],
  '/admin/settings': ['首页', '系统设置'],
};

export default function Header(props: HeaderProps) {
  const location = useLocation();
  const breadcrumbs = breadcrumbMap[location.pathname] || ['首页'];

  return (
    <div
      className={cn(
        'bg-white border-b border-gray-200 px-6 flex items-center justify-between',
        props.className
      )}
    >
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <span
              className={cn(
                index === breadcrumbs.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500'
              )}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-4">
        {/* 通知 */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* 用户信息 */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded transition-colors">
          <div className="w-8 h-8 bg-[#1890ff] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm text-gray-700">Admin</span>
        </div>
      </div>
    </div>
  );
}
