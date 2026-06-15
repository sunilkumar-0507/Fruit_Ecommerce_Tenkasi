import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PRODUCTS, type Product } from '#/data/products'
import { useCart } from '#/context/CartContext'
import { useFav } from '#/context/FavContext'
import { useFeedback } from '#/context/FeedbackContext'
import { isApiMode, api, type ProductDto } from '#/lib/apiClient'
import TiIcon from '#/components/TiIcon'

export const Route = createFileRoute('/product/$productId')({ component: ProductDetailPage })

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 1) {
    return (
      <div className="rounded-2xl overflow-hidden bg-[#f5f0e8] aspect-square max-w-sm mx-auto shadow-lg">
        <img src={images[0]} alt={name} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden bg-[#f5f0e8] aspect-square max-w-sm mx-auto shadow-lg">
        <img src={images[active]} alt={name} className="w-full h-full object-cover transition-all duration-300" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-[#3d7a20] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none transition-transform hover:scale-110"
          aria-label={`${s} stars`}
        >
          <span className={s <= (hovered || value) ? 'text-amber-400' : 'text-gray-200'}>★</span>
        </button>
      ))}
    </div>
  )
}

function FeedbackSection({ productId, slug }: { productId: string; slug: string }) {
  const { getForProduct, loadForProduct, addFeedback, reviewError } = useFeedback()
  const reviews = getForProduct(productId)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { void loadForProduct(slug, productId) }, [slug, productId, loadForProduct])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      await addFeedback(productId, slug, name, rating, comment)
      setName('')
      setComment('')
      setRating(5)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 2000)
    } catch {
      // error shown via reviewError
    }
  }

  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="mt-10">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Customer Reviews</h2>
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl font-bold text-gray-900">{avg.toFixed(1)}</span>
          <div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-lg ${s <= Math.round(avg) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Existing reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4 mb-8">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#fdf4e8] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#3d7a20] font-bold text-sm">{r.userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">{r.userName}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={`text-sm ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
              <p className="text-gray-400 text-xs mt-2">{r.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-6">No reviews yet. Be the first to share your experience!</p>
      )}

      {/* Feedback form */}
      <div className="bg-[#f5f9f7] rounded-2xl p-5 border border-[#3d7a20]/10">
        <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
        <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review <span className="text-red-500">*</span></label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think about this product…"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white resize-none"
            />
          </div>
          {reviewError && (
            <p className="text-sm text-red-500">{reviewError}</p>
          )}
          <button
            type="submit"
            disabled={!comment.trim()}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              submitted
                ? 'bg-emerald-500 text-white'
                : 'bg-[#3d7a20] text-white hover:bg-[#2a5a14] disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {submitted ? '✓ Review Submitted!' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}

function fromApiDto(p: ProductDto): Product {
  const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
  const allImgs = (p.images ?? []).map((i) => i.url).filter((u): u is string => u != null)
  return {
    id: p.id,
    slug: p.slug ?? undefined,
    name: p.nameEn ?? 'Product',
    nameTamil: p.nameTa ?? '',
    category: p.category?.nameEn ?? '',
    categorySlug: p.category?.slug ?? '',
    price: p.price,
    originalPrice: p.originalPrice ?? p.price,
    image: primary?.url ?? '/images/products/mangoes.jpeg',
    images: allImgs.length > 1 ? allImgs : undefined,
    rating: p.rating ?? 4.5,
    reviews: 0,
    unit: 'per kg',
  }
}

function pick(en: string | null | undefined, ta: string | null | undefined, isTamil: boolean): string {
  return ((isTamil ? ta || en : en) ?? '').trim()
}

function ProductDetailPage() {
  const { productId } = Route.useParams()
  const staticProduct = PRODUCTS.find((p) => p.id === productId)
  const [apiProduct, setApiProduct] = useState<ProductDto | null>(null)
  const [apiLoading, setApiLoading] = useState(isApiMode())
  const [isTamil, setIsTamil] = useState(false)
  const { addToCart } = useCart()
  const { toggle, isFav } = useFav()
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(0.5)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isApiMode()) return
    setApiLoading(true)
    void api.get<ProductDto>(`/api/Products/${productId}`)
      .then((p) => { setApiProduct(p) })
      .catch(() => {})
      .finally(() => setApiLoading(false))
  }, [productId])

  const product: Product | null = isApiMode()
    ? (apiProduct ? fromApiDto(apiProduct) : null)
    : (staticProduct ?? null)

  if (!product) {
    if (apiLoading) {
      return (
        <main className="min-h-screen bg-[#faf9f4] flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-10 h-10 border-2 border-[#3d7a20] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading product…</p>
          </div>
        </main>
      )
    }
    return (
      <main className="min-h-screen bg-[#faf9f4] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-6xl mb-4">🍃</p>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">This product may have been removed or the link is incorrect.</p>
          <Link to="/shop" className="bg-[#3d7a20] text-white px-6 py-3 rounded-full font-semibold no-underline hover:bg-[#2a5a14] transition-colors">
            Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  const fav = isFav(product.id)
  const images = product.images && product.images.length > 0 ? product.images : [product.image]
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const outOfStock = isApiMode() ? (apiProduct?.isOutOfStock ?? false) : false

  function handleAddToCart() {
    addToCart({ id: product.id, name: product.name, nameTamil: product.nameTamil, category: product.category, image: product.image, price: product.price, unit: product.unit }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-400 overflow-x-auto">
          <button type="button" onClick={() => void navigate({ to: '/' })} className="hover:text-[#3d7a20] transition-colors whitespace-nowrap">Home</button>
          <TiIcon name="angle-right" size={12} />
          <Link to="/shop" className="hover:text-[#3d7a20] transition-colors no-underline text-gray-400 whitespace-nowrap">Shop</Link>
          <TiIcon name="angle-right" size={12} />
          <span className="text-gray-600 font-medium truncate max-w-[160px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          {/* Left — Image gallery */}
          <div>
            <ImageGallery images={images} name={product.name} />
          </div>

          {/* Right — Details */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.typeBadge && (
                <span className="bg-[#fdf4e8] text-[#3d7a20] text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                  {product.typeBadge}
                </span>
              )}
              {product.seasonal && (
                <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                  🌿 Seasonal
                </span>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-1">{product.category}</p>
                {isApiMode() && apiProduct && (
                  <button
                    type="button"
                    onClick={() => setIsTamil((t) => !t)}
                    className="flex-shrink-0 px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-500 hover:border-[#3d7a20] hover:text-[#3d7a20] transition-colors"
                  >
                    {isTamil ? 'EN' : 'தமிழ்'}
                  </button>
                )}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {isApiMode() && apiProduct ? pick(apiProduct.nameEn, apiProduct.nameTa, isTamil) : product.name}
              </h1>
              <p className="text-gray-400 text-base mt-1">
                {isApiMode() && apiProduct
                  ? (isTamil ? (apiProduct.nameEn ?? '') : (apiProduct.nameTa ?? product.nameTamil))
                  : product.nameTamil}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#3d7a20] text-white px-2.5 py-1 rounded-lg">
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-amber-300 text-sm">★</span>
              </div>
              <span className="text-gray-500 text-sm">{product.reviews.toLocaleString('en-IN')} ratings</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 py-3 border-t border-b border-gray-100">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-lg text-gray-400 line-through mb-0.5">₹{product.originalPrice}</span>
              {discount > 0 && <span className="text-emerald-600 font-bold text-sm mb-0.5">{discount}% off</span>}
              <span className="text-gray-400 text-sm mb-0.5">/ {product.unit}</span>
            </div>

            {/* Bilingual content sections (API mode) or static demo content */}
            {isApiMode() && apiProduct ? (
              <>
                {(apiProduct.descriptionEn || apiProduct.descriptionTa) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pick(apiProduct.descriptionEn, apiProduct.descriptionTa, isTamil)}</p>
                  </div>
                )}
                {(apiProduct.aboutEn || apiProduct.aboutTa) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">About</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pick(apiProduct.aboutEn, apiProduct.aboutTa, isTamil)}</p>
                  </div>
                )}
                {(apiProduct.usageEn || apiProduct.usageTa) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">How to Use</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pick(apiProduct.usageEn, apiProduct.usageTa, isTamil)}</p>
                  </div>
                )}
                {(apiProduct.benefitsEn || apiProduct.benefitsTa) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Benefits</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pick(apiProduct.benefitsEn, apiProduct.benefitsTa, isTamil)}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {product.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">About this product</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                  </div>
                )}
                {product.uses && product.uses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2.5 text-sm uppercase tracking-wide">Uses &amp; Benefits</h3>
                    <ul className="space-y-2">
                      {product.uses.map((use, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <TiIcon name="check" size={15} className="text-[#3d7a20] mt-0.5 flex-shrink-0" />
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
                  aria-label="Decrease quantity"
                >
                  <TiIcon name="minus" size={13} className="text-gray-600" />
                </button>
                <span className="w-14 text-center font-bold text-gray-900 text-sm">
                  {qty < 1 ? '½' : qty % 1 === 0 ? `${qty}` : `${qty}`} kg
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.round((q + 0.5) * 10) / 10)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
                  aria-label="Increase quantity"
                >
                  <TiIcon name="plus" size={13} className="text-gray-600" />
                </button>
              </div>
              <span className="text-sm font-semibold text-[#3d7a20]">= ₹{(product.price * qty).toFixed(0)}</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  outOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : added
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#3d7a20] text-white hover:bg-[#2a5a14]'
                }`}
              >
                <TiIcon name={added ? 'check' : 'shopping-cart'} size={18} className={outOfStock ? 'text-gray-400' : 'text-white'} />
                {outOfStock ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                type="button"
                onClick={() => toggle({ id: product.id, name: product.name, nameTamil: product.nameTamil, image: product.image, price: product.price, unit: product.unit, category: product.category })}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  fav ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-400 hover:bg-red-50'
                }`}
                aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <TiIcon name="heart" size={20} className={fav ? 'text-red-500' : 'text-gray-400'} />
              </button>
            </div>

            {/* Quick info chips */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { icon: 'package', label: '100% Fresh' },
                { icon: 'time', label: '24h Harvest' },
                { icon: 'check-box', label: 'Quality Assured' },
              ].map((item) => (
                <div key={item.label} className="text-center bg-white rounded-xl py-3 px-2 border border-gray-100 shadow-sm">
                  <TiIcon name={item.icon} size={20} className="text-[#3d7a20] mb-1" />
                  <p className="text-[10px] font-semibold text-gray-700 leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback section */}
        <FeedbackSection
          productId={product.id}
          slug={(isApiMode() && apiProduct) ? (apiProduct.slug ?? product.id) : product.id}
        />
      </div>
    </main>
  )
}
