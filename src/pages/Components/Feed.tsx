import type { User } from "../../types/UserTypes";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { useRouter } from "next/router";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { IconButton } from '@mui/material';

type UserInfo = {
    user: User
}

const Feed = ({ user }: UserInfo) => {
    const router = useRouter();

    const fetchPostsQuery = trpc.useQuery(["fetch.fetchPosts", { userId: user?.id }]);

    const focusPost = (id: string) => {
        router.push(`/posts/${id}`);
    }


    return (
        <div>
            <Link href="/posts">Create a Post</Link>
            <h1>Feed: </h1>{user?.username}
            {fetchPostsQuery.data?.posts?.map((result) => {
                return (
                    <div className="w-full" key={result.username}>
                        {result.posts.map((post) => {
                            return (
                                <div className="mt-10 flex flex-col text-justify bg-discordDark w-full" key={post.id}>
                                    <button onClick={() => focusPost(post.id)}>
                                        <h1 className="border-b-2 border-discordLighter">{post.title}</h1>
                                        <h2>{result.username}</h2>
                                        <Image width="550%" height="500%" src={post.image as string} alt="Image not found!" />
                                    </button>
                                    <p className="">{post.description}</p>
                                    <p>{post.date.getDate()}/{post.date.getMonth() + 1}/{post.date.getFullYear()}</p>
                                    <div className="w-full flex justify-content space-x-10">
                                        <IconButton className="align-self-center h-10"><ThumbUpOffAltIcon fontSize="medium" color="primary" /></IconButton>
                                        <IconButton className="h-10"><ThumbUpOffAltIcon fontSize="medium" color="primary" /></IconButton>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Feed