import type { NextPage, GetStaticProps } from "next"

import { api } from "~/utils/api"

import PageHeader from "~/styles/components/PageHeader"
import { PageLayout } from "~/styles/components/layout"
import LoadingComponent from "~/styles/components/Loading"
import { PostView } from "~/styles/components/PostView"
import { generateSSGHelper } from "~/server/helpers/ssgHelper"


const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {

  const { data } = api.posts.getById.useQuery({
    id,
  })

  if (!data) return <div>404</div>

  return (
    <>
      <PageHeader title={`${data.post.content} - @${data.author.username}`} />
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const id = context.params?.id

  if (typeof id !== "string") throw new Error("no id")


  await ssg.posts.getById.prefetch({id})

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,

    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default SinglePostPage
