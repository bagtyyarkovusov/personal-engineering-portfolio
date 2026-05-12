import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { Lock } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { generateToken, revokeToken } from "@/lib/access-tokens";
import { CreateTokenForm } from "@/components/admin/create-token-form";
import { CreateRoomForm } from "@/components/admin/create-room-form";

export const metadata = { title: "Private Rooms — Admin" };

async function createRoom(
  formData: FormData,
): Promise<{ rawToken: string; tokenLabel: string | null } | null> {
  "use server";
  const projectId = formData.get("projectId") as string;
  const slug = formData.get("slug") as string;
  const showMilestones = formData.get("showMilestones") === "on";
  const showUpdates = formData.get("showUpdates") === "on";
  const showArchitecture = formData.get("showArchitecture") === "on";
  const showEvidence = formData.get("showEvidence") === "on";
  const showNextSteps = formData.get("showNextSteps") === "on";
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const tokenLabel = formData.get("tokenLabel") as string;

  if (!projectId || !slug) return null;

  const { raw, hash } = generateToken();

  await prisma.privateRoom.create({
    data: {
      projectId,
      slug,
      showMilestones,
      showUpdates,
      showArchitecture,
      showEvidence,
      showNextSteps,
      status: status ?? "draft",
      visibility: visibility ?? "privateRoom",
      tokens: {
        create: {
          tokenHash: hash,
          label: tokenLabel || "Initial access token",
        },
      },
    },
  });

  revalidatePath("/admin/private-rooms");
  return { rawToken: raw, tokenLabel: tokenLabel || null };
}

async function updateRoom(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const showMilestones = formData.get("showMilestones") === "on";
  const showUpdates = formData.get("showUpdates") === "on";
  const showArchitecture = formData.get("showArchitecture") === "on";
  const showEvidence = formData.get("showEvidence") === "on";
  const showNextSteps = formData.get("showNextSteps") === "on";
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;

  if (!id) return;

  await prisma.privateRoom.update({
    where: { id },
    data: {
      showMilestones,
      showUpdates,
      showArchitecture,
      showEvidence,
      showNextSteps,
      status,
      visibility,
    },
  });

  revalidatePath("/admin/private-rooms");
}

async function createToken(
  formData: FormData,
): Promise<{ raw: string; label: string | null } | null> {
  "use server";
  const roomId = formData.get("roomId") as string;
  const label = formData.get("label") as string;

  if (!roomId) return null;

  const { raw, hash } = generateToken();

  await prisma.accessToken.create({
    data: {
      roomId,
      tokenHash: hash,
      label: label || null,
    },
  });

  revalidatePath("/admin/private-rooms");

  return { raw, label: label || null };
}

async function revokeTokenAction(formData: FormData) {
  "use server";
  const tokenId = formData.get("tokenId") as string;

  if (!tokenId) return;

  const token = await prisma.accessToken.findUnique({
    where: { id: tokenId },
  });

  if (!token || token.revokedAt) return;

  await revokeToken(token.tokenHash);
  revalidatePath("/admin/private-rooms");
}

