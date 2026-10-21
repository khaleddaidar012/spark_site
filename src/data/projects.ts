export type ProjectCategory =
  | "structural"
  | "residential"
  | "finishing"
  | "commercial"
  | "renders";

export type ProjectStatus = "completed" | "render";

export interface ProjectStage {
  stageNumber: number;
  titleAr: string;
  titleEn: string;
  image: string;
  images?: string[];
  descriptionAr: string;
  descriptionEn: string;
}

export interface ProjectItem {
  id: string;
  category: ProjectCategory | ProjectCategory[];
  status: ProjectStatus;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  gallery?: string[];
  stages?: ProjectStage[];
  year?: string;
  scopeAr?: string;
  scopeEn?: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: "proj-damietta-foundation",
    category: ["structural", "residential"],
    status: "completed",
    titleAr: "مشروع تجهيز الموقع وتأسيس وعزل الأساسات الإنشائية",
    titleEn: "Site Preparation, Concrete Sub-Base & Foundation Waterproofing",
    locationAr: "دمياط الجديدة",
    locationEn: "New Damietta",
    descriptionAr:
      "تنفيذ متكامل ومتتابع لمراحل تأسيس الموقع بدمياط الجديدة؛ بدءاً من أعمال الرفع المساحي الدقيق وضبط المناسيب وأعمال الحفر، مروراً بصب الخرسانة العادية والتأكد من مطابقتها للمواصفات، وصولاً إلى تطبيق أنظمة عزل الرطوبة باللفائف البيتومينية المعتمدة وصب خرسانة الحماية لحفظ العزل قبل أعمال التسليح.",
    descriptionEn:
      "Sequential execution of comprehensive foundation works in New Damietta; beginning with topographical survey leveling, site preparation, and excavation, advancing to plain concrete sub-base casting, and culminating in high-specification bituminous membrane waterproofing and protective screed concrete pouring.",
    image: "/assets/projects/p_1.jpg",
    gallery: [
      "/assets/projects/p_4.jpg",
      "/assets/projects/p_1.jpg",
      "/assets/projects/p_2.jpg",
      "/assets/projects/p_3.jpg",
    ],
    stages: [
      {
        stageNumber: 1,
        titleAr: "أعمال الحفر والرفع المساحي وتجهيز الموقع",
        titleEn: "Site Excavation, Surveying & Leveling",
        image: "/assets/projects/p_4.jpg",
        descriptionAr:
          "بدء خطوات التنفيذ بالرفع المساحي وتحديد المناسيب الهندسية وتجهيز الموقع وأعمال الحفر تمهيداً للأعمال الخرسانية.",
        descriptionEn:
          "Initial site preparation including precision topographical survey leveling, boundary layout, and excavation works.",
      },
      {
        stageNumber: 2,
        titleAr: "أعمال الصبة العادية للأساسات",
        titleEn: "Plain Concrete Foundation Casting",
        image: "/assets/projects/p_1.jpg",
        descriptionAr:
          "المرحلة الثانية: تنفيذ أعمال صب الخرسانة العادية مع المتابعة المستمرة أثناء الصب والالتزام التام بالمناسيب المعتمدة.",
        descriptionEn:
          "Stage two: execution of plain concrete casting with continuous on-site inspection and strict elevation controls.",
      },
      {
        stageNumber: 3,
        titleAr: "أعمال عزل وحماية الأساسات",
        titleEn: "Foundation Waterproofing Membrane",
        image: "/assets/projects/p_2.jpg",
        descriptionAr:
          "تنفيذ طبقات العزل المائي باللفائف البيتومينية لحماية الخرسانة الإنشائية وضمان سلامة المبنى ومقاومة الرطوبة الأرضية.",
        descriptionEn:
          "Application of multi-layer bituminous waterproofing membrane to protect the structural concrete from soil moisture.",
      },
      {
        stageNumber: 4,
        titleAr: "أعمال صب خرسانة حماية العزل المائي",
        titleEn: "Protective Concrete Screed Pouring",
        image: "/assets/projects/p_3.jpg",
        descriptionAr:
          "صب طبقة خرسانية واقية فوق عزل الأساسات لحمايته من أي إجهادات أو أضرار أثناء تركيب حديد التسليح.",
        descriptionEn:
          "Pouring protective concrete screed layer over the waterproofing membrane prior to rebar placement.",
      },
    ],
    year: "2024",
    scopeAr:
      "رفع مساحي، حفر وتجهيز الموقع، صب خرسانة عادية، عزل بيتوميني متعدد الطبقات، وصب خرسانة حماية العزل",
    scopeEn:
      "Topographical survey, excavation, plain concrete casting, bituminous waterproofing, and protective screed",
  },
  {
    id: "proj-obour-finishing",
    category: ["finishing", "residential"],
    status: "completed",
    titleAr: "أعمال التشطيبات الداخلية المتكاملة لشقة سكنية",
    titleEn: "Turnkey Residential Interior Finishing",
    locationAr: "مدينة العبور",
    locationEn: "Obour City",
    descriptionAr:
      "تنفيذ متكامل لأعمال التشطيبات الداخلية المعمارية لشقة سكنية بمدينة العبور؛ شملت تناسق الخامات واختيار الألوان، توزيع الإضاءة المودرن والأسقف المعلقة، تركيب الأرضيات الخشبية، تنفيذ البانوهات والتجاليد الجدارية، والأطقم الصحية وتكسيات الحمامات بعناية فائقة.",
    descriptionEn:
      "Comprehensive execution of architectural interior finishing for an apartment in Obour City; featuring harmonized color schemes, modern recessed lighting, false ceilings, wood-look flooring, wall mouldings, and premium bathroom sanitary installations.",
    image: "/assets/projects/p_6.jpg",
    gallery: ["/assets/projects/p_6.jpg"],
    year: "2024",
    scopeAr:
      "أرضيات خشبية، أسقف جبسية معلقة، إضاءة مودرن، بانوهات كلاسيكية، وأعمال صحية متكاملة",
    scopeEn:
      "Wood flooring, suspended gypsum ceilings, architectural lighting, wall panelling, and sanitary works",
  },
  {
    id: "proj-living-transformation",
    category: ["finishing", "residential"],
    status: "completed",
    titleAr: "تشطيب وتأثيث صالة معيشة سكنية من التأسيس إلى الفرش",
    titleEn: "Turnkey Living Space Transformation: Rough-In to Furnished",
    locationAr: "مشروع سكني",
    locationEn: "Residential Project",
    descriptionAr:
      "توثيق لمراحل تحويل مساحة سكنية متكاملة من مرحلة العظم والتشطيب الأولي مروراً بتركيب الرخام والأسقف المعلقة والتجاليد الخشبية والإضاءة غير المباشرة، وصولاً إلى التسليم النهائي الكامل مع الفرش والديكور المتناسق.",
    descriptionEn:
      "Documenting the comprehensive transformation of a residential living space from rough-in execution through marble flooring, false ceiling lighting, and wood cladding to the final furnished handover.",
    image: "/assets/projects/p_7.jpg",
    gallery: ["/assets/projects/p_7.jpg"],
    year: "2024",
    scopeAr:
      "تشطيب معماري، أرضيات رخامية، تجاليد خشبية وإضاءة ليد، وتنسيق الأثاث والديكور",
    scopeEn:
      "Architectural finishing, marble flooring, wood cladding, LED profile lighting, and turnkey furnishing",
  },
];
