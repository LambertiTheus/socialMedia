import type { NextPage, GetStaticProps } from "next"

import PageHeader from "../styles/components/PageHeader"

import { api } from "~/utils/api"
import { appRouter } from "~/server/api/root"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { prisma } from "~/server/db"
import superjson from "superjson"
import { PageLayout } from "~/styles/components/layout"


const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data } = api.profile.getUserByUsername.useQuery({ username })


  if (!data) return <div>404</div>

  return (
    <>
      <PageHeader title={data.name} />
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.name ?? ""}'s profile pic`}
            width={96}
            height={96}
            className="absolute bottom-0 left-0 -mb-[64px] rounded-full ml-4 border-4 border-black bg-black"
            />
            </div>
            <div className="h-[64px]"></div>
          <div className="p-4 text-2xl font-bold">{`@${data.name  ?? ""}`}</div>
          <div className="w-full border-b border-slate-400"/>
      </PageLayout>
    </> 
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  })

  const slug = context.params?.slug

  if (typeof slug !== "string") throw new Error("no slug")

  const username = slug.replace("@", "")

  await ssg.profile.getUserByUsername.prefetch({ username })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,

    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default ProfilePage
