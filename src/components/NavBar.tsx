import Link from "next/link";
import { AvatarDropDown } from "./custom-ui/AvatarDropDown";

export function NavBar() {
  return (
    <nav className="p-4 flex items center justify-between sticky top-0 z-10 bg-background shadow-sm">
      collapseButton
      <div className="flex items-center gap-4 ">
        <AvatarDropDown />
      </div>
    </nav>
  );
}
