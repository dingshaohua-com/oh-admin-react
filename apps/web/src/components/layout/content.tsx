import { Outlet } from 'react-router';

export default function Content() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
