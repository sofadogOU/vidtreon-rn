import * as React from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { View as MotiView } from 'moti'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-spinkit'
import { useForm, Controller } from 'react-hook-form'
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'

import * as k from '@/utils/constants'

import { useTranslation } from '@/providers/TranslationProvider'

import { Icon } from '../icon.component'
import { Button } from '../buttons.component'

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = LoginCredentials & {
  firstName: string
  lastName?: string
}

interface Props {
  isVisible: boolean
  onClose: () => void
  onLogin: (data: LoginCredentials) => void
  onRegister: (data: RegisterCredentials) => void
  showSpinner: boolean
}

export const SignupForm = ({
  isVisible,
  onClose,
  onRegister,
  onLogin,
  showSpinner,
}: Props) => {
  const insets = useSafeAreaInsets()
  const i18n = useTranslation()

  const scrollRef = React.useRef<ScrollView>()

  const [isShowing, setShowing] = React.useState(isVisible)
  const [loginSelected, setLoginSelected] = React.useState(true)

  const loginForm = useForm()
  const registerForm = useForm()

  React.useEffect(() => setShowing(isVisible), [isVisible])

  const handleClose = () => {
    setShowing(false)
  }

  const handleAnimateEnd = (_: unknown, isFinished: boolean) => {
    if (isFinished && !isShowing) {
      onClose()
    }
  }

  const handleRegister = (data: RegisterCredentials) => onRegister(data)
  const handleLogin = (data: LoginCredentials) => onLogin(data)

  const handleDismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const handleNavPress = (type: 'login' | 'register') => {
    if (type === 'register') {
      scrollRef.current?.scrollTo({ x: k.screen.w })
      setLoginSelected(false)
    } else if (type === 'login') {
      scrollRef.current?.scrollTo({ x: 0 })
      setLoginSelected(true)
    }
  }

  const renderRegistrationForm = () => (
    <PageWrapper>
      <FormWrapper>
        <Field>
          <LabelWrapper>
            <Label>{i18n.t('field_first_name')}</Label>
            {registerForm.formState.errors.firstName && (
              <ErrorLabel>{`*${i18n.t('label_required')}`}</ErrorLabel>
            )}
          </LabelWrapper>
          <Controller
            control={registerForm.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={(value: string) => onChange(value)}
                value={value}
              />
            )}
            name="firstName"
            rules={{
              required: true,
            }}
          />
        </Field>
        <Field>
          <LabelWrapper>
            <Label>{i18n.t('field_last_name')}</Label>
          </LabelWrapper>
          <Controller
            control={registerForm.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={(value: string) => onChange(value)}
                value={value}
              />
            )}
            name="lastName"
          />
        </Field>
        <Field>
          <LabelWrapper>
            <Label>{i18n.t('field_email')}</Label>
            {registerForm.formState.errors.email?.type === 'required' ? (
              <ErrorLabel>{`*${i18n.t('label_required')}`}</ErrorLabel>
            ) : (
              <ErrorLabel>
                {registerForm.formState.errors.email?.message}
              </ErrorLabel>
            )}
          </LabelWrapper>
          <Controller
            control={registerForm.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={(value: string) => onChange(value)}
                value={value}
                keyboardType="email-address"
              />
            )}
            name="email"
            rules={{
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email not valid',
              },
            }}
          />
        </Field>
        <Field>
          <LabelWrapper>
            <Label>{i18n.t('field_password')}</Label>
            {registerForm.formState.errors.password && (
              <ErrorLabel>{`*${i18n.t('label_required')}`}</ErrorLabel>
            )}
          </LabelWrapper>
          <Controller
            control={registerForm.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                secureTextEntry
                onBlur={onBlur}
                onChangeText={(value: string) => onChange(value)}
                value={value}
              />
            )}
            name="password"
            rules={{
              required: true,
            }}
          />
        </Field>
        <Action onPress={registerForm.handleSubmit(handleRegister)}>
          {showSpinner ? (
            <Spinner
              type="ThreeBounce"
              color="white"
              style={{
                marginTop: k.isAndroid ? 0 : -10,
              }}
            />
          ) : (
            <Button.Label style={{ color: 'white' }}>
              {i18n.t('button_register')}
            </Button.Label>
          )}
        </Action>
      </FormWrapper>
    </PageWrapper>
  )

  const renderLoginForm = () => (
    <PageWrapper>
      <FormWrapper>
        <Field>
          <LabelWrapper>
            <Label>{i18n.t('field_email')}</Label>
            {loginForm.formState.errors.email?.type === 'required' ? (
              <ErrorLabel>{`*${i18n.t('label_required')}`}</ErrorLabel>
            ) : (
              <ErrorLabel>
                {loginForm.formState.errors.email?.message}
              </ErrorLabel>
            )}
          </LabelWrapper>
          <Controller
            control={loginForm.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={(value: string) => onChange(value)}
                value={value}
                keyboardType="email-address"
              />
            )}
            name="email"
            rules={{
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email not valid',
              },
            }}
          />
        </Field>
        <Field>
          <LabelWrapper>
            <Label>{i18n.t('field_password')}</Label>
            {loginForm.formState.errors.password && (
              <ErrorLabel>{`*${i18n.t('label_required')}`}</ErrorLabel>
            )}
          </LabelWrapper>
          <Controller
            control={loginForm.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                secureTextEntry
                onBlur={onBlur}
                onChangeText={(value: string) => onChange(value)}
                value={value}
              />
            )}
            name="password"
            rules={{
              required: true,
            }}
          />
        </Field>
        <Action onPress={loginForm.handleSubmit(handleLogin)}>
          {showSpinner ? (
            <Spinner
              type="ThreeBounce"
              color="white"
              style={{
                marginTop: k.isAndroid ? 0 : -10,
              }}
            />
          ) : (
            <Button.Label style={{ color: 'green' }}>
              {i18n.t('button_login')}
            </Button.Label>
          )}
        </Action>
      </FormWrapper>
    </PageWrapper>
  )

  return (
    <Wrapper
      animate={{ opacity: isShowing ? 1 : 0 }}
      transition={{ type: 'timing', duration: 200 }}
      onDidAnimate={handleAnimateEnd}
      pointerEvents={isShowing ? 'auto' : 'none'}
      style={{ height: k.screen.h }}
    >
      <SafeWrapper
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <KeyboardAwareScrollView enableOnAndroid>
          <Container>
            <TitleWrapper>
              <CloseButton onPress={handleClose}>
                <Icon name="closeCircle" />
              </CloseButton>
              <Title>{i18n.t('email_signup_title')}</Title>
            </TitleWrapper>
            <NavWrapper>
              <NavItem
                onPress={() => handleNavPress('login')}
                selected={loginSelected}
              >
                <NavLabel>{i18n.t('button_login')}</NavLabel>
              </NavItem>
              <NavItem
                onPress={() => handleNavPress('register')}
                selected={!loginSelected}
              >
                <NavLabel>{i18n.t('button_register')}</NavLabel>
              </NavItem>
            </NavWrapper>
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
              <ScrollWrapper
                ref={scrollRef as any}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                removeClippedSubviews
              >
                {renderLoginForm()}
                {renderRegistrationForm()}
              </ScrollWrapper>
            </TouchableWithoutFeedback>
          </Container>
        </KeyboardAwareScrollView>
      </SafeWrapper>
    </Wrapper>
  )
}

