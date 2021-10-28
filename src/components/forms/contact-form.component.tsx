import * as React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import tw from "tailwind-rn";
import { MotiView } from "moti";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm, Controller } from 'react-hook-form'
import Spinner from 'react-native-spinkit'

import * as k from '@/utils/constants'

import { useTranslation } from '@/providers/TranslationProvider'
import { useCreatorForm } from '@/hooks'

import { Icon } from '../icon.component'
import { Button } from '../buttons.component'

type FormData = {
  username: string
  email: string
  first_name: string
  last_name: string
  phone: number
  password: string
  confirm_password: string
  // pitch: string
};

interface Props {
  isVisible: boolean
  onClose: () => void
}

export const ContactForm = ({ isVisible, onClose }: Props) => {
  const insets = useSafeAreaInsets();
  const i18n = useTranslation();
  const {
    control,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const formApi = useCreatorForm();
  const [isShowing, setShowing] = React.useState(isVisible);
  const [isBusy, setBusy] = React.useState(false);

  React.useEffect(() => setShowing(isVisible), [isVisible]);
  const handleClose = () => {
    setShowing(false);
    handleDismissKeyboard();
  };

  const handleAnimateEnd = (_: unknown, isFinished: boolean) => {
    if (isFinished && !isShowing) {
      onClose();
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setBusy(true);
      const res = await formApi.mutateAsync({
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        password: data.password,
        confirm_password: data.confirm_password,
        // pitch: data.pitch,
      });
      if (res) {
        setBusy(false);
        Alert.alert(
          i18n.t(`creator_form_success_title`),
          i18n.t(`creator_form_success_message`)
        );
        reset();
      }
    } catch {
      setBusy(false);
      Alert.alert(
        i18n.t(`creator_form_error_title`),
        i18n.t(`creator_form_error_message`)
      );
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <Wrapper
        animate={{ opacity: isShowing ? 1 : 0 }}
        transition={{ type: 'timing', duration: 200 }}
        onDidAnimate={handleAnimateEnd}
        pointerEvents={isShowing ? 'auto' : 'none'}
        style={{ height: k.screen.h }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <Container>
            <TitleWrapper>
              <CloseButton onPress={handleClose}>
                <Icon name="closeCircle" />
              </CloseButton>
              <Title>{i18n.t('contact_title')}</Title>
            </TitleWrapper>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                flex: 1,
              }}
              contentContainerStyle={{
                paddingBottom: 200,
              }}
            >
              <KeyboardAwareScrollView
                enableOnAndroid
                showsVerticalScrollIndicator={false}
              >
                <PageWrapper>
                  <IntroTitle>{i18n.t('contact_apply')}</IntroTitle>
                  <IntroText>{i18n.t('contact_intro')}</IntroText>
                  <FormWrapper>
                    <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('contact_name')}</Label>
                        {errors.userName && (
                          <ErrorLabel>{`*${i18n.t(
                            'label_required'
                          )}`}</ErrorLabel>
                        )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
                          />
                        )}
                        name="userName"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </Field>
                    <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('contact_email')}</Label>
                        {errors.email?.type === 'required' ? (
                          <ErrorLabel>{`*${i18n.t(
                            'label_required'
                          )}`}</ErrorLabel>
                        ) : (
                          <ErrorLabel>{errors.email?.message}</ErrorLabel>
                        )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            keyboardType="email-address"
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
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
                        defaultValue=""
                      />
                    </Field>
                    {/* First Name */}
                    <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('first_name')}</Label>
                        {errors.firstName && (
                          <ErrorLabel>{`*${i18n.t(
                            'label_required'
                          )}`}</ErrorLabel>
                        )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
                          />
                        )}
                        name="firstName"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </Field>
                    {/* Last Name */}
                    <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('last_name')}</Label>
                        {errors.lastName && (
                          <ErrorLabel>{`*${i18n.t(
                            'label_required'
                          )}`}</ErrorLabel>
                        )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
                          />
                        )}
                        name="lastName"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </Field>
                    {/* Phone Number */}
                    <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('phone_number')}</Label>
                        {errors.phoneNumber && (
                          <ErrorLabel>{`*${i18n.t(
                            'label_required'
                          )}`}</ErrorLabel>
                        )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
                          />
                        )}
                        name="phoneNumber"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </Field>
                    {/* Password */}
                    <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('password')}</Label>
                        {errors.password && (
                          <ErrorLabel>{`*${i18n.t(
                            'label_required'
                          )}`}</ErrorLabel>
                        )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
                          />
                        )}
                        name="password"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </Field>
                    {/* Confirm Password */}
                    <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('confirm_password')}</Label>
                        {errors.confirmPassword &&
                          errors.confirmPassword.type === 'required' && (
                            <ErrorLabel>{`*${i18n.t(
                              'label_required'
                            )}`}</ErrorLabel>
                          )}
                        {errors.confirmPassword &&
                          errors.confirmPassword.type === 'validate' && (
                            <ErrorLabel>{`*${i18n.t(
                              errors.confirmPassword.message
                            )}`}</ErrorLabel>
                          )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Input
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
                          />
                        )}
                        rules={{
                          required: true,
                          validate: value =>
                            value === getValues('password') ||
                            'The passwords do not match',
                        }}
                        name="confirmPassword"
                        // rules={{
                        //   validate: value =>{
                        //    if(value !== getValues('password')){
                        //     return 'The passwords do not match'
                        //    }
                        //    return "hello"
                        //   }
                        // }}
                        defaultValue=""
                      />
                    </Field>
                    {/* <Field>
                      <LabelWrapper>
                        <Label>{i18n.t('contact_pitch')}</Label>
                        {errors.pitch && (
                          <ErrorLabel>{`*${i18n.t(
                            'label_required'
                          )}`}</ErrorLabel>
                        )}
                      </LabelWrapper>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <MultilineInput
                            multiline
                            onBlur={onBlur}
                            onChangeText={(value: string) => onChange(value)}
                            value={value}
                            placeholder={i18n.t('contact_pitch_placeholder')}
                          />
                        )}
                        name="pitch"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </Field> */}
                    <Action
                      disabled={isBusy}
                      onPress={handleSubmit(onSubmit)}
                      style={{ marginTop: k.sizes.defPadding }}
                    >
                      {isBusy ? (
                        <Spinner
                          type="ThreeBounce"
                          color="white"
                          style={{
                            marginTop: k.isAndroid ? 0 : -10,
                          }}
                        />
                      ) : (
                        <Button.Label style={{ color: 'white' }}>
                          {i18n.t('button_apply')}
                        </Button.Label>
                      )}
                    </Action>
                  </FormWrapper>
                </PageWrapper>
              </KeyboardAwareScrollView>
            </ScrollView>
          </Container>
        </SafeAreaView>
      </Wrapper>
    </TouchableWithoutFeedback>
  );
};

