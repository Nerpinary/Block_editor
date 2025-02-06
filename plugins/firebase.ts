import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp | undefined
let db: Firestore | undefined

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  if (process.client) {
    const firebaseConfig = {
      apiKey: config.public.firebase.apiKey,
      authDomain: config.public.firebase.authDomain,
      projectId: config.public.firebase.projectId,
      storageBucket: config.public.firebase.storageBucket,
      messagingSenderId: config.public.firebase.messagingSenderId,
      appId: config.public.firebase.appId,
      measurementId: config.public.firebase.measurementId
    }

    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  }

  return {
    provide: {
      firebase: {
        app,
        db
      }
    }
  }
})

export { app, db } 