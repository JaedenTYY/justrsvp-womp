import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin" className="text-2xl font-extrabold text-gray-800 hover:text-gray-600 transition duration-300 ease-in-out">
              Admin Panel
            </Link>
            <div className="space-x-6">
              <Link href="/admin/users" className="text-gray-700 hover:text-gray-900 font-semibold transition duration-300 ease-in-out hover:underline">Users</Link>
              <Link href="/admin/categories" className="text-gray-700 hover:text-gray-900 font-semibold transition duration-300 ease-in-out hover:underline">Categories</Link>
              <Link href="/admin/orders" className="text-gray-700 hover:text-gray-900 font-semibold transition duration-300 ease-in-out hover:underline">Orders</Link>
              <Link href="/admin/events" className="text-gray-700 hover:text-gray-900 font-semibold transition duration-300 ease-in-out hover:underline">Events</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-6 py-10">
        {children}
      </main>
      <footer className="bg-white shadow-lg mt-auto">
        <div className="container mx-auto px-6 py-6 text-center text-gray-600">
          © 2024 JustRSVP. All rights reserved.
        </div>
      </footer>
    </div>
  )
}