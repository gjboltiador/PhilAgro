"use client"

import { useEffect, useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'

// Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        MapTypeId: any
        Marker: any
        InfoWindow: any
        Size: any
        Point: any
      }
    }
  }
}

interface CustomMapProps {
  center: { lat: number; lng: number }
  zoom: number
  markers: Array<{
    id: string
    position: { lat: number; lng: number }
    icon: string
    status: string
    tooltip: {
      title: string
      details: string[]
    }
  }>
  mapType: 'satellite' | 'hybrid' | 'roadmap'
  className?: string
}

export function CustomMap({ center, zoom: initialZoom, markers, mapType, className = "" }: CustomMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const [zoom, setZoom] = useState(initialZoom)

  useEffect(() => {
    // Try to load Google Maps API
    const loadGoogleMaps = async () => {
      try {
        // Check if already loaded
        if (window.google?.maps) {
          setIsLoaded(true)
          return
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
        if (existingScript) {
          // Wait for it to load
          await new Promise(resolve => {
            const checkLoaded = () => {
              if (window.google?.maps) {
                resolve(true)
              } else {
                setTimeout(checkLoaded, 100)
              }
            }
            checkLoaded()
          })
          setIsLoaded(true)
          return
        }

        // Get API key from environment variable or use a placeholder
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'
        
        // If no API key is configured, use fallback immediately
        if (apiKey === 'YOUR_API_KEY_HERE') {
          console.warn('Google Maps API key not configured. Using fallback map.')
          setUseFallback(true)
          return
        }

        // Load the script
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
        script.async = true
        script.defer = true
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout loading Google Maps'))
          }, 5000)

          script.onload = () => {
            clearTimeout(timeout)
            resolve(true)
          }
          
          script.onerror = () => {
            clearTimeout(timeout)
            reject(new Error('Failed to load Google Maps'))
          }

          document.head.appendChild(script)
        })

        setIsLoaded(true)
      } catch (error) {
        console.warn('Google Maps failed to load, using fallback:', error)
        setUseFallback(true)
      }
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps || useFallback) return

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: mapType === 'satellite' ? window.google.maps.MapTypeId.SATELLITE : 
                    mapType === 'hybrid' ? window.google.maps.MapTypeId.HYBRID : 
                    window.google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: false, // We'll add custom zoom controls
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'administrative',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'landscape',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'water',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      setMap(mapInstance)
    } catch (error) {
      console.warn('Failed to initialize Google Maps, using fallback:', error)
      setUseFallback(true)
    }
  }, [isLoaded, center, zoom, mapType, useFallback])

  useEffect(() => {
    if (!map || !window.google?.maps || useFallback) return

    try {
      // Clear existing markers
      map.setZoom(zoom)
      map.setCenter(center)

      // Add new markers
      markers.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="${markerData.icon === 'truck' ? '#f97316' : '#22c55e'}" stroke="white" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-family="Arial">${markerData.icon === 'truck' ? '🚛' : '🚜'}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16)
          },
          title: markerData.tooltip.title
        })

        // Add status indicator
        const statusColor = 
          markerData.status === 'moving' || markerData.status === 'working' ? '#22c55e' :
          markerData.status === 'stopped' ? '#eab308' :
          markerData.status === 'loading' ? '#3b82f6' :
          '#ef4444'

        const statusMarker = new window.google.maps.Marker({
          position: {
            lat: markerData.position.lat + 0.001,
            lng: markerData.position.lng + 0.001
          },
          map,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="5" fill="${statusColor}" stroke="white" stroke-width="1"/>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(12, 12),
            anchor: new window.google.maps.Point(6, 6)
          }
        })

        // Add tooltip
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${markerData.tooltip.title}</div>
              ${markerData.tooltip.details.map(detail => `<div style="font-size: 12px; color: #666; margin-bottom: 2px;">${detail}</div>`).join('')}
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })
      })
    } catch (error) {
      console.warn('Failed to add markers, using fallback:', error)
      setUseFallback(true)
    }
  }, [map, markers, useFallback])

  const handleZoomIn = () => {
    if (map && !useFallback) {
      const newZoom = Math.min(map.getZoom() + 1, 20)
      map.setZoom(newZoom)
      setZoom(newZoom)
    } else {
      setZoom(prev => Math.min(prev + 1, 20))
    }
  }

  const handleZoomOut = () => {
    if (map && !useFallback) {
      const newZoom = Math.max(map.getZoom() - 1, 8)
      map.setZoom(newZoom)
      setZoom(newZoom)
    } else {
      setZoom(prev => Math.max(prev - 1, 8))
    }
  }

  // Use fallback if Google Maps fails or is not available
  if (useFallback) {
    return (
      <div className={`${className} relative bg-gradient-to-br from-blue-50 to-green-50 border-2 border-gray-200 rounded-lg overflow-hidden`}>
        {/* Fallback Map Content */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-30"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Markers */}
        {markers.map((marker) => {
          const x = 50 + (marker.position.lng - center.lng) * 1000 * (2 / zoom)
          const y = 50 + (center.lat - marker.position.lat) * 1000 * (2 / zoom)
          
          return (
            <div key={marker.id} className="absolute">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: marker.icon === 'truck' ? '#f97316' : '#22c55e'
                }}
              >
                <span className="text-white text-sm">
                  {marker.icon === 'truck' ? '🚛' : '🚜'}
                </span>
              </div>
            </div>
          )
        })}

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200">
          <div className="flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded border border-gray-200 transition-colors"
              title="Zoom In"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded border border-gray-200 transition-colors"
              title="Zoom Out"
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Zoom Level Display */}
        <div className="absolute top-4 right-16 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
          <div className="text-xs text-gray-600">
            Zoom: {zoom}x
          </div>
        </div>

        {/* Fallback Notice */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-1 shadow-sm">
          <div className="text-xs text-yellow-800">
            ⚠️ Using fallback map view
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Custom Zoom Controls */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200 z-10">
        <div className="flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded border border-gray-200 transition-colors"
            title="Zoom In"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded border border-gray-200 transition-colors"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Zoom Level Display */}
      <div className="absolute top-4 right-16 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 z-10">
        <div className="text-xs text-gray-600">
          Zoom: {zoom}x
        </div>
      </div>
    </div>
  )
} 