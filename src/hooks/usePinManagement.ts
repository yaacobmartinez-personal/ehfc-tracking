import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UserPin } from '../types/map';
import { pinService } from '../services/pinService';

export function usePinManagement() {
  const [userPins, setUserPins] = useState<UserPin[]>([]);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const renderedMarkersRef = useRef<Record<string, mapboxgl.Marker>>({});

  // Load pins from Supabase on mount
  useEffect(() => {
    const loadPins = async () => {
      try {
        console.log('Loading pins from Supabase...');
        const pins = await pinService.getAllPins();
        console.log('Loaded pins:', pins);
        setUserPins(pins);
      } catch (error) {
        console.error('Failed to load pins:', error);
      }
    };
    loadPins();
  }, []);

  const addPin = async (lng: number, lat: number, title: string, assignees: string[] = [], targetFamilies: string[] = []) => {
    try {
      const newPin = await pinService.createPin({
        title: title.trim(),
        lng,
        lat,
        assignees,
        targetFamilies,
      });
      setUserPins(prev => [...prev, newPin]);
      setIsAddingPin(false);
    } catch (error) {
      console.error('Failed to add pin:', error);
    }
  };

  const updatePin = async (pinId: string, newTitle: string, assignees: string[] = [], targetFamilies: string[] = []) => {
    try {
      const updatedPin = await pinService.updatePin(pinId, {
        title: newTitle.trim(),
        assignees,
        targetFamilies,
      });
      setUserPins(prev => 
        prev.map(pin => 
          pin.id === pinId ? updatedPin : pin
        )
      );
    } catch (error) {
      console.error('Failed to update pin:', error);
    }
  };

  const deletePin = async (pinId: string) => {
    try {
      await pinService.deletePin(pinId);
      setUserPins(prev => prev.filter(pin => pin.id !== pinId));
    } catch (error) {
      console.error('Failed to delete pin:', error);
    }
  };

  const clearAllPins = async () => {
    try {
      await pinService.deleteAllPins();
      setUserPins([]);
    } catch (error) {
      console.error('Failed to clear all pins:', error);
    }
  };

  const toggleAddPin = () => {
    setIsAddingPin(!isAddingPin);
  };

  return {
    userPins,
    isAddingPin,
    renderedMarkersRef,
    addPin,
    updatePin,
    deletePin,
    clearAllPins,
    toggleAddPin,
  };
}
