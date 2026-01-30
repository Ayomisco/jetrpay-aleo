"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DebugWalletPage() {
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [connectionResult, setConnectionResult] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Check what wallet objects are available
    const checkWallets = () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        wallets: {}
      }

      // Check for various wallet globals
      const possibleWallets = [
        'leoWallet',
        'leo', 
        'aleo',
        'puzzle',
        'foxwallet',
        'wallet'
      ]

      possibleWallets.forEach(name => {
        const walletObj = (window as any)[name]
        if (walletObj) {
          info.wallets[name] = {
            exists: true,
            type: typeof walletObj,
            methods: Object.keys(walletObj).filter(k => typeof walletObj[k] === 'function'),
            properties: Object.keys(walletObj).filter(k => typeof walletObj[k] !== 'function'),
            publicKey: walletObj.publicKey,
            address: walletObj.address,
          }
        } else {
          info.wallets[name] = { exists: false }
        }
      })

      // Also check window.aleo specifically
      if ((window as any).aleo) {
        const aleo = (window as any).aleo
        info.aleoDetails = {
          keys: Object.keys(aleo),
          isConnected: aleo.connected,
          publicKey: aleo.publicKey,
        }
      }

      setWalletInfo(info)
    }

    checkWallets()
    // Re-check periodically
    const interval = setInterval(checkWallets, 2000)
    return () => clearInterval(interval)
  }, [])

  const tryConnect = async (walletName: string) => {
    setError("")
    setConnectionResult("")
    
    try {
      const wallet = (window as any)[walletName]
      if (!wallet) {
        setError(`${walletName} not found on window`)
        return
      }

      console.log(`Trying to connect via window.${walletName}...`)
      console.log('Wallet object:', wallet)
      console.log('Available methods:', Object.keys(wallet).filter(k => typeof wallet[k] === 'function'))

      // Try different connect methods
      let address = null

      // Method 1: connect()
      if (wallet.connect) {
        console.log('Calling wallet.connect()...')
        try {
          const result = await wallet.connect()
          console.log('connect() result:', result)
          setConnectionResult(`connect() returned: ${JSON.stringify(result)}`)
          if (result?.address) address = result.address
          if (typeof result === 'string') address = result
        } catch (e: any) {
          console.log('connect() error:', e)
          setError(`connect() error: ${e.message}`)
        }
      }

      // Method 2: requestAccess()
      if (!address && wallet.requestAccess) {
        console.log('Calling wallet.requestAccess()...')
        try {
          const result = await wallet.requestAccess()
          console.log('requestAccess() result:', result)
          setConnectionResult(`requestAccess() returned: ${JSON.stringify(result)}`)
          if (result?.address) address = result.address
        } catch (e: any) {
          console.log('requestAccess() error:', e)
        }
      }

      // Method 3: getAccounts()
      if (!address && wallet.getAccounts) {
        console.log('Calling wallet.getAccounts()...')
        try {
          const result = await wallet.getAccounts()
          console.log('getAccounts() result:', result)
          setConnectionResult(`getAccounts() returned: ${JSON.stringify(result)}`)
        } catch (e: any) {
          console.log('getAccounts() error:', e)
        }
      }

      // Method 4: requestAccount()
      if (!address && wallet.requestAccount) {
        console.log('Calling wallet.requestAccount()...')
        try {
          const result = await wallet.requestAccount()
          console.log('requestAccount() result:', result)
          setConnectionResult(`requestAccount() returned: ${JSON.stringify(result)}`)
        } catch (e: any) {
          console.log('requestAccount() error:', e)
        }
      }

      if (address) {
        setConnectionResult(`Connected! Address: ${address}`)
      }

    } catch (e: any) {
      console.error('Connection error:', e)
      setError(e.message || 'Unknown error')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Wallet Debug Page</h1>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-900 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Available Wallet Objects</h2>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(walletInfo, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => tryConnect('leoWallet')}>
            Try window.leoWallet
          </Button>
          <Button onClick={() => tryConnect('leo')}>
            Try window.leo
          </Button>
          <Button onClick={() => tryConnect('aleo')}>
            Try window.aleo
          </Button>
        </div>

        {connectionResult && (
          <div className="p-4 bg-green-900/50 rounded-lg">
            <h3 className="font-semibold">Result:</h3>
            <pre className="text-sm">{connectionResult}</pre>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/50 rounded-lg">
            <h3 className="font-semibold">Error:</h3>
            <pre className="text-sm">{error}</pre>
          </div>
        )}

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Make sure Leo Wallet extension is installed</li>
            <li>Make sure Leo Wallet is unlocked</li>
            <li>Open browser console (F12) to see detailed logs</li>
            <li>Click one of the buttons above to try connecting</li>
            <li>Check if a popup appears from Leo Wallet</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
