export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
};

export const formatDateTime = (dateString: string) => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPercent = (value: number | null) => {
  if (value === null) return '-';
  return `${value.toFixed(1)} %`;
};

export const getMarkByRank = (rank: number | null): string => {
  if (rank === 1) return '◎';
  if (rank === 2) return '○';
  if (rank === 3) return '▲';
  if (rank === 4) return '△';
  if (rank !== null) return '☆';
  return '-';
};
