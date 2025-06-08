import { Flame, Mountain, Droplets, Wind, HelpCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export type ElementType = 'air' | 'water' | 'earth' | 'fire';

interface ElementIconProps extends LucideProps {
  element: ElementType | string | undefined; // Allow string for flexibility, handle undefined
}

const ElementIcon: React.FC<ElementIconProps> = ({ element, ...props }) => {
  switch (element) {
    case 'air':
      return <Wind {...props} />;
    case 'water':
      return <Droplets {...props} />;
    case 'earth':
      return <Mountain {...props} />;
    case 'fire':
      return <Flame {...props} />;
    default:
      return <HelpCircle {...props} />; // Fallback icon
  }
};

export default ElementIcon;
