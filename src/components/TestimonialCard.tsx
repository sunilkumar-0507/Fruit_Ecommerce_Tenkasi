interface TestimonialCardProps {
  name: string
  role: string
  image?: string
  testimonial: string
  rating: number
}

export default function TestimonialCard({ name, role, testimonial, rating }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
        ))}
      </div>

      {/* Testimonial */}
      <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">"{testimonial}"</p>

      {/* Author — no image */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#fdf4e8] flex items-center justify-center flex-shrink-0">
          <span className="text-[#3d7a20] font-bold text-base">{name.charAt(0)}</span>
        </div>
        <div>
          <h4 className="font-semibold text-[#3d7a20]">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
