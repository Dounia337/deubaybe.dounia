/**
 * Seeds the database with:
 *  - one admin user (from ADMIN_EMAIL / ADMIN_PASSWORD in .env, or sensible defaults)
 *  - realistic sample content for every section of the site
 *
 * Run with: npm run seed
 * Safe to re-run — it skips content that already exists.
 */
import "dotenv/config";
import { sql } from "../src/db";
import { applySchema } from "../src/db/migrate";
import { AdminRepo, ProjectsRepo, CyberRepo, ExperiencesRepo, ReflectionsRepo, CVRepo } from "../src/db/repo";
import { hashPassword } from "../src/lib/auth";

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.ADMIN_NAME || "Site Admin";

  const existing = await AdminRepo.byEmail(email);
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }
  const hash = await hashPassword(password);
  await AdminRepo.create(email, hash, name);
  console.log(`Created admin user: ${email} / ${password} (change this after first login)`);
}

async function seedProjects() {
  if ((await ProjectsRepo.all(false)).length > 0) return;

  await ProjectsRepo.create({
    title: "NextUp",
    description:
      "A youth empowerment platform for Chad connecting young people aged 15-25 to learning resources, mentorship, and opportunities.",
    problem: "Youth in Chad have limited digital access to structured learning paths, mentors, and opportunity listings tailored to their context.",
    solution: "A Next.js and Supabase platform with an admin dashboard for content management, a learning hub, and an opportunity board.",
    impact: "Gives young people in Chad a single, mobile-friendly place to discover programs, track learning progress, and apply to opportunities.",
    tech_stack: JSON.stringify(["Next.js", "Supabase", "TypeScript", "Tailwind CSS"]),
    image_url: "https://picsum.photos/seed/nextup-platform/800/600",
    github_url: "",
    demo_url: "",
    featured: 1,
    published: 1,
    order_index: 0,
  });

  await ProjectsRepo.create({
    title: "Assa Ticket",
    description: "A Flutter bus ticketing app for Chad with a French UI, mobile money payments, and an admin panel.",
    problem: "Bus travel booking in Chad is largely informal, with no digital ticketing, seat management, or payment tracking.",
    solution: "A cross-platform Flutter app with SQLite local storage, OTP authentication, mobile money integration, and an admin panel for operators.",
    impact: "Reduces double-booking and gives operators a simple digital record of tickets sold and revenue collected.",
    tech_stack: JSON.stringify(["Flutter", "Dart", "SQLite", "Mobile Money API"]),
    image_url: "https://picsum.photos/seed/assa-ticket/800/600",
    featured: 1,
    published: 1,
    order_index: 1,
  });

  await ProjectsRepo.create({
    title: "LifeLink",
    description: "A blood donation matching platform built with a Scrum team as part of a software engineering course.",
    problem: "Hospitals and donors lack a fast way to find compatible, nearby blood donors during shortages.",
    solution: "A PHP/MySQL web app matching donor blood type and location to urgent requests, with role-based dashboards.",
    impact: "Demonstrated a working matching workflow across a 4-sprint Scrum project with defined roles and ceremonies.",
    tech_stack: JSON.stringify(["PHP", "MySQL", "Bootstrap"]),
    image_url: "https://picsum.photos/seed/lifelink-app/800/600",
    featured: 0,
    published: 1,
    order_index: 2,
  });
}

