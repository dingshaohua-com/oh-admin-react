import {cn} from '@repo/shadcn-comps/lib/utils';

interface SidebarProps {
  className?: string;
}

export default function SidebarProps(props: SidebarProps) {
  return <div className={cn('bg-gray-400', props.className)}>Sidebar</div>;
}
