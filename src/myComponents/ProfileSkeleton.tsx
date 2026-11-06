
export default function ProfileSkeleton() {
  return (
    <>
      <div className="min-h-screen p-4 sm:p-0">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
            <div className="relative h-40 animate-pulse bg-bg sm:h-56">
              <div className="absolute right-5 top-5 h-9 w-9 rounded-xl bg-surface/70" />
            </div>
            <div className="px-5 pb-6 sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <div className="-mt-14 h-28 w-28 animate-pulse rounded-full border-4 border-border bg-border sm:-mt-16 sm:h-32 sm:w-32" />
                  <div className="mt-5">
                    <div className="h-7 w-48 max-w-full animate-pulse rounded-lg bg-border" />
                    <div className="mt-3 h-4 w-36 animate-pulse rounded bg-surface-2" />
                    <div className="mt-4 h-3 w-64 max-w-full animate-pulse rounded bg-surface-2" />
                    <div className="mt-2 h-3 w-48 max-w-full animate-pulse rounded bg-surface-2" />
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-pulse rounded bg-surface-2" />
                        <div className="h-3 w-28 animate-pulse rounded bg-surface-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-pulse rounded bg-surface-2" />
                        <div className="h-3 w-32 animate-pulse rounded bg-surface-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 sm:pb-1">
                  <div className="h-10 w-28 animate-pulse rounded-xl bg-surface-2" />
                  <div className="h-10 w-24 animate-pulse rounded-xl bg-surface-2" />
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 sm:max-w-lg sm:gap-8">
                <div>
                  <div className="h-6 w-16 animate-pulse rounded bg-border" />
                  <div className="mt-2 h-3 w-20 max-w-full animate-pulse rounded bg-surface-2" />
                </div>
                <div>
                  <div className="h-6 w-14 animate-pulse rounded bg-border" />
                  <div className="mt-2 h-3 w-16 max-w-full animate-pulse rounded bg-surface-2" />
                </div>
                <div>
                  <div className="h-6 w-16 animate-pulse rounded bg-border" />
                  <div className="mt-2 h-3 w-20 max-w-full animate-pulse rounded bg-surface-2" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-6 overflow-hidden border-b border-border px-2">
            <div className="shrink-0 border-b-2 border-border px-2 pb-4 pt-2">
              <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
            </div>
            <div className="shrink-0 px-2 pb-4 pt-2">
              <div className="h-3 w-20 animate-pulse rounded bg-border" />
            </div>
            <div className="shrink-0 px-2 pb-4 pt-2">
              <div className="h-3 w-16 animate-pulse rounded bg-border" />
            </div>
            <div className="shrink-0 px-2 pb-4 pt-2">
              <div className="h-3 w-20 animate-pulse rounded bg-border" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-fit rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="h-5 w-24 animate-pulse rounded bg-border" />
              <div className="mt-6 space-y-3">
                <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-surface-2" />
              </div>
              <div className="mt-7 h-4 w-28 animate-pulse rounded bg-border" />
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-7 w-20 animate-pulse rounded-full bg-surface-2" />
                <div className="h-7 w-24 animate-pulse rounded-full bg-surface-2" />
                <div className="h-7 w-16 animate-pulse rounded-full bg-surface-2" />
                <div className="h-7 w-20 animate-pulse rounded-full bg-surface-2" />
              </div>
            </div>
            <div className="space-y-5 lg:col-span-2">
              <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-surface-2" />
                  <div className="flex-1">
                    <div className="h-3 w-32 animate-pulse rounded bg-border" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-surface-2" />
                  </div>
                  <div className="h-7 w-7 animate-pulse rounded-lg bg-surface-2" />
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-surface-2" />
                </div>
                <div className="mt-5 aspect-16/7 animate-pulse rounded-xl bg-surface-2" />
                <div className="mt-5 flex gap-5 border-t border-border pt-4">
                  <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
                  <div className="h-4 w-16 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-surface-2" />
                  <div className="flex-1">
                    <div className="h-3 w-28 animate-pulse rounded bg-border" />
                    <div className="mt-2 h-3 w-20 animate-pulse rounded bg-surface-2" />
                  </div>
                  <div className="h-7 w-7 animate-pulse rounded-lg bg-surface-2" />
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-surface-2" />
                </div>
                <div className="mt-5 flex gap-3">
                  <div className="h-16 w-16 animate-pulse rounded-xl bg-surface-2 sm:h-20 sm:w-20" />
                  <div className="h-16 w-16 animate-pulse rounded-xl bg-surface-2 sm:h-20 sm:w-20" />
                  <div className="h-16 w-16 animate-pulse rounded-xl bg-surface-2 sm:h-20 sm:w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}