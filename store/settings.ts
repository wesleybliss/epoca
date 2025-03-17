// store/settingsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define our settings state type
type Theme = 'light' | 'dark' | 'system'
type Language = 'en' | 'es' | 'fr' | 'de'

interface SettingsState {
  theme: Theme
  language: Language
  notificationsEnabled: boolean
  soundEnabled: boolean
  // Actions
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  toggleNotifications: () => void
  toggleSound: () => void
}

// Create the store with persistence
export const useSettingsStore = create<SettingsState>()(
    persist(
        set => ({
            // Initial state
            theme: 'system',
            language: 'en',
            notificationsEnabled: true,
            soundEnabled: true,
            
            // Actions
            setTheme: theme => set({ theme }),
            setLanguage: language => set({ language }),
            toggleNotifications: () =>
                set(state => ({ notificationsEnabled: !state.notificationsEnabled })),
            toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),
        }),
        {
            name: 'settings-storage', // unique name for localStorage
        },
    ),
)

// Helper functions to access/update state outside of React components
export const getSettingsState = () => useSettingsStore.getState()

export const updateTheme = (theme: Theme) => {
    useSettingsStore.getState().setTheme(theme)
}

export const updateLanguage = (language: Language) => {
    useSettingsStore.getState().setLanguage(language)
}

export const toggleNotificationsSetting = () => {
    useSettingsStore.getState().toggleNotifications()
}

export const toggleSoundSetting = () => {
    useSettingsStore.getState().toggleSound()
}