const Wrapper = styled(MotiView)`
  ${tw(`absolute bg-black`)};
  width: ${k.screen.w}px;
`;
// const SafeWrapper = styled.View`
//   ${tw(`flex-1`)}
// `
const Container = styled.View`
  ${tw(`flex-1`)}
`;
const TitleWrapper = styled.View`
  ${tw(`h-11 flex-row justify-center items-center`)}
`;
const Title = styled.Text`
  ${tw(`text-base text-white font-semibold`)}
`;
const CloseButton = styled.TouchableOpacity`
  ${tw(`absolute right-4 h-11 w-11 items-center justify-center`)}
`;
const PageWrapper = styled.View`
  ${tw(`flex-1 p-6 justify-center items-center`)}
`;
const IntroTitle = styled.Text`
  ${tw(`text-base font-semibold text-white mb-2 text-center px-6`)}
`;
const IntroText = styled.Text`
  ${tw(`px-4 text-sm text-white text-center mb-8`)}
`;
const FormWrapper = styled.View`
  ${tw(`flex-1 w-full mt-4`)}
`;
const Field = styled.View`
  min-height: 96px;
`;
const TextArea = styled.TextInput`
  ${tw(`w-full rounded-lg px-4 mb-4 items-center`)};
  min-height: 48px;
  font-size: 16px;
  color: ${({ theme }) => theme.text.dark};
  background-color: ${({ theme }) => theme.white};
`;
const Input = styled(TextArea)`
  /* ${tw(`h-12`)}; */
`;
const MultilineInput = styled(Input)`
  ${k.isIOS && `padding-top: 14px; padding-bottom: 14px`}
`;
const LabelWrapper = styled.View`
  ${tw(`flex-row justify-between items-center mb-2 h-6`)}
`;
const Label = styled.Text`
  ${tw(`text-sm font-medium`)};
  color: ${({ theme }) => theme.text.light};
`;
const ErrorLabel = styled.Text`
  ${tw(`flex-1 text-xs text-red-500 text-right`)};
`;
const Action = styled.TouchableOpacity`
  ${tw(`h-10 w-full flex-row rounded-full px-4
  items-center justify-center`)};
  background-color: ${({ theme }) => theme.primary.tint};
`;
