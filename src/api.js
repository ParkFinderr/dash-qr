import axios from 'axios';

const API_BASE_URL = 'https://backend-api-services-291631508657.asia-southeast2.run.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const buildAuthHeaders = (token) => {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Verify ticket (mendukung user via token dan guest tanpa token)
export const verifyTicket = async ({ qrCode, token }) => {
  try {
    const response = await apiClient.post('/access/verify', {
      qrCode: (qrCode || '').trim(),
    }, {
      headers: buildAuthHeaders(token),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Ticket verification error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Tiket tidak valid atau tidak ditemukan.',
      status: error.response?.status,
    };
  }
};

// Active ticket (mendukung user via token atau guestSessionId)
export const getActiveTicket = async ({ guestSessionId, token }) => {
  try {
    const params = {};
    if (guestSessionId) {
      params.guestSessionId = guestSessionId;
    }

    const response = await apiClient.get('/access/activeTicket', {
      params,
      headers: buildAuthHeaders(token),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Active ticket error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
};

// Cancel ticket untuk guest
export const cancelTicket = async (guestSessionId) => {
  try {
    const response = await apiClient.post('/access/cancelTicket', {
      guestSessionId,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Cancel ticket error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
};

export default apiClient;
