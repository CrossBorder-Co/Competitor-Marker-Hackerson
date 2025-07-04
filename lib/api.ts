import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status)
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// API service functions
export const apiService = {
  // Get company analysis
  getCompanyAnalysis: async (params: {
    company: string
    prompt: string
    startDate?: string
    endDate?: string
  }) => {
    try {
      const response = await api.post("/api/analyze", params)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get competitor data
  getCompetitorData: async (companyName: string) => {
    try {
      const response = await api.get(`/api/competitors/${encodeURIComponent(companyName)}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get market insights
  getMarketInsights: async (params: {
    company: string
    industry?: string
    region?: string
  }) => {
    try {
      const response = await api.post("/api/market-insights", params)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Send chat message
  sendChatMessage: async (params: {
    message: string
    company: string
    context?: any
  }) => {
    try {
      const response = await api.post("/api/chat", params)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default api
