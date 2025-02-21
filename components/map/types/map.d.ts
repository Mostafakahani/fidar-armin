// types/leaflet.d.ts
import * as L from "leaflet";

declare module "leaflet" {
  // Add missing type for LatLngExpression if needed
  export type LatLngExpression =
    | L.LatLng
    | [number, number]
    | [number, number, number]
    | { lat: number; lng: number };

  // Extend DivIcon types
  export interface DivIconOptions {
    html?: string;
    iconSize?: L.PointExpression;
    iconAnchor?: L.PointExpression;
  }

  // Add prop types for react-leaflet components
  namespace ReactLeaflet {
    interface MapContainerProps {
      center: L.LatLngExpression;
      zoom: number;
      zoomControl?: boolean;
      attributionControl?: boolean;
      children?: React.ReactNode;
      className?: string;
    }

    interface TileLayerProps {
      url: string;
      attribution: string;
    }

    interface MarkerProps {
      position: L.LatLngExpression;
      icon?: L.Icon | L.DivIcon;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eventHandlers?: any;
    }
  }
}
