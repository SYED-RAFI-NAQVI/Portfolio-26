import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects, type Project } from "../../../data/slot";
import { ART } from "../../../components/slot/art/registry";
import styles from "./page.module.css";

/**
 * Project page.
 *
 * Every project in the archive has one: the card itself is a link, so there is
 * no card in the gallery that leads nowhere. The artwork block is skipped for
 * the projects that have none.
 *
 * This page is where the full skill list lives. The card deliberately shows
 * none; a project running twenty-odd skills has to put them somewhere, and
 * somewhere is here.
 */

export function generateStaticParams() {
  return projects.map((p: Project) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p: Project) => p.id === slug);
  if (!project) return {};
  return { title: project.name, description: project.blurb };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p: Project) => p.id === slug);
  if (!project) notFound();

  const art = ART[project.id];
  const Art = art?.Component;

  return (
    <main className={styles.page}>
      <Link href="/work" className={styles.back}>
        <span aria-hidden="true">←</span> WORK
      </Link>

      {(Art || project.cover) && (
        <div
          className={styles.hero}
          style={art?.ground ? { background: art.ground } : undefined}
        >
          {Art ? (
            <Art />
          ) : (
            <Image
              src={project.cover!}
              alt=""
              fill
              sizes="(max-width: 980px) 100vw, 900px"
              className={styles.heroImg}
            />
          )}
        </div>
      )}

      <header className={styles.head}>
        <h1 className={styles.name}>{project.name}</h1>
        <p className={styles.role}>{project.role}</p>
        <p className={styles.period}>{project.period}</p>
      </header>

      <p className={styles.lede}>{project.blurb}</p>

      {project.story?.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.sectionHead}>{section.heading}</h2>
          <p className={styles.body}>{section.body}</p>
        </section>
      ))}

      <section className={styles.section}>
        <h2 className={styles.sectionHead}>Context</h2>
        <dl className={styles.meta}>
          <dt>Type</dt>
          <dd>{project.type.join(" · ")}</dd>
          <dt>Domain</dt>
          <dd>{project.domain.join(" · ")}</dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHead}>Stack</h2>
        <ul className={styles.skills}>
          {project.skills.map((s) => (
            <li key={s} className={styles.skill}>
              {s}
            </li>
          ))}
        </ul>
      </section>

      {project.href && (
        <a
          className={styles.visit}
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {project.name} <span aria-hidden="true">↗</span>
        </a>
      )}
    </main>
  );
}
