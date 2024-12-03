import { createContext, useContext, useEffect, useState } from "react"

interface Settings {
  localNode: boolean
  endpoint: string
}

type SettingsProviderProps = {
  children: React.ReactNode
  defaultSettings?: Settings
  storageKey?: string
}

type SettingsProviderState = {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

const initialState: SettingsProviderState = {
  settings: {
    localNode: false,
    endpoint: "https://tdvw-test-node.aelf.io",
  },
  setSettings: () => null,
}

const SettingsProviderContext = createContext<SettingsProviderState>(initialState)

export function SettingsProvider({
  children,
  defaultSettings = {
    localNode: false,
    endpoint: "https://tdvw-test-node.aelf.io",
  },
  storageKey = "aelf-playground-settings",
  ...props
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(
    () => (JSON.parse(localStorage.getItem(storageKey) || "{}") as Settings) || defaultSettings
  )

  useEffect(() => {
    let _settings = settings;
    if (_settings.localNode) {
      _settings.endpoint = "http://localhost:8000";
    } else {
      _settings.endpoint = "https://tdvw-test-node.aelf.io";
    }
    localStorage.setItem(storageKey, JSON.stringify(_settings));
  }, [settings])

  const value = {settings, setSettings}

  return (
    <SettingsProviderContext.Provider {...props} value={value}>
      {children}
    </SettingsProviderContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsProviderContext)

  if (context === undefined)
    throw new Error("useSettings must be used within a SettingsProvider")

  return context
}
