import Layout from '@repo/ui-comps/layout';
import { menuItems, logo, title } from '@/config/layout';

export default function LayoutWrapper() {
  return (
    <Layout
      logo={logo}
      title={title}
      menuItems={menuItems}
    />
  );
}

