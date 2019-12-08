import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';
import { Typography } from "@material-ui/core";

it('renders without crashing', () => {
  const wrapper = shallow(<Home />);

  const welcome = (
<Typography>
CodingTheCollection helps you create educational presentations with uploaded images of artworks and related contextual media.
</Typography>
);
  // expect(wrapper.contains(welcome)).toBe(true);
  expect(wrapper.contains(welcome)).toEqual(true);
});