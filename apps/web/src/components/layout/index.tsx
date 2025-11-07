import Header from './header';
import Content from './content';
import Sidebar from './sidebar';

export default function Layout() {
  return (
    <div className="flex h-full">
      <Sidebar className="min-w-10 h-full bg-amber-600" />

      <div className="flex-1">
        <Header className="h-10" />
        <Content />
      </div>
    </div>
  );
}
