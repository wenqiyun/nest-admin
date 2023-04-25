const env = import.meta.env

const config = {
  api: {
    baseUrl: `${env.VITE_APP_BASE_API_URL}`,
    tmplDownloadUrl: `${env.VITE_APP_DOWNLOAD_URL}`
  },
  request: {
    timeout: `${env.VITE_APP_API_REQUEST_TIMEOUT}`
  }
}

export default config
