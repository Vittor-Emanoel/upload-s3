import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "./lib/utils";
import { PackageOpenIcon, Trash2 } from "lucide-react";
import { Button } from "./components/Button";

export function App() {
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFile) => {
      setFiles((state) => state.concat(acceptedFile));
    },
  });

  //deletar  sem percorrer todo o array
  function handleRemoveFile(removingIndex: number) {
    setFiles((state) => {
      const newState = [...state];
      newState.splice(removingIndex, 1);

      return newState;
    });
  }

  return (
    <div className="min-h-screen flex justify-center py-20 px-6">
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

        {files.length > 0 && (
          <div className="mt-10">
            <h2 className="font-medium text-2xl tracking-tight ">
              Arquivos selecionados
            </h2>

            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={file.name}
                  className="border flex items-center justify-between p-3 rounded-md"
                >
                  <span className="text-sm">{file.name}</span>

                  <Button
                    onClick={() => handleRemoveFile(index)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full">Upload</Button>
          </div>
        )}
      </div>
    </div>
  );
}
