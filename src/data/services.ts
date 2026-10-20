export interface ServiceItem {
  id: string;
  slug: string;
  iconName: string;
  image: string;
  isFlagged?: boolean;
}


export const servicesData: ServiceItem[] = [
  {
    id: "design",
    slug: "engineering-design",
    iconName: "Compass",
    image: "/assets/services/design.jpg",
  },
  {
    id: "construction",
    slug: "construction-contracting",
    iconName: "HardHat",
    image: "/assets/projects/p_1.jpg",
  },
  {
    id: "supervision",
    slug: "engineering-supervision",
    iconName: "ClipboardCheck",
    image: "/assets/services/supervision.jpg",
  },
  {
    id: "foundations",
    slug: "excavation-foundations-concrete",
    iconName: "Layers",
    image: "/assets/projects/p_4.jpg",
  },
  {
    id: "waterproofing",
    slug: "foundation-waterproofing",
    iconName: "ShieldCheck",
    image: "/assets/projects/p_2.jpg",
  },
  {
    id: "finishing",
    slug: "interior-exterior-finishing",
    iconName: "Paintbrush",
    image: "/assets/projects/p_6.jpg",
  },
  {
    id: "turnkey",
    slug: "turnkey-delivery",
    iconName: "KeyRound",
    image: "/assets/projects/p_7.jpg",
  },
  {
    id: "realestate",
    slug: "real-estate-investment",
    iconName: "Building2",
    image: "/assets/services/realestate.jpg",
    isFlagged: true,
  },
];

