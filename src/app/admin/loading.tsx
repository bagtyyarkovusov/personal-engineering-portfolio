import { LoadingState } from "@/components/admin/loading-state";

export default function AdminLoadingPage() {
  return (
    <div className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Admin</h1>
      </header>
      <LoadingState rows={6} />
    </div>
  );
}
