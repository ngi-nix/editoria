import { map, debounce, isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import AsyncSelect from 'react-select/lib/Async'

import styles from '../styles/teamManager.local.scss'

export class AddMember extends React.Component {
  constructor(props) {
    super(props)

    // this._onClickAdd = this._onClickAdd.bind(this)

    // this._search = this._search.bind(this)
    // this._save = this._save.bind(this)
    // this._updateMessage = this._updateMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.promiseOptions = this.promiseOptions.bind(this)
    this.searchUsers = this.searchUsers.bind(this)
    // this._hide = this._hide.bind(this)

    this.state = {
      message: {},
      selectedOption: null,
    }
  }

  // _onClickAdd() {
  //   this.setState({ message: {} })
  //   this._search(this.addUser.state.value)
  //   this.addUser.state.value = ''
  // }

  /* eslint-disable */
  // _search(username) {
  //   const { team, users, findUser } = this.props
  // findUser({
  //   variables: {
  //     search: username,
  //   },
  // }).then(res=>console.log(res))

  // const user = find(users, c => c.username === username)

  // if (user) {
  //   team.members = union(team.members, [user.id])
  //   this._save(team)
  //   return this._updateMessage(null, username)
  // }

  // this._updateMessage('error', username)
  // }
  /* eslint-enable */

  // _save(team) {
  //   const { update, updateCollection, book, users } = this.props
  //   update(team).then(res => {
  //     if (res.team.teamType === 'productionEditor') {
  //       const productionEditors = []
  //       for (let i = 0; i < res.team.members.length; i += 1) {
  //         productionEditors.push(find(users, c => c.id === res.team.members[i]))
  //       }
  //       updateCollection({
  //         id: book.id,
  //         productionEditor: productionEditors,
  //       })
  //     }
  //   })
  // }

  /* eslint-disable */
  // _updateMessage(error, username) {
  //   let msg

  //   if (error) {
  //     msg = `user ${username} not found`
  //     return this.setState({
  //       message: {
  //         error: true,
  //         text: msg,
  //         classname: 'failureGroup',
  //       },
  //     })
  //   }

  //   msg = `user ${username} successfully added to group`
  //   this.setState({
  //     message: {
  //       error: false,
  //       text: msg,
  //       classname: 'successGroup',
  //     },
  //   })
  // }
  /* eslint-enable */

  // _hide() {
  //   this.setState({ message: {} })
  //   this.props.hideInput()
  // }

  handleChange(selectedOption) {
    this.setState({ selectedOption })
    const { team, update } = this.props
    const updatedMembers = map(team.members, member => ({
      user: {
        id: member.user.id,
      },
    }))
    updatedMembers.push({ user: { id: selectedOption.value } })

    update({
      variables: { id: team.id, input: { members: updatedMembers } },
    }).then(res => this.setState({ selectedOption: null }))
  }

  promiseOptions(inputValue, callback) {
    const { findUser, team } = this.props
    const teamMemberIds = map(team.members, member => member.user.id)

    findUser({
      variables: {
        search: inputValue,
        exclude: teamMemberIds,
      },
    }).then(res => {
      const { data } = res
      const { findUser } = data
      const options = map(findUser, user => ({
        value: user.id,
        label: `${user.givenName} ${user.surname}`,
      }))
      return callback(options)
    })
  }

  searchUsers(inputValue, callback) {
    if (isEmpty(inputValue)) {
      return callback(null, { options: [] })
    }
    return this.promiseOptions(inputValue, callback)
  }

  render() {
    const { show } = this.props
    const addSingleMember = show ? (
      <div className={styles.userInputContainer}>
        <AsyncSelect
          autoload={false}
          value={this.state.selectedOption}
          placeholder="Type"
          closeMenuOnSelect
          onChange={this.handleChange}
          isClearable={false}
          loadOptions={debounce(this.searchUsers, 500)}
        />

        <span className={styles[this.state.message.classname]}>
          {this.state.message.text}
        </span>
      </div>
    ) : null

    return <span> {addSingleMember} </span>
  }
}

AddMember.propTypes = {
  show: PropTypes.bool.isRequired,
  hideInput: PropTypes.func.isRequired,
  team: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    rev: PropTypes.string,
    teamType: PropTypes.shape({
      name: PropTypes.string,
      permissions: PropTypes.arrayOf(PropTypes.string),
    }),
    members: PropTypes.arrayOf(PropTypes.string),
    object: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
    }),
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      admin: PropTypes.bool,
      email: PropTypes.string,
      id: PropTypes.string,
      rev: PropTypes.string,
      type: PropTypes.string,
      username: PropTypes.string,
    }),
  ),
  update: PropTypes.func.isRequired,
}

export default AddMember
