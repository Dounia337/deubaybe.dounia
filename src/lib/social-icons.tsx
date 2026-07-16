import type { ComponentType } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa6";
import type { SocialPlatform } from "@/db/repo";

export const SOCIAL_ICONS: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
};
