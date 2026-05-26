const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isScheduleId(value?: string): value is string {
  return typeof value === 'string' && uuidPattern.test(value);
}

export function createScheduleId(prefix = 'schedule'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function normalizeScheduleId(value?: string): string {
  if (isScheduleId(value)) {
    return value;
  }

  return createScheduleId();
}