// src/components/MapModal.js

import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const MapModal = ({ show, handleClose, setCoordinates }) => {
  useEffect(() => {
    let map;
    let marker;

    const customIcon = L.divIcon({
      html: '<i class="fas fa-map-marker-alt" style="font-size: 2rem; color: red;"></i>',
      className: 'custom-div-icon',
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    const successLocation = (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      map = L.map('map').setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      marker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(map);
      marker.bindPopup("Your Location").openPopup();

      map.on('click', function (e) {
        marker.setLatLng(e.latlng).update();
        map.setView(e.latlng, map.getZoom());
        setCoordinates(e.latlng.lat, e.latlng.lng);
      });

      marker.on('dragend', function () {
        const latlng = marker.getLatLng();
        setCoordinates(latlng.lat, latlng.lng);
      });
    };

    const errorLocation = () => {
      map = L.map('map').setView([20.154, -10.189], 5); // Centré sur Mauritanie

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      marker = L.marker([20.154, -10.189], { icon: customIcon, draggable: true }).addTo(map);
      marker.bindPopup("Default Location: Mauritania").openPopup();

      map.on('click', function (e) {
        marker.setLatLng(e.latlng).update();
        map.setView(e.latlng, map.getZoom());
        setCoordinates(e.latlng.lat, e.latlng.lng);
      });

      marker.on('dragend', function () {
        const latlng = marker.getLatLng();
        setCoordinates(latlng.lat, latlng.lng);
      });
    };

    if (show) {
      navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [show, setCoordinates]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="map" style={{ height: '400px' }}></div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapModal;
