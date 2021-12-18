import React from 'react'
import ErrorPage from '../pages/error/Error'
import Header from './Header'

const Error = () => {
    return (
        <>
         <Header isErrorPage={true} />
         <ErrorPage /> 
        </>
    )
}

export default Error
