import type { EvenAppBridge } from '@evenrealities/even_hub_sdk'
import { appendEventLog } from '../_shared/log'
import { fetchWeather, fetchLocalWeather, getSavedCity } from './api'
import { state, setBridge } from './state'
import { showScreen, showLoading, firstScreen } from './renderer'
import { onEvenHubEvent, setRefreshWeather } from './events'

export async function refreshWeather(): Promise<void> {
  const city = getSavedCity()

  try {
    if (city) {
      state.weather = await fetchWeather(city)
      appendEventLog(`Weather: refreshed for ${city.name}`)
    } else {
      appendEventLog('Weather: no city configured, attempting geolocation...')
      state.weather = await fetchLocalWeather()
      appendEventLog(`Weather: fetched local weather for ${state.weather.city}`)
    }
  } catch (err) {
    console.error('[weather] refreshWeather failed', err)
    appendEventLog(`Weather: refresh failed: ${err instanceof Error ? err.message : String(err)}`)

    // If we failed (e.g. no city AND no GPS), show a placeholder to avoid crashing the UI
    if (!state.weather) {
      appendEventLog('Weather: showing empty state.')
      return
    }
  }

  firstScreen()
  await showScreen()
}

export async function initApp(appBridge: EvenAppBridge): Promise<void> {
  setBridge(appBridge)
  setRefreshWeather(refreshWeather)

  appBridge.onEvenHubEvent((event) => {
    onEvenHubEvent(event)
  })

  await showLoading()
  await refreshWeather()

  setInterval(() => {
    void refreshWeather()
  }, 15 * 60_000)
}
