import React, { useRef, useState, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { masterCourseService } from "@/services/mastersCourseService";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileDown } from "lucide-react";

const CsvImportPanel: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const downloadTemplate = async () => {
    try {
      const blob = await masterCourseService.downloadTemplate();
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "masters_courses_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to download template",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      toast({
        title: "File Added",
        description: `${file.name} selected for upload`,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop a valid .csv file",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please choose or drop a CSV file first.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setUploadProgress(0);

      const result = await masterCourseService.importCsv(formData, (ev) => {
        if (ev.total) {
          setUploadProgress(Math.round((ev.loaded * 100) / ev.total));
        }
      });

      toast({
        title: "Import Complete ✅",
        description: `Processed ${result.rowsProcessed} rows. Invalid rows: ${result.invalidRows}`,
      });

      setLoading(false);
      setUploadProgress(null);
      setSelectedFile(null);
      if (onDone) onDone();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Upload Failed",
        description: "There was an issue importing your CSV file.",
        variant: "destructive",
      });
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Upload or drop a <strong>.csv</strong> file to bulk import or update
        master courses.
        <br />
        <strong>Columns:</strong> <code>country</code>,{" "}
        <code>universities</code> (semicolon-separated), <code>courses</code>{" "}
        (semicolon-separated)
      </p>

      {/* Drag-and-Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition cursor-pointer bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        {selectedFile ? (
          <div>
            <p className="font-medium text-gray-700">{selectedFile.name}</p>
            <p className="text-xs text-gray-500 mt-1">Ready to upload</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadCloud className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop CSV file here, or click to choose
            </p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-3">
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" /> Download Template
        </Button>

        <Button
          onClick={uploadFile}
          disabled={loading || !selectedFile}
          className="flex items-center gap-2"
        >
          <UploadCloud className="h-4 w-4" />
          {loading ? "Uploading..." : "Upload CSV"}
        </Button>
      </div>

      {/* Progress bar */}
      {uploadProgress !== null && (
        <div className="w-full bg-gray-200 rounded-md h-2 mt-3 overflow-hidden">
          <div
            style={{ width: `${uploadProgress}%` }}
            className="bg-blue-500 h-full transition-all duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default CsvImportPanel;
