import { Button } from "@/components/ui/button";
import { IoNotifications } from "react-icons/io5";

export function NotificationTray() {
  return (
    <Button variant="icon" className="px-2  hover:bg-slate-950">
      <IoNotifications size={20} color="white" />
    </Button>
  );
}
