import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppFormData } from "@/types/sop.types";

interface Props {
  formData: AppFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppFormData>>;
  onComplete: (answers: Record<string, string>) => void;
}

// Define your 5 groups of questions (arrays of {key,label})
const QUESTION_GROUPS: Array<{
  title: string;
  items: { key: string; label: string }[];
}> = [
  {
    title: "Academic Background",
    items: [
      { key: "ugMajor", label: "Undergraduate major and institution" },
      { key: "impactCourses", label: "Most impactful courses/projects" },
      { key: "honors", label: "Honors, awards, or scholarships" },
    ],
  },
  {
    title: "Professional Experience",
    items: [
      { key: "roleSummary", label: "Significant internship/job role" },
      { key: "challenges", label: "Challenges tackled & solutions" },
      { key: "teamwork", label: "Teamwork or leadership example" },
    ],
  },
  {
    title: "Research & Projects",
    items: [
      { key: "proudProject", label: "Project you’re most proud of" },
      { key: "yourContribution", label: "Your specific contribution" },
      { key: "skillsDeveloped", label: "Technical/research skills gained" },
    ],
  },
  {
    title: "Motivation & Fit",
    items: [
      { key: "extraCurricular", label: "Clubs/competitions/volunteering" },
      { key: "leadershipRoles", label: "Leadership roles outside academics" },
      { key: "whyCourse", label: "Why this course?" },
      { key: "backgroundFit", label: "How your background prepares you" },
      { key: "uniquePerspective", label: "Unique perspective you bring" },
      { key: "whyUniversity", label: "Why this university?" },
      {
        key: "researchAttraction",
        label: "Faculty/research/groups that appeal",
      },
      {
        key: "communityEngagement",
        label: "How you’ll engage campus community",
      },
    ],
  },
  {
    title: "Goals & Reflection",
    items: [
      { key: "shortTermGoals", label: "Short-term career objectives" },
      { key: "longTermImpact", label: "Long-term impact aspirations" },
      { key: "programBenefits", label: "How program helps goals" },
      { key: "strengths", label: "Core strengths and values" },
      { key: "resilience", label: "Example of resilience/adaptability" },
      { key: "intlExperience", label: "International/cultural experiences" },
      { key: "studyAbroadView", label: "How studying abroad shapes you" },
      { key: "finalReflection", label: "Anything else to highlight?" },
    ],
  },
];

export default function Questionnaire({
  formData,
  setFormData,
  onComplete,
}: Props) {
  const [subStep, setSubStep] = useState(0);

  const group = QUESTION_GROUPS[subStep];
  const total = QUESTION_GROUPS.length;

  // Check completion of current group
  const isComplete = group.items.every(({ key }) => {
    const value = formData[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  const buildAnswersMap = () => {
    const out: Record<string, string> = {};
    QUESTION_GROUPS.forEach(({ items }) => {
      items.forEach(({ key, label }) => {
        const val = formData[key];
        out[label] = typeof val === "string" ? val : "";
      });
    });
    return out;
  };

  return (
    <div className="space-y-6">
      {/* Mini-stepper */}
      <div className="flex justify-center space-x-2 mb-4">
        {QUESTION_GROUPS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === subStep
                ? "bg-primary"
                : i < subStep
                ? "bg-pastel-green"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Section Title */}
      <h3 className="text-lg font-semibold text-center">{group.title}</h3>

      {/* Questions */}
      {group.items.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {label}
          </Label>
          <Textarea
            id={key}
            placeholder="Type your answer here…"
            value={typeof formData[key] === "string" ? formData[key] : ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className="min-h-24 rounded-xl border-border bg-input"
          />
        </div>
      ))}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          disabled={subStep === 0}
          onClick={() => setSubStep(subStep - 1)}
        >
          Previous
        </Button>
        {subStep < total - 1 ? (
          <Button
            onClick={() => isComplete && setSubStep(subStep + 1)}
            disabled={!isComplete}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (!isComplete) return;
              const answers = buildAnswersMap(); // labels -> answers
              onComplete(answers); // pass back to parent
            }}
            disabled={!isComplete}
          >
            Review & Continue
          </Button>
        )}
      </div>
    </div>
  );
}
