export const metadata = { title: "Private Rooms — Admin" };

export default function AdminPrivateRoomsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Private Rooms</h1>
        <p className="text-sm text-muted-foreground">
          Manage access-restricted private rooms with shareable tokens.
        </p>
      </header>
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Private room management coming soon.
      </div>
    </div>
  );
}
