interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
}

export default function StatCard({
  label,
  value,
  subtext,
  trend,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        {icon && <div className="text-4xl text-gray-300">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span
            className={`text-xs font-semibold ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} Trend
          </span>
        </div>
      )}
    </div>
  )
}
