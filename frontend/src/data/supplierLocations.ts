export interface SupplierLocation {
  supplier: string;
  city: string;
  lat: number;
  lng: number;
}

export const SUPPLIER_LOCATIONS: SupplierLocation[] = [
  { supplier: 'ASBIS', city: 'Limassol, Cyprus', lat: 34.7071, lng: 33.0226 },
  { supplier: 'MTI', city: 'Kyiv, Ukraine', lat: 50.4501, lng: 30.5234 },
  { supplier: 'ELKO Київ', city: 'Kyiv, Ukraine', lat: 50.4547, lng: 30.5238 },
  { supplier: 'Brain', city: 'Kyiv, Ukraine', lat: 50.4462, lng: 30.5170 },
  { supplier: 'Comfy Trade', city: 'Kyiv, Ukraine', lat: 50.4401, lng: 30.5310 },
  { supplier: 'ТехноСвіт', city: 'Kharkiv, Ukraine', lat: 49.9935, lng: 36.2304 },
  { supplier: 'Дніпро-М', city: 'Dnipro, Ukraine', lat: 48.4647, lng: 35.0462 },
  { supplier: 'ТОВ "Комптек"', city: 'Lviv, Ukraine', lat: 49.8397, lng: 24.0297 },
  { supplier: 'АСБІС-Україна', city: 'Kyiv, Ukraine', lat: 50.4650, lng: 30.5100 },
  { supplier: 'Фокстрот. Техніка для дому', city: 'Kyiv, Ukraine', lat: 50.4350, lng: 30.5150 },
  { supplier: 'ТОВ "Технополіс"', city: 'Odesa, Ukraine', lat: 46.4825, lng: 30.7233 },
  {
    supplier: 'Товариство з обмеженою відповідальністю "Технологічна Дистрибуційна Компанія Україна"',
    city: 'Kyiv, Ukraine',
    lat: 50.4200,
    lng: 30.5500,
  },
  {
    supplier: 'Приватне підприємство "Об\'єднана Торгово-Технічна Компанія Схід-Захід"',
    city: 'Zaporizhzhia, Ukraine',
    lat: 47.8388,
    lng: 35.1396,
  },
  {
    supplier: 'Товариство з обмеженою відповідальністю "Міжнародний Постачальник Комп\'ютерної Техніки та Периферії"',
    city: 'Vinnytsia, Ukraine',
    lat: 49.2331,
    lng: 28.4682,
  },
  {
    supplier: 'Приватне акціонерне товариство "Всеукраїнська Гуртова База Побутової Техніки"',
    city: 'Kharkiv, Ukraine',
    lat: 49.9800,
    lng: 36.2500,
  },
];
