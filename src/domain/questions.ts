/**
 * Question catalog: the single source of truth for what the audience is asked,
 * which slide each question belongs to and which answers are valid.
 * Both the API validation and the result aggregation read from here,
 * so adding a question never requires touching transport or storage code.
 */

export const QUESTION_IDS = ["maturity", "priority", "kpi", "risk", "first-step", "satisfaction"] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

export interface ChoiceOption {
  readonly id: string;
  readonly code?: string;
  readonly label: string;
}

interface QuestionBase {
  readonly id: QuestionId;
  /** Slide of the deck where the presenter asks this question. */
  readonly slide: number;
  /** Short name used in tabs and progress. */
  readonly shortTitle: string;
  readonly title: string;
  readonly hint?: string;
}

export interface SingleChoiceQuestion extends QuestionBase {
  readonly kind: "single";
  readonly options: readonly ChoiceOption[];
}

export interface ScaleQuestion extends QuestionBase {
  readonly kind: "scale";
  readonly min: 1;
  readonly max: 5;
  readonly minLabel: string;
  readonly maxLabel: string;
}

export interface MatrixQuestion extends QuestionBase {
  readonly kind: "matrix";
  readonly min: 1;
  readonly max: 5;
  readonly minLabel: string;
  readonly maxLabel: string;
  readonly dimensions: readonly ChoiceOption[];
}

export type Question = SingleChoiceQuestion | ScaleQuestion | MatrixQuestion;

export const QUESTIONS: readonly Question[] = [
  {
    id: "maturity",
    kind: "matrix",
    slide: 1,
    shortTitle: "Rəqəmsal yetkinlik",
    title: "Təmsil etdiyiniz təşkilat bu sahələrdə nə dərəcədə rəqəmsaldır?",
    hint: "İş yeriniz və ya universitetiniz. Hər sahəyə 1-dən 5-ə qədər bal verin.",
    min: 1,
    max: 5,
    minLabel: "Əsasən əl ilə",
    maxLabel: "Tam rəqəmsal",
    dimensions: [
      { id: "integration", label: "Sistemlərin inteqrasiyası" },
      { id: "automation", label: "Proseslərin avtomatlaşdırılması" },
      { id: "documents", label: "Elektron sənəd idarəetməsi" },
      { id: "data", label: "Məlumat və hesabatlar" },
      { id: "security", label: "Kibertəhlükəsizlik" },
    ],
  },
  {
    id: "priority",
    kind: "single",
    slide: 2,
    shortTitle: "Prioritet problem",
    title: "NovaTech-in hansı problemi ilk növbədə həll olunmalıdır?",
    options: [
      { id: "P1", code: "P1", label: "Köhnə tətbiqlər və texniki borc" },
      { id: "P2", code: "P2", label: "Əlaqəsiz biznes sistemləri" },
      { id: "P3", code: "P3", label: "Təkrarlanan əl əməliyyatları" },
      { id: "P4", code: "P4", label: "Dağınıq sənəd idarəetməsi" },
      { id: "P5", code: "P5", label: "Gecikən və uyğunsuz hesabatlar" },
      { id: "P6", code: "P6", label: "İnfrastruktur və təhlükəsizlik" },
    ],
  },
  {
    id: "kpi",
    kind: "single",
    slide: 7,
    shortTitle: "İlk KPI",
    title: "Paneldə hansı göstəriciyə birinci baxardınız?",
    options: [
      { id: "resolution", label: "Sorğunun həll müddəti" },
      { id: "on-time", label: "Tapşırıqların vaxtında icrası" },
      { id: "availability", label: "Sistem əlçatanlığı" },
      { id: "incidents", label: "İnsidentlər və onların təkrarlanması" },
      { id: "approval", label: "Sənəd təsdiqi müddəti" },
      { id: "automation", label: "Avtomatlaşdırma əhatəsi" },
      { id: "satisfaction", label: "İstifadəçi məmnuniyyəti" },
    ],
  },
  {
    id: "risk",
    kind: "single",
    slide: 11,
    shortTitle: "Ən böyük risk",
    title: "Tətbiq zamanı ən böyük risk hansıdır?",
    options: [
      { id: "migration", label: "Miqrasiya defektləri" },
      { id: "integration", label: "İnteqrasiya nasazlıqları" },
      { id: "security", label: "Təhlükəsizlik insidentləri" },
      { id: "data-quality", label: "Zəif məlumat keyfiyyəti" },
      { id: "resistance", label: "İstifadəçi müqaviməti" },
      { id: "skills", label: "Bacarıq çatışmazlığı" },
      { id: "budget", label: "Büdcənin aşılması" },
      { id: "vendor", label: "Vendor asılılığı" },
    ],
  },
  {
    id: "first-step",
    kind: "single",
    slide: 12,
    shortTitle: "İlk addım",
    title: "Transformasiya hansı təşəbbüslə başlamalıdır?",
    options: [
      { id: "A", code: "A", label: "Sistem inteqrasiyası və API-lər" },
      { id: "B", code: "B", label: "İş axınının avtomatlaşdırılması" },
      { id: "C", code: "C", label: "KPI panelləri və analitika" },
    ],
  },
  {
    id: "satisfaction",
    kind: "scale",
    slide: 12,
    shortTitle: "Məmnuniyyət",
    title: "Təqdimat mövzunu nə dərəcədə aydınlaşdırdı?",
    min: 1,
    max: 5,
    minLabel: "Heç aydın olmadı",
    maxLabel: "Tam aydın oldu",
  },
];

const BY_ID = new Map<QuestionId, Question>(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: QuestionId): Question {
  const question = BY_ID.get(id);
  if (!question) throw new Error(`Unknown question: ${id}`);
  return question;
}

export function isQuestionId(value: unknown): value is QuestionId {
  return typeof value === "string" && (QUESTION_IDS as readonly string[]).includes(value);
}
