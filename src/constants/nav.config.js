import {
  LayoutDashboard, Users, UsersRound, HandHeart, Landmark, Hotel, Building2,
  Briefcase, ScanLine, CalendarCheck, HeartHandshake, PartyPopper, Ticket,
  Armchair, Route, Newspaper, Tag, Megaphone, ScrollText, BarChart3, Calendar,
  Sigma, MapPin, Smartphone, BellRing, MessagesSquare, Image, HandshakeIcon,
  LifeBuoy, Bell, TrendingUp, Settings, ClipboardList, Search, Database,
  UserX, Home as HomeIcon, HelpCircle, LayoutTemplate, MessageSquareWarning,
  CreditCard, CalendarDays, PieChart, Activity, GitBranch, Map as MapIcon,
  Footprints, BookOpen, BadgeIndianRupee, Receipt, Flame, AlertTriangle,
  BarChart2, Globe, ShieldAlert, CheckSquare, PhoneCall, Wallet, FileText
} from "lucide-react";

export const NAV_LAYOUT = "nested"; // "flat" | "nested"

export const ROUTE_TONES = {
  "/": "yellow",
  "/search": "blue",
  "/members": "blue",
  "/family": "purple",
  "/monks": "orange",
  "/community-pages": "pink",
  "/temples": "orange",
  "/dharamshalas": "green",
  "/jain-centers": "purple",
  "/staff": "teal",
  "/visitors": "blue",
  "/bookings": "green",
  "/donations": "orange",
  "/events": "purple",
  "/tickets": "pink",
  "/seating": "teal",
  "/tours": "orange",
  "/feed": "blue",
  "/offers": "green",
  "/ads": "purple",
  "/news": "orange",
  "/polls": "teal",
  "/calendar": "purple",
  "/counters": "orange",
  "/gallery": "pink",
  "/announcements": "red",
  "/tracking": "blue",
  "/devices": "teal",
  "/alerts": "red",
  "/communication": "blue",
  "/volunteers": "green",
  "/support-tickets": "orange",
  "/notifications": "purple",
  "/reports": "green",
  "/settings": "orange",
  "/audit-logs": "purple",
  "/master-data": "teal",
};

export const TONE_HEX = {
  yellow: "#FACC15",
  green: "#10B981",
  orange: "#F59E0B",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  red: "#EF4444",
  teal: "#14B8A6",
  pink: "#EC4899",
};

