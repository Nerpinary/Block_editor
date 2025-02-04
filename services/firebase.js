import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore'
import { db } from '@/plugins/firebase'

export const firebaseService = {
  async getPages() {
    const pagesRef = collection(db, 'pages')
    const q = query(pagesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  async savePage(page) {
    const pageRef = doc(collection(db, 'pages'))
    
    const pageData = {
      ...page,
      id: pageRef.id,
      blocks: page.blocks.map(block => ({
        ...block,
        content: typeof block.content === 'object' 
          ? JSON.stringify(block.content) 
          : block.content
      }))
    }
    
    await setDoc(pageRef, pageData)
    return pageRef.id
  },

  async updatePage(pageId, data) {
    try {
      // Убедимся, что pageId - это строка
      const docId = String(pageId)
      console.log('Updating document with ID:', docId)
      
      const pageRef = doc(db, 'pages', docId)
      const docSnap = await getDoc(pageRef)
      
      if (!docSnap.exists()) {
        console.error('Document not found:', docId)
        throw new Error('Document not found')
      }
      
      const updateData = {
        ...data,
        blocks: data.blocks.map(block => ({
          ...block,
          content: typeof block.content === 'object' 
            ? JSON.stringify(block.content)
            : block.content
        }))
      }
      
      await updateDoc(pageRef, updateData)
      return docId
    } catch (error) {
      console.error('Error in updatePage:', error)
      throw error
    }
  },

  async deletePage(pageId) {
    const pageRef = doc(db, 'pages', String(pageId))
    await deleteDoc(pageRef)
  },

  async getPage(pageId) {
    const pageRef = doc(db, 'pages', String(pageId))
    const snapshot = await getDoc(pageRef)
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      }
    }
    return null
  }
} 