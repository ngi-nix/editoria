// const { CustomTag } = require('../../data-model/src').models
// const omit = require('lodash/omit')
// const pick = require('lodash/pick')
// const map = require('lodash/map')

// const {
//   editoriaDataModel: {
//     models: { User },
//   },
// } = require('../../data-model')

// const { dbCleaner, api } = require('pubsweet-server/test')

// const fixtures = require('./helpers/fixtures')
// const authentication = require('pubsweet-server/src/authentication')

// describe('Tag mutations', () => {
//   // let token
//   // let user

//   beforeEach(async () => {
//     await dbCleaner()
//   })

//   it('can add a custom tag', async () => {
//     const user = await new User(fixtures.user).save()
//     const token = authentication.token.create(user)

//     const {
//       body: {
//         data: { addCustomTag },
//       },
//     } = await api.graphql.query(
//       `mutation($input: [CustomTagAddInput]!) {
//         addCustomTag(input: $input) {
//           id
//           label
//           tagType
//         }
//       }`,
//       {
//         input: fixtures.addTag,
//       },
//       token,
//     )

//     expect(map(addCustomTag, tag => omit(tag, ['id']))).toEqual(fixtures.addTag)
//   })

//   it('can update a custom tag', async () => {
//     const user = await new User(fixtures.user).save()
//     const token = authentication.token.create(user)
//     const customTag = await Promise.all(
//       fixtures.addTag.map(async tag => {
//         const addTag = await new CustomTag(tag).save()
//         return addTag
//       }),
//     )
//     fixtures.updateTag[0].id = customTag[0].id
//     const {
//       body: {
//         data: { updateCustomTag },
//       },
//     } = await api.graphql.query(
//       `mutation($input: [CustomTagUpdateInput]!) {
//         updateCustomTag(input: $input) {
//           id
//           label
//           tagType
//         }
//       }`,
//       {
//         input: fixtures.updateTag,
//       },
//       token,
//     )

//     const resultTag = [fixtures.addTag[1], fixtures.updateTag[0]]
//     const compareCustomTag = map(updateCustomTag, tag =>
//       pick(tag, ['label', 'tagType']),
//     )

//     expect(compareCustomTag).toEqual(map(resultTag, tag => omit(tag, ['id'])))
//   })

//   it('can delete a custom tag', async () => {
//     const user = await new User(fixtures.user).save()
//     const token = authentication.token.create(user)
//     const customTag = await Promise.all(
//       fixtures.addTag.map(async tag => {
//         const addTag = await new CustomTag(tag).save()
//         return addTag
//       }),
//     )

//     const deleteTag = {
//       id: customTag[0].id,
//       deleted: true,
//     }

//     const {
//       body: {
//         data: { updateCustomTag },
//       },
//     } = await api.graphql.query(
//       `mutation($input: [CustomTagUpdateInput]!) {
//         updateCustomTag(input: $input) {
//           id
//           label
//           tagType
//         }
//       }`,
//       {
//         input: [deleteTag],
//       },
//       token,
//     )

//     const compareCustomTag = map(customTag, tag =>
//       pick(tag, ['id', 'label', 'tagType']),
//     )

//     expect(updateCustomTag).toEqual([compareCustomTag[1]])
//   })
// })
