import { useUser } from "@clerk/nextjs"
import { type NextPage, GetStaticProps } from "next"

import PageHeader from "../styles/components/PageHeader"
import ErrorMessageComponent from "~/styles/components/ErrorMessage"
import LoadingComponent from "~/styles/components/Loading"

import { api } from "~/utils/api"
import { appRouter } from "~/server/api/root"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { prisma } from "~/server/db"
import superjson from "superjson"

const ProfilePage: NextPage = () => {

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({ username: "lambertitheus" })

  if (isLoading) return <LoadingComponent />

  if (!data) return <ErrorMessageComponent />

  return (
    <>
      <PageHeader title="Profile" />
      <main className="flex h-screen justify-center">
        <div>{data.name} </div>
      </main >
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const   ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  })

  const slug = context.params?.slug

  if (typeof slug !== "string") throw new Error("no slug")

  await ssg.profile.getUserByUsername.prefetch({ username: slug })

  return {
    props: {
      trpcState: ssg.dehydrate()

    }
  }
}

export default ProfilePage
