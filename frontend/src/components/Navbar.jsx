export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <h1 className="text-xl font-bold tracking-tight">Shared Todo List</h1>
      </div>
      <p className="text-blue-200 text-sm hidden sm:block">
        Semua orang bisa melihat & menambah todo di sini
      </p>
    </nav>
  );
}