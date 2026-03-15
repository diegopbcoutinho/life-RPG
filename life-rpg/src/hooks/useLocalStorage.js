import { useEffect, useState } from 'react'

export const useLocalStorageState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      // Ignore write errors to keep the UI responsive.
    }
  }, [key, state])

  return [state, setState]
}
