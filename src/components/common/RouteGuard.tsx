"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthUser, selectIsRestoring } from "@/store/slices/authSlice";
import { can, type Permission } from "@/lib/rbac";
import { NAV_ITEMS } from "./navigation";
import { Spinner } from "@/components/ui";

function FullPageLoader({ label }: { label: string }) {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-ink-3">
        <Spinner className="size-6 text-brand-500" />
        <p className="text-xs">{label}</p>
      </div>
    </div>
  );
}

export function RouteGuard({ permission, children }: { permission?: Permission; children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectAuthUser);
  const restoring = useAppSelector(selectIsRestoring);

  const routeItem = NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const effective: Permission | undefined = permission ?? routeItem?.permission;
  const allowed = effective ? can(user?.role, effective) : true;

  useEffect(() => {
    if (restoring) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed) router.replace(`/access-denied?from=${encodeURIComponent(pathname)}`);
  }, [restoring, user, allowed, pathname, router, dispatch]);

  if (restoring || !user) return <FullPageLoader label="Verifying session & permissions…" />;
  if (!allowed) return <FullPageLoader label="Insufficient role privileges…" />;

  return <>{children}</>;
}
