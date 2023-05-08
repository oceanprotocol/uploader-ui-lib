import * as React from 'react'
import { render, screen } from '@testing-library/react'

import DBSUploader from './DBSUploader'

test('renders children', () => {
  render(<DBSUploader>Some Text</DBSUploader>)
  expect(screen.getByText('Some Text')).toHaveClass('DBSUploader')
})
