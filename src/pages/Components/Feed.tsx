import type { User } from "../../types/UserTypes"
import Link from "next/link"

type UserInfo = {
    user: User
}

const Feed = ({ user }: UserInfo) => {
    return (
        <div>
            <Link href="/posts">Create a Post</Link>
            <h1>Feed: </h1>{user?.username}
        </div>
    )
}

export default Feed