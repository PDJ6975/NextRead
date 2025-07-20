import apiClient from '../lib/apiClient';

export const surveyService = {
    getSurvey: () => apiClient.get('/surveys/find'),
    updateSurvey: (surveyData) => apiClient.put('/surveys/update', surveyData),
}; 