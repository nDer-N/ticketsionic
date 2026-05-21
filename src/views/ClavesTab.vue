<template>
  <ion-page>

    <!-- Header -->
    <ion-header>
      <ion-toolbar class="main-toolbar">
        <ion-title class="toolbar-title">Claves</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleLogout" fill="solid" class="logout-btn">
            Salir
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- Loading -->
      <div v-if="isLoading" class="center-msg">
        <ion-spinner name="crescent" color="primary" />
        <p>Cargando claves...</p>
      </div>

      <!-- Lista -->
      <ion-list v-else lines="none" class="claves-list">
        <ion-item v-for="(clave, id) in claves" :key="id" class="clave-item" v.if="clave">
          <div class="clave-content">
            <span class="clave-nombre">{{ id }}</span>
            <span class="clave-status"
              :class="clave?.Status === 'new' ? 'status-libre' : clave?.Status === 'generated' ? 'status-generada' : 'status-ocupada'">
              {{ clave?.Status === 'new' ? 'Clave disponible' : clave?.Status === 'generated' ? 'Clave generada' :
                clave?.Status === 'used' ? 'Clave vencida' : 'Estado desconocido' }} </span>
          </div>
          <div class="clave-dot" :class="clave?.Status === 'new' ? 'dot-libre' : 'dot-ocupada'" />
        </ion-item>

        <div v-if="Object.keys(claves).length === 0" class="empty-msg">
          <ion-icon :icon="keyOutline" class="empty-icon" />
          <p>No hay claves registradas</p>
        </div>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonSpinner, IonButton, IonButtons, IonIcon
} from '@ionic/vue'
import { keyOutline } from 'ionicons/icons'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '@/firebase'
import { ref as dbRef, onValue, off } from 'firebase/database'
import { signOut } from 'firebase/auth'

const router = useRouter()
const claves = ref<Record<string, any>>({})
const isLoading = ref(true)

// Listener en tiempo real
const clavesRef = dbRef(db, 'Key')

onMounted(() => {
  onValue(clavesRef, snapshot => {
    isLoading.value = false
    claves.value = snapshot.val() ?? {}
  })
})

onUnmounted(() => off(clavesRef))

async function handleLogout() {
  await signOut(auth)
  router.replace('/login')
}
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

.logout-btn {
  --background: #4a6080;
  --border-radius: 20px;
  --box-shadow: none;
  font-size: 13px;
  height: 32px;
  margin-right: 8px;
}

.claves-list {
  padding: 16px;
}

.clave-item {
  --background: white;
  --border-radius: 12px;
  --padding-start: 0;
  --inner-padding-end: 0;
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.clave-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.clave-nombre {
  font-size: 16px;
  font-weight: 600;
  color: #2d3e50;
  text-transform: capitalize;
}

.clave-status {
  font-size: 13px;
  font-weight: 500;
}

.status-libre {
  color: #5a9e6f;
}

.status-ocupada {
  color: #c0635a;
}

.clave-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 16px;
}

.dot-libre {
  background: #5a9e6f;
}

.dot-ocupada {
  background: #c0635a;
}

.center-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60%;
  gap: 12px;
  color: #8a9ab0;
}

.empty-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0;
  color: #aab;
  gap: 8px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}
</style>