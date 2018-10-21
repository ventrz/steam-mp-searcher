import Button from '@atlaskit/button'
import TrashIcon from '@atlaskit/icon/glyph/trash'
import Spinner from '@atlaskit/spinner'
import { FieldArray, Formik } from 'formik'
import { Box, Flex } from 'grid-styled'
import * as React from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

import { getSteamIDWithCache } from './api'
import { Container, Fields, indents } from './ui'

const MAX_AMOUNT_OF_PEOPLE = 5

// override atlaskit styles in bruteforce way
const AdjustedButton = styled(Button)`
  height: 40px;
  margin-left: ${indents.XS};
  padding-top: 3px;
`

const validationSchema = Yup.object().shape({
  accounts: Yup.array().of(
    Yup.string()
      .required('Please fill the field')
      .test(
        'not-found',
        'No match found',
        // since formik's custom async validation kinda conflicts with validationSchema
        // (and with form without it - https://github.com/jaredpalmer/formik/issues/834),
        // this way async stuff can be handled
        value =>
          value
            ? getSteamIDWithCache(value)
                .then(({ steamid }) => !!steamid)
                .catch(() => false)
            : true,
      )
      .test('unique', 'URLs must be unique', function(value) {
        return value ? !(this.parent.filter(v => v === value).length > 1) : true
      }),
  ),
})

interface IProps {
  onSubmit: (values: string[]) => void
  isLoading: boolean
}

export class SteamNamesForm extends React.Component<IProps> {
  handleSubmit = ({ accounts }) => this.props.onSubmit(accounts)

  render() {
    const { isLoading } = this.props

    return (
      <Formik
        initialValues={{ accounts: ['', ''] }}
        onSubmit={this.handleSubmit}
        validateOnChange={false}
        validationSchema={validationSchema}
        render={({ values: { accounts }, isValid, touched, handleSubmit, isValidating }) => (
          <form onSubmit={handleSubmit}>
            <FieldArray
              name="accounts"
              render={({ push, remove }) => (
                <React.Fragment>
                  <Flex is={Container} position="relative" flexDirection="column" m="0 auto" width={1 / 4}>
                    {isValidating && (
                      <Container position="absolute" top="7px" right="0" fontSize="0.6rem" fontWeight="bold">
                        <Spinner size="small" delay="0" /> Processing your data
                      </Container>
                    )}
                    <Box mb={indents.S}>
                      {accounts.map((acc, index) => {
                        const fieldName = `accounts.${index}`

                        return (
                          <Flex flexDirection="row" alignItems="center" key={`${index}_${accounts.length}`}>
                            <Fields.Input
                              label={index ? `Friend #${index}` : 'Your account:'}
                              name={fieldName}
                              shouldFitContainer
                              required
                            />
                            {index > 1 ? (
                              <Box is={AdjustedButton} alignSelf="flex-end" onClick={() => remove(index)}>
                                <Box is={TrashIcon} label="delete" />
                              </Box>
                            ) : null}
                          </Flex>
                        )
                      })}
                    </Box>
                    <Flex justifyContent="space-between">
                      <Button
                        appearance="help"
                        onClick={() => push('')}
                        isDisabled={!(accounts.length < MAX_AMOUNT_OF_PEOPLE)}>
                        Add friend (up to {MAX_AMOUNT_OF_PEOPLE - 1})
                      </Button>
                      <Button
                        appearance="primary"
                        isDisabled={!isValid || isValidating || !Object.keys(touched).length}
                        isLoading={isLoading}
                        type="submit">
                        Check us out!
                      </Button>
                    </Flex>
                  </Flex>
                </React.Fragment>
              )}
            />
          </form>
        )}
      />
    )
  }
}
