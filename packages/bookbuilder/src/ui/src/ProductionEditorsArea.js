import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const ProductionEditorsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  font-family: 'Fira Sans Condensed';
  justify-content: flex-start;
  margin: calc(4 * ${th('gridUnit')}) auto calc(4 * ${th('gridUnit')});
`
const NamesContainer = styled.div`
  display: flex;
  /* flex-flow: column nowrap; */
  margin: 0 calc(3 * ${th('gridUnit')}) 0 0;
`
const ProductionEditorLabel = styled.div`
  color: ${th('colorText')};
  flex-basis: content;
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
`
const ProductionEditorNames = styled.div`
  color: ${th('colorText')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
`

const ProductionEditorActions = styled.div`
  align-items: flex-start;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
`

const normalizer = productionEditors => {
  let names = ''
  let label = 'Production Editor:'

  if (productionEditors && productionEditors.length > 1) {
    label = 'Production Editors:'
    for (let i = 0; i < productionEditors.length; i += 1) {
      if (i !== productionEditors.length - 1) {
        names += `${productionEditors[i]}, `
      } else {
        names += `${productionEditors[i]}`
      }
    }
  } else if (productionEditors && productionEditors.length !== 0) {
    names = productionEditors[0]
  } else {
    names = 'Unassigned'
  }

  return { names, label }
}
const ProductionEditorsArea = ({ productionEditors, actions }) => {
  const { label, names } = normalizer(productionEditors)

  return (
    <ProductionEditorsContainer>
      <NamesContainer>
        <ProductionEditorLabel>{label}</ProductionEditorLabel>
        <ProductionEditorNames>{names}</ProductionEditorNames>
      </NamesContainer>
      <ProductionEditorActions>{actions}</ProductionEditorActions>
    </ProductionEditorsContainer>
  )
}

export default ProductionEditorsArea
