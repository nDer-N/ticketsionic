<template>
  <ion-page>

    <ion-header>
      <ion-toolbar class="main-toolbar">
        <ion-title class="toolbar-title">Agregar claves</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div class="form-card">

        <div class="form-icon">
          <ion-icon :icon="addCircleOutline" />
        </div>

        <p class="form-desc">
          Ingresa cuántas claves nuevas deseas agregar a la base de datos.
          Se crearán con status <strong>new</strong>.
        </p>

        <ion-item class="input-item" lines="none">

          <ion-input v-model="cantidad" type="number" inputmode="numeric" placeholder="Ingresa el número de claves"
            class="custom-input" />
          

        </ion-item>

        <ion-button expand="block" class="agregar-btn" :disabled="isLoading" @click="agregarClaves">
          <ion-spinner v-if="isLoading" name="crescent" />
          <template v-else>
            <ion-icon :icon="addOutline" slot="start" />
            Agregar Claves
          </template>
        </ion-button>

      </div>

      <!-- Alert de éxito -->
      <ion-alert :is-open="showSuccess" header="Claves agregadas" message="Claves agregadas con éxito."
        :buttons="[{ text: 'Aceptar', handler: () => showSuccess = false }]" @didDismiss="showSuccess = false" />

      <!-- Alert de error -->
      <ion-alert :is-open="showError" header="Error" :message="errorMsg"
        :buttons="[{ text: 'Aceptar', handler: () => showError = false }]" @didDismiss="showError = false" />

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
  IonAlert
} from '@ionic/vue'

import { addCircleOutline, addOutline } from 'ionicons/icons'

import { ref } from 'vue'

import { db } from '@/firebase'

import {
  ref as dbRef,
  get,
  child,
  set
} from 'firebase/database'

const cantidad = ref('')

const isLoading = ref(false)

const showSuccess = ref(false)

const showError = ref(false)

const errorMsg = ref('')


function generarClave(): string {

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let resultado = 'K-'

  for (let i = 0; i < 8; i++) {

    resultado += chars.charAt(
      Math.floor(Math.random() * chars.length)
    )

  }

  return resultado

}



async function agregarClaves() {

  const n = parseInt(cantidad.value)

  if (isNaN(n) || n < 1) {

    errorMsg.value = 'Ingresa un número válido mayor a 0'
    showError.value = true
    return

  }

  isLoading.value = true

  try {

    const keyRef = dbRef(db, 'Key')

    // Obtener claves actuales
    const snapshot = await get(keyRef)

    let ultimoNumero = 0
 
    if (snapshot.exists()) {

      const data = snapshot.val()

      const claves = Object.keys(data)
        .map(Number)
        .filter(num => !isNaN(num))

      ultimoNumero = Math.max(...claves, 0)

    }

    // Crear nuevas claves consecutivas
    const promesas = []

    for (let i = 1; i <= n; i++) {

      const nuevoID = ultimoNumero + i

      const nuevaClaveRef = child(keyRef, nuevoID.toString())

      promesas.push(

        set(nuevaClaveRef, {

          Latitud: '',
          Longitud: '',
          Status: 'new',
          UID: '',
          Value: generarClave()

        })

      )

    }

    await Promise.all(promesas)

    cantidad.value = ''

    showSuccess.value = true

  } catch (e: any) {

    errorMsg.value = e.message ?? 'Error al agregar claves'

    showError.value = true

  } finally {

    isLoading.value = false

  }

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

.form-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  margin-top: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-icon {
  text-align: center;
  font-size: 52px;
  color: #4a6080;
}

.form-desc {
  text-align: center;
  font-size: 14px;
  color: #6a7f96;
  line-height: 1.5;
  margin: 0;
}

.input-item {
  --background: #f4f6f9;
  --border-radius: 10px;
  --padding-start: 14px;
  --inner-padding-end: 0;
  border-radius: 10px;
  border: 1.5px solid #dde3ec;
}

.agregar-btn {
  --background: #2d3e50;
  --background-activated: #1e2e40;
  --border-radius: 10px;
  --box-shadow: none;
  font-weight: 600;
  height: 48px;
  margin-top: 4px;
}
</style>