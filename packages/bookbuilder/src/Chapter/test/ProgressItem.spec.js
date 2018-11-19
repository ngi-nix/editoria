import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import sinon from 'sinon'

import ProgressItem from '../ProgressItem'

const { data } = global.mock
const type = 'front'
const chapters = data.chapters.filter(chapter => chapter.division === type)

const props = {
  chapter: chapters[0],
  type: 'edit',
  modalContainer: {},
  update: sinon.spy(),
  roles: [],
}

const getWrapper = () => shallow(<ProgressItem {...props} />)

test('should render correctly', () => {
  const wrapper = getWrapper()
  const tree = shallowToJson(wrapper)
  expect(tree).toMatchSnapshot()
})
