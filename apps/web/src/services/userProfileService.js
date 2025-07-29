import apiClient from '../lib/apiClient';

const userProfileService = {
  async getProfile() {
    const { data } = await apiClient.get('/users/me');
    return data; // { nickname, avatarUrl }
  },
  async updateNickname(nickname) {
    const { data } = await apiClient.put('/users/nickname', { nickname }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  },
  async updateAvatar(avatarUrl) {
    // Enviar como string plano, no JSON
    const { data } = await apiClient.put('/users/avatar', avatarUrl, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return data;
  },
};

export default userProfileService;
