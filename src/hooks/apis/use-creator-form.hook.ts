import { useMutation } from 'react-query'
import axios from 'axios'
import { CreatorFormSchema } from './api.typings'
import { database } from 'faker'

type Params = {
  // name: string
  username: string
  email: string
  first_name: string
  last_name: string
  phone: number
  password: string
  confirm_password: string
  // pitch: string

}

export const useCreatorForm = () => {
  return useMutation<CreatorFormSchema, never, Params>(
    data =>
      // axios.post('https://x.so.fa.dog/webapp/signup', {
        axios.post('https://x.so.fa.dog/dsa/content_creators/register', {
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        password: data.password,
        confirm_password: data.confirm_password,
        // channel_pitch: data.pitch,
      })
  )
}
