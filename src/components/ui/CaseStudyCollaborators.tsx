"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Collaborator } from "@/lib/case-studies";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

interface CaseStudyCollaboratorsProps {
  collaborators: Collaborator[];
}

interface GitHubProfileData {
  name: string;
  login: string;
  bio?: string;
  location?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  joinedYear?: string;
}

// Preset cache so the profile hovercard appears instantly with zero delay
const PRESET_PROFILES: Record<string, GitHubProfileData> = {
  milbertxd: {
    name: "Milbert De Paz",
    login: "milbertxd",
    bio: "Pogi",
    location: "Philippines",
    public_repos: 3,
    followers: 1,
    following: 0,
    joinedYear: "2025",
  },
  okimsz: {
    name: "Mico Alano",
    login: "okimsz",
    bio: "BS-CPE",
    location: "Philippines",
    public_repos: 8,
    followers: 0,
    following: 0,
    joinedYear: "2025",
  },
  crispychili: {
    name: "Yancy Arguedo",
    login: "crispychili",
    bio: "Systems & Embedded Collaborator",
    location: "Philippines",
    public_repos: 1,
    followers: 0,
    following: 5,
    joinedYear: "2024",
  },
};

const profileCache: Record<string, GitHubProfileData> = { ...PRESET_PROFILES };

