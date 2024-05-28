import { SignUpInput } from '@ayush__2002/medium-common'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BackendUrl } from '../config'

export const Auth = ({ type }: { type: 'signup' | 'signin' }) => {
    const navigate = useNavigate()
  const [postInputs, setPostInputs] = useState<SignUpInput>({
    name: '',
    email: '',
    password: ''
  })

  async function sendRequests () {
    try {
       const response = await axios.post(`${BackendUrl}/api/v1/user/${type === "signup" ? 'signup' : 'signin'}`,
         postInputs
       )
       const jwt = response.data;
       localStorage.setItem('jwt', jwt)
       navigate('/blogs')
    } catch (error: any) {
        alert("Error occured + " + error.message)   
    }
  }

  return (
    <div className='h-screen flex justify-center flex-col'>
      <div className='flex justify-center'>
        <div>
          <div className='px-10'>
            <div className='text-3xl font-bold'>Create an account</div>
            <div className='text-slate-400'>
              {type === "signin" ? "Don't have an account" : "Already have an account?"}
              <Link className='pl-2 underline' to={type === "signin" ? "/signup" : "/signin"}>
                {type === "signin" ? "Sign Up" : "Sign In"}
              </Link>
            </div>
          </div>
          <div className='pt-8'>
            {type === "signup" ? <LabelledInput
              label='Name'
              placeholder='John'
              onChange={e => {
                setPostInputs({
                  ...postInputs,
                  name: e.target.value
                })
              }}
            /> : null}
            <LabelledInput
              label='Email'
              type='email'
              placeholder='John@gmail.com'
              onChange={e => {
                setPostInputs({
                  ...postInputs,
                  email: e.target.value
                })
              }}
            />
            <LabelledInput
              label='Password'
              type='password'
              placeholder='password'
              onChange={e => {
                setPostInputs({
                  ...postInputs,
                  password: e.target.value
                })
              }}
            />
            <button onClick={sendRequests} type="button" className="w-full mt-5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign Up" : "Sign In"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LabelledInputProps {
  label: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

function LabelledInput ({
  label,
  placeholder,
  onChange,
  type
}: LabelledInputProps) {
  return (
    <div>
      <label className='block mt-2 mb-1 text-sm font-medium text-gray-900 dark:text-black'>
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || 'text'}
        id='first_name'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        placeholder={placeholder}
        required
      />
    </div>
  )
}
