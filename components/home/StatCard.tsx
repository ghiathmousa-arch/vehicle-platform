interface StatCardProps {
  icon: React.ReactNode
  number: string
  label: string
  color: string
}

export default function StatCard({ icon, number, label, color }: StatCardProps) {
  const iconColor = color === "pink" ? "text-pink-400" : "text-primary"
  const iconBg = color === "pink" ? "bg-pink-400/10" : "bg-primary/10"

  return (
    <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition shadow-sm">
      <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="text-4xl font-bold text-card-foreground mb-2">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  )
}