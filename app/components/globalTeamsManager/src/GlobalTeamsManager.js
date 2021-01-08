/* eslint-disable react/prop-types */
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Select from 'react-select'
import sortBy from 'lodash/sortBy'
import keys from 'lodash/keys'
import omit from 'lodash/omit'
import { th } from '@pubsweet/ui-toolkit'
import { H3 } from '@pubsweet/ui'
import { Loading, Button } from '../../../ui'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 100%;
  height: 100%;
`
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex-grow:1
  justify-content: center;
`
const Title = styled(H3)`
  color: #3f3f3f;
  font-family: ${th('fontReading')};
  font-weight: normal;
  margin: 0;
  margin-right: calc(3 * ${th('gridUnit')});
  padding-bottom: 0;
  padding-top: 3px;
  text-transform: uppercase;
`
const InnerWrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
  height: calc(100% - 80px);
`

const HeaderWrapper = styled.div`
  align-items: center;
  justify-content: flex-start;
  display: flex;
  position: sticky;
  background-color: white;
  height: calc(9 * ${th('gridUnit')});
  z-index: 1;
  top: 0;
  margin-bottom: calc(1 * ${th('gridUnit')});
`
const TeamHeadingWrapper = styled.h4`
  font-size: 24px;
  line-height: 28px;
  margin: 0;
`

const TeamSectionWrapper = styled.div`
  padding: 0;
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
  align-self: flex-end;
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
    <StyledForm>
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
        <Button
          disabled={!props.dirty}
          label="Save"
          title="Save"
          type="submit"
        />
      </ButtonWrapper>
    </StyledForm>
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

    const promises = data.map(team =>
      updateGlobalTeam({
        variables: {
          id: team.id,
          input: omit(team, ['id', '__typename', 'type']),
        },
      }),
    )

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

    if (loading) return <Loading />

    let globalTeams = (teams || []).filter(team => team.global)
    const infoMessage = 'Your teams have been successfully updated'

    const initialValues = {}
    globalTeams.forEach(team => {
      initialValues[team.role] = team.members.map(member => member.user.id)
    })

    globalTeams = sortBy(globalTeams, 'name')

    return (
      <Container>
        <InnerWrapper>
          <HeaderWrapper>
            <Title>Team Manager</Title>
          </HeaderWrapper>
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
        </InnerWrapper>
      </Container>
    )
  }
}

GlobalTeamsManager.defaultProps = {
  teams: null,
  users: null,
}

export default GlobalTeamsManager
