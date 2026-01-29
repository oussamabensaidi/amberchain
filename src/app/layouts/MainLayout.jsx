import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../dahsboardLayout/app-sidebar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import LogoLink from "@/components/nav/LogoLink";

export default function MainLayout({ children, title = 'BOMBYX' }) {

  useDocumentTitle(title);


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={'dashContent p-4 gap-8'}>
        <header className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 w-full md:w-fit justify-between md:justify-start">
            <LogoLink className='md:!hidden'/>
            <SidebarTrigger className="-ml-1" />
          </div>
          <Navbar type='main' />
        </header>
        <div className="flex flex-1 flex-col gap-8 h-fit">
          {/* Render children when MainLayout is used directly with children prop,
              otherwise render nested route content via Outlet. */}
          {children || <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}