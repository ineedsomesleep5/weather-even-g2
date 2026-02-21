/**
 * Headless UI Module
 * React Settings Panel has been removed to prevent collisions 
 * with the EvenHubDemo Launcher DOM.
 */
export function initUI(): void {
  // Headless mode - no DOM manipulation
  console.log('[weather] Running headless, skipping UI injection')
}
