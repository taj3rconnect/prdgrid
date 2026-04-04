import { downloadDataUrl } from './exportUtils';
import type { ImageExportParams } from '../types';

export async function exportToImage(
  element: HTMLElement,
  params?: ImageExportParams
): Promise<void> {
  const {
    fileName = 'export.png',
    format = 'png',
    quality = 1,
  } = params || {};

  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  downloadDataUrl(canvas.toDataURL(mimeType, quality), fileName);
}
