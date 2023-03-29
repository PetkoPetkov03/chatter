import React, { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../../utils/trpc"
import Form from "../Components/Form";
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


export default function Index() {
  const user = useRecoilValue(userState);
  const [title, setTitle]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [description, setDescription]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [fileId, setFileId]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [fileName, setFileName]: [string, Dispatch<SetStateAction<string>>] = useState("");
  const [fileBase64String, setFileBase64String]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();

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
    setFileBase64String(file.getFileEncodeBase64String());
  }

  const generatePictureServer = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await fetch("/api/upload/filepondgenerate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId: fileId,
        fileBase64String: fileBase64String as string,
        fileName: fileName
      })
    });

    const parsed_path = await result.json();

    createPostMutation.mutateAsync({ image: parsed_path.path, title: title, description: description, id: user?.id, global: false });
    location.reload();
  }


  return (
    <Form>
      <div className="p-8 pr-12 pl-12">
        <h1>Post: </h1>
        <form onSubmit={(e) => generatePictureServer(e)} className="flex flex-col place-content-evenly">
          <input type="text" className="mt-4 mb-4 bg-discordLighter border border-solid border-discordDark" placeholder="Title" onChange={event => setTitle(event.target.value)} />
          <textarea name="desc" placeholder="description" className="mb-4 bg-discordLighter" id="desc" cols={30} rows={10} onChange={event => setDescription(event.target.value)}></textarea>
          <FilePond className="bg-discordLighter" allowFileEncode={true} allowMultiple={true} allowDrop={true} maxFiles={1} onprocessfile={handleProcessFile} onaddfile={handleAddFile} server="/api/upload/filepondstorage" oninit={handleInit} />
          <button className="bg-discordLighter border-2 border-solid border-discordLighter p-4 " type="submit">Upload Post</button>
        </form>
      </div>
    </Form>
  )
}