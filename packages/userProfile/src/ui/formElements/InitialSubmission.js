/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'
import { get } from 'lodash'

import { th } from '@pubsweet/ui-toolkit'

import { getWBLaboratory, getWBPerson } from '../../fetch/WBApi'

import { onAutocompleteChange, onSuggestionSelected } from './helpers'

import { AuthorInput } from './index'
import AutoComplete from './AutoComplete'
import Checkbox from './Checkbox'
import Image from './Image'
import TextEditor from './TextEditor'
import TextField from './TextField'
import TextFieldGroup from './TextFieldGroup'

const Info = styled.div`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  margin-bottom: ${th('gridUnit')};
`

const disclaimerDescription = (
  <React.Fragment>
    <p>
      I/we declare to the best of my/our knowledge that the experiment is
      reproducible; that the submission has been approved by all authors; that
      the submission has been approved by the laboratory&#39;s Principal
      Investigator, and that the results have not been published elsewhere. The
      author(s) declare no conflict of interest.
    </p>
  </React.Fragment>
)

const InitialSubmission = props => {
  const { errors, handleChange, setFieldValue, values, upload } = props

  return (
    <React.Fragment>
      <Info>
        Enter author names in the order they will appear in the article:
        corresponding, first, second, etc.
      </Info>

      <AuthorInput
        label="Name"
        name="author"
        placeholder="Please type in your name"
        required
        {...props}
      />

      <TextField
        data-test-id="author-email"
        error={get(errors, 'author.email')}
        label="Email address"
        name="author.email"
        placeholder="this is the email"
        required
        value={get(values, 'author.email')}
        {...props}
      />

      <TextFieldGroup
        authors
        data={getWBPerson}
        data-test-id="coauthors"
        handleChange={handleChange}
        label="Co-Authors"
        name="coAuthors"
        placeholder="Please type a co-author's name"
        {...props}
      />

      <AutoComplete
        data-test-id="laboratory"
        error={get(errors, 'laboratory.name')}
        fetchData={getWBLaboratory}
        label="Laboratory"
        name="laboratory.name"
        onChange={e =>
          onAutocompleteChange(
            e,
            'laboratory.name',
            setFieldValue,
            handleChange,
          )
        }
        onSuggestionSelected={onSuggestionSelected}
        placeholder="Enter your PI’s registered WormBase Laboratory"
        required
        value={get(values, 'laboratory.name')}
        {...props}
      />

      <TextField
        data-test-id="funding"
        error={get(errors, 'funding')}
        label="Funding"
        name="funding"
        placeholder="this is the funding"
        required
        value={get(values, 'funding')}
        {...props}
      />

      <TextEditor
        bold
        data-test-id="title"
        error={get(errors, 'title')}
        italic
        key={`title-${props.readOnly}`}
        label="Title"
        name="title"
        placeholder="Please enter the title of your manuscript"
        required
        subscript
        superscript
        value={get(values, 'title')}
        {...props}
      />

      <Image
        data-test-id="image"
        label="Image"
        name="image"
        required
        upload={upload}
        {...props}
      />

      <TextEditor
        bold
        data-test-id="image-caption"
        error={get(props.errors, 'imageCaption')}
        italic
        key={`image-caption-${props.readOnly}`}
        label="Image caption"
        name="imageCaption"
        placeholder="Image caption"
        required
        subscript
        superscript
        value={get(values, 'imageCaption')}
        {...props}
      />

      <TextEditor
        bold
        data-test-id="pattern-description"
        error={get(props.errors, 'patternDescription')}
        italic
        key={`pattern-description-${props.readOnly}`}
        label="Main article text"
        name="patternDescription"
        placeholder="Enter article text here"
        required
        subscript
        superscript
        value={get(values, 'patternDescription')}
        {...props}
      />

      <TextEditor
        bold
        data-test-id="methods"
        error={get(props.errors, 'methods')}
        italic
        key={`methods-${props.readOnly}`}
        label="Methods & Reagents"
        name="methods"
        placeholder="Provide the methods and reagents used"
        required
        subscript
        superscript
        value={get(values, 'methods')}
        {...props}
      />

      <TextEditor
        bold
        data-test-id="references"
        error={get(props.errors, 'references')}
        italic
        key={`references-${props.readOnly}`}
        label="References"
        name="references"
        placeholder={`PMIDs are required unless they don't exist. Please enter references in this format: "Frokjaer-Jensen, C., Davis, M.W., Hopkins, C.E., Newman, B.J., Thummel, J.M., Olesen, S.P., Grunnet, M., and Jorgensen, E.M. (2008). Single-copy insertion of transgenes in Caenorhabditis elegans. Nat Genet 40, 1375-1383. Pubmed PMID: 18953339"`}
        required
        subscript
        superscript
        value={get(values, 'references')}
        {...props}
      />

      <TextField
        data-test-id="acknowledgements"
        error={get(errors, 'acknowledgements')}
        label="Acknowledgements"
        name="acknowledgements"
        value={get(values, 'acknowledgements')}
        {...props}
      />

      <AutoComplete
        data-test-id="suggested-reviewer"
        error={get(errors, 'suggestedReviewer.name')}
        fetchData={getWBPerson}
        label="Suggested Reviewer"
        name="suggestedReviewer.name"
        onChange={e =>
          onAutocompleteChange(
            e,
            'laboratory.name',
            setFieldValue,
            handleChange,
          )
        }
        onSuggestionSelected={onSuggestionSelected}
        placeholder="Please suggest a reviewer"
        value={get(values, 'suggestedReviewer.name')}
        {...props}
      />

      <Checkbox
        checkBoxText="I agree"
        checked={get(values, 'disclaimer')}
        data-test-id="disclaimer"
        description={disclaimerDescription}
        label="Disclaimer"
        name="disclaimer"
        onChange={handleChange}
        required
        value={get(values, 'disclaimer')}
        {...props}
      />

      <TextEditor
        data-test-id="comments"
        error={get(props.errors, 'comments')}
        key={`comments-${props.readOnly}`}
        label="Comments to the editor"
        name="comments"
        value={get(values, 'comments')}
        {...props}
      />
    </React.Fragment>
  )
}

export default InitialSubmission
