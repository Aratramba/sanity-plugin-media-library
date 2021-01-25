export function formatSize(size: number) {
  const kb = Math.round(size / 1000);
  const mb = kb > 1000 ? size / 1000000 : null;
  const roundedMb = mb ? Math.round(mb * 100) / 100 : null;
  return roundedMb ? `${roundedMb} mb` : `${kb} kb`;
}

export function formatDate(date: string) {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
