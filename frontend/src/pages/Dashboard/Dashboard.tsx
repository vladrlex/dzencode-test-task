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
import StatTile from './StatTile/StatTile';
import { useAppSelector } from '../../store/hooks';
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

const CHART_THEME = {
  light: {
    typeColors: ['#2a78d6', '#008300', '#e87ba4', '#eda100'],
    otherColor: '#98a4b3',
    conditionNew: '#7cb342',
    conditionUsed: '#354052',
    barDefault: '#7cb342',
    barSelected: '#4f7a26',
    gridStroke: '#e1e6eb',
    axisTick: '#7f8fa4',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e1e6eb',
    tooltipText: '#354052',
    legendText: '#354052',
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  dark: {
    typeColors: ['#3987e5', '#008300', '#d55181', '#c98500'],
    otherColor: '#6d7680',
    conditionNew: '#7cb342',
    conditionUsed: '#9aa4b0',
    barDefault: '#7cb342',
    barSelected: '#a5d76e',
    gridStroke: '#33383e',
    axisTick: '#9aa4b0',
    tooltipBg: '#1f2226',
    tooltipBorder: '#33383e',
    tooltipText: '#e9ebee',
    legendText: '#e9ebee',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    tileAttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
} as const;

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
  const theme = useAppSelector((state) => state.theme.theme);
  const c = CHART_THEME[theme];
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
    { key: 'new', label: t('productCard.new'), count: conditionCounts.new, color: c.conditionNew },
    { key: 'used', label: t('productCard.used'), count: conditionCounts.used, color: c.conditionUsed },
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
                    fill={c.tooltipText}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell
                        key={entry.type}
                        fill={entry.type === otherLabel ? c.otherColor : c.typeColors[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: c.tooltipBg, borderColor: c.tooltipBorder, color: c.tooltipText }} />
                  <Legend wrapperStyle={{ color: c.legendText }} />
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
                    fill={c.tooltipText}
                  >
                    {conditionChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: c.tooltipBg, borderColor: c.tooltipBorder, color: c.tooltipText }} />
                  <Legend wrapperStyle={{ color: c.legendText }} />
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
                  <CartesianGrid strokeDasharray="3 3" stroke={c.gridStroke} />
                  <XAxis type="number" allowDecimals={false} tick={{ fill: c.axisTick }} stroke={c.gridStroke} />
                  <YAxis
                    type="category"
                    dataKey="supplier"
                    width={140}
                    tick={{ fontSize: 11, fill: c.axisTick }}
                    stroke={c.gridStroke}
                    tickFormatter={(value: string) => truncate(value, 18)}
                  />
                  <Tooltip contentStyle={{ backgroundColor: c.tooltipBg, borderColor: c.tooltipBorder, color: c.tooltipText }} />
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
                        fill={entry.supplier === selectedSupplier ? c.barSelected : c.barDefault}
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
                <TileLayer attribution={c.tileAttribution} url={c.tileUrl} />
                {mapPoints.map((point) => (
                  <CircleMarker
                    key={point.supplier}
                    ref={(marker) => {
                      markerRefs.current[point.supplier] = marker;
                    }}
                    center={[point.lat, point.lng]}
                    radius={6 + (point.count / maxSupplierCount) * 14}
                    pathOptions={{
                      color: point.supplier === selectedSupplier ? c.barSelected : c.barDefault,
                      fillColor: point.supplier === selectedSupplier ? c.barSelected : c.barDefault,
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
