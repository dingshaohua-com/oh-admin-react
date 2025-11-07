import { Users, FileText, Settings, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

export default function Welcome() {
  const stats = [
    {
      title: '总用户数',
      value: '8,846',
      icon: Users,
      color: 'text-[#1890ff]',
      trend: '+12%',
      trendUp: true
    },
    {
      title: '内容数量',
      value: '6,560',
      icon: FileText,
      color: 'text-[#52c41a]',
      trend: '+8%',
      trendUp: true
    },
    {
      title: '系统配置',
      value: '89',
      icon: Settings,
      color: 'text-[#722ed1]',
      trend: '-2%',
      trendUp: false
    },
    {
      title: '增长率',
      value: '78%',
      icon: TrendingUp,
      color: 'text-[#fa8c16]',
      trend: '+5%',
      trendUp: true
    },
  ];

  return (
    <div>
      {/* 欢迎标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">欢迎使用</h1>
        <p className="text-gray-500 mt-1">Ant Design Pro 是一个企业级中后台前端/设计解决方案</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-sm shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-2">{stat.title}</p>
                <p className="text-3xl font-semibold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className={stat.trendUp ? 'text-[#52c41a]' : 'text-[#f5222d]'}>
                {stat.trendUp ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />}
                {stat.trend}
              </span>
              <span className="text-gray-400 ml-2">周同比</span>
            </div>
          </div>
        ))}
      </div>

      {/* 快速开始 */}
      <div className="bg-white rounded-sm shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">快速开始</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            这是一个基于 <span className="text-[#1890ff]">React</span> + <span className="text-[#1890ff]">React Router</span> + <span className="text-[#1890ff]">Tailwind CSS</span> + <span className="text-[#1890ff]">shadcn/ui</span> 构建的后台管理系统模板。
          </p>
          <p>
            点击左侧菜单可以查看不同的页面，点击右上角的折叠按钮可以收起侧边栏。
          </p>
        </div>
      </div>
    </div>
  );
}
