import './StatTile.css';

interface StatTileProps {
  label: string;
  value: string;
}

export default function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="stat-tile">
      <div className="stat-tile__value">{value}</div>
      <div className="stat-tile__label">{label}</div>
    </div>
  );
}
