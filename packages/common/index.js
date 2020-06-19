module.exports = {
  AbstractModal: () => require('./src/AbstractModal.jsx'),
  Modal: () => require('./src/Modal.jsx'),
  TextInput: () => require('./src/TextInput.jsx'),
  mimetypeHelpers: require('./src/utils/mimetypes'),
  objectKeyExtractor: require('./src/utils/fileStorageObjectKeyExtractor'),
}
