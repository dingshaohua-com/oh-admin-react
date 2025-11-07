import {cn} from '@repo/shadcn-comps/lib/utils';

interface HeaderProps {
  className?: string;
}

export default function Header(props: HeaderProps) {
  return <div className={cn('bg-gray-400', props.className)}>Header</div>;
}