// --- FLAT STRUCTURE (Option 1) ---
export const FLAT_NAV = [
  { id: "sep-overview", isSeparator: true, label: "Overview" },
  { id: "sa-dashboard", label: "SA Dashboard", icon: LayoutDashboard, route: "/admin/sa-dashboard", roles: ["SUPER_ADMIN"] },
  { id: "a-dashboard", label: "A Dashboard", icon: LayoutDashboard, route: "/a-dashboard", roles: ["SUPER_ADMIN", "TEMPLE_ADMIN", "DHARAMSHALA_ADMIN", "JAIN_CENTER_ADMIN", "MONK_ADMIN"] },

  { id: "sep-orgs", isSeparator: true, label: "Organizations" },
  { id: "flat-temples", label: "Temple", icon: Landmark, route: "/admin/temples" },
  { id: "flat-jain-centers", label: "Jain Centre", icon: Building2, route: "/admin/jain-centers" },
  { id: "flat-dharamshalas", label: "Dharamshala", icon: Hotel, route: "/admin/dharamshalas" },
  { id: "flat-bhojanshala", label: "Bhojanshala", icon: Sigma, route: "/admin/coming-soon?module=Bhojanshala", featureFlag: true },
  { id: "flat-stanaks", label: "Sthanaks", icon: HomeIcon, route: "/admin/stanaks" },
  { id: "flat-community-pages", label: "Community Pages", icon: Globe, route: "/admin/community-pages" },

  { id: "sep-people", isSeparator: true, label: "People" },
  { id: "flat-jain-members", label: "Jain Members", icon: Users, route: "/admin/members" },
  { id: "flat-non-jain-members", label: "Non-Jain Members", icon: UserX, route: "/admin/non-jain-members" },
  { id: "flat-ms", label: "MS Management", icon: HandHeart, route: "/admin/monks" },
  { id: "flat-family", label: "Family", icon: UsersRound, route: "/admin/family" },
  { id: "flat-staff", label: "Staff Management", icon: Briefcase, route: "/admin/staff" },
  { id: "flat-volunteers", label: "Volunteers", icon: HandshakeIcon, route: "/admin/volunteers" },

  { id: "sep-comm", isSeparator: true, label: "Communication" },
  { id: "flat-feed", label: "Feed", icon: Newspaper, route: "/admin/feed" },
  { id: "flat-events", label: "Events", icon: PartyPopper, route: "/admin/events" },
  { id: "flat-announcements", label: "Announcements", icon: Megaphone, route: "/announcements" },
  { id: "flat-news", label: "News", icon: ScrollText, route: "/admin/news" },
  { id: "flat-polls", label: "Polls", icon: BarChart3, route: "/admin/polls" },
  { id: "flat-notifications", label: "Notifications", icon: Bell, route: "/admin/notifications" },
  { id: "flat-tours", label: "Tours", icon: Route, route: "/admin/tours" },
  { id: "flat-99-management", label: "99 Management", icon: GitBranch, route: "/admin/coming-soon?module=99 Management", featureFlag: true },
  { id: "flat-varshitap", label: "Varshitap Management", icon: Flame, route: "/admin/coming-soon?module=Varshitap Management", featureFlag: true },

  { id: "sep-bookings", isSeparator: true, label: "Bookings" },
  { id: "flat-booking-setup", label: "Booking Setup", icon: CalendarCheck, route: "/admin/coming-soon?module=Booking Setup", featureFlag: true },
  { id: "flat-booking-categories", label: "Categories", icon: ClipboardList, route: "/admin/coming-soon?module=Booking Categories", featureFlag: true },
  { id: "flat-booking-requests", label: "Requests", icon: CalendarCheck, route: "/admin/bookings?tab=admin_bookings" },
  { id: "flat-booking-reservations", label: "Reservations", icon: CalendarCheck, route: "/admin/bookings?tab=reservations" },
  { id: "flat-booking-calendar", label: "Calendar", icon: Calendar, route: "/admin/booking-calendar" },

  { id: "sep-operations", isSeparator: true, label: "Operations" },
  { id: "flat-visitors", label: "Visitors", icon: ScanLine, route: "/admin/visitors" },
  { id: "flat-gps", label: "GPS", icon: MapPin, route: "/admin/tracking" },
  { id: "flat-routes", label: "Routes", icon: GitBranch, route: "/admin/routes" },
  { id: "flat-journey-logs", label: "Journey Logs", icon: BookOpen, route: "/admin/journey-logs" },
  { id: "flat-live-map", label: "Live Map", icon: MapIcon, route: "/admin/live-map" },
  { id: "flat-attendance", label: "Attendance", icon: CheckSquare, route: "/admin/staff?tab=attendance", featureFlag: true },

  { id: "sep-finance", isSeparator: true, label: "Finance" },
  { id: "flat-donations", label: "Donations", icon: HeartHandshake, route: "/admin/donations" },
  { id: "flat-receipts", label: "Receipts", icon: Receipt, route: "/admin/receipts" },
  { id: "flat-sponsors", label: "Sponsors", icon: Wallet, route: "/admin/coming-soon?module=Sponsors", featureFlag: true },
  { id: "flat-offers", label: "Offers", icon: Tag, route: "/admin/offers" },
  { id: "flat-ads", label: "Advertisements", icon: Megaphone, route: "/ads" },

  { id: "sep-admin-mgt", isSeparator: true, label: "Admin Management" },
  { id: "flat-admin-users", label: "Admin Users", icon: UsersRound, route: "/admins", roles: ["SUPER_ADMIN"] },
  { id: "flat-subscription-plans", label: "Subscription Plans", icon: CreditCard, route: "/admin/subscription-plans", roles: ["SUPER_ADMIN"] },
  { id: "flat-roles-permissions", label: "Roles & Permission Assignment", icon: Settings, route: "/admin/roles-permissions", roles: ["SUPER_ADMIN"] },
  { id: "flat-login-history", label: "Login History", icon: ClipboardList, route: "/admin/login-history", roles: ["SUPER_ADMIN"] },
  { id: "flat-account-status", label: "Account Status", icon: ShieldAlert, route: "/account-status", roles: ["SUPER_ADMIN"] },

  { id: "flat-reports", label: "Reports", icon: TrendingUp, route: "/admin/reports" },
  { id: "flat-support", label: "Support", icon: LifeBuoy, route: "/admin/support-tickets" },
  { id: "flat-activity-logs", label: "Activity Logs", icon: ClipboardList, route: "/audit-logs", roles: ["SUPER_ADMIN"] },
  { id: "flat-settings", label: "Settings", icon: Settings, route: "/admin/settings" }
];

