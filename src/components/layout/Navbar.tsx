import NavbarLinks from "./NavbarLinks";
import { NavbarActions } from "./NavbarActions";
import { NavbarBrand } from "./NavbarBrand";
import { MobileNavbar } from "./MobileNavbar";
import { NavbarScrollShell } from "./NavbarScrollShell";

export default function Navbar() {
  return (
    <NavbarScrollShell>
      <NavbarBrand />
      <NavbarLinks />
      <NavbarActions />
      <MobileNavbar />
    </NavbarScrollShell>
  );
}
