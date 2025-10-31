import { useState, useEffect } from 'react';
import type { Coordinates } from '../../types';

interface GeolocationState {
    coordinates: Coordinates | null;
    isLoading: boolean;
    error: string | null;
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        coordinates: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({
                coordinates: null,
                isLoading: false,
                error: 'Geolocation is not supported by your browser',
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    coordinates: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    isLoading: false,
                    error: null,
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }

                setState({
                    coordinates: null,
                    isLoading: false,
                    error: errorMessage,
                });
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000, // Cache for 5 minutes
            }
        );
    }, []);

    return state;
}
