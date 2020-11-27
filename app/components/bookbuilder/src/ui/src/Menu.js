/* eslint-disable react/sort-comp */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th, override } from '@pubsweet/ui-toolkit'
import { Button } from '@pubsweet/ui'
import { forEach } from 'lodash'

// #region styled components
const Root = styled.div``

const Label = styled.label`
  display: block;
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};

  ${override('ui.Label')};
  ${override('ui.Menu.Label')};
`

const Opener = styled.button.attrs({
  type: 'button',
})`
  align-items: center;
  background: transparent;
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  border-radius: ${th('borderRadius')};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  height: calc(${th('gridUnit')} * 6);
  padding: 0;
  width: 100%;

  &:hover {
    border-color: ${th('colorPrimary')};
  }
`

const Value = styled.span`
  border-right: ${th('borderWidth')} ${th('borderStyle')}
    ${th('colorFurniture')};
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  line-height: ${th('gridUnit')};
  padding: 0 ${th('gridUnit')};
  text-align: left;
  white-space: nowrap;

  &:hover {
    color: ${th('colorPrimary')};
  }
`

const MultipleValue = styled.span`
  background-color: ${th('colorSecondary')};
  color: ${th('colorPrimary')};
  margin: calc(${th('gridUnit')} / 6);
  padding: 0 calc(${th('gridUnit')} / 2);
  text-align: left;

  button {
    margin-left: calc(${th('gridUnit')} / 2);
    min-width: 0px;
    padding: calc(${th('gridUnit')} / 2);
  }
`

const Placeholder = styled(Value)`
  color: ${th('colorTextPlaceholder')};
  font-style: italic;
  padding: calc(${th('gridUnit')} * 2);
`

const ArrowContainer = styled.span`
  align-items: center;
  display: flex;
  height: calc(${th('gridUnit')} * 2 - ${th('borderWidth')} * 2);
  justify-content: center;
  padding: calc(${th('gridUnit')} * 2);
  width: calc(${th('gridUnit')} * 2);
`

const Arrow = styled.span`
  font-size: 50%;
  transform: scaleX(2) scaleY(${props => (props.open ? -1.2 : 1.2)});
  transition: transform 0.2s;
`

const Main = styled.div.attrs({
  role: 'listbox',
})`
  position: relative;
`

const OptionsContainer = styled.div`
  left: 0;
  position: absolute;
  right: 0;
`

const Options = styled.div`
  background-color: ${th('colorBackground')};
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  border-radius: ${th('borderRadius')};
  left: 0;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
`

const Option = styled.div.attrs({
  role: 'option',
  tabIndex: '0',
  'aria-selected': props => props.active,
})`
  border: ${th('borderWidth')} ${th('borderStyle')} transparent;
  border-width: ${th('borderWidth')} 0 ${th('borderWidth')} 0;
  color: ${props => (props.active ? props.theme.textColor : '#444')};
  cursor: pointer;
  font-family: ${th('fontInterface')};
  font-weight: ${props => (props.active ? '600' : 'inherit')};
  padding: calc(${th('gridUnit')} - ${th('borderWidth')} * 2)
    calc(${th('gridUnit')} * 2);
  white-space: nowrap;

  &:hover {
    background: ${th('colorBackgroundHue')};
    border-color: ${th('colorBorder')};
  }

  &:first-child:hover {
    border-top-color: ${th('colorBackgroundHue')};
  }

  &:last-child:hover {
    border-bottom-color: ${th('colorBackgroundHue')};
  }
`
// #endregion

