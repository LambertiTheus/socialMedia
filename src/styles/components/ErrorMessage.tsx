import { FaExclamationTriangle } from 'react-icons/fa'
import React from 'react'

const ErrorMessage: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
          <FaExclamationTriangle className="text-red-500 text-3xl flex justify-center" />
        </div>
        <span className="ml-4 text-2xl font-semibold text-slate-50">
          Oops, something went wrong!
        </span>
      </div>
      <span className="text-lg font-medium text-slate-50">
        We could not access the data you were looking for.
      </span>
    </div>
  )
}

const ErrorMessageComponent: React.FC = () => {
  return (
    <>
      <div className="p-8 relative min-h-screen">
        <ErrorMessage />
      </div>
    </>
  )
}

export default ErrorMessageComponent