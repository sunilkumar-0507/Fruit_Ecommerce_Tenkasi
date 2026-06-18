import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { api, isApiMode } from '#/lib/apiClient'

export interface Feedback {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface ReviewDto {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  createdAtUtc: string
}

interface FeedbackContextValue {
  getForProduct: (productId: string) => Feedback[]
  loadForProduct: (slug: string, productId: string) => Promise<void>
  addFeedback: (productId: string, slug: string, userName: string, rating: number, comment: string) => Promise<void>
  reviewError: string
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

function mapDto(dto: ReviewDto): Feedback {
  return {
    id: dto.id,
    productId: dto.productId,
    userName: dto.userName,
    rating: dto.rating,
    comment: dto.comment,
    date: new Date(dto.createdAtUtc).toISOString().split('T')[0],
  }
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [reviewError, setReviewError] = useState('')

  const loadForProduct = useCallback(async (slug: string, productId: string) => {
    if (!isApiMode()) return
    try {
      const dtos = await api.get<ReviewDto[]>(`/api/Products/${slug}/reviews`)
      setFeedbacks((prev) => [
        ...prev.filter((f) => f.productId !== productId),
        ...dtos.map(mapDto),
      ])
    } catch {
      // silently ignore load errors
    }
  }, [])

  function getForProduct(productId: string) {
    return feedbacks.filter((f) => f.productId === productId)
  }

  async function addFeedback(productId: string, slug: string, userName: string, rating: number, comment: string) {
    setReviewError('')
    if (isApiMode()) {
      try {
        await api.post<ReviewDto>(`/api/Products/${slug}/reviews`, { rating, comment })
        await loadForProduct(slug, productId)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to submit review.'
        setReviewError(msg)
        throw err
      }
      return
    }

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
    <FeedbackContext.Provider value={{ getForProduct, loadForProduct, addFeedback, reviewError }}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider')
  return ctx
}
