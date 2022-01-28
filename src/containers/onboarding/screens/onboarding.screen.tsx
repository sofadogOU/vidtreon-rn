import * as React from "react";
import { Alert, Platform,Text} from "react-native";
import { firebase } from "@react-native-firebase/messaging";

import {
  MainStackNavigationProp,
  MainStackRouteProp,
} from "@/typings/navigators";

import { SocialDomains } from "@/typings/Requests";

import { useTranslation } from "@/providers";
import * as transform from "@/hooks/apis/api.transformers";
// import * as k from '@/utils/constants'

import {
  useAppleAuth,
  useGoogleAuth,
  useFacebookAuth,
  useStore,
  useSocialLogin,
  useLogin,
  useRegister,
} from "@/hooks";

import {
  OnboardingSlider,
  LoadingOverlay,
  SignupForm,
  DeviceCode,
  RegisterCredentials,
  LoginCredentials,
  Offline,
} from "@/components";
import { OnboardingAuth as AuthSlide } from "@/components/onboarding/onboarding-auth.component";

interface Props {
  navigation: MainStackNavigationProp<"Onboarding">;
  route: MainStackRouteProp<"Onboarding">;
}

export const OnboardingScreen = ({ navigation, route }: Props) => {
  const i18n = useTranslation();
  const appleAuth = useAppleAuth();
  const googleAuth = useGoogleAuth();
  const facebookAuth = useFacebookAuth();
  const socialLogin = useSocialLogin();
  const register = useRegister();
  const login = useLogin();
  const store = useStore();

  const [showForm, setShowForm] = React.useState(false);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [showAuthSlide, setShowAuthSlide] = React.useState(false);
  const { itemId } = route;
  const isConnected = itemId?.isConnected;

  React.useEffect(() => {
    
    // if(route.params?.showAuth) {
    //   setShowAuthSlide(true);
    //   registerAppWithFCM()
    // }
  }, [route,store]);

  const handleClose = () => {
    store.setVisitor(true);

    // handlePresentChannel("1");

    getchannelIdFromApi()

    // @ts-ignore
    // navigation.navigate('Drawer', {
    //   screen: 'Explore',
    // })
  };

  const registerAppWithFCM = async () => {
    if(Platform.OS === 'ios') {
        await firebase.messaging().registerDeviceForRemoteMessages();
        await firebase.messaging().setAutoInitEnabled(true);
    }
}

  const getchannelIdFromApi = () => {
    fetch('http://settings.vidtreon.com/')
   .then((response) => response.json())
   .then((rsn) => {
     handlePresentChannel(rsn.channel_id);
   })
   .catch((error) => {
     console.error(error);
   });
};

  const handlePresentChannel = React.useCallback(
    (id: string) => {
      navigation.dangerouslyGetParent()?.navigate("Channel", {
        screen: "ChannelDetail",
        params: { id },
      });
    },
    [navigation]
  );

  const doAuth = async (token: string, domain: SocialDomains) => {
    try {
      const fcmToken = await firebase.messaging().getToken();
      const res = await socialLogin.mutateAsync({
        token,
        domain,
        fcm_token: fcmToken,
      });
      if (res) {
        store.setToken(res.token);
        store.setTokenDomain(domain);
        store.setVisitor(false);
        store.setUser(transform.user(res.user));
      }
      setShowSpinner(false);
      handleClose();
    } catch (e) {
      setShowSpinner(false);
    }
  };

  const handleSocialAuth = async (domain: SocialDomains) => {
    setShowSpinner(true);
    if (domain === "apple") {
      try {
        const res = await appleAuth.signin();
        res && res.identityToken && doAuth(res.identityToken, "apple");
      } catch (e) {
        setShowSpinner(false);
      }
    }
    if (domain === "google") {
      try {
        const res = await googleAuth.signin();
        res && doAuth(res, "google");
      } catch (e) {
        setShowSpinner(false);
      }
    }
    if (domain === "facebook") {
      try {
        const res = await facebookAuth.signin();
        res && doAuth(res, "facebook");
      } catch (e) {
        setShowSpinner(false);
      }
    }
  };

  const handleLogin = async ({ email, password }: LoginCredentials) => {
    try {
      console.log("sljaskdj")
      setShowSpinner(true);
      const fcmToken = await firebase.messaging().getToken();
      console.log("token" +  fcmToken )
      const res = await login.mutateAsync({
        email,
        password,
        fcm_token: fcmToken,
      });
      if (res && res.token) {
        store.setToken(res.token);
        store.setTokenDomain("email");
        store.setUser(transform.user(res.user));
        handleClose();
      } else {
        setShowSpinner(false);
        Alert.alert(
          i18n.t(`login_error_title`),
          i18n.t(`creator_form_error_message`)
        );
      }
    } catch (e) {
      setShowSpinner(false);
      Alert.alert(e +
        i18n.t(`login_error_title`),
        i18n.t(`creator_form_error_message`)
      );
    }
  };

  const handleRegister = async (data: RegisterCredentials) => {
    try {
      setShowSpinner(true);
      const res = await register.mutateAsync({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName || "",
      });
      if (res) {
        handleLogin({ email: data.email, password: data.password });
      } else {
        setShowSpinner(false);
        Alert.alert(
          i18n.t(`creator_form_error_title`),
          i18n.t(`creator_form_error_message`)
        );
      }
    } catch (e) {
      setShowSpinner(false);
      Alert.alert( e +
        i18n.t(`creator_form_error_title`),
        i18n.t(`creator_form_error_message`)
      );
    }
  };

  return (
    <>
      {/* <AuthSlide
        onDismiss={handleClose}
        onSocialAuth={handleSocialAuth}
        onShowForm={()
          
          => setShowForm(true)}
      /> */}



      {  store.connectionInfo.isConnected && 
      
      <DeviceCode
      isVisible={showForm}
      onClose={() => setShowForm(true)}
      showSpinner={showSpinner}
       />

      }  

    {  !store.connectionInfo.isConnected && 
      
      <Offline
      
       />

      }  




          {/* <Text>gggg {JSON.stringify(route)}</Text> */}

      {/* <SignupForm
        isVisible={showForm}
        onClose={() => setShowForm(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        showSpinner={showSpinner}
      /> */}
      {/* <LoadingOverlay isVisible={showSpinner} /> */}
    </>
  );
};

//  onClose={handleClose}
//         onRegister={() => setShowForm(true)}
//         onSocialAuth={handleSocialAuth}
//         showAuth={showAuthSlide}

//  onDismiss={onClose}
//           onSocialAuth={onSocialAuth}
//           onShowForm={onRegister}
