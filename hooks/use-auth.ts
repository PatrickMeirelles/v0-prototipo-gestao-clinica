"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AuthUser } from "@/lib/auth"

interface LoginPayload {
  email: string
  password: string
}

interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  refreshUser: () => Promise<void>
  error: string | null
}

interface ApiResponse {
  user?: AuthUser
  message?: string
  success?: boolean
}

async function parseJsonResponse(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as ApiResponse

  if (!response.ok) {
    throw new Error(payload.message ?? "Falha na requisição.")
  }

  return payload
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = useCallback(async () => {
    const response = await fetch("/api/users/me", { cache: "no-store" })
    if (response.ok) {
      const payload = await parseJsonResponse(response)
      setUser(payload.user ?? null)
      return
    }

    if (response.status === 401 || response.status === 403) {
      const refreshResponse = await fetch("/api/auth/refresh", { method: "POST" })
      if (refreshResponse.ok) {
        const retryResponse = await fetch("/api/users/me", { cache: "no-store" })
        const retryPayload = await parseJsonResponse(retryResponse)
        setUser(retryPayload.user ?? null)
        return
      }
    }

    await parseJsonResponse(response)
  }, [])

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      setIsLoading(true)
      try {
        await refreshUser()
      } catch {
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    bootstrap()
    return () => {
      active = false
    }
  }, [refreshUser])

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    setError(null)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const payload = await parseJsonResponse(response)
      setUser(payload.user ?? null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha ao autenticar."
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }, [])

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false
      if (user.isMaster || user.permissions.includes("*")) return true
      return (
        user.permissions.includes(permission) ||
        user.permissions.includes(`${permission}:*`) ||
        user.permissions.includes(`${permission}:view`)
      )
    },
    [user],
  )

  return useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasPermission,
      refreshUser,
      error,
    }),
    [error, hasPermission, isLoading, login, logout, refreshUser, user],
  )
}
