import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc"
import Form from "../Components/Form";
import Input from "../Components/Input";
import { useRecoilValue } from "recoil";
import { userState } from "../../libs/atoms";
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"


import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from "filepond-plugin-file-encode"
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePondErrorDescription, FilePondFile } from 'filepond';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

const index = () => {
  const user = useRecoilValue(userState);
  const [title, setTitle]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [description, setDescription]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [fileId, setFileId]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
  const [fileName, setFileName]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
  const [fileBase64StringArray, setFileBase64StringArray] = useState<string[]>([]);
  const [pathArray, setPathArray] = useState<string[]>([""]);

  const createPostMutation = trpc.useMutation(["social.createPost"]);

  const handleInit = () => {
    return;
  }

  const handleAddFile = (err: FilePondErrorDescription | null, file: FilePondFile) => {
    if (err) {
      return;
    }
    setFileId(file.id);
    setFileName(file.filename);
  }

  const handleProcessFile = (err: FilePondErrorDescription | null, file: FilePondFile) => {
    if (err) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFileBase64StringArray([...fileBase64StringArray ,file.getFileEncodeBase64String()]);
  }

  const generatePictureServer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    for(let i = 0; i < fileBase64StringArray.length; i++) {
      const response = await fetch("/api/upload/filepondgenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: fileId as string,
          fileBase64String: fileBase64StringArray[i] as string,
          fileName: fileName
        })
      });

      const parsed_path = await response.json();

      setPathArray([...pathArray, parsed_path.path]);
      console.log(pathArray);
    }

    // createPostMutation.mutateAsync({image: pathArray, title: title, description: description, id: user?.id});
  }


  return (
    <Form>
      <h1>Post: </h1>
      <form onSubmit={(e) => generatePictureServer(e)}>
        <input type="text" placeholder="Title" onChange={event => setTitle(event.target.value)} />
        <textarea name="desc" placeholder="description" id="desc" cols={30} rows={10} onChange={event => setDescription(event.target.value)}></textarea>
        <FilePond allowFileEncode={true} allowMultiple={true} allowDrop={true} maxFiles={5} onprocessfile={handleProcessFile} onaddfile={handleAddFile} server="/api/upload/filepondstorage" oninit={handleInit} />
        <button type="submit">Upload Post</button>
      </form>
    </Form>
  )
}

export default index