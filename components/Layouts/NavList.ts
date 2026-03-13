import {
  Activity,
  BookUser,
  CalendarClock,
  ClipboardListIcon,
  HelpCircleIcon,
  Images,
  LayoutDashboardIcon,
  LibraryBig,
  Newspaper,
  NotebookPen,
  SettingsIcon,
  Users2,
  UsersRound,
} from "lucide-react";

export const DashboardMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      active: "dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Kalender",
      url: "/dashboard/calendar",
      active: "calendar",
      icon: CalendarClock,
    },
    {
      title: "Sub-Unit",
      url: "/dashboard/sub-units",
      active: "sub-units",
      icon: BookUser,
    },
    {
      title: "Kegiatan",
      url: "/dashboard/activities",
      active: "activities",
      icon: Activity,
    },
    {
      title: "Berita",
      url: "/dashboard/news",
      active: "news",
      icon: Newspaper,
    },
    {
      title: "karya",
      url: "/dashboard/scientific-works",
      active: "scientific-works",
      icon: NotebookPen,
    },
    {
      title: "Galeri",
      url: "/dashboard/gallery",
      active: "gallery",
      icon: Images,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      active: "settings",
      icon: SettingsIcon,
    },
    {
      title: "Masters",
      url: "/dashboard/masters/tags",
      active: "masters",
      icon: LibraryBig,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      active: "reports",
      icon: ClipboardListIcon,
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      active: "help",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      title: "Anggota",
      url: "/dashboard/members",
      active: "members",
      icon: UsersRound,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      active: "users",
      icon: Users2,
    },
  ],
};
