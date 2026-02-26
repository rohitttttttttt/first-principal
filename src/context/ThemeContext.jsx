import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(() => {
        try {
            const stored = localStorage.getItem('studyyt_theme')
            if (stored) return stored === 'dark'
        } catch { }
        return true // default dark mode
    })

    useEffect(() => {
        localStorage.setItem('studyyt_theme', dark ? 'dark' : 'light')
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    }, [dark])

    const toggleTheme = () => setDark(prev => !prev)

    return (
        <ThemeContext.Provider value={{ dark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
