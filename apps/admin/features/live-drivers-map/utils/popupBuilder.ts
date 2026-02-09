/**
 * popupBuilder — Generates HTML for driver marker popups.
 */

interface DriverInfo {
  firstName: string | null;
  lastName: string | null;
  currentLatitude: number | null;
  currentLongitude: number | null;
  onlineStatus: string;
  phone?: string;
}

interface VehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  license_plate?: string;
  color?: string;
  category?: string;
}

export function buildPopupHTML(
  driver: DriverInfo,
  vehicle: VehicleInfo | undefined,
  statusColor: string,
): string {
  const vehicleText = vehicle
    ? `${vehicle.make || 'N/A'} ${vehicle.model || ''} ${vehicle.year || ''}`
    : 'N/A';

  const plateText = vehicle
    ? `${vehicle.license_plate || 'N/A'} • ${vehicle.color || 'N/A'} • ${vehicle.category?.toUpperCase() || 'N/A'}`
    : 'N/A';

  const phoneBlock = driver.phone
    ? `<div style="border-top:1px solid #e5e7eb;padding-top:12px;">
        <a href="tel:${driver.phone}" style="display:inline-block;background:#22C55E;color:white;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">
          📞 Call Driver
        </a>
      </div>`
    : '';

  return `
    <div style="padding:16px;min-width:280px;font-family:system-ui;">
      <div style="font-weight:bold;font-size:16px;margin-bottom:12px;">
        ${driver.firstName || ''} ${driver.lastName || ''}
      </div>
      <div style="color:${statusColor};font-weight:600;margin-bottom:12px;font-size:14px;">
        ● ${driver.onlineStatus.toUpperCase()}
      </div>
      <div style="border-top:1px solid #e5e7eb;padding-top:12px;margin-bottom:12px;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">📍 COORDINATES</div>
        <div style="font-size:13px;color:#374151;font-weight:500;font-family:monospace;">
          ${driver.currentLatitude?.toFixed(6)}, ${driver.currentLongitude?.toFixed(6)}
        </div>
      </div>
      <div style="border-top:1px solid #e5e7eb;padding-top:12px;margin-bottom:12px;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">🚗 VEHICLE</div>
        <div style="font-size:13px;color:#374151;font-weight:500;">${vehicleText}</div>
        <div style="font-size:12px;color:#6b7280;">${plateText}</div>
      </div>
      ${phoneBlock}
    </div>
  `;
}
