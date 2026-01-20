import type { JSX } from "react";

export default function AppLayout({
  sidebar,
  children,
}: {
  sidebar: JSX.Element;
  children: JSX.Element;
}) {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="sticky top-0 p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">TaskHub</h1>
          <p className="text-sm text-gray-600 mt-1">Task Management</p>
        </div>
        
        <div className="p-4">
          {sidebar}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900">SaaS Task Manager</h2>
          </div>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
