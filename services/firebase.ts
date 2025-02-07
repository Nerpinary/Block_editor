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
  updatedAt: number
}

interface PageInput extends Omit<Page, 'id' | 'createdAt' | 'updatedAt'> {
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

const deserializeBlock = (block: Block): Block => ({
  ...block,
  content: typeof block.content === 'string' 
    ? JSON.parse(block.content) 
    : block.content
})

const deserializePage = (doc: QueryDocumentSnapshot<DocumentData>): Page => {
  const data = doc.data()
  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    createdAt: Number(data.createdAt),
    updatedAt: data.updatedAt ? Number(data.updatedAt) : Date.now(),
    blocks: data.blocks?.map(deserializeBlock) || []
  }
}

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
      const pageId = page.id ?? crypto.randomUUID()
      const pageRef = doc(database, COLLECTION_NAME, pageId)

      const pageData: Page = {
        id: pageId,
        title: page.title,
        slug: page.slug,
        blocks: page.blocks?.map(serializeBlock) ?? [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      await setDoc(pageRef, pageData)
      return pageId
    } catch (error) {
      console.error('Error saving page:', error)
      throw new Error('Failed to save page')
    }
  },

  async updatePage(pageId: string, data: Partial<Page>): Promise<string> {
    try {
      const database = getDB()
      const pageRef = doc(database, COLLECTION_NAME, pageId)
      const docSnap = await getDoc(pageRef)

      if (!docSnap.exists()) {
        console.error('Document not found:', pageId)
        throw new Error('Document not found')
      }

      const updateData: Partial<Page> = {
        ...data,
        blocks: data.blocks ? data.blocks.map(serializeBlock) : undefined,
        updatedAt: Date.now()
      }

      await updateDoc(pageRef, updateData)
      return pageId
    } catch (error) {
      console.error('Error in updatePage:', error)
      throw new Error('Failed to update page')
    }
  },

  async deletePage(pageId: string): Promise<void> {
    try {
      const database = getDB()
      const pageRef = doc(database, COLLECTION_NAME, pageId)
      await deleteDoc(pageRef)
    } catch (error) {
      console.error('Error deleting page:', error)
      throw new Error('Failed to delete page')
    }
  },

  async getPage(pageId: string): Promise<Page | null> {
    try {
      const database = getDB()
      const pageRef = doc(database, COLLECTION_NAME, pageId)
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