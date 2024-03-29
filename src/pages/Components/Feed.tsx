import type { User } from "../../types/UserTypes";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { IconButton } from '@mui/material';
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { Dispatch, SetStateAction, useState } from "react";
import Welcome from "./Welcome";
import Load from "./Load";

type UserInfo = {
    user: User
}

const Feed = ({ user }: UserInfo) => {
    const router = useRouter();
    
    const [reloader, setReloader]: [number, Dispatch<SetStateAction<number>>] = useState(0);

    const fetchPostsQuery = trpc.useQuery(["fetch.fetchPosts", { userId: user?.id, reloader: reloader }]);
    const like_dislike_mutation = trpc.useMutation(["posts.like&dislikePost"], {
        onSuccess: () => fetchPostsQuery.refetch()
    });

    const focusPost = (id: string) => {
        router.push(`/posts/${id}`);
    }

   
    const like_dislike = async(post_id: string, option: boolean) => {
        await like_dislike_mutation.mutateAsync({
            id: post_id,
            user_id: user?.id as string,
            option: option
        });
    }

    if(!user) {
        return(
            <div className="h-full">
                <Welcome />
            </div>
        );
    }

    const reloadWithMore = () => {
        setReloader(reloader+10);
        
        fetchPostsQuery.refetch();
    }

    return (
        <div className="h-full">
            
            {user ? <Link href="/posts">Create a Post</Link> : null}
            <h1>Feed: </h1>{user?.username}
            {fetchPostsQuery.data?.posts?.map((result) => {
                return (
                    <div className="h-full flex flex-col justify-center" key={result.username}>
                        {result.posts.map((post) => {
                            return (
                                <div className="self-center mt-10 flex flex-col text-justify bg-discordDark" key={post.id}>
                                    <button onClick={() => focusPost(post.id)}>
                                        <h1 className="border-b-2 border-discordLighter">{post.title}</h1>
                                        <h2>{result.username}</h2>
                                        <Image width="550%" height="500%" src={post.image as string} alt="Image not found!" />
                                    </button>
                                    <div className=""><p className="">{post.description}</p></div>
                                    <p>{post.date.getDate()}/{post.date.getMonth() + 1}/{post.date.getFullYear()}</p>
                                    <div key={post.id} className="w-full flex justify-content space-x-10">
                                        <IconButton className="align-self-center h-10" onClick={() => like_dislike(post.id, true)} ><ThumbUpOffAltIcon fontSize="medium" color="primary" /><p className="text-white">{post._count.post_likes}</p></IconButton>
                                        <IconButton className="h-10" onClick={() => like_dislike(post.id, false)}><ThumbDownOffAltIcon fontSize="medium" color="primary" /><p className="text-white">{post._count.post_dislikes}</p></IconButton>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
            <div className="w-full" onClick={reloadWithMore}><Load /></div>
        </div>
    )

    
}

export default Feed