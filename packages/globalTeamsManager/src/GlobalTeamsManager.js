/* eslint-disable react/prop-types */
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Select from 'react-select'
import { sortBy, keys } from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// TODO -- clean up this import
import Actions from 'pubsweet-client/src/actions'

const TeamHeadingWrapper = styled.h4`
  border-bottom: 1px solid black;
  font-size: 24px;
  line-height: 28px;
  margin: 0;
`

const TeamSectionWrapper = styled.div`
  padding: calc(8px * 2) 0;
`

const Ribbon = styled.div`
  background: green;
  border-radius: 3px;
  color: #fff;
  font-size: 14px;
  line-height: 16px;
  padding: calc(8px / 2) 0;
  margin-top: 8px;
  text-align: center;
  visibility: ${props => (props.hide ? 'hidden' : 'visible')};
  width: 60%;
`

const ButtonWrapper = styled.div`
  padding: calc(8px * 2) 0;
`

const StyledSelect = styled(Select)`
  margin-top: 8px;
  outline: none;

  > div:first-of-type {
    border-radius: 0;
    border: 1px solid black;
    box-shadow: none;

    &:hover {
      border-color: #0b65cb;
    }

    > div > div > div:last-child {
      &:hover {
        background: #ff2d1a;
        color: #ff2d1a;
      }
    }
  }
`

const PageHeading = styled.h2`
  margin: 0;
  font-size: 36px;
  padding: 0 calc(8px * 2);
`

const PageWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  form {
    width: 60%;
  }
`

const TeamHeading = props => {
  const { name } = props
  return <TeamHeadingWrapper>{name}</TeamHeadingWrapper>
}

const TeamSection = props => {
  const { name, setFieldValue, type, users, value } = props

  const options = users
    ? users.map(user => ({
        label: user.username,
        value: user.id,
      }))
    : []

  const selectValue = value.map(userId => {
    const user = users.find(u => u.id === userId)
    if (user) {
      return {
        label: user.username,
        value: userId,
      }
    }
    return userId
  })

  const handleChange = newValue => {
    setFieldValue(type, newValue)
  }

  return (
    <TeamSectionWrapper>
      <TeamHeading name={name} />
      <StyledSelect
        closeMenuOnSelect={false}
        isMulti
        name={type}
        onChange={handleChange}
        options={options}
        value={selectValue}
      />
    </TeamSectionWrapper>
  )
}

const TeamManagerForm = props => {
  const { setFieldValue, teams, users, values } = props

  return (
    <Form>
      {teams.map(team => (
        <TeamSection
          key={team.id}
          name={team.name}
          setFieldValue={setFieldValue}
          type={team.teamType}
          users={users}
          value={values[team.teamType]}
        />
      ))}

      <ButtonWrapper>
        <button disabled={!props.dirty} primary type="submit">
          Save
        </button>
      </ButtonWrapper>
    </Form>
  )
}

class GlobalTeamsManager extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hideRibbon: true,
      ready: false,
    }
  }

  componentWillMount() {
    const { getUsers, getTeams } = this.props.actions
    Promise.all([getUsers(), getTeams()]).then(values => {
      this.setState({ ready: true })
    })
  }

  handleSubmit = (formValues, formikBag) => {
    const { teams, actions } = this.props
    const { updateTeam } = actions

    const data = keys(formValues).map(teamType => ({
      id: teams.find(t => t.teamType === teamType && t.global).id,
      members: formValues[teamType].map(item => {
        if (item.id) return item.id
        return item.value
      }),
    }))
    console.log('data', data)
    const promises = data.map(team => updateTeam(team))

    Promise.all(promises).then(res => {
      this.showRibbon()
      formikBag.resetForm(formValues)
    })
  }

  // TODO -- handle better cases like many quick saves
  showRibbon = () => {
    this.setState({
      hideRibbon: false,
    })

    setTimeout(
      () =>
        this.setState({
          hideRibbon: true,
        }),
      4000,
    )
  }

  render() {
    const { users, teams } = this.props
    const { hideRibbon, ready } = this.state

    if (!ready) return null

    let globalTeams = teams.filter(team => team.global)
    const infoMessage = 'Your teams have been successfully updated'

    const initialValues = {}
    globalTeams.forEach(team => {
      initialValues[team.teamType] = team.members
    })

    globalTeams = sortBy(globalTeams, 'name')

    return (
      <PageWrapper>
        <PageHeading>Team Manager</PageHeading>
        <Ribbon hide={hideRibbon}>{infoMessage}</Ribbon>

        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          render={formikProps => (
            <TeamManagerForm
              teams={globalTeams}
              users={users}
              {...formikProps}
            />
          )}
        />
      </PageWrapper>
    )
  }
}

GlobalTeamsManager.defaultProps = {
  teams: null,
  users: null,
}

function mapStateToProps(state, { match }) {
  const { users, teams } = state
  return {
    users: users.users,
    teams,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GlobalTeamsManager)
