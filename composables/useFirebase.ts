import { getFirestore } from 'firebase/firestore'

export const useFirebase = () => {
  const { $db } = useNuxtApp()
  
  return {
    db: $db
  }
} 