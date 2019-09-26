import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'
import { th } from '@pubsweet/ui-toolkit'
import map from 'lodash/map'

import WrappedSelect from '../WrappedSelect'
import { DefaultButton } from '../Button'

const BookTitle = styled.div`
  color: #404040;
  font-family: ${th('fontReading')};
  font-size: ${th('fontSizeHeading5')};
  line-height: ${th('lineHeightHeading5')};
  margin-bottom: calc(${th('gridUnit')} * 4);
  text-align: center;
  width: 80%;
`
const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`
const ModeRow = styled.div`
  align-items: center;
  border: 1px solid #828282;
  display: flex;
  justify-content: center;
  margin-bottom: calc(${th('gridUnit')} * 4);
`
const FormatRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: calc(${th('gridUnit')} * 3);
`
const TemplateRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: calc(${th('gridUnit')} * 1);
`

const TemplateLabel = styled.span`
  color: #3f3f3f;
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBase')};
  font-style: normal;
  font-weight: normal;
  line-height: ${th('lineHeightBase')};
  margin-right: calc(${th('gridUnit')} * 2);
  text-align: center;
`

const StyledButton = styled(DefaultButton)`
  background: ${({ active }) => (active ? th('colorPrimary') : 'none')};
  color: ${({ active }) => (active ? 'white' : '#828282')};
  justify-content: center;
  width: 100px;
  &:hover {
    background: ${th('colorPrimary')};
    div {
      color: white;
    }
  }
`

const StyledSelect = styled(WrappedSelect)`
  .react-select__control {
    border: 0;
    border-bottom: 1px solid #3f3f3f;
    border-radius: 0;
    box-shadow: none;
    outline: 0;
    width: 200px;
    &:hover {
      border-bottom: 1px solid ${th('colorPrimary')};
    }
  }
  .react-select__value-container {
    color: #3f3f3f;
    font-family: ${th('fontHeading')};
    font-size: ${th('fontSizeBase')};
    font-style: normal;
    font-weight: normal;
    line-height: ${th('lineHeightBase')};
    padding: 0;
  }
  .react-select__indicator-separator {
    display: none;
  }

  .react-select__menu-list {
    color: #3f3f3f;
    font-family: ${th('fontHeading')};
    font-size: ${th('fontSizeBase')};
    font-style: normal;
    font-weight: normal;
  }
`
const FormatLabel = styled.div`
  color: #828282;
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeHeading5')};
  font-style: normal;
  font-weight: normal;
  letter-spacing: 0.11em;
  line-height: ${th('lineHeightHeading5')};
  margin-bottom: calc(${th('gridUnit')} * 1);
  text-transform: uppercase;
`

const InfoContainer = styled.div`
  color: #3f3f3f;
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBase')};
  font-style: italic;
  font-weight: normal;
  height: 50px;
  line-height: ${th('lineHeightBase')};
  margin-bottom: calc(${th('gridUnit')} * 2);
  text-align: center;
  width: 50%;
`

const RadioButton = styled.label`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: ${({ last }) => (last ? 0 : `calc(8px * 8)`)};

  span {
    color: #3f3f3f;
    font-family: ${th('fontHeading')};
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
    margin-left: calc(${th('gridUnit')});
  }
