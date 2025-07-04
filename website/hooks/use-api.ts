"use client"

import { useState, useCallback } from "react"
import { apiService } from "@/lib/api"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null })

    try {
      const result = await apiCall()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

// Specific hooks for different API calls
export function useCompanyAnalysis() {
  const { data, loading, error, execute, reset } = useApi<any>()

  const analyzeCompany = useCallback(
    async (params: {
      company: string
      prompt: string
      startDate?: string
      endDate?: string
    }) => {
      return execute(() => apiService.getCompanyAnalysis(params))
    },
    [execute],
  )

  return {
    data,
    loading,
    error,
    analyzeCompany,
    reset,
  }
}

export function useCompetitorData() {
  const { data, loading, error, execute, reset } = useApi<any>()

  const fetchCompetitorData = useCallback(
    async (companyName: string) => {
      return execute(() => apiService.getCompetitorData(companyName))
    },
    [execute],
  )

  return {
    data,
    loading,
    error,
    fetchCompetitorData,
    reset,
  }
}

export function useMarketInsights() {
  const { data, loading, error, execute, reset } = useApi<any>()

  const fetchMarketInsights = useCallback(
    async (params: {
      company: string
      industry?: string
      region?: string
    }) => {
      return execute(() => apiService.getMarketInsights(params))
    },
    [execute],
  )

  return {
    data,
    loading,
    error,
    fetchMarketInsights,
    reset,
  }
}