// --- NESTED STRUCTURE (Option 2) ---
export const NESTED_NAV = [
  { id: "sa-dashboard", label: "SA Dashboard", icon: LayoutDashboard, route: "/admin/sa-dashboard", roles: ["SUPER_ADMIN"] },
  { id: "a-dashboard", label: "A Dashboard", icon: LayoutDashboard, route: "/a-dashboard", roles: ["SUPER_ADMIN", "TEMPLE_ADMIN", "DHARAMSHALA_ADMIN", "JAIN_CENTER_ADMIN", "MONK_ADMIN"] },

  {
    id: "folder-members",
    module: "MEMBERS",
    label: "Members",
    icon: Users,
    children: [
      { id: "m-jain", label: "Jain Members", route: "/admin/members" },
      { id: "m-non-jain", label: "Non-Jain Members", route: "/admin/non-jain-members" },
      { id: "m-family", label: "Family Management", route: "/admin/family" },
      { id: "m-import", label: "Import Members", route: "/admin/members?import=true" },
      { id: "m-export", label: "Export Members", route: "/admin/members?export=true" }
    ]
  },
  {
    id: "folder-ms",
    module: "MONKS",
    label: "MS Management",
    icon: HandHeart,
    children: [
      { id: "ms-profiles", label: "MS Profiles", route: "/admin/monks" },
      { id: "ms-hierarchy", label: "Guru Hierarchy", route: "/admin/coming-soon?module=Guru Hierarchy", featureFlag: true },
      { id: "ms-groups", label: "MS Groups", route: "/admin/coming-soon?module=MS Groups", featureFlag: true },
      { id: "ms-assoc", label: "MS Associations", route: "/admin/coming-soon?module=MS Associations", featureFlag: true },
      { id: "ms-route", label: "Current Route", route: "/admin/routes" },
      { id: "ms-planning", label: "Route Planning", route: "/admin/coming-soon?module=Route Planning", featureFlag: true },
      { id: "ms-journey", label: "Journey History", route: "/admin/journey-logs" },
      { id: "ms-chaturmas", label: "Chaturmas", route: "/admin/chaturmas" },
      { id: "ms-tapasya", label: "Tapasya", route: "/admin/coming-soon?module=Tapasya", featureFlag: true },
      { id: "ms-timeline", label: "Timeline", route: "/admin/coming-soon?module=Timeline", featureFlag: true },
      { id: "ms-followers", label: "Followers", route: "/admin/coming-soon?module=Followers", featureFlag: true }
    ]
  },
  {
    id: "folder-staff",
    module: "STAFF",
    label: "Staff",
    icon: Briefcase,
    children: [
      { id: "st-mgt", label: "Staff Management", route: "/admin/staff" },
      { id: "st-reg", label: "Staff Registration", route: "/admin/staff?action=register" },
      { id: "st-qr", label: "Staff QR Cards", route: "/admin/coming-soon?module=Staff QR Cards", featureFlag: true },
      { id: "st-att", label: "Attendance", route: "/admin/staff?tab=attendance" },
      { id: "st-leave", label: "Leave Management", route: "/admin/staff?tab=leaves" },
      { id: "st-docs", label: "Documents", route: "/admin/staff?tab=documents" },
      { id: "st-hours", label: "Working Hours", route: "/admin/staff?tab=hours" }
    ]
  },
  {
    id: "folder-committee",
    module: "STAFF",
    label: "Committee",
    icon: UsersRound,
    featureFlag: true,
    children: [
      { id: "com-members", label: "Committee Members", route: "/admin/coming-soon?module=Committee Members" },
      { id: "com-desig", label: "Designations", route: "/admin/coming-soon?module=Committee Designations" },
      { id: "com-dir", label: "Contact Directory", route: "/admin/coming-soon?module=Committee Directory" }
    ]
  },

  {
    id: "folder-temple",
    module: "TEMPLES",
    label: "Temple",
    icon: Landmark,
    children: [
      { id: "t-mgt", label: "Temple Management", route: "/admin/temples" },
      { id: "t-info", label: "Temple Information", route: "/admin/coming-soon?module=Temple Information", featureFlag: true },
      { id: "t-fac", label: "Facilities", route: "/admin/coming-soon?module=Temple Facilities", featureFlag: true },
      { id: "t-gal", label: "Gallery", route: "/admin/gallery" },
      { id: "t-com", label: "Committee", route: "/admin/coming-soon?module=Temple Committee", featureFlag: true },
      { id: "t-not", label: "Notices", route: "/admin/coming-soon?module=Temple Notices", featureFlag: true },
      { id: "t-rev", label: "Reviews", route: "/admin/coming-soon?module=Temple Reviews", featureFlag: true },
      { id: "t-dhaja", label: "Dhaja", route: "/admin/coming-soon?module=Temple Dhaja", featureFlag: true },
      { id: "t-chat", label: "Chaturmas", route: "/admin/chaturmas" },
      { id: "t-social", label: "Social Links", route: "/admin/coming-soon?module=Temple Social Links", featureFlag: true }
    ]
  },
  {
    id: "folder-jc",
    module: "JAIN_CENTERS",
    label: "Jain Centre",
    icon: Building2,
    children: [
      { id: "jc-mgt", label: "Jain Centre Management", route: "/admin/jain-centers" },
      { id: "jc-info", label: "Centre Information", route: "/admin/coming-soon?module=Centre Information", featureFlag: true },
      { id: "jc-fac", label: "Facilities", route: "/admin/coming-soon?module=Jain Centre Facilities", featureFlag: true },
      { id: "jc-gal", label: "Gallery", route: "/admin/gallery" },
      { id: "jc-com", label: "Committee", route: "/admin/coming-soon?module=Jain Centre Committee", featureFlag: true },
      { id: "jc-not", label: "Notices", route: "/admin/coming-soon?module=Jain Centre Notices", featureFlag: true },
      { id: "jc-rev", label: "Reviews", route: "/admin/coming-soon?module=Jain Centre Reviews", featureFlag: true },
      { id: "jc-social", label: "Social Links", route: "/admin/coming-soon?module=Jain Centre Social Links", featureFlag: true }
    ]
  },
  {
    id: "folder-dharamshala-sa",
    module: "DHARAMSHALAS",
    label: "Dharamshala",
    icon: Hotel,
    roles: ["SUPER_ADMIN"],
    children: [
      { id: "d-mgt", label: "Dharamshala Management", route: "/admin/dharamshalas" },
      { id: "d-build", label: "Buildings", route: "/admin/dharamshala/buildings" },
      { id: "d-floor", label: "Floors", route: "/admin/dharamshala/floors" },
      { id: "d-room", label: "Rooms", route: "/admin/dharamshala/rooms" },
      { id: "d-cat", label: "Room Categories", route: "/admin/dharamshala/categories" },
      { id: "d-am", label: "Amenities", route: "/admin/dharamshala/amenities" },
      { id: "d-pr", label: "Pricing", route: "/admin/dharamshala/pricing" },
      { id: "d-fac", label: "Facilities", route: "/admin/dharamshala/facilities" },
      { id: "d-gal", label: "Gallery", route: "/admin/dharamshala/gallery" },
      { id: "d-rule", label: "Rules", route: "/admin/dharamshala/rules" }
    ]
  },
  {
    id: "folder-dharamshala-admin",
    module: "DHARAMSHALAS",
    label: "Dharamshala",
    icon: Hotel,
    roles: ["DHARAMSHALA_ADMIN", "TEMPLE_ADMIN", "JAIN_CENTER_ADMIN", "JC_ADMIN", "MONK_ADMIN", "SUB_ADMIN", "STAFF", "ORG_ADMIN"],
    children: [
      { id: "d-list-admin", module: "DHARAMSHALAS", label: "Dharamshalas", route: "/admin/dharamshalas" },
      { id: "d-mgt-admin", module: "DHARAMSHALAS", label: "Dharamshala Management", route: "/admin/dharamshala/management" },
      { id: "d-book-admin", module: "DHARAMSHALAS", label: "Bookings", route: "/admin/dharamshala/bookings" }
    ]
  },
  {
    id: "folder-bhojanshala",
    module: "DHARAMSHALAS",
    label: "Bhojanshala",
    icon: Sigma,
    children: [
      { id: "bh-mgt", label: "Bhojanshala Management", route: "/admin/bhojanshala-management" }
    ]
  },
  {
    id: "folder-st",
    module: "STHANAKS",
    label: "Sthanaks",
    icon: HomeIcon,
    children: [
      { id: "st-stanak-mgt", label: "Sthanak Management", route: "/admin/stanaks" }
    ]
  },
  {
    id: "folder-pages",
    module: "COMMUNITY_PAGES",
    label: "Community Pages",
    icon: Globe,
    children: [
      { id: "cp-my", label: "My Page", route: "/admin/community-pages" },
      { id: "cp-info", label: "Page Information", route: "/admin/coming-soon?module=Community Page Information", featureFlag: true },
      { id: "cp-gal", label: "Gallery", route: "/admin/gallery" },
      { id: "cp-fol", label: "Followers", route: "/admin/coming-soon?module=Community Page Followers", featureFlag: true },
      { id: "cp-rev", label: "Reviews", route: "/admin/coming-soon?module=Community Page Reviews", featureFlag: true },
      { id: "cp-social", label: "Social Links", route: "/admin/coming-soon?module=Community Page Social Links", featureFlag: true },
      { id: "cp-seo", label: "SEO & Sharing", route: "/admin/coming-soon?module=Community Page SEO", featureFlag: true }
    ]
  },
  {
    id: "folder-feed",
    module: "FEED",
    label: "Feed",
    icon: Newspaper,
    children: [
      { id: "fe-mgt", label: "Feed Management", route: "/admin/feed" },
      { id: "fe-create", label: "Create Post", route: "/admin/create-post" },
      { id: "fe-sched", label: "Scheduled Posts", route: "/admin/scheduled-posts" },
      { id: "fe-feat", label: "Featured Posts", route: "/admin/featured-posts" },
      { id: "fe-rep", label: "Reported Posts", route: "/admin/reported-posts" },
      { id: "fe-an", label: "Feed Analytics", route: "/admin/feed-analytics" }
    ]
  },
  {
    id: "folder-events",
    module: "EVENTS",
    label: "Events",
    icon: PartyPopper,
    children: [
      { id: "ev-cat", label: "Event Categories", route: "/admin/coming-soon?module=Event Categories", featureFlag: true },
      { id: "ev-mgt", label: "Event Management", route: "/admin/events" },
      { id: "ev-sched", label: "Event Schedule", route: "/admin/coming-soon?module=Event Schedule", featureFlag: true },
      { id: "ev-reg", label: "Registrations", route: "/admin/coming-soon?module=Event Registrations", featureFlag: true },
      { id: "ev-att", label: "Attendees", route: "/admin/coming-soon?module=Event Attendees", featureFlag: true },
      { id: "ev-seat", label: "Seating Layout", route: "/admin/seating-layout" },
      { id: "ev-tcat", label: "Ticket Categories", route: "/admin/ticket-categories" },
      { id: "ev-pr", label: "Pricing", route: "/admin/coming-soon?module=Event Ticket Pricing", featureFlag: true },
      { id: "ev-coup", label: "Coupons", route: "/admin/coming-soon?module=Event Coupons", featureFlag: true },
      { id: "ev-qr", label: "QR Check-in", route: "/admin/coming-soon?module=Event QR Check-in", featureFlag: true },
      { id: "ev-qrep", label: "Check-in Reports", route: "/admin/coming-soon?module=Check-in Reports", featureFlag: true },
      { id: "ev-an", label: "Event Analytics", route: "/admin/event-analytics" }
    ]
  },
  {
    id: "folder-volunteers",
    label: "Volunteers",
    icon: HandshakeIcon,
    children: [
      { id: "vol-mgt", label: "Volunteer Management", route: "/admin/volunteers" }
    ]
  },
  {
    id: "folder-news",
    module: "NEWS",
    label: "News",
    icon: ScrollText,
    children: [
      { id: "ne-mgt", label: "News Management", route: "/admin/news" },
      { id: "ne-cat", label: "Categories", route: "/admin/coming-soon?module=News Categories", featureFlag: true },
      { id: "ne-feat", label: "Featured News", route: "/admin/coming-soon?module=Featured News", featureFlag: true },
      { id: "ne-sched", label: "Scheduled News", route: "/admin/coming-soon?module=Scheduled News", featureFlag: true },
      { id: "ne-arch", label: "Archived News", route: "/admin/coming-soon?module=Archived News", featureFlag: true }
    ]
  },
  {
    id: "folder-ann",
    module: "ANNOUNCEMENTS",
    label: "Announcements",
    icon: Megaphone,
    children: [
      { id: "an-mgt", label: "Announcement Management", route: "/admin/announcements" },
      { id: "an-pri", label: "Priority Announcements", route: "/admin/coming-soon?module=Priority Announcements", featureFlag: true },
      { id: "an-sched", label: "Scheduled Announcements", route: "/admin/coming-soon?module=Scheduled Announcements", featureFlag: true }
    ]
  },
  {
    id: "folder-polls",
    module: "POLLS",
    label: "Polls",
    icon: BarChart3,
    children: [
      { id: "po-mgt", label: "Poll Management", route: "/admin/polls" },
      { id: "po-resp", label: "Responses", route: "/admin/coming-soon?module=Poll Responses", featureFlag: true },
      { id: "po-res", label: "Poll Results", route: "/admin/coming-soon?module=Poll Results", featureFlag: true }
    ]
  },
  {
    id: "folder-tours",
    module: "TOURS",
    label: "Tours",
    icon: Route,
    children: [
      { id: "to-mgt", label: "Tour Management", route: "/admin/tours" },
      { id: "to-sched", label: "Tour Schedule", route: "/admin/coming-soon?module=Tour Schedule", featureFlag: true },
      { id: "to-reg", label: "Registrations", route: "/admin/coming-soon?module=Tour Registrations", featureFlag: true },
      { id: "to-part", label: "Participants", route: "/admin/coming-soon?module=Tour Participants", featureFlag: true }
    ]
  },
  {
    id: "folder-99",
    module: "TOURS",
    label: "99 Management",
    icon: GitBranch,
    featureFlag: true,
    children: [
      { id: "99-cat", label: "99 Categories", route: "/admin/coming-soon?module=99 Categories" },
      { id: "99-mgt", label: "99 Management", route: "/admin/coming-soon?module=99 Management" },
      { id: "99-part", label: "Participants", route: "/admin/coming-soon?module=99 Participants" },
      { id: "99-rep", label: "Completion Reports", route: "/admin/coming-soon?module=99 Completion Reports" }
    ]
  },
  {
    id: "folder-counter",
    module: "COUNTERS",
    label: "Spiritual Counter",
    icon: Sigma,
    children: [
      { id: "sc-cat", label: "Counter Categories", route: "/admin/counters" },
      { id: "sc-stats", label: "Member Statistics", route: "/admin/coming-soon?module=Member Counter Stats", featureFlag: true },
      { id: "sc-global", label: "Global Statistics", route: "/admin/coming-soon?module=Global Counter Stats", featureFlag: true }
    ]
  },
  {
    id: "folder-tcalendar",
    module: "CALENDAR",
    label: "Tithi Calendar",
    icon: Calendar,
    children: [
      { id: "tc-mgt", label: "Calendar Management", route: "/admin/calendar" },
      { id: "tc-types", label: "Calendar Types", route: "/admin/coming-soon?module=Calendar Types", featureFlag: true },
      { id: "tc-tithi", label: "Tithi Management", route: "/admin/coming-soon?module=Tithi Management", featureFlag: true }
    ]
  },
  {
    id: "folder-notif",
    module: "NOTIFICATIONS",
    label: "Notifications",
    icon: Bell,
    children: [
      { id: "nt-push", label: "Push Notifications", route: "/admin/coming-soon?module=Push Notifications", featureFlag: true },
      { id: "nt-wa", label: "WhatsApp", route: "/admin/coming-soon?module=WhatsApp Notifications", featureFlag: true },
      { id: "nt-sms", label: "SMS", route: "/admin/coming-soon?module=SMS Notifications", featureFlag: true },
      { id: "nt-email", label: "Email", route: "/admin/coming-soon?module=Email Notifications", featureFlag: true },
      { id: "nt-hist", label: "Notification History", route: "/admin/notifications" }
    ]
  },
  {
    id: "folder-varshitap",
    module: "TOURS", label: "Varshitap Management", icon: Flame, route: "/admin/coming-soon?module=Varshitap Management", featureFlag: true
  },
  {
    id: "group-bookings",
    label: "Bookings",
    icon: CalendarCheck,
    children: [
      {
        id: "folder-bcat",
        module: "BOOKINGS",
        label: "Booking Categories",
        icon: ClipboardList,
        children: [
          { id: "bc-mgt", label: "Category Management", route: "/admin/coming-soon?module=Category Management", featureFlag: true },
          { id: "bc-rules", label: "Booking Rules", route: "/admin/coming-soon?module=Booking Rules", featureFlag: true },
          { id: "bc-app", label: "Required Approvals", route: "/admin/coming-soon?module=Required Approvals", featureFlag: true }
        ]
      },
      {
        id: "folder-bres",
        module: "BOOKINGS",
        label: "Booking Resources",
        icon: Landmark,
        children: [
          { id: "br-rooms", label: "Rooms", route: "/admin/coming-soon?module=Booking Rooms", featureFlag: true },
          { id: "br-halls", label: "Halls", route: "/admin/coming-soon?module=Halls", featureFlag: true },
          { id: "br-bhoj", label: "Bhojanshala", route: "/admin/coming-soon?module=Bhojanshala Resources", featureFlag: true },
          { id: "br-pooja", label: "Pooja Booking", route: "/admin/coming-soon?module=Pooja Booking Resources", featureFlag: true },
          { id: "br-path", label: "Pathshala", route: "/admin/coming-soon?module=Pathshala Resources", featureFlag: true },
          { id: "br-other", label: "Other Resources", route: "/admin/coming-soon?module=Other Booking Resources", featureFlag: true }
        ]
      },
      {
        id: "folder-bmgt",
        module: "BOOKINGS",
        label: "Booking Management",
        icon: CalendarCheck,
        children: [
          { id: "bm-req", label: "Booking Requests", route: "/admin/bookings?tab=admin_bookings" },
          { id: "bm-res", label: "Reservations", route: "/admin/bookings?tab=reservations" },
          { id: "bm-walkin", label: "Walk-in Bookings", route: "/admin/coming-soon?module=Walk-in Bookings", featureFlag: true },
          { id: "bm-group", label: "Group Bookings", route: "/admin/coming-soon?module=Group Bookings", featureFlag: true },
          { id: "bm-wait", label: "Waiting List", route: "/admin/coming-soon?module=Booking Waiting List", featureFlag: true },
          { id: "bm-ext", label: "Booking Extensions", route: "/admin/coming-soon?module=Booking Extensions", featureFlag: true },
          { id: "bm-cancel", label: "Cancellations", route: "/admin/coming-soon?module=Cancellations", featureFlag: true }
        ]
      },
      {
        id: "folder-bprice",
        module: "BOOKINGS",
        label: "Pricing & Availability",
        icon: Wallet,
        children: [
          { id: "bp-price", label: "Pricing", route: "/admin/coming-soon?module=Pricing Setup", featureFlag: true },
          { id: "bp-seas", label: "Seasonal Pricing", route: "/admin/coming-soon?module=Seasonal Pricing", featureFlag: true },
          { id: "bp-avail", label: "Availability", route: "/admin/coming-soon?module=Availability Setup", featureFlag: true },
          { id: "bp-black", label: "Blackout Dates", route: "/admin/coming-soon?module=Blackout Dates", featureFlag: true },
          { id: "bp-limits", label: "Booking Limits", route: "/admin/coming-soon?module=Booking Limits", featureFlag: true }
        ]
      },
      {
        id: "folder-bcal",
        module: "BOOKINGS",
        label: "Calendar",
        icon: Calendar,
        children: [
          { id: "bl-grid", label: "Daily, Weekly, Monthly", route: "/admin/booking-calendar" },
          { id: "bl-res", label: "Resource Availability", route: "/admin/bookings?tab=availability_calendar" }
        ]
      },
      {
        id: "folder-bcheck",
        module: "BOOKINGS",
        label: "Check-In / Check-Out",
        icon: ScanLine,
        children: [
          { id: "bck-in", label: "Check-In", route: "/admin/coming-soon?module=Check-In", featureFlag: true },
          { id: "bck-out", label: "Check-Out", route: "/admin/coming-soon?module=Check-Out", featureFlag: true },
          { id: "bck-occ", label: "Current Occupancy", route: "/admin/coming-soon?module=Current Occupancy", featureFlag: true },
          { id: "bck-over", label: "Overstay Management", route: "/admin/coming-soon?module=Overstay Management", featureFlag: true }
        ]
      },
      {
        id: "folder-brep",
        module: "BOOKINGS",
        label: "Reports",
        icon: TrendingUp,
        children: [
          { id: "brp-book", label: "Booking", route: "/admin/reports?tab=bookings", featureFlag: true },
          { id: "brp-occ", label: "Occupancy", route: "/admin/coming-soon?module=Occupancy Reports", featureFlag: true },
          { id: "brp-cancel", label: "Cancellation", route: "/admin/coming-soon?module=Cancellation Reports", featureFlag: true },
          { id: "brp-rev", label: "Revenue", route: "/admin/coming-soon?module=Revenue Reports", featureFlag: true }
        ]
      }
    ]
  },

  {
    id: "group-finance",
    label: "Finance",
    icon: HeartHandshake,
    children: [
      {
        id: "folder-fnd",
        module: "DONATIONS",
        label: "Donations",
        icon: HeartHandshake,
        children: [
          { id: "dn-cat", label: "Donation Categories", route: "/admin/coming-soon?module=Donation Categories", featureFlag: true },
          { id: "dn-camp", label: "Donation Campaigns", route: "/admin/coming-soon?module=Donation Campaigns", featureFlag: true },
          { id: "dn-mgt", label: "Donation Management", route: "/admin/donations" },
          { id: "dn-verify", label: "Pending Verification", route: "/admin/coming-soon?module=Pending Verification", featureFlag: true },
          { id: "dn-online", label: "Online Donations", route: "/admin/donations?type=online", featureFlag: true },
          { id: "dn-offline", label: "Offline Donations", route: "/admin/donations?type=offline", featureFlag: true },
          { id: "dn-receipt", label: "Donation Receipts", route: "/admin/receipts" },
          { id: "dn-80g", label: "80G Receipts", route: "/admin/coming-soon?module=80G Receipts", featureFlag: true },
          { id: "dn-rep", label: "Donation Reports", route: "/admin/reports/donations" }
        ]
      },
      {
        id: "folder-fbank",
        module: "DONATIONS",
        label: "Bank & Payment",
        icon: Wallet,
        children: [
          { id: "bp-bank", label: "Bank Accounts", route: "/admin/coming-soon?module=Bank Accounts", featureFlag: true },
          { id: "bp-upi", label: "UPI QR Codes", route: "/admin/coming-soon?module=UPI QR Codes", featureFlag: true },
          { id: "bp-gw", label: "Payment Gateway", route: "/admin/coming-soon?module=Payment Gateway", featureFlag: true },
          { id: "bp-tx", label: "Payment Transactions", route: "/admin/coming-soon?module=Payment Transactions", featureFlag: true },
          { id: "bp-recon", label: "Payment Reconciliation", route: "/admin/coming-soon?module=Payment Reconciliation", featureFlag: true }
        ]
      },
      {
        id: "folder-fsponsor",
        module: "SPONSORS",
        label: "Sponsors",
        icon: Wallet,
        featureFlag: true,
        children: [
          { id: "sp-mgt", label: "Sponsor Management", route: "/admin/coming-soon?module=Sponsor Management" },
          { id: "sp-cat", label: "Sponsor Categories", route: "/admin/coming-soon?module=Sponsor Categories" },
          { id: "sp-pack", label: "Sponsorship Packages", route: "/admin/coming-soon?module=Sponsorship Packages" },
          { id: "sp-act", label: "Active Sponsors", route: "/admin/coming-soon?module=Active Sponsors" },
          { id: "sp-rep", label: "Sponsor Reports", route: "/admin/coming-soon?module=Sponsor Reports" }
        ]
      },
      {
        id: "folder-fads",
        module: "SPONSORS",
        label: "Advertisements",
        icon: Megaphone,
        children: [
          { id: "ad-mgt", label: "Advertisement Management", route: "/ads" },
          { id: "ad-cat", label: "Advertisement Categories", route: "/admin/coming-soon?module=Ad Categories", featureFlag: true },
          { id: "ad-banner", label: "Banner Management", route: "/admin/banners" },
          { id: "ad-sched", label: "Campaign Schedule", route: "/admin/coming-soon?module=Campaign Schedule", featureFlag: true },
          { id: "ad-rep", label: "Advertisement Reports", route: "/admin/coming-soon?module=Ad Reports", featureFlag: true }
        ]
      },
      {
        id: "folder-foffers",
        module: "OFFERS",
        label: "Offers & Benefits",
        icon: Tag,
        children: [
          { id: "of-cat", label: "Offer Categories", route: "/admin/coming-soon?module=Offer Categories", featureFlag: true },
          { id: "of-mgt", label: "Offer Management", route: "/admin/offers" },
          { id: "of-coup", label: "Coupons", route: "/admin/coming-soon?module=Offer Coupons", featureFlag: true },
          { id: "of-partner", label: "Partner Businesses", route: "/admin/coming-soon?module=Partner Businesses", featureFlag: true },
          { id: "of-rep", label: "Offer Reports", route: "/admin/coming-soon?module=Offer Reports", featureFlag: true },
          { id: "of-an", label: "Offer Analytics", route: "/admin/coming-soon?module=Offer Analytics", featureFlag: true }
        ]
      },
      {
        id: "folder-freports",
        module: "REPORTS",
        label: "Reports",
        icon: TrendingUp,
        children: [
          { id: "fr-don", label: "Donation", route: "/admin/reports/donations" },
          { id: "fr-pay", label: "Payment", route: "/admin/coming-soon?module=Payment Reports", featureFlag: true },
          { id: "fr-spon", label: "Sponsor", route: "/admin/coming-soon?module=Sponsor Reports", featureFlag: true },
          { id: "fr-ad", label: "Advertisement", route: "/admin/coming-soon?module=Ad Reports", featureFlag: true },
          { id: "fr-sum", label: "Financial Summary", route: "/admin/coming-soon?module=Financial Summary", featureFlag: true }
        ]
      }
    ]
  },

  {
    id: "group-operations",
    label: "Operations",
    icon: Settings,
    children: [
      {
        id: "folder-opvis",
        module: "VISITORS",
        label: "Visitor Management",
        icon: ScanLine,
        children: [
          { id: "vi-in", label: "Visitor Entry", route: "/admin/visitors" },
          { id: "vi-out", label: "Visitor Exit", route: "/admin/coming-soon?module=Visitor Exit", featureFlag: true },
          { id: "vi-hist", label: "Visitor History", route: "/admin/coming-soon?module=Visitor History", featureFlag: true },
          { id: "vi-exp", label: "Expected Visitors", route: "/admin/coming-soon?module=Expected Visitors", featureFlag: true },
          { id: "vi-veh", label: "Vehicle Entry", route: "/admin/coming-soon?module=Vehicle Entry", featureFlag: true },
          { id: "vi-qr", label: "QR Check-In", route: "/admin/coming-soon?module=Visitor QR Check-In", featureFlag: true },
          { id: "vi-vip", label: "VIP Visitors", route: "/admin/coming-soon?module=VIP Visitors", featureFlag: true },
          { id: "vi-black", label: "Blacklisted Visitors", route: "/admin/coming-soon?module=Blacklisted Visitors", featureFlag: true },
          { id: "vi-rep", label: "Visitor Reports", route: "/admin/coming-soon?module=Visitor Reports", featureFlag: true }
        ]
      },
      {
        id: "folder-optracking",
        module: "TRACKING",
        label: "MS Tracking",
        icon: MapPin,
        children: [
          { id: "tr-live", label: "Live Tracking", route: "/admin/tracking" },
          { id: "tr-man", label: "Manual Tracking", route: "/admin/manual-tracking" },
          { id: "tr-route", label: "Route Planning", route: "/admin/coming-soon?module=Route Planning", featureFlag: true },
          { id: "tr-journey", label: "Journey Logs", route: "/admin/journey-logs" },
          { id: "tr-map", label: "Live Map", route: "/admin/live-map" },
          { id: "tr-chat", label: "Chaturmas Tracking", route: "/admin/coming-soon?module=Chaturmas Tracking", featureFlag: true },
          { id: "tr-rep", label: "Route Reports", route: "/admin/coming-soon?module=Route Reports", featureFlag: true }
        ]
      },
      {
        id: "folder-opstaff",
        module: "STAFF",
        label: "Staff Operations",
        icon: Briefcase,
        children: [
          { id: "so-man", label: "Manual Attendance", route: "/admin/coming-soon?module=Manual Attendance", featureFlag: true },
          { id: "so-qr", label: "QR Attendance", route: "/admin/coming-soon?module=QR Attendance", featureFlag: true },
          { id: "so-leave", label: "Leave Management", route: "/admin/staff?tab=leaves", featureFlag: true },
          { id: "so-hours", label: "Working Hours", route: "/admin/staff?tab=hours", featureFlag: true },
          { id: "so-salary", label: "Shift and Salary Management", route: "/admin/coming-soon?module=Shift and Salary Management", featureFlag: true },
          { id: "so-rep", label: "Attendance Reports", route: "/admin/coming-soon?module=Attendance Reports", featureFlag: true }
        ]
      },
      {
        id: "folder-opdocs",
        module: "STAFF",
        label: "Document Management",
        icon: BookOpen,
        children: [
          { id: "dm-org", label: "Organization Documents", route: "/admin/coming-soon?module=Organization Documents", featureFlag: true },
          { id: "dm-staff", label: "Staff Documents", route: "/admin/staff?tab=documents", featureFlag: true },
          { id: "dm-upload", label: "Upload Documents", route: "/admin/coming-soon?module=Upload Documents", featureFlag: true },
          { id: "dm-exp", label: "Expiry Reminders", route: "/admin/coming-soon?module=Expiry Reminders", featureFlag: true },
          { id: "dm-dl", label: "Download Documents", route: "/admin/coming-soon?module=Download Documents", featureFlag: true }
        ]
      },
      {
        id: "folder-optasks",
        module: "STAFF",
        label: "Task Management",
        icon: CheckSquare,
        featureFlag: true,
        children: [
          { id: "tk-pend", label: "Pending Tasks", route: "/admin/coming-soon?module=Pending Tasks" },
          { id: "tk-app", label: "Pending Approvals", route: "/admin/coming-soon?module=Pending Approvals" },
          { id: "tk-follow", label: "Follow-ups", route: "/admin/coming-soon?module=Follow-ups" },
          { id: "tk-remind", label: "Reminders", route: "/admin/coming-soon?module=Reminders" },
          { id: "tk-comp", label: "Completed Tasks", route: "/admin/coming-soon?module=Completed Tasks" }
        ]
      },
      {
        id: "folder-oprep",
        module: "REPORTS",
        label: "Reports",
        icon: TrendingUp,
        children: [
          { id: "or-vis", label: "Visitor", route: "/admin/coming-soon?module=Visitor Reports", featureFlag: true },
          { id: "or-track", label: "Tracking", route: "/admin/coming-soon?module=Tracking Reports", featureFlag: true },
          { id: "or-att", label: "Attendance", route: "/admin/coming-soon?module=Attendance Reports", featureFlag: true },
          { id: "or-sum", label: "Operational Summary", route: "/admin/coming-soon?module=Operational Summary", featureFlag: true }
        ]
      }
    ]
  },

  {
    id: "group-reports",
    module: "REPORTS",
    label: "Reports & Analytics",
    icon: TrendingUp,
    children: [
      { id: "rp-exec", label: "Executive Dashboard", route: "/admin/reports" },
      { id: "rp-people", label: "People Reports", route: "/admin/reports/members" },
      { id: "rp-org", label: "Organization Reports", route: "/admin/coming-soon?module=Organization Reports", featureFlag: true },
      { id: "rp-comm", label: "Community Reports", route: "/admin/reports/events" },
      { id: "rp-book", label: "Booking Reports", route: "/admin/reports?tab=bookings", featureFlag: true },
      { id: "rp-fin", label: "Financial Reports", route: "/admin/reports/donations" },
      { id: "rp-op", label: "Operations Reports", route: "/admin/coming-soon?module=Operations Reports", featureFlag: true },
      { id: "rp-export", label: "Export Center", route: "/admin/coming-soon?module=Export Center", featureFlag: true }
    ]
  },

  {
    id: "group-support",
    module: "SUPPORT",
    label: "Support",
    icon: LifeBuoy,
    children: [
      { id: "su-ticket", label: "Support Tickets", route: "/admin/support-tickets" },
      { id: "su-feedback", label: "Feedback", route: "/admin/feedback" },
      { id: "su-incorrect", label: "Incorrect Information", route: "/admin/incorrect-reports" },
      { id: "su-contacts", label: "Contact Requests", route: "/admin/coming-soon?module=Contact Requests", featureFlag: true },
      { id: "su-kb", label: "Knowledge Base", route: "/admin/faq" }
    ]
  },

  {
    id: "group-settings",
    module: "SETTINGS",
    label: "Settings",
    icon: Settings,
    children: [
      { id: "se-admin", label: "Admin Management", route: "/admins", roles: ["SUPER_ADMIN"] },
      { id: "se-roles", label: "Roles & Permissions", route: "/admin/coming-soon?module=Roles & Permissions", roles: ["SUPER_ADMIN"], featureFlag: true },
      { id: "se-master", label: "Master Data", route: "/admin/master-data", roles: ["SUPER_ADMIN"] },
      { id: "se-notif", label: "Notification Center", route: "/admin/notifications/preferences", featureFlag: true },
      { id: "se-platform", label: "Platform Settings", route: "/admin/settings", roles: ["SUPER_ADMIN"] },
      { id: "se-payment", label: "Payment Settings", route: "/admin/coming-soon?module=Payment Settings", roles: ["SUPER_ADMIN"], featureFlag: true },
      { id: "se-security", label: "Security", route: "/admin/settings?tab=security", roles: ["SUPER_ADMIN"], featureFlag: true },
      { id: "se-sub", label: "Subscription", route: "/admin/subscription-plans", roles: ["SUPER_ADMIN"] }
    ]
  }
];
