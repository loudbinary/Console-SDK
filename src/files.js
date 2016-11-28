import urls from './urls'
import totalRows from './utils/total-rows'
import { FOLDER } from './utils/cache-tags'

const getFileFolder = file => {
  const tokens = file.split('/')

  if (tokens.length > 1) {
    tokens.pop()

    return tokens.join('/')
  }

  return ''
}

export default req => ({
  loadDirectory(appId, path = '', pattern, sub = false, pageSize = 15, offset = 0) {
    const params = { pageSize, offset, pattern, sub }
    const dataReq = req.get(urls.fileView(appId, path)).query(params)
      .cacheTags(FOLDER(path))

    return totalRows(req).getWithData(dataReq)
  },

  createDir(appId, path, folderName) {
    return req.post(urls.createDir(appId, path, folderName)).cacheTags(FOLDER(path))
  },

  getFileContent(appId, authKey, filePath) {
    return req.get(urls.fileDownload(appId, authKey, filePath))
  },

  performOperation(appId, filePath, operation) {
    filePath = filePath || encodeURIComponent('/') //for root directory operations it has send '/' as path

    return req.put(`${urls.appConsole(appId)}/files/${filePath}`)
      .query({ operation })
      .cacheTags(FOLDER(getFileFolder(filePath)))
  },

  editFile(appId, filePath, fileContent) {
    return req.post(urls.fileEdit(appId, filePath), fileContent)
  },

  createFile(appId, filePath, fileContent) {
    return req.post(urls.fileCreate(appId, filePath), fileContent)
      .cacheTags(FOLDER(getFileFolder(filePath)))
  },

  deleteFile(appId, filePath) {
    return req.delete(urls.fileDelete(appId, filePath))
      .cacheTags(FOLDER(getFileFolder(filePath)))
  },

  uploadFile(appId, file, path, fileName) {
    return req.post(urls.fileUpload(appId, `${path}/${fileName}`), file)
      .cacheTags(FOLDER(path))
  },

  createConsoleFile(appId, path, content) {
    return req.post(`${urls.appConsole(appId)}/files/create/${path}`, content)
      .cacheTags(FOLDER(getFileFolder(path)))
  },

  viewFiles(appId, path = '') {
    return req.get(`${urls.appConsole(appId)}/files/view/${path}`)
  }
})