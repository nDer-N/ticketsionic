<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom" class="custom-tab-bar">

        <ion-tab-button tab="claves" href="/tabs/claves">
          <ion-icon :icon="keyOutline" />
          <ion-label>Claves</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="usuarios" href="/tabs/usuarios">
          <ion-icon :icon="peopleOutline" />
          <ion-label>Usuarios</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="agregar" href="/tabs/agregar">
          <ion-icon :icon="addCircleOutline" />
          <ion-label>Agregar claves</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="mapa" href="/tabs/mapa">
          <ion-icon :icon="mapOutline" />
          <ion-label>Mapa</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonTabs, IonTabBar, IonTabButton,
  IonIcon, IonLabel, IonRouterOutlet
} from '@ionic/vue'
import { keyOutline, peopleOutline, addCircleOutline, mapOutline } from 'ionicons/icons'
</script>

<style scoped>
.custom-tab-bar {
  --background: #2d3e50;
  --color: rgba(255,255,255,0.5);
  --color-selected: #ffffff;
  border-top: none;
}
</style>