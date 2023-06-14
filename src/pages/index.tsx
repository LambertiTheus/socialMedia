import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import { useState } from "react"

import { api } from "~/utils/api"

import toast from "react-hot-toast"

import ErrorMessageComponent from "../styles/components/ErrorMessage"
import LoadingComponent from "../styles/components/Loading"
import { LoadingPost } from "~/styles/components/LoadingPost"
import { PageLayout } from "~/styles/components/layout"
import { PostView } from "~/styles/components/PostView"

const CreatePostWizard = () => {
  const { user } = useUser()

  const [input, setInput] = useState("")

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate()
      toast("Successfully posted", {
        icon: "🫡"
      })
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post! Please try again later. ")
      }
    },
  })

  if (!user) return null

  return (
    <div className="flex w-full gap-3">
      <UserButton appearance={{
        elements: {
          userButtonAvatarBox: {
            width: 56,
            height: 56
          }
        }
      }} />
      <input
        placeholder="type here!"
        className="grow bg-transparent outline-none outline-wrap"
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


const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingComponent />

  if (!data) return <ErrorMessageComponent />

  return (
    <div className="flex flex-col overflow-y-auto">
      {[...data].map((fullPost) => (
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
    <PageLayout>
      <div className="flex flex-col h-screen bg-blue-50 text-black">
        <header className="flex items-center justify-between px-4 py-2 border-b border-blue-200 bg-white shadow-md">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </header>

        <main className="flex-1 overflow-y-scroll p-4 bg-blue-50">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <Feed />
          </div>
        </main>
      </div>
    </PageLayout>
  )
}

export default Home
