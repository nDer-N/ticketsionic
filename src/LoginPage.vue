<template>
  <ion-page class="login-page">
    <ion-content class="login-content">
      <div class="login-wrapper">

        <!-- Card -->
        <div class="login-card">

          <!-- Header -->
          <div class="login-header">
            <div class="logo-circle">
              <ion-icon :icon="trainOutline" class="logo-icon" />
            </div>
            <h1 class="app-title">QR trip</h1>
            <p class="app-subtitle">Inicia tu sesión en QR trip</p>
          </div>

          <!-- Formulario -->
          <div class="form-group">
            <ion-item class="input-item" lines="none">
              <ion-input
                v-model="email"
                type="email"
                placeholder="Email"
                autocomplete="email"
                class="custom-input"
              />
            </ion-item>

            <ion-item class="input-item" lines="none">
              <ion-input
                v-model="password"
                type="password"
                placeholder="Password"
                class="custom-input"
              />
            </ion-item>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="error-msg">
            <ion-icon :icon="alertCircleOutline" />
            <span>{{ errorMsg }}</span>
          </div>

          <!-- Botón -->
          <ion-button
            expand="block"
            class="login-btn"
            :disabled="isLoading"
            @click="handleLogin"
          >
            <ion-spinner v-if="isLoading" name="crescent" />
            <span v-else>Login</span>
          </ion-button>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonItem, IonInput,
  IonButton, IonIcon, IonSpinner
} from '@ionic/vue'
import { trainOutline, alertCircleOutline } from 'ionicons/icons'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const router   = useRouter()
const email    = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Por favor completa todos los campos'
    return
  }
  isLoading.value = true
  errorMsg.value  = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.replace('/tabs/claves')
  } catch (e: any) {
    errorMsg.value = 'Correo o contraseña incorrectos'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  --background: #e8edf2;
}

.login-content {
  --background: #e8edf2;
}

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(90, 110, 140, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo-icon {
  font-size: 40px;
  color: #4a6080;
}

.app-title {
  font-size: 26px;
  font-weight: 700;
  color: #2d3e50;
  margin: 0 0 6px;
}

.app-subtitle {
  font-size: 14px;
  color: #8a9ab0;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.input-item {
  --background: #f4f6f9;
  --border-radius: 10px;
  --padding-start: 14px;
  --padding-end: 14px;
  --inner-padding-end: 0;
  border-radius: 10px;
  border: 1.5px solid #dde3ec;
  --color: #2d3e50;
  --placeholder-color: #aab4c0
  --placeholder-opacity:1;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e05252;
  font-size: 13px;
  margin-bottom: 12px;
}

.login-btn {
  --background: #4a6080;
  --background-activated: #3a5070;
  --border-radius: 10px;
  --box-shadow: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 48px;
  margin-top: 8px;
}
</style>