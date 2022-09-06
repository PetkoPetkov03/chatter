import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Layout from './Components/Layout';
import type { User } from '../types/UserTypes';

const Wrapper = ({ Component ,pageProps }:any ) => {
    const [user, setUser]: [User, Dispatch<SetStateAction<User>>] = useState();

    const fetchUser = async () => {
        const request = await fetch("/api/auth/user");

        const response = await request.json();

        setUser(response.user);
    }

    useEffect(() => {
        fetchUser();
    });
    return (
        <Layout><Component {...pageProps} /></Layout>
    )
}

export default Wrapper