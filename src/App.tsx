import { useState } from 'react'

function App() {
  const [totalBill, setTotalBill] = useState('')
  const [numPeople, setNumPeople] = useState('')
  const [perPerson, setPerPerson] = useState<number | null>(null)

  const calculateSplit = () => {
    const bill = parseFloat(totalBill)
    const people = parseInt(numPeople)

    if (!isNaN(bill) && !isNaN(people) && people > 0) {
      setPerPerson(bill / people)
    } else {
      setPerPerson(null)
    }
  }

  const reset = () => {
    setTotalBill('')
    setNumPeople('')
    setPerPerson(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Split Bill Calculator
        </h1>
        <p className="text-slate-600 text-lg">
          Calculate and split bills instantly with your friends. Fast, accurate, and easy to use.
        </p>
      </div>

      {/* Calculator Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900">Calculate Split</h2>
          <p className="text-slate-600 text-sm mt-1">
            Enter the total bill amount and number of people
          </p>
        </div>

        <div className="space-y-6">
          {/* Total Bill Input */}
          <div className="space-y-2">
            <label htmlFor="total-bill" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Bill Amount
            </label>
            <input
              id="total-bill"
              type="number"
              placeholder="0.00"
              value={totalBill}
              onChange={(e) => setTotalBill(e.target.value)}
              className="w-full text-lg px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Number of People Input */}
          <div className="space-y-2">
            <label htmlFor="num-people" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Number of People
            </label>
            <input
              id="num-people"
              type="number"
              placeholder="0"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              className="w-full text-lg px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={calculateSplit} 
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md transition-colors cursor-pointer"
            >
              Calculate
            </button>
            <button 
              onClick={reset} 
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-md transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Result Display */}
          {perPerson !== null && (
            <>
              <div className="border-t border-slate-200 my-4"></div>
              <div className="bg-blue-50 rounded-lg p-6 text-center space-y-2">
                <p className="text-sm text-slate-600 font-medium">
                  Amount Per Person
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  ${perPerson.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-4xl w-full">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Calculation</h3>
          <p className="text-sm text-slate-600">
            Get accurate split amounts in real-time
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Any Group Size</h3>
          <p className="text-sm text-slate-600">
            Split bills among any number of people
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Precise & Fair</h3>
          <p className="text-sm text-slate-600">
            Decimal accuracy ensures everyone pays fairly
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-sm text-slate-500">
        <p>Built with React + Vite + Tailwind CSS</p>
      </footer>
    </div>
  )
}

export default App
