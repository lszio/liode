import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PowerMemory } from './index';

export default {
  title: 'Geist/PowerMemory',
  component: PowerMemory,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PowerMemory>;

const Template: ComponentStory<typeof PowerMemory> = (args) => <PowerMemory {...args} />;

export const  Default = Template.bind({});
Default.args = {
  user: {
    name: 'Jane Doe',
  },
};
