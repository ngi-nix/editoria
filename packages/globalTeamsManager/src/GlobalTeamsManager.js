/* eslint-disable react/prop-types */
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Select from 'react-select'
import { sortBy, keys, omit } from 'lodash'

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
  margin-top: 8px;
  padding: calc(8px / 2) 0;
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
    border: 1px solid black;
    border-radius: 0;
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
  font-size: 36px;
  margin: 0;
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
        id: user.id,
      }))
    : []

  const selectValue = value.map(usr => {
    const user = users.find(u => u.id === usr)
    if (user) {
      return {
        label: user.username,
        id: usr,
      }
    }
    return usr
  })

  const handleChange = newValue => {
    setFieldValue(type, newValue)
  }

  return (
    <TeamSectionWrapper>
      <TeamHeading name={name} />
      <StyledSelect
        closeMenuOnSelect={false}
        getOptionValue={option => option.id}
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
          type={team.role}
          users={users}
          value={values[team.role]}
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

  handleSubmit = (formValues, formikBag) => {
    const { teams, updateGlobalTeam } = this.props

    const data = keys(formValues).map(role => {
      const team = teams.find(t => t.role === role)
      team.members = formValues[role].map(item => ({ user: { id: item.id } }))
      return team
    })

    const promises = data.map(team => {
      return updateGlobalTeam({
        variables: {
          id: team.id,
          input: omit(team, ['id', '__typename', 'type']),
        },
      })
    })

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
    const { users, teams, loading } = this.props
    const { hideRibbon } = this.state

    if (loading) return 'Loading...'

    let globalTeams = (teams || []).filter(team => team.global)
    const infoMessage = 'Your teams have been successfully updated'

    const initialValues = {}
    globalTeams.forEach(team => {
      initialValues[team.role] = team.members.map(member => member.user.id)
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

export default GlobalTeamsManager
