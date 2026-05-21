<template>
  <ion-page>

    <ion-header>
      <ion-toolbar class="main-toolbar">
        <ion-title class="toolbar-title">Usuarios</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div v-if="isLoading" class="center-msg">
        <ion-spinner name="crescent" />
        <p>Cargando usuarios...</p>
      </div>

      <ion-list v-else lines="none" class="usuarios-list">
        <ion-item
          v-for="(usuario, uid) in usuarios"
          :key="uid"
          class="usuario-item"
        >
          <div class="avatar" slot="start">
            {{ iniciales(usuario) }}
          </div>
          <div class="usuario-content">
            <span class="usuario-nombre">{{ usuario.nombre }} {{ usuario.apellido }}</span>
            <span class="usuario-carrera">{{ usuario.carrera }}</span>
            <span class="usuario-semestre">Semestre {{ usuario.semestre }}</span>
          </div>    
        </ion-item>

        <div v-if="Object.keys(usuarios).length === 0" class="empty-msg">
          <ion-icon :icon="peopleOutline" class="empty-icon" />
          <p>No hay usuarios registrados</p>
        </div>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonSpinner, IonIcon
} from '@ionic/vue'
import { peopleOutline } from 'ionicons/icons'
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase'
import { ref as dbRef, onValue, off } from 'firebase/database'

const usuarios  = ref<Record<string, any>>({})
const isLoading = ref(true)

const usuariosRef = dbRef(db, 'usuario')


onMounted(() => {

  const unsubscribe = onValue(

    usuariosRef,

    (snapshot) => {

      isLoading.value = false

      const data = snapshot.val()

      console.log('USUARIOS:', data)

      if (!data) {

        usuarios.value = {}
        return

      }

      const limpio = Object.fromEntries(

        Object.entries(data).filter(

          ([_, value]: any) =>

            value &&
            typeof value === 'object' &&
            value.nombre

        )

      )

      usuarios.value = limpio

    },

    (error) => {

      console.error(error)

      isLoading.value = false

    }

  )

  onUnmounted(() => unsubscribe())

})



onUnmounted(() => off(usuariosRef))

function iniciales(u: any): string {
  const n = (u.nombre   ?? '?')[0].toUpperCase()
  const a = (u.apellido ?? '?')[0].toUpperCase()
  return `${n}${a}`
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

.usuarios-list {
  padding: 16px;
}

.usuario-item {
  --background: white;
  --border-radius: 12px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  align-items: center;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #2d3e50;
  color: white;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.usuario-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 0;
}

.usuario-nombre {
  font-size: 16px;
  font-weight: 600;
  color: #2d3e50;
}

.usuario-carrera {
  font-size: 13px;
  color: #6a7f96;
}

.usuario-semestre {
  font-size: 12px;
  color: #aab;
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