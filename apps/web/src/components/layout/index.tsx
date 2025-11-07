import Header from './header';
import Content from './content';
import Sidebar from './sidebar';
import { LayoutProvider } from '@/contexts/LayoutContext';

export default function Layout() {
  return (
    <LayoutProvider>
      <div className="flex h-full w-full">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 右侧主体区域 */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* 顶部导航 */}
          <Header className="h-16 shrink-0" />

          {/* 内容区域 */}
          <Content />
        </div>
      </div>
    </LayoutProvider>
  );
}
