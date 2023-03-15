import React from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import { returnToPrevious } from '../../libs/returnToPrevious';

const Post = () => {
    const router = useRouter();

    const { id } = router.query;
    const stringifiedId = id as string;

    const fetchFocusPostQuery = trpc.useQuery(["fetch.fetchFocusPost", {id: stringifiedId}]);

    return (
        <div>
            <button onClick={() => returnToPrevious(router)} >[--</button>
            <h1>{fetchFocusPostQuery.data?.post?.title}</h1>
            <h2>{fetchFocusPostQuery.data?.post?.date.getDate()}/{fetchFocusPostQuery.data?.post?.date.getMonth() as number + 1}/{fetchFocusPostQuery.data?.post?.date.getFullYear()}</h2>
            <p>{fetchFocusPostQuery.data?.post?.description}</p>
            <Image width="750%" height="700%" src={fetchFocusPostQuery.data?.post?.image as string} alt="image not loading" />
        </div> 
    )
}

export default Post