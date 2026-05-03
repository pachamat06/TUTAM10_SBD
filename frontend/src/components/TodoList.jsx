import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

export default function TodoList() {
  const [todos,   setTodos]   = useState([]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);
  const [error,   setError]   = useState("");

  async function fetchTodos() {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API}/todos`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat todo");
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTodos(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setAdding(true);
    try {
      const res  = await fetch(`${API}/todos`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ title: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTodos([data, ...todos]);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(id) {
    try {
      const res  = await fetch(`${API}/todos/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTodos(todos.map(t => (t.id === id ? data : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/todos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const total    = todos.length;
  const done     = todos.filter(t => t.completed).length;
  const pending  = total - done;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total",    value: total,   color: "bg-blue-50 text-blue-700 border-blue-200"  },
          { label: "Selesai",  value: done,    color: "bg-green-50 text-green-700 border-green-200" },
          { label: "Pending",  value: pending, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form tambah todo */}
      <form
        onSubmit={handleAdd}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tulis todo baru..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
        >
          {adding ? "..." : "+ Tambah"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg px-4 py-3 mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4 animate-pulse flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded flex-1" />
              <div className="w-16 h-7 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : todos.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">📝</p>
          <p className="font-semibold text-lg">Belum ada todo</p>
          <p className="text-sm mt-1">Tambahkan todo pertamamu di atas!</p>
        </div>
      ) : (
        /* Daftar todo */
        <ul className="flex flex-col gap-3">
          {todos.map(todo => (
            <li
              key={todo.id}
              className={`border rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm transition
                ${todo.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200 hover:border-blue-300"
                }`}
            >
              {/* Checkbox toggle */}
              <button
                onClick={() => handleToggle(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition
                  ${todo.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-blue-500"
                  }`}
              >
                {todo.completed && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Title */}
              <span className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                {todo.title}
              </span>

              {/* Tanggal */}
              <span className="text-xs text-gray-400 hidden sm:block">
                {new Date(todo.created_at).toLocaleDateString("id-ID", {
                  day:   "numeric",
                  month: "short",
                })}
              </span>

              {/* Tombol Hapus */}
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-400 hover:text-red-600 transition ml-1 text-lg leading-none"
                title="Hapus"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}