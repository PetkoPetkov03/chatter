import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import type { User } from '@prisma/client';
import { trpc } from '../../utils/trpc';

type TriggerProp = {
  SetRepTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  RepTrigger: boolean;
  RepId: string;
  User: User | null
};

const ReportComponent = (props: TriggerProp): JSX.Element => {
  const [submitAccess, setSubmitAccess]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(true);
  const [reportType, setReportType]: [string, Dispatch<SetStateAction<string>>] = useState("harassment");
  const [desctiption, setDescription]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [message, setMessage]: [string, Dispatch<SetStateAction<string>>] = useState("");

  const setReportTrigger = props.SetRepTrigger;
  const repTrigger = props.RepTrigger;
  const repId = props.RepId;
  const user = props.User;

  const reportMutation = trpc.useMutation("social.report");

  const reportTypeAssignment = (type: string) => {
    setReportType(type);  
  }

  const sendReport = async(event: React.FormEvent, id: string, reportType: string, desctiption: string) => {
    event.preventDefault();
    if(!user) {
      return;
    }
    const report = await reportMutation.mutateAsync({id: id, repType: reportType, description: desctiption, user});
    setMessage(report.message);
  }

  useEffect(() => {
    if(desctiption.length > 0) {
      setSubmitAccess(false)
    }else{
      setSubmitAccess(true);
    }
  }, [desctiption]);

  return (
    <div className="report-component">
      <h1>{repId}</h1>
      <form onSubmit={(event) => sendReport(event,repId, reportType, desctiption)}>
        <select name="" id="">
          <option onClick={() => reportTypeAssignment("harassment")}>Harassment</option>
          <option onClick={() => reportTypeAssignment("inapName")}>Inapropriate Name</option>
        </select>

        <textarea onChange={(e) => setDescription(e.target.value)} placeholder='Description of the users behaiviour' value={desctiption} name="" id="" cols={20} rows={5}></textarea>
        <button type='submit' disabled={submitAccess}>Submit</button>
      </form>
      <button onClick={() => setReportTrigger(!repTrigger)} >Cancel</button>
      {message}
    </div>
  )
}

export default ReportComponent