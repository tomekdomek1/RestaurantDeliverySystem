export const ORDER_STATUSES = [
  { value: 0, backendName: 'WaitingForConfirmation', label: 'Oczekuje na akceptację', color: 'warning' as const },
  { value: 1, backendName: 'Confirmed', label: 'Zaakceptowane', color: 'info' as const },
  { value: 2, backendName: 'IsBeingPrepared', label: 'W przygotowaniu', color: 'primary' as const },
  { value: 3, backendName: 'InDelivery', label: 'W drodze', color: 'primary' as const },
  { value: 4, backendName: 'Delivered', label: 'Dostarczone', color: 'success' as const }
];

export const getStatusLabel = (status: number | string): string => {
  const found = ORDER_STATUSES.find(s => s.value === status || s.backendName.toLowerCase() === String(status).toLowerCase());
  return found ? found.label : 'Nieznany status';
};

export const getStatusColor = (status: number | string) => {
  const found = ORDER_STATUSES.find(s => s.value === status || s.backendName.toLowerCase() === String(status).toLowerCase());
  return found ? found.color : 'default';
};

export const getActiveStepIndex = (status: number | string): number => {
  const index = ORDER_STATUSES.findIndex(s => s.value === status || s.backendName.toLowerCase() === String(status).toLowerCase());
  return index !== -1 ? index : 0;
};