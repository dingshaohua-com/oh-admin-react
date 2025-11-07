import { Users, FileText, Settings, TrendingUp } from 'lucide-react';

export default function Welcome() {
  const stats = [
    { title: '总用户数', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: '内容数量', value: '567', icon: FileText, color: 'bg-green-500' },
    { title: '系统配置', value: '89', icon: Settings, color: 'bg-purple-500' },
    { title: '增长率', value: '+12%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">欢迎使用 Admin Pro</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">快速开始</h2>
        <p className="text-gray-600">
          这是一个基于 React + React Router + Tailwind CSS + shadcn/ui 构建的后台管理系统模板。
        </p>
        <p className="text-gray-600 mt-2">
          点击左侧菜单可以查看不同的页面。
        </p>
      </div>
    </div>
  );
}
