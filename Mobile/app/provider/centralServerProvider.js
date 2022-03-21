import axios from 'axios'


export default class CentralServerProvider {
    axiosInstance = null
    constructor() {
        this.axiosInstance = axios.create({ baseURL: "http://localhost:8080"});
    }

     
    async getUser(email, password) {
        const result = await this.axiosInstance.post("user/login/", {email: email, password: password});
        console.log(result.data);
        return result.data;
    }
}