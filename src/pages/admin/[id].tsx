import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import { userState } from '../../libs/atoms';
import { useRecoilValue } from 'recoil';
import { trpc } from '../../utils/trpc';

const Admin = () => {
    const router = useRouter();
    const [submitedUsersIds, setSubmitedUsersIds]: [string[] | undefined, Dispatch<SetStateAction<string[] | undefined>>] = useState();
    const [reportedUsersIds, setReportedUsersIds]: [string[] | undefined, Dispatch<SetStateAction<string[] | undefined>>] = useState();
    const user = useRecoilValue(userState);
    const { id } = router.query;

    const { data, isLoading } = trpc.useQuery(["admin.fetchReports", { user_STATUS: typeof user?.admin === "undefined" ? false : user.admin }]);
    const fetchMessagesReroute = (sid: string, rid: string) => {
        router.push(`/admin/messages/${sid}&${rid}`);
        return;
    }

    return (
        <div>
            <h1>Hello</h1>
            {isLoading ? null : data?.reports?.map((report, i) => {
                
                return (
                    <div key={report.id}>
                        Report ID: <h1>{report.id}</h1>
                        Report Message: <p>{report.message}</p>
                        Report Submited by: <p>{report.submiterId}</p>
                        Reported: <p>{report.userId}</p>
                        Date of the submition: <p>{report.date.getUTCDate()}</p>
                        Reported For: <p>{report.reportType}</p>

                        <button onClick={() => fetchMessagesReroute(report.submiterId, report.userId)} >Check Conversations</button>
                        <br />
                    </div>
                )
            })}
        </div>
    );
}

export default Admin