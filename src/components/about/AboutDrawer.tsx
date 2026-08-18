"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AboutDrawer.module.css";
import { sound } from "../../sounds";
import { BrandIcon } from "./BrandIcon";
import { LocationMap } from "./LocationMap";
import { 
  intro, 
  currently, 
  locations,
  howIBuild, 
  pathData, 
  projects, 
  stats, 
  awards, 
  links 
} from "../../data/about";

export function AboutDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const isClosingRef = useRef(false);

  // Handle URL Hash based open/close
  useEffect(() => {
    const handleHash = () => {
      if (isClosingRef.current) return;
      
      const shouldOpen = window.location.hash === "#about";
      if (shouldOpen && !isOpen) {
        sound.page();
        setIsOpen(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsAnimating(true);
          });
        });
        document.body.style.overflow = "hidden";
      } else if (!shouldOpen && isOpen) {
        closeDrawer();
      }
    };
    
    handleHash(); // check on mount
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [isOpen]);

  const closeDrawer = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    
    sound.whoosh();
    setIsAnimating(false);
    
    // Immediately clear the hash so Next.js syncs before the animation finishes
    if (window.location.hash === "#about") {
      router.push(window.location.pathname, { scroll: false });
    }

    setTimeout(() => {
      setIsOpen(false);
      document.body.style.overflow = "";
      isClosingRef.current = false;
    }, 340); // CSS transition duration
  };

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Scroll Tick Logic
  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
    const container = scrollRef.current;
    
    const handleScroll = () => {
      const currentY = container.scrollTop;
      const direction = currentY > lastScrollY.current ? "down" : "up";
      const crossingLine = 80; // pixels from top (just below sticky header)
      
      const sections = container.querySelectorAll("[data-section]");
      let crossed = false;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Container rect top is offset, so we calculate relative to container top
        const containerRect = container.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        
        // We track if a section's top crosses the crossingLine threshold
        // Since getBoundingClientRect is updated dynamically during scroll, we check the delta
        // A simpler approach: maintain old positions, but it's easier to just check if `relativeTop` 
        // just crossed the crossingLine line between this frame and the last.
        // Actually, easiest is storing last relative positions or deducing from direction.
        
        // For simplicity: if a section boundary is within a small window near the crossing line
        if (relativeTop > crossingLine - 20 && relativeTop < crossingLine + 20) {
          // ensure we only tick once per boundary by checking if we already crossed one this frame
          // to prevent multiple ticks if scrolling extremely fast
          crossed = true;
        }
      });

      // A more robust tick logic: store section tops on mount/resize, compare scrollTop.
      // But we can just use IntersectionObserver configured with a tight rootMargin.
      lastScrollY.current = currentY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Robust Tick Logic using Intersection Observer
  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
             sound.scroll(); // Using the existing mechanical tick
          }
        });
      },
      {
        root: scrollRef.current,
        rootMargin: "-80px 0px -100% 0px", // Trigger when element hits 80px from top
        threshold: 0
      }
    );

    const sections = scrollRef.current.querySelectorAll("[data-section]");
    sections.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, [isOpen]);


  if (!isOpen && !isAnimating) return null;

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isAnimating ? styles.visible : ""}`} 
        onClick={closeDrawer}
        aria-hidden="true"
      />
      
      <dialog 
        open 
        className={`${styles.drawer} ${isAnimating ? styles.visible : ""}`}
        aria-label="About Rafi"
        ref={drawerRef}
      >
        <div className={styles.stickyHeader}>
          <div className={styles.headerTitle}>ABOUT</div>
          <div className={styles.headerControls}>
            <a 
              href="https://linkedin.com/in/syedrafinaqvi" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.iconButton}
              aria-label="LinkedIn"
              data-hover-sound="ambient"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <button 
              className={styles.iconButton} 
              onClick={closeDrawer}
              aria-label="Close About"
              data-hover-sound="ambient"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3L13 13M13 3L3 13" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.scrollContent} ref={scrollRef}>
          {/* INTRO */}
          <section className={styles.introSection}>
            <div className={styles.introTop}>
              <img src="/Rafi_about.png" alt="Rafi" className={styles.introAvatar} />
              <div className={styles.introText}>
                <h1 className={styles.name}>{intro.name}</h1>
                <h2 className={styles.title}>{intro.title}</h2>
              </div>
            </div>
            
            <div className={styles.bioWrapper}>
              {intro.bio.map((paragraph, i) => (
                <p key={i} className={styles.bio}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* CURRENTLY */}
          <Section label="Currently" id="currently">
            <div className={styles.currentlyList}>
              {currently.map((item, i) => (
                <div key={i} className={styles.currentlyRow}>
                  <div className={styles.currentlyContent}>
                    <div className={styles.currentlyHeader}>
                      <span className={styles.currentlyName}>{item.name}</span>
                      <span className={styles.currentlyStatus}>{item.status}</span>
                    </div>
                    <p className={styles.currentlyDesc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* LOCATION */}
          <Section label="Location" id="location">
            <LocationMap />
          </Section>



          {/* PATH */}
          <Section label="PATH" id="path">
            <div className={styles.pathList}>
              {pathData.map((item, i) => {
                const prevItem = pathData[i - 1];
                const nextItem = pathData[i + 1];
                const showInternshipHeader = item.type === "internship" && prevItem?.type !== "internship";
                const isLastBeforeInternships = item.type !== "internship" && nextItem?.type === "internship";
                const isLastInternship = item.type === "internship" && nextItem?.type !== "internship";

                return (
                  <React.Fragment key={i}>
                    {showInternshipHeader && (
                      <div className={styles.internshipsHeader}>EARLY INTERNSHIPS</div>
                    )}
                    {item.type === "internship" ? (
                      <div className={`${styles.internshipRow} ${isLastInternship ? styles.noBorderBottom : ''}`}>
                        <div className={styles.internshipLogoContainer}>
                          {item.logo ? (
                            <img src={item.logo} alt={`${item.company} logo`} className={styles.internshipLogo} />
                          ) : (
                            <div className={styles.internshipLogoFallback}>{item.company.charAt(0)}</div>
                          )}
                        </div>
                        <div className={styles.internshipDetails}>
                          <div className={styles.internshipHeader}>
                            <span className={styles.internshipCompany}>{item.company}</span>
                            <span className={styles.internshipPeriod}>{item.period}</span>
                          </div>
                          <div className={styles.internshipRole}>{item.role}</div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${styles.pathRow} ${item.type === 'education' ? styles.educationRow : ''} ${isLastBeforeInternships ? styles.noBorderBottom : ''}`}>
                        <div className={styles.pathLogoContainer}>
                          {item.logo ? (
                            <img src={item.logo} alt={`${item.company} logo`} className={styles.pathLogo} />
                          ) : (
                            <div className={styles.pathLogoFallback}>{item.company.charAt(0)}</div>
                          )}
                        </div>
                        <div className={styles.pathDetails}>
                          <div className={styles.pathHeader}>
                            <span className={styles.pathCompany}>{item.company}</span>
                            <span className={styles.pathPeriod}>{item.period}</span>
                          </div>
                          <div className={styles.pathRole}>{item.role}</div>
                          {item.description && <p className={styles.pathDesc}>{item.description}</p>}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </Section>


          {/* IN NUMBERS */}
          <Section label="In Numbers" id="numbers">
            <div className={styles.statsGrid}>
              {stats.map((stat, i) => (
                <div key={i} className={styles.statBox}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </Section>



          {/* ELSEWHERE */}
          <Section label="Elsewhere" id="elsewhere">
             <div className={styles.linksList}>
              {links.map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.linkRow}>
                  <span>{link.label}</span>
                  {link.text && <span className={styles.linkSubtext}>{link.text}</span>}
                  <span className={styles.linkArrow}>↗</span>
                </a>
              ))}
            </div>
          </Section>

          {/* VIEW RESUME */}
          <div className={styles.resumeWrapper}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.resumeButton}>
              VIEW RESUME ↗
            </a>
          </div>

        </div>
      </dialog>
    </>
  );
}

function Section({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <section className={styles.section} data-section={id}>
      <div className={styles.sectionLabel}>{label}</div>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}
