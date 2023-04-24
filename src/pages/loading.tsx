/* eslint-disable @typescript-eslint/no-unused-vars */

import { type NextPage } from "next"
import PageHeader from "../styles/components/PageHeader"
import LoadingComponent from "../styles/components/Loading"

const Loading: NextPage = () => {

    return (
        <>
            <PageHeader title="Loading test" />
            <LoadingComponent />
        </>
    )
}

export default Loading
