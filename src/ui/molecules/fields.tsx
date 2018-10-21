import TextField, { Props as ITextFieldProps } from '@atlaskit/field-text'
import { FastField, FieldProps } from 'formik'
import { path } from 'ramda'
import * as React from 'react'

interface IOwnProps {
  name: string
}

const InputComponent: React.SFC<FieldProps & ITextFieldProps & IOwnProps> = ({
  field,
  form: { errors, touched },
  ...rest
}) => {
  const fieldPath = field.name.split('.')
  const isTouched = path(fieldPath, touched)
  const actualError = path(fieldPath, errors)
  const error = isTouched && actualError

  return <TextField {...field} {...rest} isInvalid={!!error} invalidMessage={error} />
}

const Input: React.SFC<ITextFieldProps & IOwnProps> = props => <FastField {...props} component={InputComponent} />

export const Fields = { Input }
