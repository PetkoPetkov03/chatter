import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { userState } from '../../libs/atoms';
import { useRecoilValue } from 'recoil';
import { trpc } from '../../utils/trpc';

const Admin = () => {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const { id } = router.query;

    useEffect(() => {
        if(typeof user?.id !== "undefined") {
            if(id !== user.id) {
                router.push("/");
            }
            if(user.admin !== true) {
                router.push("/");
            }
        }
    }, [id, router, user]);
    return (
        <h1>Hello World</h1>
    );
}

export default Admin