function CollaboratorItem({ collaborator }: { collaborator: Collaborator }) {
  const { fx } = useHudAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [profile, setProfile] = useState<GitHubProfileData | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanUsername = collaborator.github
    ? collaborator.github.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "")
    : "";

  const profileUrl = collaborator.github
    ? collaborator.github.startsWith("http")
      ? collaborator.github
      : `https://github.com/${cleanUsername}`
    : "#";

  const avatarSrc =
    collaborator.avatar ||
    (cleanUsername ? `https://github.com/${cleanUsername}.png?size=160` : "");

  // Load profile data and optionally refresh in background
  useEffect(() => {
    if (!cleanUsername) return;

    if (profileCache[cleanUsername]) {
      setProfile(profileCache[cleanUsername]);
    } else {
      setProfile({
        name: collaborator.name,
        login: cleanUsername,
        bio: collaborator.role,
      });
    }

    let isMounted = true;
    fetch(`https://api.github.com/users/${cleanUsername}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const updated: GitHubProfileData = {
          name: data.name || collaborator.name || cleanUsername,
          login: data.login || cleanUsername,
          bio: data.bio || collaborator.role || undefined,
          location: data.location || undefined,
          public_repos: data.public_repos ?? 0,
          followers: data.followers ?? 0,
          following: data.following ?? 0,
          joinedYear: data.created_at ? new Date(data.created_at).getFullYear().toString() : undefined,
        };
        profileCache[cleanUsername] = updated;
        setProfile(updated);
      })
      .catch(() => {
        // Retain preset cache
      });

    return () => {
      isMounted = false;
    };
  }, [cleanUsername, collaborator.name, collaborator.role]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (isClosing) {
      setIsClosing(false);
    }
    if (!isOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        fx.blip();
        setIsOpen(true);
        setIsClosing(false);
      }, 70);
    }
  }, [fx, isClosing, isOpen]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 190);
    }, 220);
  }, []);

  const displayName = profile?.name || collaborator.name || `@${cleanUsername}`;
  const displayBio = profile?.bio || collaborator.role;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {/* Collaborator Hyperlink Button */}
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={fx.click}
        className="group flex items-center gap-3 border border-periwinkle/15 bg-world/50 p-2.5 transition-all duration-300 ease-out hover:border-iris-bright hover:bg-world-3/60 hover:-translate-y-0.5 focus-visible:border-signal outline-none"
        title={`View ${collaborator.name} (@${cleanUsername}) on GitHub`}
      >
        {/* GitHub Avatar / Fallback */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-sm border border-periwinkle/20 bg-world-2 flex items-center justify-center group-hover:border-iris-bright transition-colors">
          {!imageError && avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt={`${displayName} avatar`}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="font-mono text-xs font-bold text-iris-bright uppercase">
              {displayName.charAt(0)}
            </span>
          )}
        </div>

        {/* Name & Handle */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-paper group-hover:text-iris-bright transition-colors truncate">
            {displayName}
          </p>
          {cleanUsername && (
            <p className="t-micro text-periwinkle/60 group-hover:text-periwinkle/90 transition-colors truncate">
              @{cleanUsername}
            </p>
          )}
        </div>

        {/* External Link Indicator */}
        <span
          className="t-micro text-periwinkle/40 group-hover:text-iris-bright group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
          aria-hidden="true"
        >
          ↗
        </span>
      </a>

      {/* Social Media Style GitHub Profile Tooltip / Popover */}
      {isOpen && (
        <div
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute z-[80] w-[280px] sm:w-[310px] top-full mt-2 left-0 sm:left-auto sm:right-[calc(100%+14px)] sm:top-[-8px] pointer-events-auto ${
            isClosing ? "animate-tooltip-out" : "animate-tooltip-in"
          }`}
        >
          {/* Pointer arrow pointing towards the hovered button on desktop */}
          <div
            className="hidden sm:block absolute -right-[6px] top-6 h-3 w-3 rotate-45 border-t border-r border-periwinkle/20 bg-[#0e0f17] z-30 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative overflow-hidden border border-periwinkle/20 bg-[#0e0f17]/95 shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl rounded-xs">
            {/* Ambient subtle top line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-iris-bright/60 to-transparent" />

            {/* Header Banner */}
            <div className="relative h-12 w-full border-b border-periwinkle/15 bg-gradient-to-r from-iris/20 via-world-3 to-world-2 px-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-periwinkle/70">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-[10px] font-mono text-periwinkle/80">
                  github.com
                </span>
              </div>
            </div>

            {/* Profile Body */}
            <div className="p-4 pt-0">
              {/* Avatar + Action Row */}
              <div className="relative -mt-6 mb-3 flex items-end justify-between">
                <div className="relative h-13 w-13 shrink-0 rounded-sm border-2 border-[#0e0f17] bg-world-2 shadow-md overflow-hidden ring-1 ring-periwinkle/30">
                  {!imageError && avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarSrc}
                      alt={`${displayName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-iris/20 font-mono text-base font-bold text-iris-bright">
                      {displayName.charAt(0)}
                    </div>
                  )}
                </div>

                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={fx.click}
                  className="group/btn flex items-center gap-1 border border-periwinkle/25 bg-world-2 px-2.5 py-1 text-[10px] font-mono text-periwinkle/90 transition-all duration-200 hover:border-iris-bright hover:bg-iris/15 hover:text-paper cursor-pointer"
                >
                  <span>Profile</span>
                  <span className="text-[9px] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </div>

              {/* Name and Handle */}
              <div className="mb-2">
                <h4 className="font-display text-sm font-bold text-paper leading-tight tracking-tight">
                  {displayName}
                </h4>
                <p className="text-[11px] text-periwinkle/60 font-mono mt-0.5">
                  @{cleanUsername}
                </p>
              </div>

              {/* Bio */}
              {displayBio && (
                <p className="mb-3 text-xs leading-relaxed text-periwinkle/80">
                  {displayBio}
                </p>
              )}

              {/* Location & Joined info */}
              {(profile?.location || profile?.joinedYear) && (
                <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-periwinkle/55">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3 fill-none stroke-current" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </span>
                  )}
                  {profile.joinedYear && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3 fill-none stroke-current" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined {profile.joinedYear}
                    </span>
                  )}
                </div>
              )}

              {/* GitHub Stats Row */}
              <div className="grid grid-cols-3 gap-1 border border-periwinkle/15 bg-world-2/60 p-2 text-center rounded-xs">
                <div>
                  <p className="font-mono text-xs font-bold text-paper">
                    {profile?.public_repos ?? 0}
                  </p>
                  <p className="text-[8px] font-mono uppercase tracking-wider text-periwinkle/50">
                    Repos
                  </p>
                </div>
                <div className="border-x border-periwinkle/10">
                  <p className="font-mono text-xs font-bold text-paper">
                    {profile?.followers ?? 0}
                  </p>
                  <p className="text-[8px] font-mono uppercase tracking-wider text-periwinkle/50">
                    Followers
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-paper">
                    {profile?.following ?? 0}
                  </p>
                  <p className="text-[8px] font-mono uppercase tracking-wider text-periwinkle/50">
                    Following
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CaseStudyCollaborators({ collaborators }: CaseStudyCollaboratorsProps) {
  if (!collaborators || collaborators.length === 0) return null;

  return (
    <div>
      <p className="t-label mb-3 text-iris-bright">COLLABORATORS</p>
      <div className="flex flex-col gap-2.5">
        {collaborators.map((c, i) => (
          <CollaboratorItem key={c.github || `${c.name}-${i}`} collaborator={c} />
        ))}
      </div>
    </div>
  );
}
