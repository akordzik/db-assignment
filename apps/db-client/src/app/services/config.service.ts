import { Injectable, inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private platformId = inject(PLATFORM_ID)

  get apiBaseUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return `${window.location.protocol}//${window.location.hostname}:3000/api`
    }

    const nodeProcess = (
      globalThis as typeof globalThis & {
        process?: { env?: Record<string, string> }
      }
    ).process
    const envApiUrl = nodeProcess?.env?.['API_URL'] || 'http://localhost:3000'
    return envApiUrl.endsWith('/api') ? envApiUrl : envApiUrl + '/api'
  }
}
