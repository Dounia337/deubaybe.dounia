import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { CVRepo } from "@/db/repo";
import { handleApiError } from "@/lib/api-helpers";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#0A192F" },
  header: { marginBottom: 18, borderBottom: "2 solid #0A192F", paddingBottom: 12 },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  headline: { fontSize: 12, color: "#4C5B73", marginBottom: 6 },
  contactRow: { flexDirection: "row", gap: 10, fontSize: 9, color: "#4C5B73" },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0A192F",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    borderBottom: "1 solid #C7D2E0",
    paddingBottom: 3,
  },
  entry: { marginBottom: 8 },
  entryTitleRow: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  entryDate: { fontSize: 9, color: "#4C5B73" },
  entrySub: { fontSize: 9.5, color: "#334155", marginBottom: 2 },
  entryDesc: { fontSize: 9.5, lineHeight: 1.4, color: "#1F2937" },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillPill: {
    fontSize: 8.5,
    backgroundColor: "#EEF2FF",
    color: "#312E81",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
});

function fmtRange(start: string, end?: string | null) {
  return `${start} — ${end || "Present"}`;
}

export async function GET() {
  try {
    const profile = await CVRepo.profile();
    const links: { label: string; url: string }[] = JSON.parse(profile.links || "[]");
    const education = await CVRepo.education();
    const experience = await CVRepo.experience();
    const skills = await CVRepo.skills();
    const leadership = await CVRepo.leadership();

    const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
      acc[s.category] = acc[s.category] || [];
      acc[s.category].push(s);
      return acc;
    }, {});

    const doc = React.createElement(
      Document,
      {},
      React.createElement(
        Page,
        { size: "A4", style: styles.page },
        // Header
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(Text, { style: styles.name }, profile.full_name),
          React.createElement(Text, { style: styles.headline }, profile.headline),
          React.createElement(
            View,
            { style: styles.contactRow },
            profile.email ? React.createElement(Text, {}, profile.email) : null,
            profile.phone ? React.createElement(Text, {}, profile.phone) : null,
            profile.location ? React.createElement(Text, {}, profile.location) : null,
            ...links.map((l, i) =>
              React.createElement(Link, { key: i, src: l.url, style: { color: "#3B5BDB" } }, l.label)
            )
          )
        ),
        // Summary
        profile.summary
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, "Summary"),
              React.createElement(Text, { style: styles.entryDesc }, profile.summary)
            )
          : null,
        // Education
        education.length
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, "Education"),
              ...education.map((e) =>
                React.createElement(
                  View,
                  { style: styles.entry, key: e.id },
                  React.createElement(
                    View,
                    { style: styles.entryTitleRow },
                    React.createElement(Text, { style: styles.entryTitle }, e.institution),
                    React.createElement(Text, { style: styles.entryDate }, fmtRange(e.start_date, e.end_date))
                  ),
                  React.createElement(
                    Text,
                    { style: styles.entrySub },
                    e.field ? `${e.degree}, ${e.field}` : e.degree
                  ),
                  e.description ? React.createElement(Text, { style: styles.entryDesc }, e.description) : null
                )
              )
            )
          : null,
        // Experience
        experience.length
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, "Experience"),
              ...experience.map((e) =>
                React.createElement(
                  View,
                  { style: styles.entry, key: e.id },
                  React.createElement(
                    View,
                    { style: styles.entryTitleRow },
                    React.createElement(Text, { style: styles.entryTitle }, `${e.role} · ${e.organization}`),
                    React.createElement(Text, { style: styles.entryDate }, fmtRange(e.start_date, e.end_date))
                  ),
                  e.description ? React.createElement(Text, { style: styles.entryDesc }, e.description) : null
                )
              )
            )
          : null,
        // Leadership
        leadership.length
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, "Leadership"),
              ...leadership.map((e) =>
                React.createElement(
                  View,
                  { style: styles.entry, key: e.id },
                  React.createElement(
                    View,
                    { style: styles.entryTitleRow },
                    React.createElement(Text, { style: styles.entryTitle }, `${e.role} · ${e.organization}`),
                    React.createElement(Text, { style: styles.entryDate }, fmtRange(e.start_date, e.end_date))
                  ),
                  e.description ? React.createElement(Text, { style: styles.entryDesc }, e.description) : null
                )
              )
            )
          : null,
        // Skills
        skills.length
          ? React.createElement(
              View,
              { style: styles.section },
              React.createElement(Text, { style: styles.sectionTitle }, "Skills"),
              ...Object.entries(skillsByCategory).map(([category, items]) =>
                React.createElement(
                  View,
                  { style: styles.entry, key: category },
                  React.createElement(Text, { style: styles.entrySub }, category),
                  React.createElement(
                    View,
                    { style: styles.skillsWrap },
                    ...items.map((s) => React.createElement(Text, { style: styles.skillPill, key: s.id }, s.name))
                  )
                )
              )
            )
          : null
      )
    );

    const buffer = await renderToBuffer(doc);
    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${profile.full_name.replace(/\s+/g, "_")}_CV.pdf"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
