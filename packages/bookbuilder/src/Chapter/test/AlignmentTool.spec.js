import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import sinon from 'sinon'

import AlignmentTool from '../AlignmentTool'

const { data } = global.mock
const type = 'front'
const chapters = data.chapters.filter(chapter => chapter.division === type)

const props = {
  chapter: chapters[0],
  update: sinon.spy(),
}

const getWrapper = () => shallow(<AlignmentTool {...props} />)

test('should render correctly', () => {
  const wrapper = getWrapper()
  const tree = shallowToJson(wrapper)
  expect(tree).toMatchSnapshot()
})
