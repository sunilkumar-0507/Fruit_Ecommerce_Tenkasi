interface StatCardProps {
  value: string
  label: string
  icon: React.ReactNode
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white transition-all duration-300">
      <div className="flex justify-center mb-3 text-[#4fb8b2] text-3xl">
        {icon}
      </div>
      <div className="font-fraunces text-3xl font-bold text-[#2f6a4a] mb-1">
        {value}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}
