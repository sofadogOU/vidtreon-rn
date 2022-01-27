import * as React from 'react'
import { Keyboard , TextInput ,Text,View,StyleSheet,ImageBackground} from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { View as MotiView } from 'moti'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-spinkit'
import { useForm, Controller } from 'react-hook-form'
import * as k from '@/utils/constants'    
import { useDeviceCode } from '@/hooks'
import NetInfo from "@react-native-community/netinfo";

import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import bgLogo from '@/assets/images/bglogo.png'
import {
  useStore,
} from '@/hooks'

import {
  ChannelStackNavigationProp,
  ChannelStackRouteProp,
} from '@/typings/navigators'



import { useTranslation } from '@/providers/TranslationProvider'

import { Icon } from '../icon.component'
import { Button } from '../buttons.component'
import DeviceInfo from 'react-native-device-info';



interface Props {
  isVisible: boolean
  onClose: () => void
  showSpinner: boolean
  navigation: ChannelStackNavigationProp<'ChannelDetail'>
  route: ChannelStackRouteProp<'ChannelDetail'>
}



export const DeviceCode = ({
  isVisible,
  onClose,
  showSpinner,
  navigation, route 
}: Props) => {
  const insets = useSafeAreaInsets()
  const i18n = useTranslation()
  const store = useStore()
  //const readNotification = useDeviceCode()


  const scrollRef = React.useRef<ScrollView>()

  const [isShowing, setShowing] = React.useState(isVisible)
  const [unique_code,setUnique_code] = React.useState('');

  const deviceId = DeviceInfo.getUniqueId();


  const  unsubscribe=() => {
    NetInfo.fetch().then(state => {
      console.log(state,"connection data ");
    })
  };

  React.useEffect(() => {
    setShowing(isVisible), [isVisible]
    unsubscribe()
   // console.log(store.connectionInfo,"connectioninfo");
   
  },[store]);

  const handlePresentChannel = React.useCallback(
    (id: string) => {
      navigation.dangerouslyGetParent()?.navigate('Channel', {
        screen: 'ChannelDetail',
        params: { id },
      })
    },
    [navigation]
  )

  
  const callApiWithDeviceCode = async () =>{

    let requestData1 = {
      "deviceId": deviceId,
      "unique_code": unique_code
  }
    
  



//   let requestData = {
//     "name": "morpheus",
//     "job": "leader"
// }

  // console.log(requestData,"-------");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData1)
  };

 
  const response = await fetch('http://localhost:3000/checkDeviceCode', requestOptions);
  const data = await response.json();
  //console.log(data,"data console");
 if(data.result=="ok"){
  alert("data has been submitted !!!");
  store.setDeviceCode(true);
 }
  
  ///handlePresentChannel('1');
  
 



  }




 
 
  return (
    
      <>  

<ImageBackground source={bgLogo} resizeMode="cover" style={{ flex: 1,paddingBottom:100,
    justifyContent: "center"}}>
    <View style={styles.loginTextSection}>
     </View>
     { store.isDeviceCode == false &&  store.isSubcription == false && 
 <View style={styles.loginButtonSection}>
 <TextInput
          style={styles.inputText}
          placeholder="Enter Your DeviceCode"
          placeholderTextColor="#36485f"
          underlineColorAndroid={'transparent'}
          onChangeText={setUnique_code}
          value={unique_code}
          
        />
 </View>
}

{ store.isDeviceCode  === false && store.isSubcription == false && 

 <View style={styles.loginButtonSection}>
     
     <Button
                type="social"
                onPress={() => callApiWithDeviceCode()}
                style={styles.loginButton}
              >
                
                <Button.Label>{`Submit`}</Button.Label>
              </Button>

    

</View>
}

{ store.isSubcription == true  && 
 <View style={styles.loginButtonSection}>
      <Text style={styles.subButton}>Please applied  For subcription</Text>
 </View>

}

 </ImageBackground>

 </>
      
  )
}




const styles = StyleSheet.create({
  loginTextSection: {
     width: '100%',
     height: '30%',
  },

  loginButtonSection: {
     width: '100%',
     height: '10%',
    
     justifyContent: 'center',
     alignItems: 'center'
  },

  inputText: {
     marginLeft: '20%',
     width: '80%',
     fontWeight : 'bold',
     height : '50%',
     borderColor: "gray",
    
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },

  loginButton: {
    marginLeft: '20%',
     width: '80%',
     fontWeight : 'bold',
     height : '50%',
     borderColor: "gray",
    
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },

  subButton : {
    
    fontWeight : 'bold'
  }
})
