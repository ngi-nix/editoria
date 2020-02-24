import React from 'react'
import { ApolloConsumer } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_SPELLCHECKER_COMPONENT = gql`
  query SpellChecker($language: String, $text: String) {
    spellChecker(language: $language, text: $text) {
      language
      matches
      software
      warnings
    }
  }
`

const spellCheckerQuery = props => {
  const { render } = props
  return (
    <ApolloConsumer>
      {client => render({ client, query: GET_SPELLCHECKER_COMPONENT })}
    </ApolloConsumer>
  )
}

export default spellCheckerQuery
