import { useState } from 'react'

function App() {
  const [totalBill, setTotalBill] = useState('')
  const [numPeople, setNumPeople] = useState('')
  const [perPerson, setPerPerson] = useState<number | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')

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
    setScanError('')
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setScanError('')

    try {
      // Use OCR.space free API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('apikey', 'K87899142388957') // Free public key
      formData.append('language', 'eng')

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.ParsedResults?.[0]?.ParsedText) {
        const text = result.ParsedResults[0].ParsedText
        
        // Try to extract total amount (various patterns)
        const patterns = [
          /total[:\s]*\$?\s*(\d+\.?\d*)/i,
          /amount[:\s]*\$?\s*(\d+\.?\d*)/i,
          /\$\s*(\d+\.?\d+)/,
          /(\d+\.\d{2})/g, // Find all dollar amounts
        ]

        let found = false
        for (const pattern of patterns) {
          const match = text.match(pattern)
          if (match) {
            const amount = match[1] || match[0]
            setTotalBill(amount.replace('$', '').trim())
            found = true
            break
          }
        }

        if (!found) {
          setScanError('Could not find total amount. Please enter manually.')
        }
      } else {
        setScanError('Could not read image. Please try another or enter manually.')
      }
    } catch (error) {
      setScanError('Scan failed. Please enter amount manually.')
      console.error('OCR error:', error)
    } finally {
      setIsScanning(false)
    }
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
          Split Bill Auto Generator
        </h1>
        <p className="text-slate-600 text-lg">
          Scan your bill with your camera or enter manually. Split it instantly with your friends.
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
          {/* Scan Bill Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Scan Bill (Auto-detect total)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                disabled={isScanning}
                className="w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-md text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-md">
                  <div className="flex items-center gap-2 text-blue-600">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium">Scanning bill...</span>
                  </div>
                </div>
              )}
            </div>
            {scanError && (
              <p className="text-sm text-orange-600">{scanError}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">or enter manually</span>
            </div>
          </div>

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Auto Bill Scan</h3>
          <p className="text-sm text-slate-600">
            Just snap a photo - OCR extracts the total automatically
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
        <p>Built with React + Vite + Tailwind CSS + OCR.space</p>
      </footer>
    </div>
  )
}

export default App
