import { UserPin } from '../types/map';

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function getPinPopupHtml(pin: UserPin): string {
  const assigneesText = pin.assignees.length > 0 ? pin.assignees.join(', ') : 'None assigned';
  const familiesText = pin.targetFamilies.length > 0 ? pin.targetFamilies.join(', ') : 'No target families';
  
  return `
    <div id="pin-${pin.id}" style="min-width: 220px;">
      <div class="font-medium text-gray-900 mb-2">${escapeHtml(pin.title)}</div>
      <div class="text-xs text-gray-600 mb-2">${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}</div>
      <div class="text-xs text-gray-700 mb-2">
        <span class="font-medium">Assignees:</span> ${escapeHtml(assigneesText)}
      </div>
      <div class="text-xs text-gray-700 mb-3">
        <span class="font-medium">Target Families:</span> ${escapeHtml(familiesText)}
      </div>
      <div class="flex gap-2">
        <button id="rename-${pin.id}" class="px-2 py-1 text-xs bg-blue-600 text-white rounded">Edit</button>
        <button id="delete-${pin.id}" class="px-2 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
  `;
}

export function generatePinId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadPinsFromStorage(): UserPin[] {
  try {
    const saved = localStorage.getItem('userPins');
    if (saved) {
      const parsed: UserPin[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return [];
}

export function savePinsToStorage(pins: UserPin[]): void {
  try {
    localStorage.setItem('userPins', JSON.stringify(pins));
  } catch {
    // ignore storage errors
  }
}
