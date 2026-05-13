# Web User Debug Guide (Scanner Site)

Dokumen ini dipakai untuk debug website lain (web scanner) agar bisa membaca QR dari project ini dan mengaktifkan tiket.

## 1. Kontrak Data yang Wajib Sama

Sumber QR (project ini) default meng-encode nilai **plain text kode tiket**:
Contoh: `PF-1778311898289-a9df7436`

Endpoint scan tiket (backend):
- `POST /access/verify`
- Body yang dipakai scanner:

```json
{
  "qrCode": "PF-1778311898289-a9df7436"
}
```

Catatan:
- Jangan kirim key lain seperti `ticketId`, `name`, `plateNumber`, atau `parkingLocation`.
- QR dari website ini harus dianggap sebagai satu string kode tiket saja.
- Jika scanner membaca JSON QR, tetap ambil field `qrCode` lalu kirim sebagai body di atas.

## 2. Cara Generate QR Test dari Project Ini

Jalankan web generator lalu buka salah satu URL ini.

Mode paling aman (disarankan untuk scanner lain):
```txt
http://localhost:5173/?qrCode=PF-1778311898289-a9df7436
```

Mode JSON (opsional, hanya jika scanner memang butuh JSON):
```txt
http://localhost:5173/?qrCode=PF-1778311898289-a9df7436&format=json
```

## 3. Checklist Debug di Website Scanner

1. Pastikan hasil decode dari kamera tercetak di console.
2. Pastikan nilai decode tidak kosong dan tidak ada spasi ekstra di kiri/kanan.
3. Pastikan request ke backend mengirim body key `qrCode` saja.
4. Pastikan header auth sesuai mode endpoint:
   - User mode: wajib `Authorization: Bearer <token>`.
   - Guest mode: endpoint guest tidak perlu token (jika backend mendukung).
5. Pastikan URL backend benar:
   - `https://backend-api-services-291631508657.asia-southeast2.run.app/access/verify`
6. Cek tab Network browser:
   - Status code
   - Request payload
   - Response body
   - CORS error

## 4. Snippet Scanner Site (Wajib Log Detail)

Gunakan snippet ini di website scanner lain:

```javascript
async function verifyScannedTicket(decodedValue, token) {
  const qrCode = String(decodedValue || '').trim();

  console.log('[SCAN] decodedValue:', decodedValue);
  console.log('[SCAN] qrCode(trimmed):', qrCode);

  if (!qrCode) {
    console.error('[SCAN] QR kosong, hentikan request');
    return { ok: false, reason: 'QR_EMPTY' };
  }

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = 'https://backend-api-services-291631508657.asia-southeast2.run.app/access/verify';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ qrCode })
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    console.log('[SCAN] status:', res.status);
    console.log('[SCAN] response:', data);

    if (!res.ok) {
      return { ok: false, status: res.status, data };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    console.error('[SCAN] network error:', err);
    return { ok: false, reason: 'NETWORK_ERROR', error: err.message };
  }
}
```

## 5. Parser Aman Jika Scanner Menghasilkan JSON

Jika library scanner menghasilkan string JSON, pakai parser ini:

```javascript
function extractQrCode(decodedValue) {
  const raw = String(decodedValue || '').trim();
  if (!raw) return '';

  try {
    const parsed = JSON.parse(raw);
    return String(parsed?.qrCode || '').trim();
  } catch {
    return raw;
  }
}
```

Pemakaian:

```javascript
const qrCode = extractQrCode(decodedValue);
await verifyScannedTicket(qrCode, token);
```

## 6. Tabel Gejala dan Penyebab

1. Gejala: "Tiket tidak ditemukan"
   - Kemungkinan: key payload salah (`ticketId` vs `qrCode`) atau nilai QR tidak aktif.

2. Gejala: 401 / 403
   - Kemungkinan: token user tidak dikirim / expired / role tidak sesuai.

3. Gejala: CORS error di browser
   - Kemungkinan: backend belum allow origin domain scanner.

4. Gejala: decode berhasil tapi backend tetap gagal
   - Kemungkinan: value decode ada karakter tambahan (newline/spasi), belum di-trim.

5. Gejala: endpoint benar tapi status 400
   - Kemungkinan: body bukan JSON valid atau content-type bukan `application/json`.

## 7. Verifikasi Cepat Manual (Tanpa Kamera)

Tes dari browser console website scanner:

```javascript
verifyScannedTicket('PF-1778311898289-a9df7436', 'PASTE_TOKEN_DI_SINI');
```

Jika ini sukses tapi scan kamera gagal, masalah ada di layer decode QR, bukan backend.

## 8. Output Debug yang Harus Dikirim Jika Masih Gagal

Jika masih gagal, kirim 4 data ini:
1. Nilai mentah hasil decode QR (sebelum parsing).
2. Final request body yang dikirim ke `/access/verify`.
3. Status code dan response body backend.
4. Apakah request membawa `Authorization` atau tidak.
