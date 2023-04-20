/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignIn, SignInButton, SignOutButton, SignUp, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import PageHeader from "pageHeader"
import ErrorMessageComponent from "~/styles/errorMessage"
import LoadingComponent from "~/styles/loading"

import { RouterOutputs, api } from "~/utils/api"

const CreatePostWizard = () => {
  const { user } = useUser()

  if (!user) return <ErrorMessageComponent />
  console.log(user)

  return (
    <div className="flex w-full gap-3">
      <img
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
      />
      <input placeholder="type algo " className="grow bg-transparent outline-none" />
    </div >
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div key={post.id} className="border-b border-slate-400 p-4">
      <img
        src={author.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <span>{`@${author.username}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
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
            {[...data]?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main >
    </>
  )
}

export default Home
