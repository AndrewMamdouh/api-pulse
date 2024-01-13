/**
 *  Generate Authentication Headers Dynamically
 */
const getAuthHeaders = () => ({
  'X-API-KEY': localStorage.getItem('API_Key') || '',
  'X-PARTNER-ID': localStorage.getItem('Partner_ID') || '',
  'X-TEAM-NAME': localStorage.getItem('Team_Name') || '',
  'X-ENV-NAME': localStorage.getItem('ENV_Name') || '',
});

export default getAuthHeaders;
