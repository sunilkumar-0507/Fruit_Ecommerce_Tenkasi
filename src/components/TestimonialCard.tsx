interface TestimonialCardProps {
  name: string
  role: string
  image: string
  testimonial: string
  rating: number
}

export default function TestimonialCard({
  name,
  role,
  image,
  testimonial,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Testimonial */}
      <p className="text-gray-600 mb-6 line-clamp-4">"{testimonial}"</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <h4 className="font-semibold text-[#2f6a4a]">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
