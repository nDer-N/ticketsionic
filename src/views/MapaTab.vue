
<template>

  <ion-page>

    <ion-header>

      <ion-toolbar class="main-toolbar">

        <ion-title class="toolbar-title">
          Mapa de Torniquetes
        </ion-title>

      </ion-toolbar>

    </ion-header>

    <ion-content>

      <div id="map"></div>

    </ion-content>

  </ion-page>

</template>

<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/vue'


import { onIonViewDidEnter } from '@ionic/vue'
import L from 'leaflet'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
})
import { Chart, registerables } from 'chart.js'
import { db } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'

Chart.register(...registerables)

let map: L.Map | null = null

// Guardamos los datos por coordenada para usarlos en el evento
const datosUbicacion: Record<string, { total: number, historico: number[] }> = {}

async function cargarMapa() {
  map = L.map('map').setView([20.6736, -103.344], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  const snapshot = await get(dbRef(db, 'Key'))
  if (!snapshot.exists()) return

  const data = snapshot.val()
  const ubicaciones: Record<string, number[]> = {}

  Object.values(data).forEach((item: any) => {
    if (item.Status === 'used' && item.Latitud && item.Longitud) {
      const key = `${item.Latitud},${item.Longitud}`
      if (!ubicaciones[key]) ubicaciones[key] = []
      // Ejemplo: agrupa por hora si tienes timestamp, aquí usamos conteo simple
      ubicaciones[key].push(1)
    }
  })

  Object.entries(ubicaciones).forEach(([coords, lecturas]) => {
    const [lat, lng] = coords.split(',').map(Number)
    const total = lecturas.length

    // ID único por marcador para encontrar el canvas después
    const canvasId = `chart-${lat.toString().replace('.', '')}-${lng.toString().replace('.', '')}`

    const popupContent = `
      <div style="width:220px">
        <strong>Torniquete</strong><br/>
        Claves leídas: <b>${total}</b>
        <canvas id="${canvasId}" width="200" height="120"></canvas>
      </div>
    `

    const marker = L.marker([lat, lng]).addTo(map!)
    marker.bindPopup(popupContent)

    // 🔑 Aquí está el truco: renderizar el chart DESPUÉS de que el popup abre
    marker.on('popupopen', () => {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement
      if (!canvas) return

      // Evitar duplicar charts si el popup se abre varias veces
      if ((canvas as any)._chartInstance) {
        (canvas as any)._chartInstance.destroy()
      }

      const chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: lecturas.map((_, i) => `L${i + 1}`),
          datasets: [{
            label: 'Lecturas',
            data: lecturas,
            backgroundColor: '#3b82f6'
          }]
        },
        options: {
          responsive: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      })

      ;(canvas as any)._chartInstance = chart
    })
  })
}

onIonViewDidEnter(async () => {
  if (!map) await cargarMapa()
  setTimeout(() => { map?.invalidateSize() }, 300)
})

</script>

<style scoped>


.main-toolbar {
  --background: #2d3e50;
  --color: white;
}

.toolbar-title {
  font-weight: 700;
  font-size: 18px;
}

ion-content {
  --padding-top: 0;
  --padding-bottom: 0;
}


#map {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}





ion-content {
  --padding-top: 0;
  --padding-bottom: 0;
}

</style>

