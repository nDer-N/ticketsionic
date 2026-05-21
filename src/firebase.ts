import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'


const firebaseConfig = {
  apiKey: "AIzaSyDSRGIBU5bVP8Gd-_TYopg2PTp49iuvbM8",
  authDomain: "proyecto-tickets-17d33.firebaseapp.com",
  databaseURL: "https://proyecto-tickets-17d33-default-rtdb.firebaseio.com",
  projectId: "proyecto-tickets-17d33",
  storageBucket: "proyecto-tickets-17d33.firebasestorage.app",
  messagingSenderId: "550549350496",
  appId: "1:550549350496:web:46200ed8b19597ee48fb05"
};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getDatabase(app)