import { map, debounce, isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import AsyncSelect from 'react-select/async'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Container = styled.div`
  margin-bottom: calc(2 * ${th('gridUnit')});
  padding: 0 calc(2 * ${th('gridUnit')}) 0 calc(2 * ${th('gridUnit')});
  width: 95%;
`
export class AddMember extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.promiseOptions = this.promiseOptions.bind(this)
    this.searchUsers = this.searchUsers.bind(this)

    this.state = {
      message: {},
      selectedOption: null,
    }
  }

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
    const { searchForUsers, team } = this.props
    const teamMemberIds = map(team.members, member => member.user.id)

    searchForUsers({
      variables: {
        search: inputValue,
        exclude: teamMemberIds,
      },
    }).then(res => {
      const { data } = res
      const { searchForUsers } = data
      const options = map(searchForUsers, user => ({
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

    return (
      <Container>
        {show && (
          <AsyncSelect
            autoload={false}
            closeMenuOnSelect
            isClearable={false}
            loadOptions={debounce(this.searchUsers, 500)}
            onChange={this.handleChange}
            placeholder="Search"
            value={this.state.selectedOption}
          />
        )}
      </Container>
    )
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
