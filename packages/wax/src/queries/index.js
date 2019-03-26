export { default as getBookComponentQuery } from './getBookComponent'
export { default as updateBookComponentContentMutation } from './updateContent'
export {
  default as updateBookComponentTrackChangesMutation,
} from './updateTrackChanges'
export { default as renameBookComponentMutation } from './renameBookComponent'
export { default as uploadFileMutation } from './uploadFile'
export { default as lockBookComponentMutation } from './lockBookComponent'
export { default as unlockBookComponentMutation } from './unlockBookComponent'
export {
  trackChangeSubscription,
  titleChangeSubscription,
} from './waxPubsweetSubscriptions'
