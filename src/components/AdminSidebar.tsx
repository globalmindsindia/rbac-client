import { NavLink } from "react-router-dom";
import { useAuth } from "@/auth/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { menuConfig } from "@/config/menuConfig";
import companyLogo from "@/assets/gmi_logo.png";

export function AdminSidebar() {
  const { open } = useSidebar();
  const { selectedApp } = useAuth();
  const userRole = selectedApp?.role; // current user's role

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-0 flex flex-col items-center -mt-0.5">
          <img
            src={companyLogo}
            alt="Company Logo"
            className={`mx-auto ${open ? "w-52" : "w-24"} h-auto transition-all duration-300`}
          />
          <hr className="border-t border-border w-full mt-2" />
        </div>
        {menuConfig.map((section) => {
          // Filter items based on role
          const filteredItems = section.items.filter(
            (item) => !item.roles || item.roles.includes(userRole!)
          );

          if (filteredItems.length === 0) return null; // skip empty sections

          return (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url}>
                          {({ isActive }) => (
                            <div
                              className={`${
                                isActive
                                  ? "bg-blue-600 text-white font-medium rounded-md"
                                  : "hover:bg-blue-100 text-gray-700 hover:text-blue-800 rounded-md"
                              } flex items-center gap-3 px-4 py-2 w-full transition-colors`}
                            >
                              <item.icon
                                className={`h-4 w-4 ${
                                  isActive ? "text-white" : "text-blue-500"
                                }`}
                              />
                              {open && <span>{item.title}</span>}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
