/* Public contact and hire links. One source for the contact block, hire CTAs and JSON-LD. */
export const EMAIL = "bagtyyarkovusov@icloud.com";
export const CAL_URL = "https://cal.com/bagtyyar-kovusov";
export const UPWORK_URL = "https://www.upwork.com/freelancers/~015b99076f8e93af2c";

export const HIRE_LINKS = {
  upwork: { href: UPWORK_URL, label: "Hire me on Upwork" },
  call: { href: CAL_URL, label: "Book a 20-minute call" },
} as const;
