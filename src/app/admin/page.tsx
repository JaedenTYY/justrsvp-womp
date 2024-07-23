import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { href: "/admin/users", title: "Manage Users", color: "bg-blue-600" },
          { href: "/admin/categories", title: "Manage Categories", color: "bg-green-600" },
          { href: "/admin/orders", title: "Manage Orders", color: "bg-yellow-600" },
          { href: "/admin/events", title: "Manage Events", color: "bg-purple-600" },
        ].map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`
              ${item.color} 
              hover:opacity-90 
              transition-all 
              duration-300 
              ease-in-out
              text-white 
              rounded-lg 
              shadow-md 
              overflow-hidden
              transform
              hover:scale-105
              hover:shadow-lg
            `}
          >
            <div className="p-6 group">
              <h2 className="text-xl font-semibold mb-2 transition-transform duration-300 group-hover:-translate-y-0.5">{item.title}</h2>
              <p className="text-sm opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0.5">
                Click to {item.title.toLowerCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}