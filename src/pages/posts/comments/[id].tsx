import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';
import BasicButton from '../../Components/BasicButton';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../libs/atoms';

const Comments = () => {

    const user = useRecoilValue(userState);

    const [comment, setComment]: [string, Dispatch<SetStateAction<string>>] = useState("");

    const disable = false;

    const router = useRouter();
    const { id } = router.query;
    const idStringified = id as string

    const commentsQuery = trpc.useQuery(["fetch.fetchComments", { id: idStringified }]);

    const postCommentMutation = trpc.useMutation(["posts.createComment"]);

    const postComment = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await postCommentMutation.mutateAsync({
            id: idStringified,
            author_id: user?.id as string,
            content: comment
        });

        router.reload();
    }

    return (
        <div>
            <form onSubmit={(e) => postComment(e)}>
                <input onChange={(e) => setComment(e.target.value)} type="text" className='text-white bg-discordDark' />
                <BasicButton disable={disable} />
            </form>
            {commentsQuery.data?.comments.map((comment) => {
                return (
                    <div key={comment.id} >
                        <h2>{comment.content}</h2>
                    </div>
                );
            })}
        </div>
    )
}

export default Comments