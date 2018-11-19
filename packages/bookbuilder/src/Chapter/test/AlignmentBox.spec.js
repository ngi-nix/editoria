import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import sinon from 'sinon'

import AlignmentBox from '../AlignmentBox'

const { data } = global.mock
const type = 'front'
const chapters = data.chapters.filter(chapter => chapter.division === type)

const props = {
  chapter: chapters[0],
  position: 'left',
  update: sinon.spy(),
}

const getWrapper = () => shallow(<AlignmentBox {...props} />)

test('should render correctly', () => {
  const wrapper = getWrapper()
  const tree = shallowToJson(wrapper)
  expect(tree).toMatchSnapshot()
})
