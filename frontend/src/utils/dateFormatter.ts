export const formatDateNumeric = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day} / ${month}`;
};

export const formatDateFull = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const monthStr = date.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', '');
  const year = date.getFullYear();
  return `${day} / ${monthStr} / ${year}`;
};