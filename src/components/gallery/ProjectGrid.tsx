"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Locale, getDict } from "@/lib/i18n";
import { projectsData, ProjectItem, ProjectCategory } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface ProjectGridProps {
  locale: Locale;
  limit?: number;
}

export function ProjectGrid({ locale, limit }: ProjectGridProps) {
  const dict = getDict(locale);
  const isRtl = locale === "ar";
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [projects, setProjects] = useState<ProjectItem[]>(projectsData);

  useEffect(() => {
    let active = true;
    fetch("/api/projects", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((rows: { id: string; title: string; description: string; image: string }[] | null) => {
        if (!active || !rows) return;
        const localById = new Map(projectsData.map((project) => [project.id, project]));
        const databaseProjects = rows.map((row): ProjectItem => {
          const local = localById.get(row.id);
          return {
            ...(local ?? {} as ProjectItem),
            id: row.id,
            category: local?.category ?? "residential",
            status: local?.status ?? "completed",
            titleAr: row.title,
            titleEn: local?.titleEn ?? row.title,
            locationAr: local?.locationAr ?? "مشروع سبارك",
            locationEn: local?.locationEn ?? "Spark Project",
            descriptionAr: row.description,
            descriptionEn: local?.descriptionEn ?? row.description,
            image: row.image,
            gallery: local?.gallery ?? [row.image],
          };
        });
        setProjects(databaseProjects);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const categories = [
    { key: "all", label: dict.gallery.filters.all },
    { key: "structural", label: dict.gallery.filters.structural },
    { key: "residential", label: dict.gallery.filters.residential },
    { key: "finishing", label: dict.gallery.filters.finishing },
    { key: "renders", label: dict.gallery.filters.renders },
  ];

  const filteredProjects = projects.filter((item) => {
    if (activeCategory === "all") return true;
    if (Array.isArray(item.category)) {
      return item.category.includes(activeCategory as ProjectCategory);
    }
    return item.category === activeCategory;
  });

  const displayProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  const handleOpenProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
  };

  const handleNextImage = () => {
    if (!selectedProject) return;
    const gallery =
      selectedProject.gallery && selectedProject.gallery.length > 0
        ? selectedProject.gallery
        : [selectedProject.image];
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = () => {
    if (!selectedProject) return;
    const gallery =
      selectedProject.gallery && selectedProject.gallery.length > 0
        ? selectedProject.gallery
        : [selectedProject.image];
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const currentGallery =
    selectedProject && selectedProject.gallery && selectedProject.gallery.length > 0
      ? selectedProject.gallery
      : selectedProject
      ? [selectedProject.image]
      : [];

  const activeImage = currentGallery[activeImageIndex] || selectedProject?.image || "";
  const currentStage = selectedProject?.stages?.[activeImageIndex];

  return (
    <div className="space-y-10">
      {/* Category Filter Pills (Only shown when not limited, or always available) */}
      {!limit && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C59341] ${
                activeCategory === cat.key
                  ? "bg-[#0B111E] text-[#DEB86A] shadow-md border-2 border-[#C59341]"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {displayProjects.length > 0 ? (
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:p-0 lg:grid-cols-3">
          {displayProjects.map((project) => {
            const title = isRtl ? project.titleAr : project.titleEn;
            const location = isRtl ? project.locationAr : project.locationEn;
            const description = isRtl ? project.descriptionAr : project.descriptionEn;
            const isCompleted = project.status === "completed";
            const galleryCount = project.gallery?.length || 1;

            return (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className="min-w-[84vw] max-w-[26rem] snap-center bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-[#C59341]/60 transition-all duration-300 flex flex-col cursor-pointer group md:min-w-0 md:max-w-none"
              >
                {/* Image Preview Container */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={project.image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Status Badge */}
                  <div className="absolute top-3.5 start-3.5">
                    <Badge
                      variant={isCompleted ? "completed" : "render"}
                      size="sm"
                      className="shadow-md backdrop-blur-md"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{dict.gallery.badges.completed}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{dict.gallery.badges.render}</span>
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Multi-stage Gallery Indicator Badge */}
                  {galleryCount > 1 && (
                    <div className="absolute top-3.5 end-3.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-[#DEB86A]/40 text-[#DEB86A] text-xs font-semibold flex items-center gap-1.5 shadow-md">
                      <Layers className="w-3.5 h-3.5" />
                      <span>
                        {galleryCount} {isRtl ? "مراحل مصورة" : "Stages"}
                      </span>
                    </div>
                  )}

                  {/* Hover Quick View Trigger Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                    <span className="p-3 rounded-full bg-[#0B111E] text-[#DEB86A] shadow-xl border border-[#C59341]">
                      <Eye className="w-6 h-6" />
                    </span>
                  </div>

                  {/* Location overlay */}
                  <div className="absolute bottom-3 start-3 end-3 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#DEB86A] shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0B111E] group-hover:text-[#AA7B2F] transition-colors leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    {project.year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.year}</span>
                      </div>
                    )}
                    <span className="text-[#AA7B2F] font-semibold group-hover:underline">
                      {dict.gallery.viewProject} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State for Filters */
        <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <p className="text-sm sm:text-base text-slate-700 font-semibold">
            {isRtl
              ? "لا توجد مشروعات ضمن هذا التصنيف حالياً"
              : "No projects found in this category currently"}
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRtl
              ? "تلتزم سبارك بالشفافية الكاملة: جميع الأعمال المعروضة موثقة ومنفذة ميدانياً على أرض الواقع."
              : "Spark commits to full integrity: all showcased works are real projects executed on-site."}
          </p>
        </div>
      )}

      {/* Accessible Lightbox Modal with Multi-Image Gallery Support */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={isRtl ? selectedProject.titleAr : selectedProject.titleEn}
        >
          <div className="space-y-6">
            {/* Modal Image Display with Carousel Controls (Full uncropped view) */}
            <div className="relative h-72 sm:h-[440px] md:h-[500px] w-full rounded-xl overflow-hidden bg-[#070B14] border border-white/10 flex items-center justify-center">
              {/* Ambient atmospheric backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25 blur-2xl scale-110 pointer-events-none transition-all duration-500"
                style={{ backgroundImage: `url(${activeImage})` }}
              />

              {/* Main Uncropped Image */}
              <div className="relative w-full h-full z-10">
                <Image
                  src={activeImage}
                  alt={isRtl ? selectedProject.titleAr : selectedProject.titleEn}
                  fill
                  className="object-contain transition-all duration-300 drop-shadow-lg"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                  unoptimized
                />
              </div>

              {/* Status Badge in Lightbox */}
              <div className="absolute top-4 start-4 z-20">
                <Badge
                  variant={selectedProject.status === "completed" ? "completed" : "render"}
                  size="md"
                  className="shadow-lg backdrop-blur-md"
                >
                  {selectedProject.status === "completed"
                    ? dict.gallery.badges.completed
                    : dict.gallery.badges.render}
                </Badge>
              </div>

              {/* Stage Counter Badge if multi-image */}
              {currentGallery.length > 1 && (
                <div className="absolute top-4 end-4 z-20 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#DEB86A]/40 text-[#DEB86A] text-xs font-mono font-bold shadow-lg">
                  0{activeImageIndex + 1} / 0{currentGallery.length}
                </div>
              )}

              {/* Navigation arrows inside lightbox gallery */}
              {currentGallery.length > 1 && (
                <div className="absolute inset-y-0 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    aria-label={dict.gallery.lightbox.prev}
                    className="p-2.5 rounded-full bg-black/75 hover:bg-black text-white pointer-events-auto border border-white/20 hover:border-[#DEB86A] transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    aria-label={dict.gallery.lightbox.next}
                    className="p-2.5 rounded-full bg-black/75 hover:bg-black text-white pointer-events-auto border border-white/20 hover:border-[#DEB86A] transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails Strip */}
            {currentGallery.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#DEB86A] uppercase tracking-wider block">
                  {isRtl ? "مراحل توثيق المشروع:" : "Project Documentation Stages:"}
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {currentGallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-[#DEB86A] scale-105 shadow-md shadow-[#C59341]/20 ring-2 ring-[#C59341]/50"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Stage ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                      <span className="absolute bottom-0.5 end-0.5 px-1 py-0.2 rounded bg-black/80 text-[10px] text-white font-mono font-bold">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Stage Specific Description if present */}
            {currentStage && (
              <div className="p-3.5 rounded-xl bg-[#DEB86A]/10 border border-[#DEB86A]/30 space-y-1">
                <span className="text-xs font-bold text-[#DEB86A] block">
                  {isRtl ? `المرحلة ${currentStage.stageNumber}: ${currentStage.titleAr}` : `Stage ${currentStage.stageNumber}: ${currentStage.titleEn}`}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {isRtl ? currentStage.descriptionAr : currentStage.descriptionEn}
                </p>
              </div>
            )}

            {/* Project Overall Description & Scope Bar */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#DEB86A]" />
                  <span>
                    {isRtl ? selectedProject.locationAr : selectedProject.locationEn}
                  </span>
                </div>
                {selectedProject.year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#DEB86A]" />
                    <span>{selectedProject.year}</span>
                  </div>
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {isRtl
                  ? selectedProject.descriptionAr
                  : selectedProject.descriptionEn}
              </p>

              {/* Scope details */}
              {(selectedProject.scopeAr || selectedProject.scopeEn) && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300">
                  <span className="font-bold text-[#DEB86A] block mb-1">
                    {locale === "ar" ? "نطاق التنفيذ المعتمد:" : "Verified Scope:"}
                  </span>
                  <p>
                    {isRtl ? selectedProject.scopeAr : selectedProject.scopeEn}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
