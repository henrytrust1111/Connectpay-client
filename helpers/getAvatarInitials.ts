export function getAvatarInitials(name: string): string {
  if (!name.trim()) return "?";

  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2) // Get first two words (e.g., first and last name)
    .map((part) => part[0].toUpperCase())
    .join("");

  return initials || "?";
}
