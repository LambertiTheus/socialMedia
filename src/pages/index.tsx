/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignIn, SignInButton, SignOutButton, SignUp, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import PageHeader from "pageHeader"
import ErrorMessageComponent from "~/styles/errorMessage"
import LoadingComponent from "~/styles/loading"

import { api } from "~/utils/api"

const CreatePostWizard = () => {
  const { user } = useUser()

  if (!user) return <ErrorMessageComponent />

  return (
    <div className="flex gap-4">
      <img
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        />
        <input placeholder="type algo " className="bg-transparent"/>
    </div >
  )
}

const Home: NextPage = () => {
  const user = useUser()

  const { data, isLoading } = api.posts.getAll.useQuery()

  if (isLoading) return <LoadingComponent />

  if (!data) return <div>Something went wrong</div>

  return (
    <>
      <PageHeader title="home" />
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {[...data]?.map((post) => (
              <div key={post.id} className="border-b border-slate-400 p-8">
                {post.content}</div>
            ))}
          </div>
        </div>
      </main >
    </>
  )
}

export default Home
