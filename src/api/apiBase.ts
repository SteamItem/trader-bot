import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Agent = require('agentkeepalive');

export abstract class ApiBase {
  constructor() {
    this.httpAgent = new Agent({
      keepAlive: true,
      maxSockets: 100,
      maxFreeSockets: 10,
      timeout: 60000, // active socket keepalive for 60 seconds
      freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
    });
    this.httpsAgent = new Agent.HttpsAgent({
      keepAlive: true,
      maxSockets: 100,
      maxFreeSockets: 10,
      timeout: 60000, // active socket keepalive for 60 seconds
      freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
    });

    this.axiosInstance = this.setupClient();
  }

  public httpAgent: Agent;
  public httpsAgent: Agent.HttpsAgent;
  protected axiosInstance: AxiosInstance;

  private setupClient() {
    const options: AxiosRequestConfig = {
      //60 sec timeout
      timeout: 60000,
      //keepAlive pools and reuses TCP connections, so it's faster
      httpAgent: this.httpAgent,
      httpsAgent: this.httpsAgent,
      //follow up to 10 HTTP 3xx redirects
      maxRedirects: 10,
      //cap the maximum content length we'll accept to 50MBs, just in case
      maxContentLength: 50 * 1000 * 1000
    };
    const axiosInstance = axios.create(options);

    axiosInstance.interceptors.response.use(
      res => res,
      err => {
        if (err.response) {
          let message = `${err.response.statusText}-${err.response.status}`;
          const responseMessage = err.response.data.message;
          if (responseMessage) { message += `: ${responseMessage}`;}
          throw new Error(message);
        } else {
          throw new Error(err.message);
        }
      }
    );
    return axiosInstance;
  }
}