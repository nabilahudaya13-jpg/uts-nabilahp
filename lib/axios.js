import axios from "axios";

const api = axios.create({
    baseURL: 'https://backend-kmc.siakadpoltekeskmc.ac.id/api/v1/pasien',
    timeout: 10000
});

export default api;