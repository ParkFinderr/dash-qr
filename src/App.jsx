import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useMemo, useState } from 'react'
import { getActiveTicket } from './api'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [qrFormat, setQrFormat] = useState('raw')
  const [ticketData, setTicketData] = useState({
    qrCode: 'PF-1778311898289-a9df7436'
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const guestSessionId = params.get('guestSessionId')
    const token = params.get('token')
    const qrCode = params.get('qrCode') || params.get('code')
    const requestedFormat = (params.get('format') || 'raw').toLowerCase()

    setQrFormat(requestedFormat === 'json' ? 'json' : 'raw')

    if (qrCode) {
      setTicketData({ qrCode })
      return
    }

    if (!guestSessionId && !token) {
      return
    }

    const loadTicket = async () => {
      setIsLoading(true)
      setLoadError('')

      const result = await getActiveTicket({ guestSessionId, token })
      if (!result.success) {
        setLoadError(result.error || 'Gagal memuat tiket dari backend.')
        setIsLoading(false)
        return
      }

      const payload = result.data?.data || result.data
      setTicketData({
        qrCode: payload?.qrCode || payload?.code || payload?.ticketCode || 'PF-1778311898289-a9df7436'
      })
      setIsLoading(false)
    }

    loadTicket()
  }, [])

  const qrValue = useMemo(() => {
    if (qrFormat === 'json') {
      return JSON.stringify({
        qrCode: ticketData.qrCode
      })
    }

    // Default payload plain text agar scanner website lain bisa langsung kirim ke body qrCode.
    return ticketData.qrCode
  }, [qrFormat, ticketData])

  return (
    <GenerateTicketView
      isLoading={isLoading}
      loadError={loadError}
      ticketData={ticketData}
      qrValue={qrValue}
      qrFormat={qrFormat}
    />
  )
}

function GenerateTicketView({ isLoading, loadError, ticketData, qrValue, qrFormat }) {
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
