"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, Moon, PanelLeft, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, selectAuthUser } from "@/store/slices/authSlice";
import { selectTheme, setMobileNavOpen, toggleSidebar, toggleTheme } from "@/store/slices/uiSlice";
import { notify } from "@/store/slices/notificationsSlice";
import { Avatar, Badge, Dropdown, DropdownItem, buttonVariants } from "@/components/ui";

export function Topbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const theme = useAppSelector(selectTheme);

  const handleSignOut = async () => {
    await dispatch(logout());
    dispatch(notify({ title: "Signed out", message: "Your session was terminated.", tone: "info" }));
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line glass">
      <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`${buttonVariants("ghost", "icon")} lg:hidden`}
            onClick={() => dispatch(setMobileNavOpen(true))}
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </button>
          <button
            type="button"
            className={`${buttonVariants("ghost", "icon")} hidden lg:inline-flex`}
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="size-4" />
          </button>

          <div className="hidden items-center gap-2 rounded-lg border border-line bg-panel px-3 py-1.5 text-xs text-ink-3 md:flex">
            <span className="size-1.5 rounded-full bg-success-500" />
            Production · eu-west-1
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={buttonVariants("ghost", "icon")}
            onClick={() => dispatch(toggleTheme())}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <Dropdown
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-panel-2"
              >
                <Avatar name={user?.name ?? "Guest"} />
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-medium text-ink">{user?.name ?? "Guest"}</span>
                  <span className="block text-[11px] uppercase tracking-wide text-ink-3">
                    {user?.role ?? "signed out"}
                  </span>
                </span>
              </button>
            }
          >
            <div className="border-b border-line px-3 py-2">
              <p className="truncate text-xs font-medium text-ink">{user?.email}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge
                  tone={user?.role === "admin" ? "brand" : user?.role === "manager" ? "info" : "neutral"}
                >
                  {user?.role}
                </Badge>
                <span className="text-[11px] text-ink-3">{user?.department}</span>
              </div>
            </div>
            <div className="pt-1">
              <DropdownItem danger onClick={handleSignOut}>
                <LogOut className="size-3.5" />
                Sign out
              </DropdownItem>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
