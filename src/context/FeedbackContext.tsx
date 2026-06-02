import { createContext, useContext, useState, type ReactNode } from 'react'

export interface Feedback {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface FeedbackContextValue {
  getForProduct: (productId: string) => Feedback[]
  addFeedback: (productId: string, userName: string, rating: number, comment: string) => void
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

const SAMPLE: Feedback[] = [
  { id: 'f1', productId: '1', userName: 'Priya M.', rating: 5, comment: 'Absolutely the best mangoes I have tasted! Sweet, juicy, no carbide. Reminds me of my grandmother\'s garden.', date: '2026-05-18' },
  { id: 'f2', productId: '1', userName: 'Ravi K.', rating: 5, comment: 'Ordered 3 kg for the family. All fruits were perfectly ripe and packed well. Will order again.', date: '2026-05-14' },
  { id: 'f3', productId: '2', userName: 'Anjali D.', rating: 4, comment: 'Fresh and delicious! The rambutans were very sweet. Slight delay in delivery but quality was top notch.', date: '2026-05-20' },
  { id: 'f4', productId: '3', userName: 'Suresh P.', rating: 5, comment: 'Extremely fresh pomegranates with deep red colour. Rich in taste. Perfect for juicing every morning.', date: '2026-05-19' },
]

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(SAMPLE)

  function getForProduct(productId: string) {
    return feedbacks.filter((f) => f.productId === productId)
  }

  function addFeedback(productId: string, userName: string, rating: number, comment: string) {
    const entry: Feedback = {
      id: `f${Date.now()}`,
      productId,
      userName: userName.trim() || 'Anonymous',
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
    }
    setFeedbacks((prev) => [entry, ...prev])
  }

  return (
    <FeedbackContext.Provider value={{ getForProduct, addFeedback }}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider')
  return ctx
}
