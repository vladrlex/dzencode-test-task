import MonitorIcon from './MonitorIcon';
import CpuIcon from './CpuIcon';
import GpuIcon from './GpuIcon';
import RamIcon from './RamIcon';

interface ProductIconProps {
  type: string;
  size?: number;
  className?: string;
}

export default function ProductIcon({ type, size = 20, className = '' }: ProductIconProps) {
  const normalizedType = type.toLowerCase();

  switch (normalizedType) {
    case 'processors':
    case 'cpu':
      return <CpuIcon size={size} className={className} />;
      
    case 'graphics cards':
    case 'gpu':
    case 'video cards':
      return <GpuIcon size={size} className={className} />;
      
    case 'monitors':
    case 'displays':
    case 'televisions':
      return <MonitorIcon size={size} className={className} />;

    case 'ram':
    case 'memory':
    case 'motherboards':
      return <RamIcon size={size} className={className} />;

    default:
      return <MonitorIcon size={size} className={className} />;
  }
}