`

const optionsFormatter = options => {
  const { data } = options
  const { getTemplates } = data
  return map(getTemplates, template => ({
    value: template.id,
    label: template.name,
  }))
}

const targetMapper = {
  epub: 'epub',
  pdf: 'pagedjs',
  pagedjs: 'pagedjs',
  vivliostyle: 'vivliostyle',
}

class ExportBookModal extends Component {
  constructor(props) {
    super(props)
    this.renderFormatOptions = this.renderFormatOptions.bind(this)
    this.renderTemplateSection = this.renderTemplateSection.bind(this)
    this.changeMode = this.changeMode.bind(this)
    this.changeRadioOption = this.changeRadioOption.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      mode: 'preview',
      selectOptions: [],
      selectedValue: null,
      viewer: 'pagedjs',
      templateId: undefined,
      format: 'epub',
    }
  }

  componentDidMount() {
    const { viewer } = this.state
    const { data } = this.props
    const { getTemplates } = data

    getTemplates(targetMapper[viewer]).then(res =>
      this.setState({
        selectOptions: optionsFormatter(res),
        selectedValue: null,
      }),
    )
  }

  componentDidUpdate(_, prevState) {
    const { mode: prevMode } = prevState
    const { mode, viewer, format } = this.state
    const { data } = this.props
    const { getTemplates } = data
    const modeChanged = prevMode !== mode
    if (modeChanged) {
      if (mode === 'preview') {
        return getTemplates(targetMapper[viewer]).then(res =>
          this.setState({
            selectOptions: optionsFormatter(res),
            selectedValue: null,
          }),
        )
      }
      return getTemplates(targetMapper[format]).then(res =>
        this.setState({
          selectOptions: optionsFormatter(res),
          selectedValue: null,
        }),
      )
    }
    return false
  }

  changeMode(mode) {
    this.setState({
      mode,
      viewer: 'pagedjs',
      templateId: undefined,
      selectedValue: null,
      format: 'epub',
    })
  }

  changeRadioOption(e) {
    const { mode } = this.state
    const { data } = this.props
    const { getTemplates } = data
    const { target } = e
    const { value } = target

    if (mode === 'preview') {
      this.setState({
        viewer: value,
        templateId: undefined,
        selectedValue: null,
      })
    } else {
      this.setState({
        format: value,
        templateId: undefined,
        selectedValue: null,
      })
    }
    return getTemplates(targetMapper[value]).then(res =>
      this.setState({
        selectOptions: optionsFormatter(res),
        selectedValue: null,
      }),
    )
  }

  handleSubmit() {
    const { mode, viewer, format, templateId } = this.state
    const { data } = this.props
    const { onConfirm } = data

    if (!templateId && format !== 'icml') return false

    return onConfirm(mode, viewer, templateId, format)
  }

  onChange(selection) {
    const { value } = selection
    this.setState({ templateId: value, selectedValue: selection })
  }

  renderTemplateSection() {
    const { mode, format, selectOptions, selectedValue } = this.state
    if (mode === 'download' && format === 'icml') {
      return null
    }

    return (
      <TemplateRow>
        <TemplateLabel>Template</TemplateLabel>
        <StyledSelect
          isClearable={false}
          isDisabled={false}
          isLoading={false}
          isSearchable={false}
          onChange={this.onChange}
          options={selectOptions}
          value={selectedValue}
        />
      </TemplateRow>
    )
  }

  renderFormatOptions() {
    const { mode, viewer, format } = this.state
    const textMapper = {
      epub: 'You are about to export a valid EPUB v3 file.',
      icml:
        'You will get a compressed zip file containing all images used in the book and the ICML file ready to be imported in Adobe inDesign.',
      pdf: 'Using PagedJS, we’ll generate a PDF version of your book',
      pagedjs: 'View your book in PagedJS for more granular styles tunning',
      vivliostyle:
        'View your book in Vivliostyle to get an idea of how an EPUB version will be like',
    }

    if (mode === 'download') {
      return (
        <Fragment>
          <FormatLabel>Format</FormatLabel>
          <FormatRow>
            <RadioButton>
              <input
                checked={format === 'epub'}
                name="epub"
                onChange={this.changeRadioOption}
                type="radio"
                value="epub"
              />
              <span>EPUB</span>
            </RadioButton>
            <RadioButton>
              <input
                checked={format === 'pdf'}
                name="pdf"
                onChange={this.changeRadioOption}
                type="radio"
                value="pdf"
              />
              <span>PDF</span>
            </RadioButton>
            <RadioButton last>
              <input
                checked={format === 'icml'}
                name="icml"
                onChange={this.changeRadioOption}
                type="radio"
                value="icml"
              />
              <span>ICML</span>
            </RadioButton>
          </FormatRow>
          <InfoContainer>{textMapper[format]}</InfoContainer>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <FormatLabel>Viewer</FormatLabel>
        <FormatRow>
          <RadioButton>
            <input
              checked={viewer === 'pagedjs'}
              name="pagedjs"
              onChange={this.changeRadioOption}
              type="radio"
              value="pagedjs"
            />
            <span>PagedJS</span>
          </RadioButton>
          <RadioButton last>
            <input
              checked={viewer === 'vivliostyle'}
              name="vivliostyle"
              onChange={this.changeRadioOption}
              type="radio"
              value="vivliostyle"
            />
            <span>Vivliostyle</span>
          </RadioButton>
        </FormatRow>
        <InfoContainer>{textMapper[viewer]}</InfoContainer>
      </Fragment>
    )
  }

  render() {
    const { isOpen, hideModal, data } = this.props
    const { bookTitle } = data
    const { mode, templateId, format } = this.state
    const mainSection = this.renderFormatOptions()
    const templateSection = this.renderTemplateSection()

    return (
      <DialogModal
        disableConfirm={!templateId && format !== 'icml'}
        headerText="EXPORT BOOK"
        isOpen={isOpen}
        notCentered
        onConfirm={this.handleSubmit}
        onRequestClose={hideModal}
        size="medium_narrow"
      >
        <Container>
          <BookTitle>{bookTitle}</BookTitle>
          <ModeRow>
            <StyledButton
              active={mode === 'preview'}
              label="Preview"
              onClick={() => this.changeMode('preview')}
            />
            <StyledButton
              active={mode === 'download'}
              label="Download"
              last
              onClick={() => this.changeMode('download')}
            />
          </ModeRow>
          {mainSection}
          {templateSection}
        </Container>
      </DialogModal>
    )
  }
}

export default ExportBookModal
