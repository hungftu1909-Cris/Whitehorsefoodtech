import type { UseFormRegister } from "react-hook-form";

/**
 * Hidden anti-spam field. Real visitors never see or fill it; bots that
 * auto-fill every input on the page do — the API route rejects submissions
 * where it's non-empty.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Honeypot({ register }: { register: UseFormRegister<any> }) {
  return (
    <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
      <label htmlFor="company_website">Website</label>
      <input
        id="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("company_website")}
      />
    </div>
  );
}
