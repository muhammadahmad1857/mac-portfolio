import { navIcons, navLinks } from "@/constants";
import dayjs from "dayjs";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav>
      <div>
        <Image src="/images/logo.svg" alt="Logo" width={50} height={50} />
        <p>Ahmad&apos;s Portfolio</p>
        <ul>
          {navLinks.map(({ id, name }) => (
            <li key={id}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <Image
                src={img}
                alt={`Icon ${id}`}
                className="icon"
                width={30}
                height={30}
              />
            </li>
          ))}
        </ul>
        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
