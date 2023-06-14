import Image from "next/image"
import dayjs from "dayjs"
import Link from "next/link"
import relativeTime from "dayjs/plugin/relativeTime"
import { type RouterOutputs } from "~/utils/api"

dayjs.extend(relativeTime)


type PostWithUser = RouterOutputs["posts"]["getAll"][number]

export const PostView = (props: PostWithUser) => {
    const { post, author } = props
    return (
        <div key={post.id} className="flex gap-3 border-b  border-slate-400 p-4">
            <Image
                src={author.profileImageUrl}
                className="h-14 w-14 rounded-full"
                alt={`@${author.username}'s profile picture`}
                width={56}
                height={56}
            />
            <div className="flex flex-col"
                style={{ maxWidth: '500px', wordWrap: 'break-word' }}>
                <div className="flex gap-1 text-black" >
                    <Link href={`/@${author.username}`}>
                        <span>{`@${author.username}`} &nbsp;• </span>
                    </Link>
                    <Link href={`/post/${post.id}`}>
                        <span className="font-thin">{`${dayjs(
                            post.createdAt
                        ).fromNow()}`}</span>
                    </Link>
                </div>
                <span className="text-2xl">{post.content}</span>
            </div>
        </div>
    )
}

