import Logo from "@/components/campus-connect/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider
} from "@/components/ui/sidebar";
import { Home, LogOut, Calendar } from "lucide-react";
import Link from "next/link";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="px-2">
                        <Logo />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/student/dashboard" tooltip="Dashboard">
                                <Home />
                                <span>Dashboard</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                            <SidebarMenuButton href="/student/dashboard" tooltip="All Events">
                                <Calendar />
                                <span>All Events</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                     <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://picsum.photos/seed/student/100/100" />
                            <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">Student User</span>
                            <span className="text-xs text-muted-foreground">student@campus.edu</span>
                        </div>
                    </div>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/" className="w-full">
                                <SidebarMenuButton tooltip="Logout">
                                    <LogOut/>
                                    <span>Logout</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
