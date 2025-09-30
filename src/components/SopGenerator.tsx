// src/components/SOPGenerator.tsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useBlocker } from "react-router-dom"; // requires data router
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  FileText,
  Sparkles,
  Mail,
  Phone,
  Copy as CopyIcon,
  Download as DownloadIcon,
  RefreshCw, // NEW
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sopService } from "@/services/sopService";
import { handleError } from "@/helpers/errorHandler";
import Loader from "./Loader";
import Questionnaire from "./Questionnaire";

// PDF.js
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// jsPDF
import { jsPDF } from "jspdf";

// docx
import { Document, Packer, Paragraph, TextRun } from "docx";

// Configure pdf.js worker
GlobalWorkerOptions.workerSrc = pdfWorker;

type Step = "university" | "resume" | "questions" | "quality_check" | "result";

// Shared type from types; keep single source of truth
import type { AppFormData as SopAppFormData } from "@/types/sop.types";

// Extend for UI-only fields, index signature preserved
type UIAppFormData = SopAppFormData & { experience?: string };

function ConfirmNavigation({
  isBlocked,
  title = "Leave this page?",
  subtitle = "Unsaved progress will be lost if you continue.",
}: {
  isBlocked: boolean;
  title?: string;
  subtitle?: string;
}) {
  const shouldBlock = useCallback(
    ({
      currentLocation,
      nextLocation,
    }: {
      currentLocation: any;
      nextLocation: any;
    }) => isBlocked && currentLocation.pathname !== nextLocation.pathname,
    [isBlocked]
  );
  const blocker = useBlocker(shouldBlock as any);
  const open = blocker.state === "blocked" || blocker.state === "proceeding";

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{subtitle}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            className="rounded-lg"
            onClick={() => blocker.reset?.()}
          >
            Stay on page
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => blocker.proceed?.()}
            className="rounded-lg bg-destructive hover:bg-destructive/90"
          >
            Leave anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SOPGenerator() {
  const steps: Step[] = [
    "university",
    "resume",
    "questions",
    "quality_check",
    "result",
  ];
  const { toast } = useToast();

  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    country: "",
    university: "",
    course: "",
    resume: null,
    preffered_length: "",
    specific_requirements: "",
    experience: "",
  } satisfies UIAppFormData;

  const [currentStep, setCurrentStep] = useState<Step>("university");
  const [formData, setFormData] = useState<UIAppFormData>(initialFormData);

  const [sopId, setSopId] = useState<number | null>(null);
  const [generatedSOP, setGeneratedSOP] = useState<string>("");
  const [originalPdfPath, setOriginalPdfPath] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [qualityQuestions, setQualityQuestions] = useState<string[]>([]);
  const [improvementAnswers, setImprovementAnswers] = useState<
    Record<string, string>
  >({});
  const [qualityCheckCompleted, setQualityCheckCompleted] = useState(false);

  // NEW: result step enhancements
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const words = useMemo(
    () =>
      generatedSOP.trim()
        ? generatedSOP.trim().split(/\s+/).filter(Boolean).length
        : 0,
    [generatedSOP]
  );
  const chars = generatedSOP.length;
  const readingMinutes = Math.max(1, Math.round(words / 200));

  const hasProgress = useMemo(() => {
    const idx = steps.indexOf(currentStep);
    return (
      (idx > 0 || !!sopId || !!generatedSOP.trim()) && currentStep !== "result"
    );
  }, [currentStep, steps, sopId, generatedSOP]);

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadTxt(name: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${name}.txt`);
  }

  function downloadPdf(name: string, text: string) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const lines = doc.splitTextToSize(text, maxWidth);
    let y = margin;
    const lineHeight = 16;
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    doc.save(`${name}.pdf`);
  }

  async function downloadDocx(name: string, text: string) {
    const paragraphs = text.split(/\n{2,}/).map(
      (block) =>
        new Paragraph({
          children: block
            .split("\n")
            .map((line) => new TextRun({ text: line, break: 1 })),
        })
    );
    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }],
    });
    const blob = await Packer.toBlob(doc);
    downloadBlob(blob, `${name}.docx`);
  }

  async function extractPdfTextFromUrl(url: string) {
    const arrayBuffer = await fetch(url).then((r) => r.arrayBuffer());
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const t = (content.items as any[])
        .map((it) => ("str" in it ? it.str : ""))
        .join(" ");
      text += t + "\n\n";
    }
    return text.trim();
  }

  async function handleQuestionnaireComplete(
    answersFromQuestionnaire: Record<string, string>
  ) {
    try {
      setLoading(true);
      const fullAnswers = {
        ...answersFromQuestionnaire,
        "Preffered length": formData.preffered_length || "450",
        "specific requirements":
          formData.specific_requirements || "Do whatever you want",
      };
      const payload = {
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        country: formData.country || "",
        university: formData.university || "",
        course: formData.course || "",
        answers: fullAnswers,
      };
      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));
      if (formData.resume) fd.append("resume", formData.resume);

      const { id } = await sopService.submitSop(fd);
      setSopId(id);
      setPolling(true);
      pollQualityCheck(id);
    } catch (e) {
      handleError(e, toast);
    } finally {
      setLoading(false);
    }
  }

  async function pollQualityCheck(id: number, attempt = 0) {
    const maxAttempts = 10,
      delay = 3000;
    try {
      const res = await sopService.sopQualityCheck(id);
      if (res.success && res.data?.phase === "quality_check") {
        setPolling(false);
        setQualityScore(res.data.quality_result.current_score);
        const qs: string[] = res.data.quality_result.questions_to_improve || [];
        setQualityQuestions(qs);
        const init: Record<string, string> = {};
        qs.forEach((q) => (init[q] = ""));
        setImprovementAnswers(init);
        setCurrentStep("quality_check");
        return;
      }
      if (attempt < maxAttempts)
        setTimeout(() => pollQualityCheck(id, attempt + 1), delay);
      else setPolling(false);
    } catch (err) {
      setPolling(false);
      handleError(err, toast);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFormData({ ...formData, resume: file });
      toast({
        title: "Resume uploaded! 📄",
        description: "Your resume has been successfully uploaded.",
      });
    }
  };

  async function handleSubmitImprovements() {
    if (!sopId) return;
    setLoading(true);
    try {
      // Send improvement answers first
      await sopService.improvementSuggestions(sopId, {
        improvement_answers: improvementAnswers,
      });

      // Then call finalize to get the final SOP PDF as blob
      const pdfBlob = await sopService.finalize(sopId);

      // Create object URL from blob
      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );

      // Auto-download
      const link = document.createElement("a");
      link.href = url;
      link.download = `sop_${sopId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Keep it in state so user can re-download
      setOriginalPdfPath(url);
      setSopId(sopId);
      setCurrentStep("result");

      toast({
        title: "SOP finalized successfully",
        description: `SOP ID: ${sopId}`,
      });
    } catch (err) {
      handleError(err, toast);
    } finally {
      setLoading(false);
    }
  }

  const stepTitles: Record<Step, string> = {
    university: "",
    resume: "Upload Your Resume 📄",
    questions: "Tell Us About Yourself ✨",
    quality_check: "Additional Questions ❓",
    result: "Your SOP ✍️",
  };

  const isStepComplete = (step: Step) => {
    switch (step) {
      case "university":
        return (
          !!formData.name &&
          !!formData.email &&
          !!formData.phone &&
          !!formData.country &&
          !!formData.university &&
          !!formData.course
        );
      case "resume":
        return formData.resume !== null;
      case "questions":
        return sopId !== null;
      case "quality_check":
        return qualityCheckCompleted;
      case "result":
        return true;
      default:
        return false;
    }
  };

  const universityData = {
    USA: {
      universities: [
        "Harvard University",
        "Stanford University",
        "MIT",
        "UC Berkeley",
        "Yale University",
        "Princeton University",
      ],
      courses: [
        "Computer Science",
        "Business Administration",
        "Engineering",
        "Medicine",
        "Law",
        "Economics",
        "Psychology",
        "International Relations",
      ],
    },
    UK: {
      universities: [
        "Oxford University",
        "Cambridge University",
        "Imperial College London",
        "London School of Economics",
        "University College London",
      ],
      courses: [
        "Law",
        "Medicine",
        "Economics",
        "Political Science",
        "Data Science",
        "Engineering",
        "Psychology",
      ],
    },
    Canada: {
      universities: [
        "University of Toronto",
        "McGill University",
        "University of British Columbia",
        "University of Waterloo",
        "McMaster University",
      ],
      courses: [
        "Computer Science",
        "Engineering",
        "Medicine",
        "Environmental Science",
        "Business Administration",
        "Data Analytics",
      ],
    },
    Australia: {
      universities: [
        "University of Melbourne",
        "Australian National University",
        "University of Sydney",
        "University of Queensland",
        "Monash University",
      ],
      courses: [
        "Marine Biology",
        "Engineering",
        "Business Management",
        "Medicine",
        "Law",
        "Computer Science",
        "Architecture",
      ],
    },
    Germany: {
      universities: [
        "Technical University of Munich",
        "Heidelberg University",
        "Humboldt University of Berlin",
        "University of Freiburg",
        "RWTH Aachen University",
      ],
      courses: [
        "Mechanical Engineering",
        "Automotive Engineering",
        "Computer Science",
        "Physics",
        "Economics",
        "Medicine",
        "Philosophy",
      ],
    },
  } as const;

  const handleNext = () => {
    const i = steps.indexOf(currentStep);
    if (i < steps.length - 1) setCurrentStep(steps[i + 1]);
  };
  const handlePrevious = () => {
    const i = steps.indexOf(currentStep);
    if (i > 0) setCurrentStep(steps[i - 1]);
  };

  const countries = Object.keys(universityData);
  const progressSteps = [
    { key: "university", label: "University", index: 1 },
    { key: "resume", label: "Resume", index: 2 },
    { key: "questions", label: "Questions", index: 3 },
    { key: "quality_check", label: "Quality", index: 4 },
    { key: "result", label: "Result", index: 5 },
  ];

  const safeScore = Math.max(0, Math.min(100, qualityScore ?? 0));
  const r = 40,
    circumference = 2 * Math.PI * r;
  const dash = (safeScore / 100) * circumference;

  // NEW: load draft on entering result
  useEffect(() => {
    if (currentStep === "result") {
      const key = `sop_${sopId ?? "draft"}_draft`;
      const cached = localStorage.getItem(key);
      if (cached && !generatedSOP) {
        setGeneratedSOP(cached);
      }
    }
  }, [currentStep, sopId, generatedSOP]);

  // NEW: autosave with debounce
  useEffect(() => {
    if (currentStep !== "result") return;
    const key = `sop_${sopId ?? "draft"}_draft`;
    setSaveStatus("saving");
    const t = setTimeout(() => {
      try {
        localStorage.setItem(key, generatedSOP);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1200);
      } catch {
        setSaveStatus("idle");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [generatedSOP, currentStep, sopId]);

  // NEW: reset to server text
  const handleResetToServer = async () => {
    if (!originalPdfPath) return;
    try {
      setLoading(true);
      const txt = await extractPdfTextFromUrl(originalPdfPath);
      setGeneratedSOP(txt);
      toast({
        title: "Reverted to original",
        description: "Loaded server-generated text.",
      });
    } catch (e) {
      handleError(e, toast);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SPA navigation guard (no Back to Home button for admin page) */}
      <ConfirmNavigation isBlocked={hasProgress} />

      {(loading || polling) && (
        <>
          {loading && <Loader text="Processing..." />}
          {polling && (
            <Loader text="Performing quality check, please wait..." />
          )}
        </>
      )}

      <div className="min-h-screen bg-gradient-soft py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
              {progressSteps.map((step, index) => (
                <div key={step.key} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300 ${
                      currentStep === step.key
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : isStepComplete(step.key as Step)
                        ? "bg-pastel-green text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.index}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={`w-4 md:w-8 h-0.5 mx-1 md:mx-2 transition-all duration-300 ${
                        isStepComplete(step.key as Step) ||
                        progressSteps.findIndex((s) => s.key === currentStep) >
                          index
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <Card className="shadow-card bg-gradient-card border-0 animate-fade-in">
            <CardHeader className="text-center pb-4 md:pb-6">
              <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                {stepTitles[currentStep]}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              {currentStep === "university" && (
                <div className="space-y-6 animate-slide-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="rounded-xl border-border bg-input"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="rounded-xl border-border bg-input"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., +91 9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="rounded-xl border-border bg-input"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            country: value,
                            university: "",
                            course: "",
                          })
                        }
                      >
                        <SelectTrigger className="rounded-xl border-border bg-input">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label
                        htmlFor="university"
                        className="text-sm font-medium"
                      >
                        University
                      </Label>
                      <Select
                        value={formData.university}
                        onValueChange={(value) =>
                          setFormData({ ...formData, university: value })
                        }
                        disabled={!formData.country}
                      >
                        <SelectTrigger className="rounded-xl border-border bg-input">
                          <SelectValue placeholder="Select university" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.country &&
                            universityData[
                              formData.country as keyof typeof universityData
                            ].universities.map((uni) => (
                              <SelectItem key={uni} value={uni}>
                                {uni}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="course" className="text-sm font-medium">
                        Course/Program
                      </Label>
                      <Select
                        value={formData.course}
                        onValueChange={(value) =>
                          setFormData({ ...formData, course: value })
                        }
                        disabled={!formData.country}
                      >
                        <SelectTrigger className="rounded-xl border-border bg-input">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.country &&
                            universityData[
                              formData.country as keyof typeof universityData
                            ].courses.map((course) => (
                              <SelectItem key={course} value={course}>
                                {course}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "resume" && (
                <div className="space-y-6 animate-slide-up">
                  <div className="border-2 border-dashed border-border rounded-xl p-4 md:p-8 text-center bg-pastel-blue">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Upload your resume</p>
                      <p className="text-sm text-muted-foreground">
                        PDF, DOC, or DOCX up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("resume-upload")?.click()
                      }
                      className="mt-4 rounded-xl"
                      variant="outline"
                    >
                      Choose File
                    </Button>
                    {formData.resume && (
                      <p className="mt-4 text-sm text-primary font-medium">
                        ✅ {formData.resume.name} uploaded successfully!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === "questions" && (
                <Questionnaire
                  formData={formData}
                  setFormData={setFormData}
                  onComplete={(answers) => handleQuestionnaireComplete(answers)}
                />
              )}

              {currentStep === "quality_check" && (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      Quality Check
                    </h2>
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-gray-200"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-blue-600"
                            strokeWidth="10"
                            strokeDasharray={`${dash}, ${circumference}`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800">
                          {Math.max(0, Math.min(100, qualityScore ?? 0))}/100
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Your Answer Quality Score
                    </p>
                  </div>

                  <div className="space-y-6">
                    {qualityQuestions.map((q, index) => (
                      <div key={q} className="space-y-2">
                        <Label className="text-lg font-medium text-gray-700">
                          {index + 1}. {q}
                        </Label>
                        <Textarea
                          value={improvementAnswers[q] || ""}
                          onChange={(e) =>
                            setImprovementAnswers((m) => ({
                              ...m,
                              [q]: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Provide your improvement suggestions here..."
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleSubmitImprovements}
                      disabled={
                        !Object.values(improvementAnswers).every((v) =>
                          v?.trim()
                        ) || loading
                      }
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit Improvements
                    </Button>
                  </div>
                </div>
              )}

              {/* UPDATED RESULT STEP ONLY */}
              {currentStep === "result" && (
                <div className="space-y-6 animate-fade-in max-w-2xl mx-auto p-4">
                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xl md:text-2xl font-semibold text-foreground mt-2">
                            Finalize SOP
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            sop_{sopId ?? "draft"}.pdf • {words} words • {chars}{" "}
                            chars • ~{readingMinutes} min read
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Your final PDF is being downloaded…
                      </p>
                      {originalPdfPath && (
                        <Button variant="default" asChild>
                          <a href={originalPdfPath} download>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Download Again
                          </a>
                        </Button>
                      )}
                      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                          variant="outline"
                          asChild
                          className="flex items-center gap-2"
                        >
                          <a href="mailto:support@example.com">
                            <Mail className="w-4 h-4" />
                            Email Support
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          asChild
                          className="flex items-center gap-2"
                        >
                          <a href="tel:+917353446655">
                            <Phone className="w-4 h-4" />
                            +91 7353446655
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep !== "result" && (
                <div className="flex justify-between pt-6 md:pt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === "university"}
                    className="rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === "quality_check" ? (
                    <div />
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepComplete(currentStep)}
                      className="rounded-xl"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
