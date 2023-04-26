import { useUser } from "@clerk/nextjs"
import { type NextPage } from "next"

import PageHeader from "../../styles/components/PageHeader"

import { api } from "~/utils/api"


const SinglePostPage: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  api.posts.getAll.useQuery()

  if (!userLoaded) return <div />

  return (
    <>
      <PageHeader title="Post " />
      <main className="flex h-screen justify-center">
        <div>Post View</div>
      </main >
    </>
  )
}

export default SinglePostPage