async function seedCyber() {
  if ((await CyberRepo.all(false)).length > 0) return;

  await CyberRepo.create({
    title: "Windows Event Log Forensics with Security.evtx",
    description: "Investigated a simulated compromise using Windows Security event logs to reconstruct the attacker's actions.",
    category: "Log Analysis",
    tools_used: JSON.stringify(["Event Viewer", "Sysmon", "Splunk"]),
    logs_analysis:
      "EventID 4624 (successful logon) followed by 4688 (process creation) for an unfamiliar binary path,\nthen 4720 (user account created) minutes later — consistent with post-compromise persistence.",
    what_i_learned:
      "Correlating logon type, process creation, and account management events in sequence is far more revealing than looking at any single event ID alone.",
    image_url: "https://picsum.photos/seed/evtx-forensics/800/600",
    published: 1,
    order_index: 0,
  });

  await CyberRepo.create({
    title: "Home Lab: Splunk + Sysmon + pfSense",
    description: "Built a home SOC lab to practice detection engineering and network segmentation.",
    category: "Blue Team",
    tools_used: JSON.stringify(["Splunk", "Sysmon", "pfSense", "OWASP ZAP", "Juice Shop"]),
    logs_analysis: "",
    what_i_learned:
      "Getting Sysmon configs tuned to reduce noise before shipping logs to Splunk saves hours of triage later — visibility without tuning is just noise.",
    image_url: "https://picsum.photos/seed/home-soc-lab/800/600",
    published: 1,
    order_index: 1,
  });

  await CyberRepo.create({
    title: "SQL Injection & LFI Patterns in Apache Logs",
    description: "Used grep and manual review to spot injection and local file inclusion attempts in raw Apache access logs.",
    category: "Log Analysis",
    tools_used: JSON.stringify(["grep", "Apache", "CyberChef"]),
    logs_analysis: "GET /product?id=1' OR '1'='1  -> 200\nGET /index.php?page=../../../../etc/passwd -> 403",
    what_i_learned:
      "A 403 doesn't mean the attempt failed to matter — repeated LFI probes against different paths are still a signal worth escalating.",
    image_url: "https://picsum.photos/seed/apache-log-patterns/800/600",
    published: 1,
    order_index: 2,
  });
}

async function seedExperiences() {
  if ((await ExperiencesRepo.all(false)).length > 0) return;

  await ExperiencesRepo.create({
    title: "ProMind Mental Health Experience",
    type: "Leadership",
    event_date: "2026-03-14",
    description: "Co-organized a campus mental health awareness event at Ashesi University, Norton Motulski venue.",
    key_takeaway: "Designing for psychological safety in an event's structure matters as much as the content itself.",
    image_url: "https://picsum.photos/seed/promind-event/800/600",
    published: 1,
    order_index: 0,
  });

  await ExperiencesRepo.create({
    title: "Vimeo OTT Sales Call — Student Representative",
    type: "Convening",
    event_date: "2026-02-20",
    description: "Represented EBN Limited Ghana in a vendor call evaluating Vimeo OTT for a micro-drama streaming platform.",
    key_takeaway: "Vendor calls go better when you arrive with specific technical questions, not just budget questions.",
    image_url: "https://picsum.photos/seed/vimeo-ott-call/800/600",
    published: 1,
    order_index: 1,
  });

  await ExperiencesRepo.create({
    title: "Mastercard Foundation Scholars Program",
    type: "Leadership",
    event_date: "2023-09-01",
    description: "Selected as a Mastercard Foundation Scholar at Ashesi University, Ghana.",
    key_takeaway: "Scholarship community pushed me to think about impact beyond my own career, toward NextUp and ByTe.",
    image_url: "https://picsum.photos/seed/mcf-scholars/800/600",
    published: 1,
    order_index: 2,
  });
}

