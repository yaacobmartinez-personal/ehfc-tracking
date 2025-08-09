'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Barangay, UserPin } from '../types/map';
import { getPinPopupHtml } from '../utils/pinUtils';
import { usePinManagement } from '../hooks/usePinManagement';
import FloatingActionButton from './FloatingActionButton';
import BarangayInfo from './BarangayInfo';
import AddPinDialog from './AddPinDialog';


export default function MalolosMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [pendingCoordinates, setPendingCoordinates] = useState<{ lng: number; lat: number } | null>(null);
  const [editingPin, setEditingPin] = useState<UserPin | null>(null);
  
  // Pin management hook
  const {
    userPins,
    isAddingPin,
    renderedMarkersRef,
    addPin,
    updatePin,
    deletePin,
    toggleAddPin,
  } = usePinManagement();
  
  // Long-press helpers
  const pressTimerRef = useRef<number | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const startLngLatRef = useRef<{ lng: number; lat: number } | null>(null);
  const longPressFiredRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [120.8114, 14.8433],
      zoom: 11,
      maxBounds: [
        [120.75, 14.75], // Southwest bounds
        [120.90, 14.90]  // Northeast bounds
      ],
      maxZoom: 18,
      minZoom: 11
    });

    map.current.on('load', async () => {
      if (!map.current) return;
      
      // Search bar removed - no geocoding functionality

      try {

        // Fetch GeoJSON data from public folder
        const response = await fetch('/malolos.geojson');
        const geojsonData = await response.json();
        
        map.current.addSource('malolos-barangays', {
          type: 'geojson',
          data: geojsonData
        });

        // GeoJSON loaded

        // Fill layer for barangays
        map.current.addLayer({
          id: "barangays-fill",
          type: "fill",
          source: "malolos-barangays",
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#ff6b6b", // Color when hovered
              "#4ecdc4"  // Default color
            ],
            "fill-opacity": 0.6,
          },
        });

        // Outline layer for barangays
        map.current.addLayer({
          id: "barangays-outline",
          type: "line",
          source: "malolos-barangays",
          paint: {
            "line-color": "#2c3e50",
            "line-width": 2,
          },
        });

        // Add labels for barangay names
      map.current.addLayer({
          id: "barangays-labels",
          type: "symbol",
          source: "malolos-barangays",
          layout: {
            "text-field": ["get", "adm4_en"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-anchor": "center"
          },
        paint: {
            "text-color": "#2c3e50",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1
          }
        });

        // Barangay clicks are disabled - no action taken

        // Change cursor on hover
        map.current.on('mouseenter', 'barangays-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer';
          }
        });

        map.current.on('mouseleave', 'barangays-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';
          }
        });

        // Hover effect
        let hoveredStateId: string | number | null = null;

        map.current.on('mousemove', 'barangays-fill', (e) => {
          if (e.features && e.features.length > 0) {
            if (hoveredStateId !== null) {
              map.current?.setFeatureState(
                { source: 'malolos-barangays', id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = e.features[0].id ?? null;
            if (hoveredStateId !== null) {
              map.current?.setFeatureState(
                { source: 'malolos-barangays', id: hoveredStateId },
                { hover: true }
              );
            }
          }
        });

        map.current.on('mouseleave', 'barangays-fill', () => {
          if (hoveredStateId !== null) {
            map.current?.setFeatureState(
              { source: 'malolos-barangays', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = null;
        });

      } catch (error) {
        console.error('Error loading GeoJSON data:', error);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isClient]);



  const attachPopupHandlers = useCallback((pinId: string): void => {
    const renameBtn = document.getElementById(`rename-${pinId}`);
    const deleteBtn = document.getElementById(`delete-${pinId}`);
    if (renameBtn) {
      renameBtn.onclick = () => {
        const current = userPins.find((p) => p.id === pinId);
        if (!current) return;
        
        // Open dialog in edit mode
        setEditingPin(current);
        setShowAddDialog(true);
      };
    }
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        deletePin(pinId);
      };
    }
  }, [userPins, deletePin]);

  // Render and sync markers with state
  useEffect(() => {
    if (!map.current) return;

    const markers = renderedMarkersRef.current;
    const stateIds = new Set(userPins.map((p) => p.id));

    // Remove markers that no longer exist
    Object.keys(markers).forEach((id) => {
      if (!stateIds.has(id)) {
        markers[id].remove();
        delete markers[id];
      }
    });

    // Add/update markers from state
    userPins.forEach((pin) => {
      const existing = markers[pin.id];
      if (!existing) {
        const popupHtml = getPinPopupHtml(pin);
        const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(popupHtml);
        const marker = new mapboxgl.Marker({ color: '#2563eb' })
          .setLngLat([pin.lng, pin.lat])
          .setPopup(popup)
          .addTo(map.current as mapboxgl.Map);

        const popupInstance = marker.getPopup();
        if (popupInstance) {
          popupInstance.on('open', () => attachPopupHandlers(pin.id));
        }
        markers[pin.id] = marker;
      } else {
        // Update popup content if title changed
        const currentPopup = existing.getPopup();
        if (currentPopup) {
          currentPopup.setHTML(getPinPopupHtml(pin));
          // Rebind handlers on next open
          currentPopup.on('open', () => attachPopupHandlers(pin.id));
        }
        existing.setLngLat([pin.lng, pin.lat]);
      }
    });

    // Update pin labels GeoJSON source
    const pinLabelsData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: userPins.map(pin => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [pin.lng, pin.lat]
        },
        properties: {
          id: pin.id,
          title: pin.title
        }
      }))
    };

    // Add or update pin labels source
    const existingSource = map.current.getSource('pin-labels');
    if (existingSource) {
      (existingSource as mapboxgl.GeoJSONSource).setData(pinLabelsData);
    } else {
      map.current.addSource('pin-labels', {
        type: 'geojson',
        data: pinLabelsData
      });

      // Add pin labels layer
      map.current.addLayer({
        id: 'pin-labels',
        type: 'symbol',
        source: 'pin-labels',
        layout: {
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-anchor': 'top',
          'text-offset': [0, 1.5],
          'text-allow-overlap': false,
          'text-ignore-placement': false
        },
        paint: {
          'text-color': '#1e40af',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
          'text-halo-blur': 1
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPins, attachPopupHandlers]); // renderedMarkersRef is a ref and stable, no need to include in deps

  // Handle map click to add pin when in add mode
  useEffect(() => {
    if (!map.current) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!isAddingPin) return;
      const { lng, lat } = e.lngLat;
      setPendingCoordinates({ lng, lat });
      setShowAddDialog(true);
      (map.current as mapboxgl.Map).getCanvas().style.cursor = '';
    };

    (map.current as mapboxgl.Map).on('click', handleClick);
    // Long-press support (800ms) for touch and mouse
    const thresholdMs = 800;

    const beginPress = (e: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent) => {
      if (pressTimerRef.current) {
        window.clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      longPressFiredRef.current = false;
      const p = 'point' in e ? e.point : (e as mapboxgl.MapTouchEvent).points?.[0] || undefined;
      startPointRef.current = p ? { x: p.x, y: p.y } : null;
      startLngLatRef.current = e.lngLat ? { lng: e.lngLat.lng, lat: e.lngLat.lat } : null;
      pressTimerRef.current = window.setTimeout(() => {
        longPressFiredRef.current = true;
        if (!isAddingPin) return;
        if (!startLngLatRef.current) return;
        const { lng, lat } = startLngLatRef.current;
        setPendingCoordinates({ lng, lat });
        setShowAddDialog(true);
      }, thresholdMs);
    };

    const endPress = () => {
      if (pressTimerRef.current) {
        window.clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    };

    const moveCancel = (e: mapboxgl.MapMouseEvent | mapboxgl.MapTouchEvent) => {
      if (!startPointRef.current) return;
      const p = 'point' in e ? e.point : (e as mapboxgl.MapTouchEvent).points?.[0] || undefined;
      if (!p) return;
      const dx = Math.abs(p.x - startPointRef.current.x);
      const dy = Math.abs(p.y - startPointRef.current.y);
      if (dx > 5 || dy > 5) {
        endPress();
      }
    };

    const m = map.current as mapboxgl.Map;
    m.on('mousedown', beginPress);
    m.on('mouseup', endPress);
    m.on('mousemove', moveCancel);
    m.on('touchstart', beginPress);
    m.on('touchend', endPress);
    m.on('touchmove', moveCancel);

    return () => {
      (map.current as mapboxgl.Map).off('click', handleClick);
      const mm = map.current as mapboxgl.Map;
      if (mm) {
        mm.off('mousedown', beginPress);
        mm.off('mouseup', endPress);
        mm.off('mousemove', moveCancel);
        mm.off('touchstart', beginPress);
        mm.off('touchend', endPress);
        mm.off('touchmove', moveCancel);
      }
    };
  }, [isAddingPin, addPin]);

  const handleAddPinSubmit = async (data: { title: string; assignees: string[]; targetFamilies: string[] }) => {
    if (editingPin) {
      // Update existing pin
      await updatePin(editingPin.id, data.title, data.assignees, data.targetFamilies);
      setShowAddDialog(false);
      setEditingPin(null);
    } else if (pendingCoordinates) {
      // Add new pin
      await addPin(pendingCoordinates.lng, pendingCoordinates.lat, data.title, data.assignees, data.targetFamilies);
      setShowAddDialog(false);
      setPendingCoordinates(null);
    }
  };

  const handleAddPinCancel = () => {
    setShowAddDialog(false);
    setPendingCoordinates(null);
    setEditingPin(null);
  };



  // Removed legacy barangay text search handlers (now using Mapbox Geocoder)

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Malolos Barangays Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <div className="p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Malolos, Bulacan Barangays Map</h1>
        <p className="text-sm">Interactive map with pin management</p>
      </div>
      
      <FloatingActionButton
        isActive={isAddingPin}
        onClick={toggleAddPin}
        title={isAddingPin ? 'Adding Pin… tap map' : 'Add Pin'}
        ariaLabel="Add pin"
      />

      
      <div ref={mapContainer} className="w-full h-full" style={{ height: 'calc(100vh - 80px)' }} />
      
      <BarangayInfo 
        barangay={selectedBarangay} 
        onClose={() => setSelectedBarangay(null)} 
      />
      
      <AddPinDialog
        isOpen={showAddDialog}
        onClose={handleAddPinCancel}
        onSubmit={handleAddPinSubmit}
        editMode={!!editingPin}
        initialData={editingPin ? {
          title: editingPin.title,
          assignees: editingPin.assignees,
          targetFamilies: editingPin.targetFamilies,
        } : undefined}
      />
    </div>
  );
}
