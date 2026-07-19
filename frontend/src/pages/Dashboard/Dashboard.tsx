import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from '../../config/config';
import { SUPPLIER_LOCATIONS } from '../../data/supplierLocations';
import './Dashboard.css';

interface SupplierCount {
  supplier: string;
  count: number;
}

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;

export default function Dashboard() {
  const { t } = useTranslation();
  const [supplierCounts, setSupplierCounts] = useState<SupplierCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/meta/supplier-counts`)
      .then((res) => setSupplierCounts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const maxSupplierCount = Math.max(1, ...supplierCounts.map((s) => s.count));
  const mapPoints = SUPPLIER_LOCATIONS.map((loc) => ({
    ...loc,
    count: supplierCounts.find((s) => s.supplier === loc.supplier)?.count ?? 0,
  })).filter((loc) => loc.count > 0);

  if (loading) {
    return (
      <div className="lazy-fallback-container">
        <div className="lazy-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid dashboard">
      <h2 className="dashboard__title">{t('dashboard.title')}</h2>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card dashboard__card">
            <div className="card-body">
              <h5 className="card-title">{t('dashboard.productsBySupplier')}</h5>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={supplierCounts} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="supplier"
                    width={140}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value: string) => truncate(value, 18)}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7cb342" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card dashboard__card">
            <div className="card-body">
              <h5 className="card-title">{t('dashboard.supplierMap')}</h5>
              <MapContainer
                center={[49.0, 31.0]}
                zoom={5}
                scrollWheelZoom={false}
                style={{ height: 360, width: '100%', borderRadius: 4 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapPoints.map((point) => (
                  <CircleMarker
                    key={point.supplier}
                    center={[point.lat, point.lng]}
                    radius={6 + (point.count / maxSupplierCount) * 14}
                    pathOptions={{ color: '#7cb342', fillColor: '#7cb342', fillOpacity: 0.5 }}
                  >
                    <Popup>
                      <strong>{point.supplier}</strong>
                      <br />
                      {point.city}
                      <br />
                      {t('dashboard.productsCount', { count: point.count })}
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
