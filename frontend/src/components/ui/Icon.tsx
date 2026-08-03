import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!LucideIcon) return <Icons.HelpCircle {...props} />;
  return <LucideIcon {...props} />;
}
