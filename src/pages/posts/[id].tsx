import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import { returnToPrevious } from '../../libs/returnToPrevious';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpOnAltIcon from "@mui/icons-material/ThumbUp"
import ThumbDownOnAltIcon from '@mui/icons-material/ThumbDown';
import { IconButton } from '@mui/material';
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CommentIcon from '@mui/icons-material/Comment';
import { useRecoilValue } from 'recoil';
import { userState } from '../../libs/atoms';

const Post = () => {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const { id } = router.query;
    const stringifiedId = id as string;

    const fetchFocusPostQuery = trpc.useQuery(["fetch.fetchFocusPost", { id: stringifiedId }]);
    const fetchFocusPostsLikesDislikesQuery = trpc.useQuery(["fetch.fetchSPostLikesDislikes", { id: stringifiedId }]);
    const like_dislike_mutation = trpc.useMutation(["posts.like&dislikePost"], {
        onSuccess: () => {
            fetchFocusPostsLikesDislikesQuery.refetch();
            checkIfLDQuery.refetch()
        }
    });

    const like_dislike = async (post_id: string, option: boolean) => {
        await like_dislike_mutation.mutateAsync({
            id: post_id,
            user_id: user?.id as string,
            option: option
        });
    }

    const checkIfLDQuery = trpc.useQuery(["fetch.checkIfLD", { user_id: user?.id as string, post_id: stringifiedId }]);


    return (
        <div className='h-fit flex flex-col min-h-min items-center'>
            <div className='self-start border-2 border-solid border-discordDark bg-discordDark ml-2 p-2 h-fit w-fit '>
                <IconButton className="align-self-center h-10" onClick={() => returnToPrevious(router)}><ArrowBackIcon fontSize='large' color='primary' /></IconButton>
            </div>
            <div className='flex border-discordDark bg-discordDark w-fit h-fit p-2 justify-center'>
                <div className='flex flex-col h-fit items-center justify-center'>
                    <h1>{fetchFocusPostQuery.data?.post?.title}</h1>
                    <h2>{fetchFocusPostQuery.data?.post?.date.getDate()}/{fetchFocusPostQuery.data?.post?.date.getMonth() as number + 1}/{fetchFocusPostQuery.data?.post?.date.getFullYear()}</h2>
                    <p>{fetchFocusPostQuery.data?.post?.description}</p>
                    <Image width="750%" height="700%" src={fetchFocusPostQuery.data?.post?.image as string} alt="image not loading" />
                    <div className='flex justify-around w-max'>
                        <div className='flex self-start h-fit min-h-min mt-4'>
                            <div className='h-fit w-fit' onClick={() => like_dislike(stringifiedId, true)}>{checkIfLDQuery.data?.like === true ? <IconButton className="align-self-center h-10"><ThumbUpOnAltIcon fontSize="large" color="primary" /><p className="text-white">{fetchFocusPostsLikesDislikesQuery.data?.likes}</p></IconButton> : <IconButton className="align-self-center h-10"><ThumbUpOffAltIcon fontSize="large" color="primary" /><p className="text-white">{fetchFocusPostsLikesDislikesQuery.data?.likes}</p></IconButton>}</div>
                            <div className='h-fit w-fit' onClick={() => like_dislike(stringifiedId, false)}>{checkIfLDQuery.data?.dislike === true ? <IconButton className="align-self-center h-10"><ThumbDownOnAltIcon fontSize="large" color="primary" /><p className="text-white">{fetchFocusPostsLikesDislikesQuery.data?.dislikes}</p></IconButton> : <IconButton className="align-self-center h-10"><ThumbDownOffAltIcon fontSize="large" color="primary" /><p className="text-white">{fetchFocusPostsLikesDislikesQuery.data?.dislikes}</p></IconButton>}</div>
                        </div>
                        <div className='flex self-end h-fit min-h-min mt-4'><div className='h-fit w-fit'><CommentIcon fontSize='large' color='primary' /></div></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Post