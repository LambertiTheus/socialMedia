/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignInButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import { useState } from "react"

import PageHeader from "../styles/components/PageHeader"
import ErrorMessageComponent from "../styles/components/ErrorMessage"
import LoadingComponent from "../styles/components/Loading"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"

import { type RouterOutputs, api } from "~/utils/api"

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  const [input, setInput] = useState("")

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate()
      toast("Successfully posted",{
        icon: "🫡👌"
      })
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post! try again later. ")
      }
    },
  })

  if (!user) return null

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="type algo "
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => mutate({ content: input })}>Post</button>
    </div >
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div key={post.id} className="flex gap-3 border-b  border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username} profile picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`• ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingComponent />

  if (!data) return <ErrorMessageComponent />

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  api.posts.getAll.useQuery()

  if (!userLoaded) return <div />

  return (
    <>
      <PageHeader title="home" />
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main >
    </>
  )
}

export default Home
