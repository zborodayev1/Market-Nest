import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import React, { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

interface AddressPickerProps {
  address: string
  setAddress: (address: string) => void
  coordinates: [number, number]
  setCoordinates: (coords: [number, number]) => void
}

export const AddressPicker: React.FC<AddressPickerProps> = ({
  address,
  setAddress,
  coordinates,
  setCoordinates,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const inputClasses =
    ' px-5 py-2 w-[300px] h-[50px] bg-[#fff] border border-[#212121]  rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] focus:border-transparent transition-all duration-200 '
  const labelClasses =
    'flex items-center gap-2 text-sm font-medium text-[#212121] mb-1'
  const customIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    []
  )

  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.invalidateSize()
    }, 300)
  }, [])

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng
        setCoordinates([lat, lng])

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        if (!response.ok) {
          console.error('Error fetching address:', response.status)
          return
        }

        const data = await response.json()

        if (data.display_name) {
          setAddress(data.display_name)
        }
      },
    })
    return null
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Coordinates', latitude, longitude)
          setCoordinates([latitude, longitude])
        },
        (error) => {
          console.error('Error:', error.message)
        }
      )
    } else {
      console.error('Геолокация не поддерживается')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex justify-center items-center flex-col gap-3">
      <div className="">
        <div>
          <label className={labelClasses}>
            <MapPin size={18} /> Address
          </label>
          <input
            readOnly
            value={address}
            placeholder="Address"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden border border-gray-300 shadow-lg">
        <MapContainer
          center={coordinates}
          zoomControl={false}
          zoom={12}
          className="w-full h-full rounded-full"
          ref={mapRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coordinates} icon={customIcon} />
          <MapClickHandler />
        </MapContainer>
      </div>
    </div>
  )
}

export default AddressPicker
