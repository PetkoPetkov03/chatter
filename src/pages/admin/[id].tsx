import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { userState } from '../../libs/atoms';
import { useRecoilValue } from 'recoil';
import { trpc } from '../../utils/trpc';

const Admin = () => {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const { id } = router.query;

    const {data, isLoading} = trpc.useQuery(["admin.fetchReports", {user_STATUS: typeof user?.admin === "undefined" ? false : user.admin}]);

    return (
        <div>
            <h1>Hello</h1>
            {isLoading ? "" : data?.reports?.map((report) => {
                return (
                    <div key={report.id}>
                        <h1>{report.id}</h1>\
                        <p>{report.message}</p>
                        <p>{report.submiterId}</p>
                        <p>{report.userId}</p>
                        <p>{report.date.getUTCDate()}</p>
                        <p>{report.reportType}</p>
                        <br />
                    </div>
                )
            })}
        </div>
    );
}

export default Admin