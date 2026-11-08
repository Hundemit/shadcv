import type { ResumeContact } from "../../../../components/resume/document/types";

export const contact: ResumeContact = {
  name: "Jan Hindemit",
  location: "24610 Trappenkamp",
  phone: "+49 1627 19 5858",
  email: "janhindemit1@gmail.com",
  photo: {
    src: "/portrait.png",
    alt: "Portrait of Jan Hindemit",
  },
  links: [
    {
      label: "Portfolio",
      href: "https://janhindemit.de",
    },
    {
      label: "GitHub",
      href: "https://dub.sh/github-hundemit",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jan-hindemit/",
    },
  ],
};