async function seedReflections() {
  if ((await ReflectionsRepo.all(false)).length > 0) return;

  await ReflectionsRepo.create({
    title: "What Leading Quietly Taught Me About ByTe",
    content:
      "Badaracco's Leading Quietly resists the idea that leadership has to be loud. Reading it during a stretch of building ByTe alongside coursework reframed how I think about the small, unglamorous decisions that actually move a company forward.\n\nMost of what I do for ByTe isn't dramatic — it's responding carefully to a client brief, or deciding not to overpromise a timeline. Quiet leadership, in Badaracco's sense, is about restraint and judgment rather than charisma.\n\nThe same idea shows up in ProMind and NextUp. Neither needed a grand gesture to matter — they needed consistent, patient follow-through.",
    tags: JSON.stringify(["Leadership", "Growth"]),
    image_url: "https://picsum.photos/seed/leading-quietly/800/600",
    post_date: "2026-04-02",
    published: 1,
  });

  await ReflectionsRepo.create({
    title: "Why I Started Taking Blue Team Seriously",
    content:
      "I didn't plan to spend a semester building a home SOC lab. It started with one Sysmon config that wouldn't behave, and turned into a habit of reading logs the way I used to read code — looking for the line that doesn't belong.\n\nWhat surprised me most is how much of blue team work is just disciplined pattern recognition under uncertainty. That's a skill that transfers directly to debugging, to research methods, to reading a messy client requirement and figuring out what's actually being asked.",
    tags: JSON.stringify(["Tech", "Growth"]),
    image_url: "https://picsum.photos/seed/blue-team-seriously/800/600",
    post_date: "2026-05-18",
    published: 1,
  });
}

async function seedCV() {
  const profile = await CVRepo.profile();
  if (profile.full_name === "Your Name") {
    await CVRepo.updateProfile({
      full_name: "Deubaybe Dounia",
      headline: "Computer Science Student · Blue Team Learner · Builder for African Contexts",
      summary:
        "Third-year Computer Science student at Ashesi University (Mastercard Foundation Scholar), building software for African contexts and preparing for a career in cybersecurity. Co-founder of ByTe and founder of NextUp.",
      email: "hello@example.com",
      phone: "",
      location: "Accra, Ghana",
      links: JSON.stringify([
        { label: "GitHub", url: "https://github.com" },
        { label: "LinkedIn", url: "https://linkedin.com" },
      ]),
      photo_url: "https://i.pravatar.cc/300?u=dounia-profile",
    });
  }

  if ((await CVRepo.education()).length === 0) {
    await CVRepo.addEducation({
      institution: "Ashesi University",
      degree: "B.Sc. Computer Science",
      field: "Mastercard Foundation Scholar",
      start_date: "2023-09-01",
      end_date: null,
      description: "Coursework spanning software engineering, modeling & simulation, computer architecture, and research methods.",
      order_index: 0,
    });
  }

  if ((await CVRepo.experience()).length === 0) {
    await CVRepo.addExperience({
      organization: "ByTe",
      role: "Co-Founder",
      start_date: "2024-06-01",
      end_date: null,
      description: "West African software development and digital solutions company.",
      order_index: 0,
    });
    await CVRepo.addExperience({
      organization: "NextUp",
      role: "Founder",
      start_date: "2025-01-01",
      end_date: null,
      description: "Youth empowerment initiative in Chad for ages 15–25 — learning hub, mentorship, and opportunities.",
      order_index: 1,
    });
  }

  if ((await CVRepo.leadership()).length === 0) {
    await CVRepo.addLeadership({
      role: "Co-Organizer",
      organization: "ProMind (Ashesi Mental Health Initiative)",
      start_date: "2025-09-01",
      end_date: null,
      description: "Campus mental health awareness initiative.",
      order_index: 0,
    });
  }

  if ((await CVRepo.skills()).length === 0) {
    const skills: [string, string][] = [
      ["Languages", "English"],
      ["Languages", "French"],
      ["Languages", "Spanish"],
      ["Technical", "TypeScript"],
      ["Technical", "Python"],
      ["Technical", "Flutter/Dart"],
      ["Technical", "SQL"],
      ["Cybersecurity", "Splunk"],
      ["Cybersecurity", "Nmap"],
      ["Cybersecurity", "Log Analysis"],
    ];
    for (let i = 0; i < skills.length; i++) {
      const [category, name] = skills[i];
      await CVRepo.addSkill({ category, name, level: 4, order_index: i });
    }
  }
}

async function main() {
  await applySchema();
  await seedAdmin();
  await seedProjects();
  await seedCyber();
  await seedExperiences();
  await seedReflections();
  await seedCV();
  console.log("Seed complete.");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
