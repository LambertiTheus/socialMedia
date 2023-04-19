/* eslint-disable @typescript-eslint/no-unused-vars */

import { type NextPage } from "next"
import PageHeader from "pageHeader"
import LoadingComponent from "~/styles/loading"

const Loading: NextPage = () => {

    return (
        <>
            <PageHeader title="Loading test" />
            <LoadingComponent />

        </>
    )
}

export default Loading
