// Shared by every toolbar link, action and theme toggle.
// Edit these static Tailwind classes to customize the toolbar in one place.
export const toolbarButtonStyles = {
  base: "h-9 min-w-9 translate-y-0.5 transition-transform hover:translate-y-0 rounded-none rounded-t-md border-b-0 !bg-card focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground motion-reduce:translate-y-0 motion-reduce:transition-none px-3 text-sm font-medium text-foreground",
  icon: "size-9 px-0",
  group:
    "gap-0 [&_[data-slot=button]]:rounded-b-none! [&>[data-slot]:not(:has(~[data-slot]))]:rounded-br-none!",
};
