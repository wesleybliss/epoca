'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSettingsStore } from '@/store/settings'

export function ThemeSync() {
    const { theme } = useSettingsStore()
    const { setTheme } = useTheme()

    useEffect(() => {
        setTheme(theme)
    }, [theme, setTheme])

    return null
}