const ScrollWrapper = styled(ScrollView)``

const Wrapper = styled(MotiView)`
  ${tw(`absolute bg-black inset-0`)};
  width: ${k.screen.w}px;
`
const SafeWrapper = styled.View`
  ${tw(`flex-1`)}
`
const Container = styled.View`
  ${tw(`flex-1`)}
`
const TitleWrapper = styled.View`
  ${tw(`h-11 flex-row justify-center items-center`)}
`
const Title = styled.Text`
  ${tw(`text-base text-white font-semibold`)}
`
const CloseButton = styled.TouchableOpacity`
  ${tw(`absolute right-4 h-11 w-11 items-center justify-center`)}
`
const PageWrapper = styled.View`
  ${tw(`flex-1 p-6 justify-center items-center`)};
  width: ${k.screen.w}px;
`
const FormWrapper = styled.View`
  ${tw(`flex-1 w-full mt-4`)}
`
const Field = styled.View`
  ${tw(``)}
`
const Input = styled.TextInput`
  ${tw(`w-full h-12 rounded-lg px-4 mb-4`)};
  font-size: 16px;
  color: ${({ theme }) => theme.text.body};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const Label = styled.Text`
  ${tw(`text-sm font-medium mb-2`)};
  color: ${({ theme }) => theme.text.light};
`
const NavWrapper = styled.View`
  ${tw(`w-full h-11 flex-row mt-4`)}
`
const NavItem = styled.TouchableOpacity<{ selected: boolean }>`
  ${tw(`h-full w-1/2 items-center justify-center border-b border-white`)};
  border-bottom-width: ${({ selected }) => (selected ? 4 : 1)}px;
`
const NavLabel = styled.Text`
  ${tw(`text-sm text-white`)}
`
const LabelWrapper = styled.View`
  ${tw(`flex-row flex-1 justify-between items-center mb-2`)}
`
const ErrorLabel = styled.Text`
  ${tw(`flex-1 text-xs text-red-500 text-right`)};
`
const Action = styled.TouchableOpacity`
  ${tw(`h-10 w-full flex-row rounded-full px-4 mt-4
  items-center justify-center`)};
  background-color: ${({ theme }) => theme.primary.tint};
`
