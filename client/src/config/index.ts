const config = {
  api: {
    baseUrl: `${process.env.VUE_APP_BASE_API_URL}`,
    tmplDownloadUrl: `${process.env.VUE_API_DOWNLOAD_URL}`
  },
  request: {
    timeout: `${process.env.VUE_APP_API_REQUEST_TIMEOUT}`
  }
}

export default config
