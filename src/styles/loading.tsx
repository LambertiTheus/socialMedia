import styles from './Loading.module.css'
import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-80">
      <div className="w-12 h-12 border-t-4 border-white rounded-full animate-spin"></div>
      <span className={`mt-4 text-2xl font-semibold text-white`}>
        <span className={styles.loadingText}>Loading</span><span className={styles.loadingDots}>.</span><span className={styles.loadingDots}>.</span><span className={styles.loadingDots}>.</span>
      </span>
    </div>
  ) 
}

const LoadingComponent: React.FC = () => {
  return (
    <>
      <div className="p-8">
        <Loading />
      </div>
    </>
  )
}

export default LoadingComponent


