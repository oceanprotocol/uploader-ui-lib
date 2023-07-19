import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Tabs from './index'

export default {
  title: 'Component/@shared/Tabs',
  component: Tabs
} as ComponentMeta<typeof Tabs>

const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />

export const items = [
  {
    title: 'First tab',
    content: 'this is the content for the first tab'
  },
  {
    title: 'Second tab',
    content: 'this is the content for the second tab'
  },
  {
    title: 'Third tab',
    content: 'this is the content for the third tab'
  }
]

export const Default = Template.bind({});
Default.args = {
  items: items
};