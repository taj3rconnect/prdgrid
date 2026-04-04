import type { ScheduleExportParams } from '../types';

export async function scheduleExport(
  params: ScheduleExportParams
): Promise<void> {
  const { endpoint, ...scheduleConfig } = params;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'schedule',
      ...scheduleConfig,
    }),
  });

  if (!response.ok) {
    throw new Error(`Schedule export failed: ${response.statusText}`);
  }
}
