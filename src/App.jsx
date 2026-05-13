import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useMemo, useState } from 'react'
import { getActiveTicket } from './api'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [qrFormat, setQrFormat] = useState('raw')
  const [ticketData, setTicketData] = useState({
    qrCode: 'PF-DEFAULT',
    guestSessionId: null
  })
  const [guestSessionId, setGuestSessionId] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshInterval, setRefreshInterval] = useState(5000) // Auto-refresh setiap 5 detik

  const loadTicket = async (guestSId, authToken) => {
    if (!guestSId && !authToken) return

    setIsLoading(true)
    setLoadError('')

    const result = await getActiveTicket({ guestSessionId: guestSId, token: authToken })
    if (!result.success) {
      setLoadError(result.error || 'Gagal memuat tiket dari backend.')
      setIsLoading(false)
      return
    }

    const payload = result.data?.data || result.data
    setTicketData({
      qrCode: payload?.qrCode || payload?.code || payload?.ticketCode || 'PF-DEFAULT',
      guestSessionId: guestSId // Store guestSessionId untuk dikirim ke scanner
    })
    setIsLoading(false)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const guestSId = params.get('guestSessionId')
    const authToken = params.get('token')
    const qrCode = params.get('qrCode') || params.get('code')
    const requestedFormat = (params.get('format') || 'raw').toLowerCase()

    setQrFormat(requestedFormat === 'json' ? 'json' : 'raw')
    setGuestSessionId(guestSId)
    setToken(authToken)

    if (qrCode) {
      setTicketData({ qrCode })
      return
    }

    if (guestSId || authToken) {
      loadTicket(guestSId, authToken)
    }
  }, [])

  // Auto-refresh tiket terbaru dari backend setiap N detik
  useEffect(() => {
    if (!guestSessionId && !token) return

    const interval = setInterval(() => {
      loadTicket(guestSessionId, token)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [guestSessionId, token, refreshInterval])

  const qrValue = useMemo(() => {
    if (qrFormat === 'json') {
      // JSON format: include both qrCode dan guestSessionId untuk context lengkap
      return JSON.stringify({
        qrCode: ticketData.qrCode,
        guestSessionId: ticketData.guestSessionId
      })
    }

    // Default payload plain text: hanya qrCode, guestSessionId akan di-handle via localStorage/URL param
    return ticketData.qrCode
  }, [qrFormat, ticketData])

  const handleRefreshNow = () => {
    if (guestSessionId || token) {
      loadTicket(guestSessionId, token)
    }
  }

  return (
    <GenerateTicketView
      isLoading={isLoading}
      loadError={loadError}
      ticketData={ticketData}
      qrValue={qrValue}
      qrFormat={qrFormat}
      onRefresh={handleRefreshNow}
      hasBackendAuth={!!(guestSessionId || token)}
    />
  )
}

function GenerateTicketView({ isLoading, loadError, ticketData, qrValue, qrFormat, onRefresh, hasBackendAuth }) {
  return (
    <div className="dashboard-container">
      <div className="ticket-card">
        <div className="header-row">
          <div className="logo-text">PARKFINDER</div>
          <div className="status-badge">Aktif</div>
        </div>

        <div className="qr-section">
          <div className="qr-wrapper">
            <QRCodeSVG
              value={qrValue}
              size={200}
              level={'H'}
              includeMargin={true}
            />
          </div>
          <p className="instruction-text">
            QR ini hanya berisi kode tiket untuk endpoint scan di website lain.
          </p>
          {isLoading && <p className="instruction-text">Memuat data tiket dari backend...</p>}
          {loadError && <p className="error-inline">{loadError}</p>}
          {hasBackendAuth && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#00D4FF',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'Memuat...' : 'Refresh Tiket'}
            </button>
          )}
        </div>

        <div className="ticket-details">
          <div className="detail-item">
            <span className="detail-label">Kode Tiket</span>
            <span className="detail-value">{ticketData.qrCode}</span>
          </div>
        </div>

        <button
          className="action-button"
          onClick={() => {
            alert('Mengunduh tiket sebagai gambar... (Simulasi)');
          }}
        >
          Simpan Tiket
        </button>
      </div>
    </div>
  )
}

export default App
