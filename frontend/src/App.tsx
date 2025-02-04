import { Progress } from "@/components/Progress";
import { Loader2Icon, PackageOpenIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast, Toaster } from "sonner";
import { Button } from "./components/Button";
import { cn } from "./lib/utils";
import { getPresignedURL } from "./services/getPresignedURL";
import { uploadFile } from "./services/uploadFile";

interface IUpload {
  file: File;
  progress: number;
}

export function App() {
  const [uploads, setUploads] = useState<IUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploads((state) =>
        state.concat(acceptedFiles.map((file) => ({ file, progress: 0 }))),
      );
    },
  });

  //deletar  sem percorrer todo o arrayJH
  function handleRemoveUpload(removingIndex: number) {
    setUploads((state) => {
      const newState = [...state];
      newState.splice(removingIndex, 1);

      return newState;
    });
  }

  async function handleUpload() {
    try {
      setIsLoading(true);

      //gera todas as urls
      const uploadObjects = await Promise.all(
        uploads.map(async ({ file }) => ({
          url: await getPresignedURL(file),
          file,
        })),
      );

      console.log(uploadObjects, `urls`);

      const response = await Promise.allSettled(
        uploadObjects.map(({ url, file }, index) =>
          uploadFile(url, file, (progress) => {
            console.log(url);
            setUploads((state) => {
              const newState = [...state];
              const upload = newState[index];

              newState[index] = {
                ...upload,
                progress,
              };

              return newState;
            });
          }),
        ),
      );

      response.forEach((response, index) => {
        if (response.status === "rejected") {
          const fileWithError = uploads[index].file;
          console.log(response);
          console.error(`O upload do arquivo ${fileWithError.name} falhou`);
        }
      });

      setUploads([]);
      toast.success("Uploads realizados com sucesso");
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center py-20 px-6">
      <Toaster />
      <div className="w-full max-w-xl">
        <div
          {...getRootProps()}
          className={cn(
            "border h-60 w-full rounded-md flex flex-col items-center justify-center cursor-pointer border-dashed transition-colors",
            isDragActive && "bg-accent/50",
          )}
        >
          <input {...getInputProps()} />
          <PackageOpenIcon className="size-10 stroke-1 mb-2" />
          <span>Solte os seus arquivos aqui</span>
          <small className="text-muted-foreground">
            Apenas arquivos PNG de ate 1MB
          </small>
        </div>

        {uploads.length > 0 && (
          <div className="mt-10">
            <h2 className="font-medium text-2xl tracking-tight ">
              Arquivos selecionados
            </h2>

            <div className="mt-4 space-y-2">
              {uploads.map(({ file, progress }, index) => (
                <div key={file.name} className="border p-3 rounded-md">
                  <div className="flex items-center justify-between ">
                    <span className="text-sm">{file.name}</span>

                    <Button
                      onClick={() => handleRemoveUpload(index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <Progress className="h-2 mt-2" value={progress} />
                </div>
              ))}
            </div>
            <Button
              className="mt-4 w-full flex gap-2"
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading && <Loader2Icon className="animate-spin size-5" />}
              Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
