import Header from '@/components/custom/Header'
import React from 'react'

const DahboardLayout = ({children}) => {
  return (
    <div>
        <Header/>
        {children}
    </div>
  )
}

export default DahboardLayout