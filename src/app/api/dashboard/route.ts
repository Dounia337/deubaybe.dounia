import { NextResponse } from "next/server";
import { ProjectsRepo, CyberRepo, ExperiencesRepo, ReflectionsRepo, MessagesRepo } from "@/db/repo";
import { requireAdmin } from "@/lib/session";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    await requireAdmin();
    const [projects, cyberEntries, experiences, reflections, messages, unreadMessages] = await Promise.all([
      ProjectsRepo.all(false),
      CyberRepo.all(false),
      ExperiencesRepo.all(false),
      ReflectionsRepo.all(false),
      MessagesRepo.all(),
      MessagesRepo.unreadCount(),
    ]);
    return NextResponse.json({
      stats: {
        totalProjects: projects.length,
        totalCyberEntries: cyberEntries.length,
        totalExperiences: experiences.length,
        totalReflections: reflections.length,
        totalMessages: messages.length,
        unreadMessages,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
