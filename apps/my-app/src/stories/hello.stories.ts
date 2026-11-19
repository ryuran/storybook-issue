import type { Meta, StoryObj } from '@storybook/angular-vite';

import { Hello } from './hello';

const meta: Meta<Hello> = { title: 'Hello', component: Hello };
export default meta;

export const Default: StoryObj<Hello> = {};
