import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { Map as LeafletMap, CircleMarker as LeafletCircleMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from '../../config/config';
import { SUPPLIER_LOCATIONS } from '../../data/supplierLocations';
import StatTile from '../../components/StatTile/StatTile';
import './Dashboard.css';

interface SupplierCount {
  supplier: string;
  count: number;
}

interface TypeCount {
  type: string;
  count: number;
}

interface ConditionCounts {
  new: number;
  used: number;
}

interface OrderStats {
  totalOrders: number;
  totalProducts: number;
  totalUsd: number;
  totalUah: number;
}

const TYPE_COLORS = ['#2a78d6', '#e87ba4', '#eda100', '#1baf7a'];
const TYPE_OTHER_COLOR = '#98a4b3';

const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;

function foldToTopFour(counts: TypeCount[], otherLabel: string) {
  const sorted = [...counts].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, 4);
  const rest = sorted.slice(4);
  const otherTotal = rest.reduce((sum, item) => sum + item.count, 0);
  return otherTotal > 0 ? [...top, { type: otherLabel, count: otherTotal }] : top;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [supplierCounts, setSupplierCounts] = useState<SupplierCount[]>([]);
  const [typeCounts, setTypeCounts] = useState<TypeCount[]>([]);
  const [conditionCounts, setConditionCounts] = useState<ConditionCounts>({ new: 0, used: 0 });
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<Record<string, LeafletCircleMarker | null>>({});

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/products/meta/supplier-counts`).then((res) => setSupplierCounts(res.data)),
      axios.get(`${API_URL}/api/products/meta/type-counts`).then((res) => setTypeCounts(res.data)),
      axios.get(`${API_URL}/api/products/meta/condition-counts`).then((res) => setConditionCounts(res.data)),
      axios.get(`${API_URL}/api/orders/meta/stats`).then((res) => setOrderStats(res.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const otherLabel = t('dashboard.other');
  const typeChartData = foldToTopFour(typeCounts, otherLabel);
  const conditionChartData = [
    { key: 'new', label: t('productCard.new'), count: conditionCounts.new, color: '#7cb342' },
    { key: 'used', label: t('productCard.used'), count: conditionCounts.used, color: '#354052' },
  ].filter((item) => item.count > 0);

  const maxSupplierCount = Math.max(1, ...supplierCounts.map((s) => s.count));
  const mapPoints = SUPPLIER_LOCATIONS.map((loc) => ({
    ...loc,
    count: supplierCounts.find((s) => s.supplier === loc.supplier)?.count ?? 0,
  })).filter((loc) => loc.count > 0);

  const selectSupplier = (supplier: string) => {
    setSelectedSupplier(supplier);
    const point = mapPoints.find((p) => p.supplier === supplier);
    if (point) {
      mapRef.current?.flyTo([point.lat, point.lng], 8, { duration: 1 });
      markerRefs.current[supplier]?.openPopup();
    }
  };

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

      {orderStats && (
        <div className="row g-4 dashboard__stats">
          <div className="col-6 col-md-3">
            <StatTile label={t('dashboard.totalOrders')} value={orderStats.totalOrders.toLocaleString('en-US')} />
          </div>
          <div className="col-6 col-md-3">
            <StatTile label={t('dashboard.totalProducts')} value={orderStats.totalProducts.toLocaleString('en-US')} />
          </div>
          <div className="col-6 col-md-3">
            <StatTile label={t('dashboard.totalValueUsd')} value={`$${orderStats.totalUsd.toLocaleString('en-US')}`} />
          </div>
          <div className="col-6 col-md-3">
            <StatTile label={t('dashboard.totalValueUah')} value={`₴${orderStats.totalUah.toLocaleString('en-US')}`} />
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card dashboard__card">
            <div className="card-body">
              <h5 className="card-title">{t('dashboard.productsByType')}</h5>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={typeChartData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, percent }) => `${truncate(String(name), 14)} ${Math.round((percent ?? 0) * 100)}%`}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell
                        key={entry.type}
                        fill={entry.type === otherLabel ? TYPE_OTHER_COLOR : TYPE_COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card dashboard__card">
            <div className="card-body">
              <h5 className="card-title">{t('dashboard.newVsUsed')}</h5>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={conditionChartData}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                  >
                    {conditionChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 dashboard__row-spacer">
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
                  <Bar
                    dataKey="count"
                    radius={[0, 4, 4, 0]}
                    cursor="pointer"
                    onClick={(data) => {
                      if (data.payload?.supplier) selectSupplier(data.payload.supplier);
                    }}
                  >
                    {supplierCounts.map((entry) => (
                      <Cell
                        key={entry.supplier}
                        fill={entry.supplier === selectedSupplier ? '#4f7a26' : '#7cb342'}
                      />
                    ))}
                  </Bar>
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
                ref={mapRef}
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
                    ref={(marker) => {
                      markerRefs.current[point.supplier] = marker;
                    }}
                    center={[point.lat, point.lng]}
                    radius={6 + (point.count / maxSupplierCount) * 14}
                    pathOptions={{
                      color: point.supplier === selectedSupplier ? '#4f7a26' : '#7cb342',
                      fillColor: point.supplier === selectedSupplier ? '#4f7a26' : '#7cb342',
                      fillOpacity: point.supplier === selectedSupplier ? 0.8 : 0.5,
                      weight: point.supplier === selectedSupplier ? 3 : 1,
                    }}
                    eventHandlers={{
                      click: () => selectSupplier(point.supplier),
                    }}
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