class Menu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      selected: props.value,
      selectOneOfMultiElement: undefined,
    }

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  resetMenu = props => {
    this.state = {
      open: false,
      selected: undefined,
    }
  }

  toggleMenu = () => {
    this.setState({
      open: !this.state.open,
    })

    if (this.state.open === false) {
      document.addEventListener('mousedown', this.handleClickOutside)
    }
  }

  selectOneOfMultiElement = (event, value) => {
    event.stopPropagation()
    const selectOneOfMultiElement = value
    this.setState({ selectOneOfMultiElement })
    if (this.props.selectElement) this.props.selectElement(value)
  }

  removeSelect = (event, value) => {
    event.stopPropagation()
    let { selected } = this.state
    const index = selected.indexOf(value)
    selected = [...selected.slice(0, index), ...selected.slice(index + 1)]
    this.setState({ selected })
    if (this.props.onChange) this.props.onChange(selected)
  }

  handleClickOutside(event) {
    if (this.state.open) {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleMenu()
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
  }

  handleSelect = ({ selected, open }) => {
    const { multi } = this.props
    let values
    if (multi) {
      values = this.state.selected ? this.state.selected : []
      if (values.indexOf(selected) === -1) values.push(selected)
    } else {
      values = selected
    }

    this.setState({
      selected: values,
    })
    this.toggleMenu()
    if (this.props.onChange) this.props.onChange(values)
  }

  handleKeyPress = (event, selected, open) => {
    if (event.which === 13) {
      this.handleSelect(selected, open)
    }
  }

  optionLabel = value => {
    const { options } = this.props

    const flatOption = []
    forEach(options, value => {
      if (value.children) flatOption.push(value.children)
      if (!value.children) flatOption.push(value)
    })

    return flatOption.find(option => option.value === value)
      ? flatOption.find(option => option.value === value).label
      : ''
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ selected: nextProps.value })
    }
  }

  render() {
    const {
      maxHeight = 250,
      label,
      options,
      inline,
      placeholder,
      renderFooter: RenderFooterOption,
      renderOption: RenderOption,
      renderOpener: RenderOpener,
      className,
      multi,
      reset,
      ...rest
    } = this.props
    const { open, selected } = this.state

    if (reset === true) this.resetMenu(this.props)

    return (
      <Root
        className={className}
        inline={inline}
        open={open}
        ref={this.setWrapperRef}
      >
        {label && <Label>{label}</Label>}
        <Main>
          <RenderOpener
            open={open}
            optionLabel={this.optionLabel}
            placeholder={placeholder}
            removeSelect={this.removeSelect}
            selected={selected}
            selectOneOfMultiElement={this.selectOneOfMultiElement}
            toggleMenu={this.toggleMenu}
            {...rest}
          />
          <OptionsContainer>
            {open && (
              <Options maxHeight={maxHeight} open={open}>
                {options.map((option, key) => {
                  let groupedHeader = null
                  let groupedOptions = [option]
                  if (option.children) {
                    groupedOptions = option.children
                    groupedHeader = option.text ? (
                      <>
                        <span>{option.text}</span>
                        <hr />
                      </>
                    ) : (
                      <hr />
                    )
                  }
                  return (
                    <>
                      {key > 0 && groupedHeader}
                      {groupedOptions.map(groupoption => (
                        <RenderOption
                          handleKeyPress={this.handleKeyPress}
                          handleSelect={this.handleSelect}
                          key={groupoption.value}
                          label={groupoption.label}
                          multi={multi}
                          selected={selected}
                          value={groupoption.value}
                        />
                      ))}
                    </>
                  )
                })}
                <RenderFooterOption />
              </Options>
            )}
          </OptionsContainer>
        </Main>
      </Root>
    )
  }
}

const DefaultMenuOption = ({
  selected,
  label,
  value,
  handleSelect,
  handleKeyPress,
  multi,
}) => {
  const option = (
    <Option
      active={value === selected}
      key={value}
      onClick={() => handleSelect({ open: false, selected: value })}
      onKeyPress={event => handleKeyPress(event, value)}
    >
      {label || value}
    </Option>
  )

  if (!multi) return option
  return multi && !selected.includes(value) ? option : null
}

const DefaultOpener = ({
  toggleMenu,
  open,
  selected,
  placeholder,
  optionLabel,
  removeSelect,
  selectOneOfMultiElement,
}) => (
  <Opener onClick={toggleMenu} open={open}>
    {(!selected || selected.length === 0) && (
      <Placeholder>{placeholder}</Placeholder>
    )}
    {selected && !Array.isArray(selected) && (
      <Value>{optionLabel(selected)}</Value>
    )}
    {selected && selected.length > 0 && Array.isArray(selected) && (
      <Value>
        {selected.map(select => (
          <MultipleValue
            onClick={event => selectOneOfMultiElement(event, select)}
          >
            {optionLabel(select)}
            <Button onClick={event => removeSelect(event, select)}>x</Button>
          </MultipleValue>
        ))}
      </Value>
    )}
    <ArrowContainer>
      <Arrow open={open}>▼</Arrow>
    </ArrowContainer>
  </Opener>
)

Menu.propTypes = {
  /** Menu items. */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ).isRequired,
  /** Custom component for the selected option. */
  renderOpener: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  /** Custom option component. The component will be rendered with *optionProps*. */
  renderOption: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  reset: PropTypes.bool,
  /** Optional label to be shown above the menu. */
  label: PropTypes.string,
  /** Placeholder until a value is selected. */
  placeholder: PropTypes.string,
  /** Maximum height of the options container. */
  maxHeight: PropTypes.number,
}

Menu.defaultProps = {
  renderOption: DefaultMenuOption,
  renderOpener: DefaultOpener,
  reset: false,
  placeholder: 'Choose in the list',
}

export { Menu }
