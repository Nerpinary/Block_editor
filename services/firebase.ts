import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  getDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Firestore
} from 'firebase/firestore'
import { db } from '../plugins/firebase'

interface Block {
  id: number
  type: string
  content: string | object
  parentId?: string
}

interface Page {
  id: string
  title: string
  slug: string
  blocks: Block[]
  createdAt: number
  updatedAt?: number
}

interface PageInput extends Omit<Page, 'id'> {
  id?: string
}

const COLLECTION_NAME = 'pages'

const getDB = (): Firestore => {
  if (!db) throw new Error('Firebase is not initialized')
  return db
}

const serializeBlock = (block: Block): Block => ({
  ...block,
  content: typeof block.content === 'object' 
    ? JSON.stringify(block.content) 
    : block.content
})

const deserializePage = (
  doc: QueryDocumentSnapshot<DocumentData>
): Page => ({
  id: doc.id,
  ...doc.data()
}) as Page

export const firebaseService = {
  async getPages(): Promise<Page[]> {
    try {
      const database = getDB()
      const pagesRef = collection(database, COLLECTION_NAME)
      const q = query(pagesRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(deserializePage)
    } catch (error) {
      console.error('Error fetching pages:', error)
      throw new Error('Failed to fetch pages')
    }
  },

  async savePage(page: PageInput): Promise<string> {
    try {
      const database = getDB()
      const pageRef = doc(collection(database, COLLECTION_NAME))
      
      const pageData: Page = {
        ...page,
        id: pageRef.id,
        blocks: page.blocks.map(serializeBlock),
        createdAt: Date.now()
      }
      
      await setDoc(pageRef, pageData)
      return pageRef.id
    } catch (error) {
      console.error('Error saving page:', error)
      throw new Error('Failed to save page')
    }
  },

  async updatePage(pageId: string | number, data: Partial<Page>): Promise<string> {
    try {
      const database = getDB()
      const docId = String(pageId)
      console.log('Updating document with ID:', docId)
      
      const pageRef = doc(database, COLLECTION_NAME, docId)
      const docSnap = await getDoc(pageRef)
      
      if (!docSnap.exists()) {
        console.error('Document not found:', docId)
        throw new Error('Document not found')
      }
      
      const updateData = {
        ...data,
        blocks: data.blocks?.map(serializeBlock),
        updatedAt: Date.now()
      }
      
      await updateDoc(pageRef, updateData)
      return docId
    } catch (error) {
      console.error('Error in updatePage:', error)
      throw new Error('Failed to update page')
    }
  },

  async deletePage(pageId: string | number): Promise<void> {
    try {
      const database = getDB()
      const pageRef = doc(database, COLLECTION_NAME, String(pageId))
      await deleteDoc(pageRef)
    } catch (error) {
      console.error('Error deleting page:', error)
      throw new Error('Failed to delete page')
    }
  },

  async getPage(pageId: string | number): Promise<Page | null> {
    try {
      const database = getDB()
      const pageRef = doc(database, COLLECTION_NAME, String(pageId))
      const snapshot = await getDoc(pageRef)
      
      if (snapshot.exists()) {
        return deserializePage(snapshot)
      }
      
      return null
    } catch (error) {
      console.error('Error fetching page:', error)
      throw new Error('Failed to fetch page')
    }
  }
} 