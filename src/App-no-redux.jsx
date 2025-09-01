import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-amber-400">Elysia Perfumes</h1>
        <p className="text-xl">Welcome to our perfume collection!</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen">
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
