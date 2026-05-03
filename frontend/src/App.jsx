import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <TodoList />
            </div>
          }
        />
        {/* redirect semua path tak dikenal ke home */}
        <Route path="*" element={<TodoList />} />
      </Routes>
    </BrowserRouter>
  );
}