const { pickBy, transform, isEqual, isObject } = require('lodash')

class EditoriaMode {
  /**
   * Creates a new instance of EditoriaMode
   *
   * @param {string} userId A user's UUID
   * @param {string} operation The operation you're authorizing for
   * @param {any} object The object of authorization
   * @param {any} context Context for authorization, e.g. database access
   * @returns {string}
   */
  constructor(userId, operation, object, context) {
    this.userId = userId
    this.operation = EditoriaMode.mapOperation(operation)
    this.object = object
    this.context = context
  }

  /**
   * Maps operations from HTTP verbs to semantic verbs
   *
   * @param {any} operation
   * @returns {string}
   */
  static mapOperation(operation) {
    const operationMap = {
      GET: 'read',
      POST: 'create',
      PATCH: 'update',
      DELETE: 'delete',
    }

    return operationMap[operation] ? operationMap[operation] : operation
  }

  static difference(object, base) {
    const changes = (object, base) =>
      transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] =
            isObject(value) && isObject(base[key])
              ? changes(value, base[key])
              : value
        }
      })
    return changes(object, base)
  }

  async isTeamMember(teamType, object) {
    let membershipCondition
    if (object) {
      membershipCondition = team =>
        team.teamType === teamType &&
        team.object &&
        team.object.id === object.id
    } else {
      membershipCondition = team => team.teamType === teamType
    }

    const memberships = await Promise.all(
      this.user.teams.map(async teamId => {
        const teamFound = await this.context.models.Team.find(teamId)
        if (teamFound) {
          return membershipCondition(teamFound)
        }
        return false
      }),
    )

    return memberships.includes(true)
  }

  async hasMembership(object) {
    let collection
    if (object.collection) {
      collection = object.collection
    } else {
      collection = object
    }

    const membershipCondition = team => team.object.id === collection.id

    const memberships = await Promise.all(
      this.user.teams.map(async teamId => {
        const teamFound = await this.context.models.Team.find(teamId)
        if (teamFound) {
          return membershipCondition(teamFound)
        }
        return false
      }),
    )
    return memberships.includes(true)
  }

  isAuthor(object) {
    return this.isTeamMember('author', object)
  }

  isAssignedCopyEditor(object) {
    return this.isTeamMember('copyEditor', object)
  }

  isAssignedProductionEditor(object) {
    return this.isTeamMember('productionEditor', object)
  }

  isProductionEditor() {
    return this.isTeamMember('productionEditor')
  }
  async findCollectionByObject(object) {
    let id
    if (object.collection) {
      id = object.collection.id
    } else if (object.bookId && object.type) {
      id = object.bookId
    } else {
      switch (object.type) {
        case 'fragment':
          id = object.book
          break
        case 'team':
          id = object.object.id
          break
        default:
          id = object.id
          break
      }
    }
    if (id) {
      return this.context.models.Collection.find(id)
    }
    return undefined
  }
  async canRead() {
    this.user = await this.context.models.User.find(this.userId)

    const collection = await this.findCollectionByObject(this.object)

    const permission =
      (await this.isAuthor(collection)) ||
      (await this.isAssignedCopyEditor(collection)) ||
      (await this.isAssignedProductionEditor(collection))

    return permission
  }

  async canListCollections() {
    this.user = await this.context.models.User.find(this.userId)

    return {
      filter: async collections => {
        const filteredCollections = await Promise.all(
          collections.map(async collection => {
            const condition =
              (await this.isAuthor(collection)) ||
              (await this.isAssignedCopyEditor(collection)) ||
              (await this.isAssignedProductionEditor(collection))
            return condition ? collection : undefined
          }, this),
        )

        return filteredCollections.filter(collection => collection)
      },
    }
  }

  async canReadUser() {
    this.user = await this.context.models.User.find(this.userId)

    if (this.user.id === this.object.id) {
      return true
    }
    return {
      filter: user =>
        pickBy(user, (_, key) => ['id', 'username', 'type'].includes(key)),
    }
  }

  async canListTeams() {
    this.user = await this.context.models.User.find(this.userId)
    // if (await this.isProductionEditor()) {
    //   return true
    // }

    // return {
    //   filter: async teams => {
    //     const filteredTeams = await Promise.all(
    //       teams.map(async team => {
    //         const condition = this.belongsToTeam(team.id)
    //         return condition ? team : undefined
    //       }, this),
    //     )

    //     return filteredTeams.filter(team => team)
    //   },
    // }
    return true
  }

  belongsToTeam(teamId) {
    return this.user.teams.includes(teamId)
  }

  async canReadTeam() {
    this.user = await this.context.models.User.find(this.userId)
    return this.belongsToTeam(this.object.id)
  }

  async canCreateTeam() {
    this.user = await this.context.models.User.find(this.userId)
    return this.isProductionEditor()
  }

  async canUpdateTeam() {
    this.user = await this.context.models.User.find(this.userId)
    let current
    if (this.object.current) {
      current = this.object.current
    } else {
      current = this.object
    }
    const teamFound = await this.context.models.Team.find(current.id)
    const collection = await this.findCollectionByObject(teamFound)
    return this.isAssignedProductionEditor(collection)
  }

  async canCreateCollection() {
    this.user = await this.context.models.User.find(this.userId)
    return this.isProductionEditor()
  }

  async canInteractWithCollections() {
    this.user = await this.context.models.User.find(this.userId)
    let current
    if (this.object.current) {
      current = this.object.current
    } else {
      current = this.object
    }
    const collection = await this.findCollectionByObject(current)
    const membership = []
    if (collection) {
      if (collection.productionEditor) {
        for (let i = 0; i < collection.productionEditor.length; i += 1) {
          if (collection.productionEditor[i].id === this.user.id) {
            membership.push(true)
          } else {
            membership.push(false)
          }
        }
      }
      return membership.includes(true)
    }
    return false
  }
  async canBroadcastEvent() {
    this.user = await this.context.models.User.find(this.userId)
    return this.hasMembership(this.object)
  }

  async canInteractWithFragments() {
    this.user = await this.context.models.User.find(this.userId)
    const collection = await this.findCollectionByObject(this.object)
    const permissions =
      collection &&
      ((await this.isAssignedProductionEditor(collection)) ||
        (await this.isAssignedCopyEditor(collection)))
    return permissions
  }

  async canUpdateFragment() {
    this.user = await this.context.models.User.find(this.userId)
    const { current, update } = this.object
    const wasEditingSate = current.progress.edit === 0
    const wasReviewingSate = current.progress.review === 0
    const wasCleaningUpSate = current.progress.clean_up === 0
    const diff = EditoriaMode.difference(update, current)
    const collection = await this.findCollectionByObject(current)

    if (collection) {
      if (await this.isAssignedProductionEditor(collection)) {
        if (
          current.lock !== null &&
          diff.lock !== undefined &&
          current.lock.editor.userId !== this.user.id
        ) {
          return false
        }
        return true
      } else if (await this.isAssignedCopyEditor(collection)) {
        if (Object.keys(diff).length === 1) {
          if (
            (diff.lock !== undefined || update.lock !== undefined) &&
            (wasEditingSate || wasCleaningUpSate) &&
            (current.lock === null ||
              current.lock.editor.userId === this.user.id)
          ) {
            return true
          }
          if (
            diff.progress &&
            (diff.progress.edit === 1 || diff.progress.edit === -1) &&
            wasEditingSate
          ) {
            return true
          }
          if (
            diff.progress &&
            (diff.progress.review === 1 ||
              diff.progress.review === 0 ||
              diff.progress.review === -1)
          ) {
            return true
          }
          if (
            diff.progress &&
            (diff.progress.clean_up === 1 ||
              diff.progress.clean_up === 0 ||
              diff.progress.clean_up === -1)
          ) {
            return true
          }
          if (
            diff.progress &&
            (diff.progress.page_check === 0 || diff.progress.page_check === -1)
          ) {
            return true
          }
          if (
            (diff.trackChanges === true || diff.trackChanges === false) &&
            (wasEditingSate || wasReviewingSate || wasCleaningUpSate)
          ) {
            return true
          }
          if (diff.source) {
            return true
          }
          if (diff.alignment) {
            return true
          }
        }
        if (Object.keys(diff).length === 2) {
          if (diff.number !== undefined && diff.index !== undefined) {
            return true
          }
          if (diff.source && diff.title !== undefined) {
            return true
          }
          if (
            (diff.trackChanges === true || diff.trackChanges === false) &&
            (wasEditingSate || wasReviewingSate || wasCleaningUpSate)
          ) {
            return true
          }
        }
        return false
      } else if (await this.isAuthor(collection)) {
        if (Object.keys(diff).length === 1) {
          if (
            (diff.lock !== undefined || update.lock !== undefined) &&
            wasReviewingSate &&
            (current.lock === null ||
              current.lock.editor.userId === this.user.id)
          ) {
            return true
          }
          if (
            diff.progress &&
            (diff.progress.review === 1 || diff.progress.review === -1) &&
            wasReviewingSate
          ) {
            return true
          }
          if (diff.source) {
            return true
          }
        }
        if (Object.keys(diff).length === 2) {
          if (diff.source && diff.title !== undefined) {
            return true
          }
        }
        return false
      }
      return false
    }
    return false
  }

  async canBroadcastFragmentPatchEvent() {
    this.user = await this.context.models.User.find(this.userId)
    const foundFragment = await this.context.models.Fragment.find(
      this.object.fragment.id,
    )
    const collection = await this.findCollectionByObject(foundFragment)
    return foundFragment && collection && this.hasMembership(collection)
  }
  async canFragmentEdit() {
    this.user = await this.context.models.User.find(this.userId)
    const fragment = this.object
    const isEditingSate = fragment.progress.edit === 0
    const isReviewingSate = fragment.progress.review === 0
    const isCleaningUpSate = fragment.progress.clean_up === 0
    const collection = await this.findCollectionByObject(this.object)

    if (collection) {
      if (await this.isAssignedProductionEditor(collection)) {
        return true
      } else if (
        (await this.isAssignedCopyEditor(collection)) &&
        (isEditingSate || isCleaningUpSate)
      ) {
        return true
      } else if ((await this.isAuthor(collection)) && isReviewingSate) {
        return true
      }
    }
    return false
  }

  async canChangeProgress() {
    this.user = await this.context.models.User.find(this.userId)
    const progressType = this.object.type

    const collection = await this.findCollectionByObject(this.object)
    if (collection) {
      if (await this.isAssignedProductionEditor(collection)) {
        return true
      } else if (await this.isAssignedCopyEditor(collection)) {
        let condition = false
        switch (progressType) {
          case 'file_prep': {
            condition = true
            break
          }
          case 'edit': {
            condition = true
            break
          }
          case 'review': {
            condition = true
            break
          }
          case 'clean_up': {
            condition = true
            break
          }
          case 'page_check': {
            condition = false
            break
          }
          case 'final': {
            condition = false
            break
          }
          default: {
            return condition
          }
        }
        return condition
      } else if (await this.isAuthor(collection)) {
        let condition = false
        switch (progressType) {
          case 'review': {
            condition = true
            break
          }
          default: {
            return condition
          }
        }
        return condition
      }
    }
    return false
  }

  async canChangeProgressLeft() {
    this.user = await this.context.models.User.find(this.userId)
    const progressType = this.object.type
    const { currentValues } = this.object

    const collection = await this.findCollectionByObject(this.object)
    if (collection) {
      if (await this.isAssignedProductionEditor(collection)) {
        return true
      } else if (await this.isAssignedCopyEditor(collection)) {
        let condition = false
        switch (progressType) {
          case 'file_prep': {
            if (currentValues.file_prep === 1) {
              return true
            }
            break
          }
          case 'edit': {
            if (currentValues.edit === 1) {
              condition = true
            }
            break
          }
          case 'review': {
            if (currentValues.review === 1) {
              condition = true
            }
            break
          }
          case 'clean_up': {
            if (currentValues.clean_up === 1) {
              condition = true
            }
            break
          }
          case 'page_check': {
            condition = false
            break
          }
          case 'final': {
            condition = false
            break
          }
          default: {
            return condition
          }
        }
        return condition
      } else if (await this.isAuthor(collection)) {
        const condition = false
        return condition
      }
    }
    return false
  }
  async canChangeProgressRight() {
    this.user = await this.context.models.User.find(this.userId)
    const progressType = this.object.type
    const { currentValues } = this.object

    const collection = await this.findCollectionByObject(this.object)
    if (collection) {
      if (await this.isAssignedProductionEditor(collection)) {
        return true
      } else if (await this.isAssignedCopyEditor(collection)) {
        let condition = false
        switch (progressType) {
          case 'file_prep': {
            condition = false
            break
          }
          case 'edit': {
            if (currentValues.edit === 0) {
              condition = true
            }
            break
          }
          case 'review': {
            if (currentValues.review === -1 || currentValues.review === 0) {
              condition = true
            }
            break
          }
          case 'clean_up': {
            if (currentValues.clean_up === -1 || currentValues.clean_up === 0) {
              condition = true
            }
            break
          }
          case 'page_check': {
            condition = false
            break
          }
          case 'final': {
            condition = false
            break
          }
          default: {
            return condition
          }
        }
        return condition
      } else if (await this.isAuthor(collection)) {
        let condition = false
        switch (progressType) {
          case 'review': {
            if (currentValues.review === 0) {
              condition = true
            }
            break
          }
          default: {
            return condition
          }
        }
        return condition
      }
    }
    return false
  }
  async canInteractWithEditor() {
    this.user = await this.context.models.User.find(this.userId)
    const fragment = this.object
    const isReviewingSate = fragment.progress.review === 0
    const isEditingSate = fragment.progress.edit === 0
    const isCleanUpSate = fragment.progress.clean_up === 0
    const collection = await this.findCollectionByObject(this.object)

    if (collection) {
      if (await this.isAssignedProductionEditor(collection)) {
        return 'full'
      } else if (
        (await this.isAssignedCopyEditor(collection)) &&
        (isEditingSate || isCleanUpSate)
      ) {
        return 'full'
      } else if ((await this.isAuthor(collection)) && isReviewingSate) {
        return 'review'
      }
    }
    return 'selection'
  }
  async canRemoveTeamMember() {
    // this.user = await this.context.models.User.find(this.userId)
    // const collection = await this.findCollectionByObject(this.object)
    // if (collection) {
    //   return (
    //     this.isAssignedProductionEditor(collection) &&
    //     this.object.teamType !== 'productionEditor'
    //   )
    // }
    return true
  }
  async canGo() {
    this.user = await this.context.models.User.find(this.userId)
    const collection = await this.findCollectionByObject(this.object)
    if (collection) {
      return (
        this.isAssignedProductionEditor(collection) ||
        this.isAssignedCopyEditor(collection) ||
        this.isAuthor(collection)
      )
    }
    return false
  }
}

