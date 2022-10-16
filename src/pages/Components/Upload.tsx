import React, { Dispatch, SetStateAction, useState } from 'react';
import { FilePond, registerPlugin } from "react-filepond"
import "filepond/dist/filepond.min.css"


import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from "filepond-plugin-file-encode"
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePondErrorDescription, FilePondFile } from 'filepond';
import { trpc } from '../../utils/trpc';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

interface UploadProps {
    userId: string
}
const Upload = (props: UploadProps) => {
    const [fileId, setFileId]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const [fileName, setFileName]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();
    const [fileBase64String, setFileBase64String]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState();

    const uploadIconMutation = trpc.useMutation("upload.icon");

    const handleInit = () => {
        return;
    }

    const handleAddFile = (err: FilePondErrorDescription | null, file: FilePondFile) => {
        if(err) {
            return;
        }
        setFileId(file.id);
        setFileName(file.filename);
    }

    const handleProcessFile = (err: FilePondErrorDescription | null, file: FilePondFile) => {
        if(err) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setFileBase64String(file.getFileEncodeBase64String());
    }

    const generatePictureServer = async() => {
        const result = await fetch("/api/upload/filepondgenerate", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                fileId: fileId as string,
                fileBase64String: fileBase64String as string,
                fileName: fileName
            })
        });

        const parsed_result = await result.json();
        await uploadIconMutation.mutateAsync({
            userId: props.userId,
            path: parsed_result.path
        });
    }
    return (
        <div>
            <FilePond allowFileEncode={true} allowMultiple={false} allowDrop={false} maxFiles={1} onprocessfile={handleProcessFile} onaddfile={handleAddFile} server="/api/upload/filepondstorage" oninit={handleInit} />
            <button onClick={generatePictureServer}>SSSSSSSS</button>
        </div>
    )
}

export default Upload