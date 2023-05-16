import { SignInButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Image from "next/image"
import { useState } from "react"

import PageHeader from "../styles/components/PageHeader"
import ErrorMessageComponent from "../styles/components/ErrorMessage"
import LoadingComponent from "../styles/components/Loading"
import { LoadingPost } from "~/styles/components/LoadingPost"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"

import { type RouterOutputs, api } from "~/utils/api"
import Link from "next/link"
import { PageLayout } from "~/styles/components/layout"

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  const [input, setInput] = useState("")

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate()
      toast("Successfully posted", {
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

        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            if (input !== "") {
              mutate({ content: input })
            }
          }
        }}

        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingPost />
        </div>
      )}
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div key={post.id} className="flex gap-3 border-b  border-slate-400 p-4">
      <Link href={`/@${author.username}`}>
        <Image
          src={author.profileImageUrl}
          className="h-14 w-14 rounded-full"
          alt={`@${author.username} profile picture`}
          width={56}
          height={56}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`• ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
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
      <PageLayout>
        <div className="flex border-b border-slate-400 p-4">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  )
}

export default Home