module.exports = {
  before: async (userId, operation, object, context) => {
    const user = await context.models.User.find(userId)
    if (user.admin) {
      if (operation && operation === 'PATCH') {
        if (object.current.type === 'fragment') {
          const diff = EditoriaMode.difference(object.update, object.current)
          if (
            object.current.lock !== null &&
            diff.lock !== undefined &&
            diff.lock !== null &&
            object.current.lock.editor.userId !== user.id
          ) {
            return false
          }
        }
      }
    }

    return user && user.admin
  },
  GET: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)

    // GET /api/collections
    if (object && object.path === '/collections') {
      return mode.canListCollections()
    }
    // GET /api/collection
    if (object && object.type === 'collection') {
      return mode.canRead()
    }

    // GET /api/collections/:collectionId/fragments
    if (object && object.path === '/fragments') {
      return true
    }
    // GET /api/collections/:collectionId/fragments/:fragmentId
    if (object && object.type === 'fragment') {
      return mode.canRead()
    }

    // GET /api/users
    if (object && object.path === '/users') {
      return true
    }

    // // GET /api/teams
    if (object && object.path === '/teams') {
      return mode.canListTeams()
    }

    // // GET /api/team
    if (object && object.type === 'team') {
      return mode.canReadTeam()
    }

    // // GET /api/user
    if (object && object.type === 'user') {
      return mode.canReadUser()
    }

    return false
  },
  POST: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    // POST /api/collections
    if (object && object.path === '/collections') {
      return mode.canCreateCollection()
    }
    // POST /api/users
    if (object && object.path === '/users') {
      return true
    }
    // POST /api/fragments
    if (object && object.path === '/collections/:collectionId/fragments') {
      return mode.canInteractWithFragments()
    }
    // POST /api/teams
    if (object && object.path === '/teams') {
      return mode.canCreateTeam()
    }

    return false
  },
  PATCH: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    // PATCH /api/collections/:id
    let data
    if (object) {
      if (object.current) {
        data = object.current
      } else {
        data = object
      }
    } else {
      return false
    }

    if (data.type === 'collection') {
      return mode.canInteractWithCollections()
    }
    // PATCH /api/fragments/:id
    if (data.type === 'fragment') {
      return mode.canUpdateFragment()
    }
    // PATCH /api/teams/:id
    if (data.type === 'team') {
      return mode.canUpdateTeam()
    }

    return false
  },
  DELETE: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    // DELETE /api/collections/:id
    if (object && object.type === 'collection') {
      return mode.canInteractWithCollections()
    }
    // DELETE /api/fragments/:id
    if (object && object.type === 'fragment') {
      return mode.canInteractWithFragments()
    }

    // DELETE /api/teams/:id
    if (object && object.type === 'team') {
      return mode.canUpdateTeam()
    }

    return false
  },
  'can view nav links': (userId, operation, object, context) => false,
  'can add books': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canCreateCollection()
  },
  'can rename books': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithCollections()
  },
  'can delete books': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithCollections()
  },
  'can view teamManager': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithCollections()
  },
  'can view addComponent': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithFragments()
  },
  'can view deleteComponent': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithFragments()
  },
  'can view uploadButton': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithFragments()
  },
  'can view alignmentTool': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithFragments()
  },
  'can view fragmentEdit': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canFragmentEdit()
  },
  'can view stateList': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithFragments()
  },
  'can reorder bookComponents': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithFragments()
  },
  'can change progressList': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canChangeProgress()
  },
  'can change progressList left': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canChangeProgressLeft()
  },
  'can change progressList right': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canChangeProgressRight()
  },
  'can use for editing': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canFragmentEdit()
  },
  'can view multipleFilesUpload': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithFragments()
  },
  'can remove team member': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canRemoveTeamMember()
  },
  // TODO: refactor to use productionEditor property of collection
  'collection:create': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return object.collection.owners.includes(userId) || mode.canBroadcastEvent()
  },
  'collection:patch': (userId, operation, object, context) =>
    // const mode = new EditoriaMode(userId, operation, object, context)
    true,
  'collection:delete': (userId, operation, object, context) => true,
  'fragment:create': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canBroadcastEvent()
  },
  'fragment:patch': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canBroadcastFragmentPatchEvent()
  },
  'can go': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canGo()
  },
  'fragment:delete': (userId, operation, object, context) => true,
  // it is important all the clients to get notified when crud is happening on
  // the team resource in order for the authsome to work properly
  'team:create': (userId, operation, object, context) => true,
  'team:delete': (userId, operation, object, context) => true,
  'team:patch': (userId, operation, object, context) => true,
  'can view add team memeber': (userId, operation, object, context) =>
    // if (object === 'Production Editor') {
    //   return false
    // }
    true,
  'can interact with editor': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canInteractWithEditor()
  },
  // TODO: protect ink endpoint
}