export default async function AdminPrivateRoomsPage() {
  const rooms = await prisma.privateRoom.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { id: true, title: true } },
      tokens: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          label: true,
          tokenHash: true,
          revokedAt: true,
          lastUsedAt: true,
          createdAt: true,
        },
      },
    },
  });
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  // Group rooms by project
  const roomsByProject = rooms.reduce<
    Record<string, typeof rooms>
  >((acc, room) => {
    const projectId = room.project.id;
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push(room);
    return acc;
  }, {});

  // Sort project entries by project title
  const sortedProjectEntries = Object.entries(roomsByProject).sort(
    ([, a], [, b]) =>
      a[0].project.title.localeCompare(b[0].project.title),
  );

  const totalTokenCount = rooms.reduce(
    (acc, room) => acc + room.tokens.length,
    0,
  );

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Private Rooms</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage private rooms with signed access tokens. Rooms let
          you share curated project progress with clients via shareable links.
        </p>
      </header>

      <CreateRoomForm createRoomAction={createRoom} projects={projects} />

      <section className="space-y-6">
        <h2 className="font-serif text-xl tracking-tight">
          All Rooms ({rooms.length}) &middot; {totalTokenCount} token
          {totalTokenCount !== 1 ? "s" : ""}
        </h2>

        {rooms.length === 0 ? (
          <EmptyState
            icon={Lock}
            title="No private rooms yet"
            description="Create a private room to share curated project progress with clients. Rooms use signed links for read-only access."
          />
        ) : (
          sortedProjectEntries.map(([projectId, projectRooms]) => (
            <div key={projectId} className="space-y-3">
              <h3 className="font-serif text-lg tracking-tight text-muted-foreground">
                {projectRooms[0].project.title}
              </h3>
              {projectRooms.map((room) => {
                const activeTokens = room.tokens.filter(
                  (t) => !t.revokedAt,
                );
                const revokedTokens = room.tokens.filter(
                  (t) => t.revokedAt,
                );
                const sections: string[] = [
                  room.showMilestones && "Milestones",
                  room.showUpdates && "Updates",
                  room.showArchitecture && "Architecture",
                  room.showEvidence && "Evidence",
                  room.showNextSteps && "Next Steps",
                ].filter((s): s is string => !!s);

                return (
                  <details
                    key={room.id}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <summary className="cursor-pointer text-sm flex items-center gap-2">
                      <span className="font-medium">{room.slug}</span>
                      <span
                        className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                          room.status === "published"
                            ? "bg-status-success text-status-success-foreground"
                            : room.status === "archived"
                              ? "bg-status-neutral text-status-neutral-foreground"
                              : "bg-status-warning text-status-warning-foreground"
                        }`}
                      >
                        {room.status}
                      </span>
                    </summary>

                    {/* Section toggles summary */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {sections.length > 0 ? (
                        sections.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No sections visible
                        </span>
                      )}
                    </div>

                    {/* Room edit form */}
                    <form action={updateRoom} className="mt-4 space-y-4">
                      <input type="hidden" name="id" value={room.id} />
                      <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-muted-foreground">
                          Section Toggles
                        </legend>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              name="showMilestones"
                              defaultChecked={room.showMilestones}
                              className="rounded border-border bg-background"
                            />
                            Milestones
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              name="showUpdates"
                              defaultChecked={room.showUpdates}
                              className="rounded border-border bg-background"
                            />
                            Updates
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              name="showArchitecture"
                              defaultChecked={room.showArchitecture}
                              className="rounded border-border bg-background"
                            />
                            Architecture
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              name="showEvidence"
                              defaultChecked={room.showEvidence}
                              className="rounded border-border bg-background"
                            />
                            Evidence
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              name="showNextSteps"
                              defaultChecked={room.showNextSteps}
                              className="rounded border-border bg-background"
                            />
                            Next Steps
                          </label>
                        </div>
                      </fieldset>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            defaultValue={room.status}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Visibility
                          </label>
                          <select
                            name="visibility"
                            defaultValue={room.visibility}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          >
                            <option value="public">Public</option>
                            <option value="privateRoom">Private Room</option>
                            <option value="adminOnly">Admin Only</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Save Changes
                      </button>
                    </form>

                    {/* Tokens section */}
                    <div className="mt-6 border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">
                          Access Tokens ({room.tokens.length})
                        </h4>
                      </div>

                      {/* Create token form - client component */}
                      <CreateTokenForm
                        roomId={room.id}
                        createTokenAction={createToken}
                      />

                      {/* Active tokens */}
                      {activeTokens.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">
                            Active Tokens
                          </p>
                          <ul className="space-y-1.5">
                            {activeTokens.map((token) => (
                              <li
                                key={token.id}
                                className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="truncate font-medium">
                                    {token.label ?? "Unlabelled"}
                                  </span>
                                  <span className="text-xs text-muted-foreground shrink-0">
                                    Created{" "}
                                    {new Date(
                                      token.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                  {token.lastUsedAt && (
                                    <span className="text-xs text-muted-foreground shrink-0">
                                      Last used{" "}
                                      {new Date(
                                        token.lastUsedAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <form action={revokeTokenAction}>
                                  <input
                                    type="hidden"
                                    name="tokenId"
                                    value={token.id}
                                  />
                                  <button
                                    type="submit"
                                    className="text-xs text-destructive hover:text-destructive/80 font-medium shrink-0 ml-2"
                                  >
                                    Revoke
                                  </button>
                                </form>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Revoked tokens */}
                      {revokedTokens.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">
                            Revoked Tokens
                          </p>
                          <ul className="space-y-1.5">
                            {revokedTokens.map((token) => (
                              <li
                                key={token.id}
                                className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
                              >
                                <span className="truncate">
                                  {token.label ?? "Unlabelled"}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive shrink-0">
                                  Revoked
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          ))
        )}
      </section>
    </main>
  );
}
