
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

import { db } from '@/firebase'

import {
  ref as dbRef,
  get
} from 'firebase/database'

let map: L.Map | null = null

async function cargarMapa() {

  // Crear mapa centrado en Guadalajara
  map = L.map('map').setView(
    [20.6736, -103.344],
    13

    
  )

  // Capa del mapa
  L.tileLayer(

    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    {
      attribution: '&copy; OpenStreetMap contributors'
    }

  ).addTo(map)

  // Leer claves de Firebase
  const snapshot = await get(

    dbRef(db, 'Key')

  )

  if (!snapshot.exists()) return

  const data = snapshot.val()

  // Agrupar lecturas por coordenadas
  const ubicaciones: Record<string, number> = {}

  Object.values(data).forEach((item: any) => {

    if (

      item.Status === 'used' &&
      item.Latitud &&
      item.Longitud

    ) {

      const key = `${item.Latitud},${item.Longitud}`

      if (!ubicaciones[key]) {

        ubicaciones[key] = 0

      }

      ubicaciones[key]++

    }

  })

  // Crear markers
  Object.entries(ubicaciones).forEach(

    ([coords, total]) => {

      const [lat, lng] = coords
        .split(',')
        .map(Number)

      L.marker([lat, lng])

        .addTo(map)

        .bindPopup(

          `
            <strong>Torniquete</strong>
            <br/>
            Claves leídas: ${total}
          `

        )

    }

  )

}

onIonViewDidEnter(async () => { 
    if (!map) { await cargarMapa() }
    setTimeout(() => { 
        if (map) {
             map.invalidateSize() } 
            }, 300) 
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

